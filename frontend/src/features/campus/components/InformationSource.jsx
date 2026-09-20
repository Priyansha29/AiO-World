/**
 * InformationSource — surfaces the provenance of a piece of campus
 * information. The label comes from `SOURCE_TYPE_LABELS`; the source name is
 * always shown so unverifiable demo items never look like they came from an
 * official feed.
 */
import { SOURCE_TYPE_LABELS } from '../domain/campus-categories'

export default function InformationSource({ source }) {
  const typeLabel = SOURCE_TYPE_LABELS[source?.type] ?? source?.type ?? 'Unknown source'

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