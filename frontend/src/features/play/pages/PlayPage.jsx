import { useEffect } from 'react'
import Navbar from '../../../components/Navbar'
import FunHero from '../components/FunHero'
import FunCollection from '../components/FunCollection'
import { FUN_COLLECTIONS } from '../data/fun-resources'
import '../play.css'

export default function PlayPage() {
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  return (
    <main className="play-page" id="top">
      <Navbar />
      <div className="play-shell">
        <FunHero />
        {FUN_COLLECTIONS.map((collection) => (
          <FunCollection key={collection.id} collection={collection} />
        ))}
      </div>
    </main>
  )
}