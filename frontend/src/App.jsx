import Home from './pages/Home'
import CollegeSetupPage from './features/campus/pages/CollegeSetupPage'
import CampusHubPage from './features/campus/pages/CampusHubPage'
import { useHashRoute } from './router/hash-router'

function App() {
  const route = useHashRoute()

  if (route === '/setup') return <CollegeSetupPage />
  if (route === '/campus') return <CampusHubPage />
  return <Home />
}

export default App