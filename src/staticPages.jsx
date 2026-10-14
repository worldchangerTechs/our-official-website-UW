import Home from './pages/Home.jsx'
import OurStory from './pages/OurStory.jsx'
import WhatWeDo from './pages/WhatWeDo.jsx'
import PeerTraining from './pages/PeerTraining.jsx'
import GetSupport from './pages/GetSupport.jsx'
import SelfAcceptanceHub from './pages/SelfAcceptanceHub.jsx'
import Stories from './pages/Stories.jsx'
import StoryDetail from './pages/StoryDetail.jsx'
import Impact from './pages/Impact.jsx'
import Events from './pages/Events.jsx'
import Volunteer from './pages/Volunteer.jsx'
import Partner from './pages/Partner.jsx'
import Donate from './pages/Donate.jsx'
import Resources from './pages/Resources.jsx'
import Contact from './pages/Contact.jsx'
import NotFound from './pages/NotFound.jsx'

export const staticPages = [
  ['/', Home],
  ['/our-story', OurStory],
  ['/what-we-do', WhatWeDo],
  ['/peer-training', PeerTraining],
  ['/get-support', GetSupport],
  ['/self-acceptance-hub', SelfAcceptanceHub],
  ['/stories', Stories],
  ['/stories/:slug', StoryDetail],
  ['/hub/:slug', SelfAcceptanceHub],
  ['/impact', Impact],
  ['/events', Events],
  ['/volunteer', Volunteer],
  ['/partner', Partner],
  ['/donate', Donate],
  ['/resources', Resources],
  ['/contact', Contact],
  ['/not-found', NotFound],
]
