// vite.config.js
import { defineConfig } from "file:///C:/Users/onyi/Desktop/unity%20within/our%20official%20website/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/onyi/Desktop/unity%20within/our%20official%20website/node_modules/@vitejs/plugin-react/dist/index.js";
import { VitePWA } from "file:///C:/Users/onyi/Desktop/unity%20within/our%20official%20website/node_modules/vite-plugin-pwa/dist/index.js";
var base = "/our-official-website-UW/";
var vite_config_default = defineConfig(({ isSsrBuild }) => ({
  base,
  plugins: [
    react(),
    VitePWA({
      disable: isSsrBuild,
      registerType: "autoUpdate",
      includeAssets: ["offline.html"],
      manifest: {
        name: "Unity Within \u2014 Peer Support Movement",
        short_name: "Unity Within",
        description: "A youth-led mental health organization connecting young people to support.",
        theme_color: "#f5dfe1",
        background_color: "#f5dfe1",
        display: "standalone",
        start_url: base,
        scope: base
      },
      workbox: {
        navigateFallback: `${base}index.html`,
        navigateFallbackDenylist: [
          new RegExp(`^${base}(?:our-story|what-we-do|peer-training|get-support|self-acceptance-hub|impact|events|volunteer|partner|donate|resources|contact|stories|not-found)(?:/|$)`),
          new RegExp(`^${base}(?:stories|hub)/.+`)
        ],
        globPatterns: ["**/*.{html,js,css,svg,json}"],
        globIgnores: ["**/images/optimized/**"],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.includes("/images/optimized/"),
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "unity-within-images",
              expiration: { maxEntries: 90, maxAgeSeconds: 60 * 60 * 24 * 30 }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\//,
            handler: "StaleWhileRevalidate",
            options: { cacheName: "unity-within-fonts", expiration: { maxEntries: 12, maxAgeSeconds: 60 * 60 * 24 * 90 } }
          }
        ]
      }
    })
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        ...isSsrBuild ? {} : {
          manualChunks: {
            "react-vendor": ["react", "react-dom", "react-router-dom"]
          }
        }
      }
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxvbnlpXFxcXERlc2t0b3BcXFxcdW5pdHkgd2l0aGluXFxcXG91ciBvZmZpY2lhbCB3ZWJzaXRlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxvbnlpXFxcXERlc2t0b3BcXFxcdW5pdHkgd2l0aGluXFxcXG91ciBvZmZpY2lhbCB3ZWJzaXRlXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9vbnlpL0Rlc2t0b3AvdW5pdHklMjB3aXRoaW4vb3VyJTIwb2ZmaWNpYWwlMjB3ZWJzaXRlL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xyXG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSAndml0ZS1wbHVnaW4tcHdhJ1xyXG5cclxuY29uc3QgYmFzZSA9ICcvb3VyLW9mZmljaWFsLXdlYnNpdGUtVVcvJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IGlzU3NyQnVpbGQgfSkgPT4gKHtcclxuICBiYXNlLFxyXG4gIHBsdWdpbnM6IFtcclxuICAgIHJlYWN0KCksXHJcbiAgICBWaXRlUFdBKHtcclxuICAgICAgZGlzYWJsZTogaXNTc3JCdWlsZCxcclxuICAgICAgcmVnaXN0ZXJUeXBlOiAnYXV0b1VwZGF0ZScsXHJcbiAgICAgIGluY2x1ZGVBc3NldHM6IFsnb2ZmbGluZS5odG1sJ10sXHJcbiAgICAgIG1hbmlmZXN0OiB7XHJcbiAgICAgICAgbmFtZTogJ1VuaXR5IFdpdGhpbiBcdTIwMTQgUGVlciBTdXBwb3J0IE1vdmVtZW50JyxcclxuICAgICAgICBzaG9ydF9uYW1lOiAnVW5pdHkgV2l0aGluJyxcclxuICAgICAgICBkZXNjcmlwdGlvbjogJ0EgeW91dGgtbGVkIG1lbnRhbCBoZWFsdGggb3JnYW5pemF0aW9uIGNvbm5lY3RpbmcgeW91bmcgcGVvcGxlIHRvIHN1cHBvcnQuJyxcclxuICAgICAgICB0aGVtZV9jb2xvcjogJyNmNWRmZTEnLFxyXG4gICAgICAgIGJhY2tncm91bmRfY29sb3I6ICcjZjVkZmUxJyxcclxuICAgICAgICBkaXNwbGF5OiAnc3RhbmRhbG9uZScsXHJcbiAgICAgICAgc3RhcnRfdXJsOiBiYXNlLFxyXG4gICAgICAgIHNjb3BlOiBiYXNlLFxyXG4gICAgICB9LFxyXG4gICAgICB3b3JrYm94OiB7XHJcbiAgICAgICAgbmF2aWdhdGVGYWxsYmFjazogYCR7YmFzZX1pbmRleC5odG1sYCxcclxuICAgICAgICBuYXZpZ2F0ZUZhbGxiYWNrRGVueWxpc3Q6IFtcclxuICAgICAgICAgIG5ldyBSZWdFeHAoYF4ke2Jhc2V9KD86b3VyLXN0b3J5fHdoYXQtd2UtZG98cGVlci10cmFpbmluZ3xnZXQtc3VwcG9ydHxzZWxmLWFjY2VwdGFuY2UtaHVifGltcGFjdHxldmVudHN8dm9sdW50ZWVyfHBhcnRuZXJ8ZG9uYXRlfHJlc291cmNlc3xjb250YWN0fHN0b3JpZXN8bm90LWZvdW5kKSg/Oi98JClgKSxcclxuICAgICAgICAgIG5ldyBSZWdFeHAoYF4ke2Jhc2V9KD86c3Rvcmllc3xodWIpLy4rYCksXHJcbiAgICAgICAgXSxcclxuICAgICAgICBnbG9iUGF0dGVybnM6IFsnKiovKi57aHRtbCxqcyxjc3Msc3ZnLGpzb259J10sXHJcbiAgICAgICAgZ2xvYklnbm9yZXM6IFsnKiovaW1hZ2VzL29wdGltaXplZC8qKiddLFxyXG4gICAgICAgIHJ1bnRpbWVDYWNoaW5nOiBbXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHVybFBhdHRlcm46ICh7IHVybCB9KSA9PiB1cmwucGF0aG5hbWUuaW5jbHVkZXMoJy9pbWFnZXMvb3B0aW1pemVkLycpLFxyXG4gICAgICAgICAgICBoYW5kbGVyOiAnU3RhbGVXaGlsZVJldmFsaWRhdGUnLFxyXG4gICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgY2FjaGVOYW1lOiAndW5pdHktd2l0aGluLWltYWdlcycsXHJcbiAgICAgICAgICAgICAgZXhwaXJhdGlvbjogeyBtYXhFbnRyaWVzOiA5MCwgbWF4QWdlU2Vjb25kczogNjAgKiA2MCAqIDI0ICogMzAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHVybFBhdHRlcm46IC9eaHR0cHM6XFwvXFwvZm9udHNcXC4oZ29vZ2xlYXBpc3xnc3RhdGljKVxcLmNvbVxcLy8sXHJcbiAgICAgICAgICAgIGhhbmRsZXI6ICdTdGFsZVdoaWxlUmV2YWxpZGF0ZScsXHJcbiAgICAgICAgICAgIG9wdGlvbnM6IHsgY2FjaGVOYW1lOiAndW5pdHktd2l0aGluLWZvbnRzJywgZXhwaXJhdGlvbjogeyBtYXhFbnRyaWVzOiAxMiwgbWF4QWdlU2Vjb25kczogNjAgKiA2MCAqIDI0ICogOTAgfSB9LFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICBdLFxyXG4gICAgICB9LFxyXG4gICAgfSksXHJcbiAgXSxcclxuICBidWlsZDoge1xyXG4gICAgb3V0RGlyOiAnZGlzdCcsXHJcbiAgICBlbXB0eU91dERpcjogdHJ1ZSxcclxuICAgIHNvdXJjZW1hcDogZmFsc2UsXHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIG91dHB1dDoge1xyXG4gICAgICAgIC4uLihpc1NzckJ1aWxkID8ge30gOiB7XHJcbiAgICAgICAgICBtYW51YWxDaHVua3M6IHtcclxuICAgICAgICAgICAgJ3JlYWN0LXZlbmRvcic6IFsncmVhY3QnLCAncmVhY3QtZG9tJywgJ3JlYWN0LXJvdXRlci1kb20nXSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSksXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pKVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXlXLFNBQVMsb0JBQW9CO0FBQ3RZLE9BQU8sV0FBVztBQUNsQixTQUFTLGVBQWU7QUFFeEIsSUFBTSxPQUFPO0FBRWIsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxXQUFXLE9BQU87QUFBQSxFQUMvQztBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sUUFBUTtBQUFBLE1BQ04sU0FBUztBQUFBLE1BQ1QsY0FBYztBQUFBLE1BQ2QsZUFBZSxDQUFDLGNBQWM7QUFBQSxNQUM5QixVQUFVO0FBQUEsUUFDUixNQUFNO0FBQUEsUUFDTixZQUFZO0FBQUEsUUFDWixhQUFhO0FBQUEsUUFDYixhQUFhO0FBQUEsUUFDYixrQkFBa0I7QUFBQSxRQUNsQixTQUFTO0FBQUEsUUFDVCxXQUFXO0FBQUEsUUFDWCxPQUFPO0FBQUEsTUFDVDtBQUFBLE1BQ0EsU0FBUztBQUFBLFFBQ1Asa0JBQWtCLEdBQUcsSUFBSTtBQUFBLFFBQ3pCLDBCQUEwQjtBQUFBLFVBQ3hCLElBQUksT0FBTyxJQUFJLElBQUksMEpBQTBKO0FBQUEsVUFDN0ssSUFBSSxPQUFPLElBQUksSUFBSSxvQkFBb0I7QUFBQSxRQUN6QztBQUFBLFFBQ0EsY0FBYyxDQUFDLDZCQUE2QjtBQUFBLFFBQzVDLGFBQWEsQ0FBQyx3QkFBd0I7QUFBQSxRQUN0QyxnQkFBZ0I7QUFBQSxVQUNkO0FBQUEsWUFDRSxZQUFZLENBQUMsRUFBRSxJQUFJLE1BQU0sSUFBSSxTQUFTLFNBQVMsb0JBQW9CO0FBQUEsWUFDbkUsU0FBUztBQUFBLFlBQ1QsU0FBUztBQUFBLGNBQ1AsV0FBVztBQUFBLGNBQ1gsWUFBWSxFQUFFLFlBQVksSUFBSSxlQUFlLEtBQUssS0FBSyxLQUFLLEdBQUc7QUFBQSxZQUNqRTtBQUFBLFVBQ0Y7QUFBQSxVQUNBO0FBQUEsWUFDRSxZQUFZO0FBQUEsWUFDWixTQUFTO0FBQUEsWUFDVCxTQUFTLEVBQUUsV0FBVyxzQkFBc0IsWUFBWSxFQUFFLFlBQVksSUFBSSxlQUFlLEtBQUssS0FBSyxLQUFLLEdBQUcsRUFBRTtBQUFBLFVBQy9HO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUixhQUFhO0FBQUEsSUFDYixXQUFXO0FBQUEsSUFDWCxlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUEsUUFDTixHQUFJLGFBQWEsQ0FBQyxJQUFJO0FBQUEsVUFDcEIsY0FBYztBQUFBLFlBQ1osZ0JBQWdCLENBQUMsU0FBUyxhQUFhLGtCQUFrQjtBQUFBLFVBQzNEO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLEVBQUU7IiwKICAibmFtZXMiOiBbXQp9Cg==
