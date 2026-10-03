export const GRADE_SCALE = [
  { key: 'A+', points: 10 },
  { key: 'A', points: 9 },
  { key: 'B+', points: 8 },
  { key: 'B', points: 7 },
  { key: 'C+', points: 6 },
  { key: 'C', points: 5 },
  { key: 'D', points: 4 },
  { key: 'F', points: 0 },
]

export function gradePoints(grade) {
  const entry = GRADE_SCALE.find((item) => item.key === grade)
  return entry ? entry.points : 0
}

export function calculateSemesterGpa(rows) {
  let totalCredits = 0
  let earned = 0
  for (const row of rows) {
    const credits = Number(row.credit)
    if (!Number.isFinite(credits) || credits <= 0) continue
    totalCredits += credits
    earned += credits * gradePoints(row.grade)
  }
  if (totalCredits === 0) return { totalCredits: 0, earned: 0, sgpa: null }
  return { totalCredits, earned, sgpa: earned / totalCredits }
}

export function projectCgpa(prevCgpa, prevCredits, earned, credits) {
  const totalCredits = prevCredits + credits
  if (totalCredits === 0) return null
  return (prevCgpa * prevCredits + earned) / totalCredits
}

export function requiredSgpaForTarget(prevCgpa, prevCredits, credits, target) {
  if (credits === 0) return null
  return (target * (prevCredits + credits) - prevCgpa * prevCredits) / credits
}