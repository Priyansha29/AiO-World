import AttendanceCalculator from '../components/calculators/AttendanceCalculator'
import Base64EncoderDecoder from '../components/calculators/Base64EncoderDecoder'
import CgpaCalculator from '../components/calculators/CgpaCalculator'
import CidrCalculator from '../components/calculators/CidrCalculator'
import ColorConverter from '../components/calculators/ColorConverter'
import CurrencyConverter from '../components/calculators/CurrencyConverter'
import JsonFormatter from '../components/calculators/JsonFormatter'
import MarksPercentageCalculator from '../components/calculators/MarksPercentageCalculator'
import RelativeGradingCalculator from '../components/calculators/RelativeGradingCalculator'
import RegexTester from '../components/calculators/RegexTester'
import SalaryCtcCalculator from '../components/calculators/SalaryCtcCalculator'
import SubnetCalculator from '../components/calculators/SubnetCalculator'
import TimezoneConverter from '../components/calculators/TimezoneConverter'
import TimestampConverter from '../components/calculators/TimestampConverter'
import UnitConverter from '../components/calculators/UnitConverter'
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
  'color-converter': ColorConverter,
  'timestamp-converter': TimestampConverter,
  'ip-cidr-calculator': CidrCalculator,
  'subnet-calculator': SubnetCalculator,
  'currency-converter': CurrencyConverter,
  'timezone-converter': TimezoneConverter,
  'unit-converter': UnitConverter,
  'salary-ctc-calculator': SalaryCtcCalculator,
}

export function toolComponent(toolId) {
  return TOOL_COMPONENTS[toolId] ?? null
}