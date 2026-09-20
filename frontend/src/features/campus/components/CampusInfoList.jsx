/**
 * CampusInfoList — the dashboard/grid of information cards.
 * Desktop: multi-column grid. Mobile: single stacked feed (CSS handles this).
 */
import CampusInfoCard from './CampusInfoCard'

export default function CampusInfoList({ items }) {
  return (
    <div className="campus-card-grid">
      {items.map((item, index) => (
        <CampusInfoCard key={item.id} information={item} index={index} />
      ))}
    </div>
  )
}