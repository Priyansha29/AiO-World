import AttendanceCalculator from '../components/calculators/AttendanceCalculator'
import CgpaCalculator from '../components/calculators/CgpaCalculator'
import JsonFormatter from '../components/calculators/JsonFormatter'
import MarksPercentageCalculator from '../components/calculators/MarksPercentageCalculator'
import RelativeGradingCalculator from '../components/calculators/RelativeGradingCalculator'

export const TOOL_COMPONENTS = {
  'cgpa-calculator': CgpaCalculator,
  'attendance-calculator': AttendanceCalculator,
  'marks-percentage-calculator': MarksPercentageCalculator,
  'relative-grading-calculator': RelativeGradingCalculator,
  'json-formatter': JsonFormatter,
}

export function toolComponent(toolId) {
  return TOOL_COMPONENTS[toolId] ?? null
}