// supabase/functions/submit-story/index.ts
// Edge Function: submit-story
// Public endpoint that accepts story submissions from the website.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Environment variables (set in Supabase secrets)
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ALLOWED_ORIGINS = Deno.env.get("ALLOWED_ORIGINS"); // comma‑separated
const TURNSTILE_SECRET = Deno.env.get("TURNSTILE_SECRET");
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const RATE_LIMIT_SALT = Deno.env.get("RATE_LIMIT_SALT") || "default_salt";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// Zod schema for validation
const StorySchema = z.object({
  name: z.string().max(100).optional(),
  anonymous: z.boolean(),
  contact: z.string().max(200).optional(),
  story_text: z.string().min(20).max(5000),
  consent_given: z.literal(true),
  website: z.string().optional(), // honeypot field
  turnstile_token: z.string().optional(),
});

/** Utility: CORS handling */
function corsHeaders(origin: string | null) {
  const allowed = ALLOWED_ORIGINS?.split(",").map((s) => s.trim()) || [];
  if (origin && allowed.includes(origin)) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    } as HeadersInit;
  }
  return {} as HeadersInit;
}

/** Rate limiting – hash IP with server‑side salt */
async function checkRateLimit(ip: string): Promise<boolean> {
  const hash = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(ip + RATE_LIMIT_SALT),
  );
  const hashHex = Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const { data, error } = await supabase
    .from("rate_limits")
    .select("key", { count: "exact", head: false })
    .eq("key", hashHex)
    .gt("created_at", new Date(Date.now() - 60 * 60 * 1000).toISOString());
  if (error) console.error("Rate limit check error", error);
  const current = data?.length ?? 0;
  if (current >= 3) return false;
  // record the attempt
  await supabase.from("rate_limits").upsert({ key: hashHex });
  return true;
}

/** Optional Turnstile verification */
async function verifyTurnstile(token: string): Promise<boolean> {
  if (!TURNSTILE_SECRET) return true; // disabled
  const resp = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret: TURNSTILE_SECRET, response: token }).toString(),
  });
  const result = await resp.json();
  return result.success === true;
}

/** Optional email notification via Resend */
async function sendNotification() {
  if (!RESEND_API_KEY) return;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "no-reply@unitywithin.org",
      to: "info.unitywithin@gmail.com",
      subject: "New story submission received",
      text: "A new story was submitted via the website. No personal data is included.",
    }),
  });
}

serve(async (req) => {
  const origin = req.headers.get("origin");
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
    });
  }

  // IP extraction (Cloudflare passes it in cf-connecting-ip)
  const ip = req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

  const json = await req.json().catch(() => ({}));

  // Honeypot – if filled, silently succeed without storing
  if (json.website && json.website.trim() !== "") {
    return new Response(JSON.stringify({ message: "Thanks for your submission!" }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
    });
  }

  const parseResult = StorySchema.safeParse(json);
  if (!parseResult.success) {
    return new Response(JSON.stringify({ error: "Invalid input", details: parseResult.error.format() }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
    });
  }
  const data = parseResult.data;

  // Turnstile check if token present
  if (data.turnstile_token && !(await verifyTurnstile(data.turnstile_token))) {
    return new Response(JSON.stringify({ error: "Captcha verification failed" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
    });
  }

  // Rate limit
  if (!(await checkRateLimit(ip))) {
    return new Response(JSON.stringify({ error: "Too many submissions, please try later" }), {
      status: 429,
      headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
    });
  }

  // Insert using service role – do not log any personal fields
  const { error: insertError } = await supabase.from("story_submissions").insert({
    name: data.anonymous ? null : data.name,
    anonymous: data.anonymous,
    contact: data.anonymous ? null : data.contact,
    story_text: data.story_text,
    consent_given: true,
    status: "new",
  });

  if (insertError) {
    console.error("Insert error", insertError);
    return new Response(JSON.stringify({ error: "Failed to save submission" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
    });
  }

  // Optional email notification
  await sendNotification();

  return new Response(JSON.stringify({ message: "Thanks for sharing your story! We will review it shortly." }), {
    status: 200,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
});

