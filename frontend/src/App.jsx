import Home from './pages/Home'
import CollegeSetupPage from './features/campus/pages/CollegeSetupPage'
import CampusHubPage from './features/campus/pages/CampusHubPage'
import FunPage from './features/play/pages/FunPage'
import CollectionPage from './features/play/pages/CollectionPage'
import GuessWhoPage from './features/play/pages/GuessWhoPage'
import SidequestsPage from './features/sidequests/pages/SidequestsPage'
import CareerPage from './features/career/pages/CareerPage'
import RoadmapDetailPage from './features/career/pages/RoadmapDetailPage'
import LibraryPage from './features/learn/library/pages/LibraryPage'
import BookReaderPage from './features/learn/library/pages/BookReaderPage'
import MyLibraryPage from './features/learn/library/pages/MyLibraryPage'
import SubjectsPage from './features/learn/subjects/pages/SubjectsPage'
import SubjectDetailPage from './features/learn/subjects/pages/SubjectDetailPage'
import PlatformPage from './components/platform/PlatformPage'
import { findPlatformSection } from './components/platform/platform-data'
import { useHashRoute } from './router/hash-router'

function App() {
  const route = useHashRoute()

  const roadmapMatch = route.match(/^\/career\/roadmaps\/([\w-]+)$/)
  const libraryBookMatch = route.match(/^\/learn\/library\/book\/([\w-]+)$/)
  const subjectMatch = route.match(/^\/learn\/subjects\/([\w-]+)$/)

  if (route === '/setup') return <CollegeSetupPage />
  if (route === '/campus') return <CampusHubPage />
  if (route === '/play/guess-who') return <GuessWhoPage />
  if (route === '/play') return <FunPage />
  const funCollectionMatch = route.match(/^\/fun\/([\w-]+)$/)
  if (funCollectionMatch) return <CollectionPage collectionId={funCollectionMatch[1]} />
  if (route === '/fun') return <FunPage />
  if (route === '/sidequests') return <SidequestsPage />
  if (route === '/learn/library') return <LibraryPage />
  if (route === '/learn/library/my-library') return <MyLibraryPage />
  if (libraryBookMatch) return <BookReaderPage bookId={libraryBookMatch[1]} />
  if (route === '/learn/subjects') return <SubjectsPage />
  if (subjectMatch) return <SubjectDetailPage subjectId={subjectMatch[1]} />
  if (route === '/learn') return <PlatformPage platformKey="learn" />
  if (route === '/career/roadmaps') return <CareerPage />
  if (roadmapMatch) return <RoadmapDetailPage roadmapId={roadmapMatch[1]} />
  if (route === '/career') return <PlatformPage platformKey="career" />

  const section = findPlatformSection(route)
  if (section) return <PlatformPage platformKey={section.platform.key} sectionKey={section.section.key} />
  return <Home />
}

export default App