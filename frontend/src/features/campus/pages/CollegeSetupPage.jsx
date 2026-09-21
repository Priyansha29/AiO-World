/**
 * CollegeSetupPage — step 1 of the Campus Hub flow: discover + choose a college.
 * Selecting a college persists it (profile-store) and routes to #/campus.
 */
import { useState } from 'react'
import Navbar from '../../../components/Navbar'
import CollegeSearch from '../components/CollegeSearch'
import CollegeCard from '../components/CollegeCard'
import { ErrorState } from '../components/States'
import { useCollegeSearch } from '../services/use-campus-data'
import { getSelectedCollege, saveSelectedCollege } from '../services/profile-store'
import { navigate } from '../../../router/hash-router'
import '../campus.css'

function SelectBanner({ college }) {
  if (!college) return null
  return (
    <div className="select-banner">
      <p className="select-banner__text">
        <strong>{college.name}</strong> is your current college.
      </p>
      <div className="select-banner__actions">
        <button type="button" className="select-banner__primary" onClick={() => navigate('/campus')}>
          Continue to your Campus
        </button>
        <span className="select-banner__note">Switching below changes your Campus Hub.</span>
      </div>
    </div>
  )
}

export default function CollegeSetupPage() {
  const [query, setQuery] = useState('')
  const [selectedCollege] = useState(() => getSelectedCollege())
  const { colleges, loading, error, retry } = useCollegeSearch(query)

  const handleSelect = (college) => {
    saveSelectedCollege(college)
    navigate('/campus')
  }

  const showPopular = query.trim() === ''

  return (
    <main className="campus-page" id="top">
      <Navbar />
      <div className="campus-page__shell campus-page__shell--setup">
        <header className="setup-head">
          <p className="campus-eyebrow">Campus Hub</p>
          <h1 className="setup-head__title">Where do you study?</h1>
          <p className="setup-head__lede">
            Personalize AiO World around your campus. Everything that matters — notices,
            classes, buses, mess, events and opportunities — in one place.
          </p>
        </header>

        <SelectBanner college={selectedCollege} />

        <CollegeSearch value={query} onChange={setQuery} />

        <div className="setup-results" aria-live="polite">
          {loading ? (
            <div className="college-list" aria-hidden="true">
              {Array.from({ length: 3 }, (_, index) => (
                <div className="college-skeleton" key={index} />
              ))}
            </div>
          ) : error ? (
            <ErrorState message="Couldn't load colleges." onRetry={retry} />
          ) : colleges.length > 0 ? (
            <>
              <p className="setup-results__label">
                {showPopular ? 'Pune colleges' : `Colleges matching “${query.trim()}”`}
              </p>
              <div className="college-list">
                {colleges.map((college, index) => (
                  <CollegeCard
                    key={college.id}
                    college={college}
                    index={index}
                    onSelect={handleSelect}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="setup-results__empty">
              <p>
                No colleges match “{query.trim()}”.
              </p>
              <p className="campus-state__hint">
                Try the college name, its abbreviation, city or university.
              </p>
            </div>
          )}
        </div>

        <p className="demo-note">
          Initial Pune college directory · More campuses coming soon.
        </p>
      </div>
    </main>
  )
}