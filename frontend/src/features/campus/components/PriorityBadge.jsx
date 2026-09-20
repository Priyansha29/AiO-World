/**
 * PriorityBadge — visual priority without shouting. Every level is red-free
 * except `urgent`, which uses the brand accent sparingly.
 */
const PRIORITY_LABELS = {
  low: 'Low',
  normal: 'Normal',
  high: 'High',
  urgent: 'Urgent',
}

export default function PriorityBadge({ priority }) {
  return (
    <span className={`campus-priority campus-priority--${priority}`}>
      <span className="campus-priority__dot" aria-hidden="true" />
      {PRIORITY_LABELS[priority] ?? priority}
    </span>
  )
}