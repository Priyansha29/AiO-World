/**
 * CampusHubPage — the personalized Campus Hub (step 2 of the flow).
 *
 * Data flow: selected college (profile-store) → campus data hook →
 * category filter + search → card list. Components here never fetch directly.
 */
import { useEffect, useMemo, useState } from 'react'
import Navbar from '../../../components/Navbar'
import CampusHeader from '../components/CampusHeader'
import CampusCategoryTabs from '../components/CampusCategoryTabs'
import CampusInfoList from '../components/CampusInfoList'
import { EmptyState, ErrorState, InfoSkeleton } from '../components/States'
import { useCampusInformation } from '../services/use-campus-data'
import { getSelectedCollege } from '../services/profile-store'
import { navigate } from '../../../router/hash-router'
import { CAMPUS_CATEGORY_META } from '../domain/campus-categories'
import '../campus.css'

export default function CampusHubPage() {
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')

  const profileCollege = useMemo(() => getSelectedCollege(), [])

  useEffect(() => {
    if (!profileCollege) navigate('/setup')
  }, [profileCollege])

  const filters = useMemo(
    () => ({
      category: category === 'all' ? undefined : category,
      query: query.trim(),
    }),
    [category, query],
  )

  const { college, items, loading, error, retry } = useCampusInformation(
    profileCollege?.id ?? null,
    filters,
  )

  const lastUpdatedAt = useMemo(() => {
    if (!items.length) return null
    return items.reduce((latest, item) =>
      item.updatedAt > latest.updatedAt ? item : latest,
    ).updatedAt
  }, [items])

  if (!profileCollege) {
    return (
      <main className="campus-page" id="top">
        <Navbar />
      </main>
    )
  }

  const categoryMeta = category !== 'all' ? CAMPUS_CATEGORY_META[category] : null
  const hasQuery = query.trim() !== ''

  const emptyTitle = hasQuery
    ? `No results for “${query.trim()}”`
    : categoryMeta
      ? categoryMeta.emptyTitle
      : 'Nothing here yet'
  const emptyHint = hasQuery
    ? 'Try a different word — for example “exam”, “bus” or “menu”.'
    : categoryMeta
      ? categoryMeta.emptyHint
      : 'When your campus publishes updates, they will appear here.'

  return (
    <main className="campus-page" id="top">
      <Navbar />
      <div className="campus-page__shell campus-page__shell--hub">
        <CampusHeader
          college={college ?? profileCollege}
          lastUpdatedAt={lastUpdatedAt}
          onChangeCollege={() => navigate('/setup')}
        />

        <div className="campus-controls">
          <CampusCategoryTabs active={category} onChange={setCategory} />
          <div className="campus-search">
            <input
              type="search"
              className="campus-search__input"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search campus info…"
              aria-label="Search campus information"
            />
          </div>
        </div>

        {loading ? (
          <InfoSkeleton count={4} />
        ) : error ? (
          <ErrorState message={error} onRetry={retry} />
        ) : items.length > 0 ? (
          <CampusInfoList items={items} />
        ) : (
          <EmptyState title={emptyTitle} hint={emptyHint} />
        )}

        <p className="demo-note">
          Demo data · Sample campus information for development — sources are
          fictional and not verified. Nothing here is live.
        </p>
      </div>
    </main>
  )
}