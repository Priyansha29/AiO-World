import Home from './pages/Home'
import CollegeSetupPage from './features/campus/pages/CollegeSetupPage'
import CampusHubPage from './features/campus/pages/CampusHubPage'
import PlayPage from './features/play/pages/PlayPage'
import GuessWhoPage from './features/play/pages/GuessWhoPage'
import NannyManiaPage from './features/play/pages/NannyManiaPage'
import SidequestsPage from './features/sidequests/pages/SidequestsPage'
import CareerPage from './features/career/pages/CareerPage'
import RoadmapDetailPage from './features/career/pages/RoadmapDetailPage'
import LibraryPage from './features/learn/library/pages/LibraryPage'
import BookReaderPage from './features/learn/library/pages/BookReaderPage'
import MyLibraryPage from './features/learn/library/pages/MyLibraryPage'
import PlatformPage from './components/platform/PlatformPage'
import { findPlatformSection } from './components/platform/platform-data'
import { useHashRoute } from './router/hash-router'

function App() {
  const route = useHashRoute()

  const roadmapMatch = route.match(/^\/career\/roadmaps\/([\w-]+)$/)
  const libraryBookMatch = route.match(/^\/learn\/library\/book\/([\w-]+)$/)

  if (route === '/setup') return <CollegeSetupPage />
  if (route === '/campus') return <CampusHubPage />
  if (route === '/play/guess-who') return <GuessWhoPage />
  if (route === '/play/nanny-mania') return <NannyManiaPage />
  if (route === '/play') return <PlayPage />
  if (route === '/sidequests') return <SidequestsPage />
  if (route === '/learn/library') return <LibraryPage />
  if (route === '/learn/library/my-library') return <MyLibraryPage />
  if (libraryBookMatch) return <BookReaderPage bookId={libraryBookMatch[1]} />
  if (route === '/learn') return <PlatformPage platformKey="learn" />
  if (route === '/career/roadmaps') return <CareerPage />
  if (roadmapMatch) return <RoadmapDetailPage roadmapId={roadmapMatch[1]} />
  if (route === '/career') return <PlatformPage platformKey="career" />

  const section = findPlatformSection(route)
  if (section) return <PlatformPage platformKey={section.platform.key} sectionKey={section.section.key} />
  return <Home />
}

export default App