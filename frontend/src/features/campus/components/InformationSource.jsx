/**
 * InformationSource — surfaces the provenance of a piece of campus
 * information. The label comes from `SOURCE_TYPE_LABELS` (or an explicit
 * per-item `label`, used to mark demo content as demo/sample). Demo items are
 * never labelled "official" or "live".
 */
import { SOURCE_TYPE_LABELS } from '../domain/campus-categories'

export default function InformationSource({ source }) {
  const typeLabel =
    source?.label ?? SOURCE_TYPE_LABELS[source?.type] ?? source?.type ?? 'Unknown source'

  return (
    <span className="campus-source">
      <span className="campus-source__label">{typeLabel}</span>
      {source?.name ? (
        <span className="campus-source__name">{source.name}</span>
      ) : null}
      {source?.url ? (
        <a
          className="campus-source__name"
          href={source.url}
          target="_blank"
          rel="noreferrer"
        >
          ↗
        </a>
      ) : null}
    </span>
  )
}