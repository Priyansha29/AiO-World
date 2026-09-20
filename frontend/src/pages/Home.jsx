import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Explore from '../components/Explore'
import Footer from '../components/Footer'
import './Home.css'

function Home() {
  return (
    <main className="home">
      <Navbar />
      <Hero />
      <Explore />
      <Footer />
    </main>
  )
}

export default Home