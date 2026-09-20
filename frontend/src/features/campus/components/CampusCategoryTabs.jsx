/**
 * CampusCategoryTabs — category filter pills. Horizontally scrollable on
 * small screens; `all` is the default view.
 */
import { CAMPUS_CATEGORY_LIST } from '../domain/campus-categories'

export default function CampusCategoryTabs({ active, onChange }) {
  const tabs = [{ id: 'all', label: 'All' }, ...CAMPUS_CATEGORY_LIST]

  return (
    <div className="campus-tabs" role="tablist" aria-label="Filter campus information">
      {tabs.map((tab) => {
        const isActive = active === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`campus-tabs__tab${isActive ? ' campus-tabs__tab--active' : ''}`}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}