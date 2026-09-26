import Home from './pages/Home'
import CollegeSetupPage from './features/campus/pages/CollegeSetupPage'
import CampusHubPage from './features/campus/pages/CampusHubPage'
import PlayPage from './features/play/pages/PlayPage'
import GuessWhoPage from './features/play/pages/GuessWhoPage'
import NannyManiaPage from './features/play/pages/NannyManiaPage'
import SidequestsPage from './features/sidequests/pages/SidequestsPage'
import { useHashRoute } from './router/hash-router'

function App() {
  const route = useHashRoute()

  if (route === '/setup') return <CollegeSetupPage />
  if (route === '/campus') return <CampusHubPage />
  if (route === '/play/guess-who') return <GuessWhoPage />
  if (route === '/play/nanny-mania') return <NannyManiaPage />
  if (route === '/play') return <PlayPage />
  if (route === '/sidequests') return <SidequestsPage />
  return <Home />
}

export default App