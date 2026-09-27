/**
 * Subjects presenter — the taxonomy → catalogue layer for the Subjects module.
 *
 * The shared taxonomy (`src/shared/taxonomy.js`) is the single source of truth
 * for subjects, groups and skills. This file only adapts that vocabulary into
 * the record shape the generic catalogue shell expects (id / title /
 * description / group / skills / tags) plus the filter config. It never
 * re-declares a subject list or a grouping — both are derived, so a subject or
 * group added to the taxonomy shows up here automatically.
 */
import {
  groupForSubject,
  skillsForSubject,
  SUBJECT_GROUPS,
  SUBJECTS,
} from '../../../../shared/taxonomy'

/** Group order for display, straight from the taxonomy (no new grouping). */
export const SUBJECT_GROUP_ORDER = SUBJECT_GROUPS.map((group) => group.key)

const GROUP_LABELS = Object.fromEntries(SUBJECT_GROUPS.map((group) => [group.key, group.label]))

export function subjectGroupLabel(groupKey) {
  return GROUP_LABELS[groupKey] ?? groupKey
}

/**
 * Adapt one subject into a catalogue record. `skills` holds shared skill keys
 * (so the explorer's haystack turns them into searchable labels) and `tags`
 * carries the group label so "search: web development" finds the group's
 * subjects too.
 */
export function subjectToRecord(subject) {
  const group = groupForSubject(subject.key)
  const skills = skillsForSubject(subject.key)
  return {
    id: subject.key,
    title: subject.label,
    description: subject.description,
    group: group?.key ?? null,
    groupLabel: group?.label ?? null,
    skills: skills.map((skill) => skill.key),
    aliases: [subject.key],
    tags: group ? [group.label] : [],
  }
}

/** The full subjects catalogue — derived once from the taxonomy. */
export const SUBJECT_RECORDS = SUBJECTS.map(subjectToRecord)

/** The filter configuration for the Subjects index, keyed by taxonomy groups. */
export const SUBJECT_FILTERS = [
  {
    key: 'group',
    label: 'Subject group',
    valueField: 'group',
    options: SUBJECT_GROUPS.map((group) => ({
      value: group.key,
      label: group.label,
      count: SUBJECT_RECORDS.filter((record) => record.group === group.key).length,
    })),
  },
]