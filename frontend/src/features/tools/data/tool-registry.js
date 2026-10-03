import AttendanceCalculator from '../components/calculators/AttendanceCalculator'
import Base64EncoderDecoder from '../components/calculators/Base64EncoderDecoder'
import CgpaCalculator from '../components/calculators/CgpaCalculator'
import JsonFormatter from '../components/calculators/JsonFormatter'
import MarksPercentageCalculator from '../components/calculators/MarksPercentageCalculator'
import RelativeGradingCalculator from '../components/calculators/RelativeGradingCalculator'
import RegexTester from '../components/calculators/RegexTester'
import UrlEncoderDecoder from '../components/calculators/UrlEncoderDecoder'

export const TOOL_COMPONENTS = {
  'cgpa-calculator': CgpaCalculator,
  'attendance-calculator': AttendanceCalculator,
  'marks-percentage-calculator': MarksPercentageCalculator,
  'relative-grading-calculator': RelativeGradingCalculator,
  'json-formatter': JsonFormatter,
  'base64-encoder-decoder': Base64EncoderDecoder,
  'url-encoder-decoder': UrlEncoderDecoder,
  'regex-tester': RegexTester,
}

export function toolComponent(toolId) {
  return TOOL_COMPONENTS[toolId] ?? null
}