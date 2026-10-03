import AttendanceCalculator from '../components/calculators/AttendanceCalculator'
import CgpaCalculator from '../components/calculators/CgpaCalculator'
import MarksPercentageCalculator from '../components/calculators/MarksPercentageCalculator'

export const TOOL_COMPONENTS = {
  'cgpa-calculator': CgpaCalculator,
  'attendance-calculator': AttendanceCalculator,
  'marks-percentage-calculator': MarksPercentageCalculator,
}

export function toolComponent(toolId) {
  return TOOL_COMPONENTS[toolId] ?? null
}