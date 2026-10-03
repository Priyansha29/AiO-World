import AttendanceCalculator from '../components/calculators/AttendanceCalculator'
import CgpaCalculator from '../components/calculators/CgpaCalculator'

export const TOOL_COMPONENTS = {
  'cgpa-calculator': CgpaCalculator,
  'attendance-calculator': AttendanceCalculator,
}

export function toolComponent(toolId) {
  return TOOL_COMPONENTS[toolId] ?? null
}