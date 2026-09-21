import Home from './pages/Home'
import CollegeSetupPage from './features/campus/pages/CollegeSetupPage'
import CampusHubPage from './features/campus/pages/CampusHubPage'
import PlayPage from './features/play/pages/PlayPage'
import GuessWhoPage from './features/play/pages/GuessWhoPage'
import { useHashRoute } from './router/hash-router'

function App() {
  const route = useHashRoute()

  if (route === '/setup') return <CollegeSetupPage />
  if (route === '/campus') return <CampusHubPage />
  if (route === '/play/guess-who') return <GuessWhoPage />
  if (route === '/play') return <PlayPage />
  return <Home />
}

export default App