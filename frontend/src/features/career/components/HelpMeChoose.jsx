/**
 * Help Me Choose — a pick-a-lane quiz that suggests a roadmap.
 *
 * Five light questions, each a set of option buttons. The page owns the
 * answer state and the suggestion (via `services/chooser.js`); this component
 * only renders the questions and the resulting suggestion card.
 */
import { memo } from 'react'
import { navigate } from '../../../router/hash-router'

const QUESTIONS = [
  {
    key: 'careerPath',
    label: 'What is drawing you in?',
    options: [
      { value: 'software', label: 'Software & web' },
      { value: 'ai', label: 'AI & data' },
      { value: 'cloud', label: 'Cloud & DevOps' },
      { value: 'cybersecurity', label: 'Security' },
      { value: 'engineering', label: 'Systems / hardware' },
      { value: 'design', label: 'Design & product' },
    ],
  },
  {
    key: 'cpp',
    label: 'How do you feel about C?',
    options: [
      { value: 'yes', label: 'Love being close to the machine' },
      { value: 'meh', label: 'It is fine when I have to' },
      { value: 'no', label: 'Prefer high-level languages' },
    ],
  },
  {
    key: 'ai',
    label: 'Do you want to work with AI?',
    options: [
      { value: 'yes', label: 'Yes, very much' },
      { value: 'maybe', label: 'Open to it' },
      { value: 'no', label: 'Not my thing' },
    ],
  },
  {
    key: 'data',
    label: 'Does "data" sound exciting?',
    options: [
      { value: 'yes', label: 'Love analysis & insights' },
      { value: 'maybe', label: 'It has its moments' },
      { value: 'no', label: 'Prefer building products' },
    ],
  },
  {
    key: 'quick',
    label: 'How fast do you want a result?',
    options: [
      { value: 'quick', label: 'As fast as possible' },
      { value: 'steady', label: 'Steady and solid' },
    ],
  },
]

function HelpMeChoose({ answers, onAnswer, suggestion, suggestedIds }) {
  const answeredCount = QUESTIONS.filter((q) => answers[q.key]).length
  const finishedAll = answeredCount === QUESTIONS.length

  return (
    <div className="career-choose" id="help-me-choose">
      <div className="career-choose__intro">
        <h2 className="career-choose__title">Help me choose</h2>
        <p className="career-choose__sub">
          Five quick questions, one suggested roadmap. The "why" is honest — it
          just matches what you picked against real paths.
        </p>
        <span className="career-choose__count">
          {answeredCount}/{QUESTIONS.length} answered
        </span>
      </div>

      <ol className="career-choose__questions">
        {QUESTIONS.map((question) => (
          <li key={question.key} className="career-choose__question">
            <h3 className="career-choose__qlabel">{question.label}</h3>
            <div className="career-choose__options">
              {question.options.map((option) => {
                const selected = answers[question.key] === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    className={`career-choose__option${selected ? ' career-choose__option--selected' : ''}`}
                    onClick={() => onAnswer(question.key, option.value)}
                    aria-pressed={selected}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </li>
        ))}
      </ol>

      {suggestion && (
        <div className="career-choose__result">
          {finishedAll ? (
            <>
              <p className="career-choose__result-label">Your suggested starting path:</p>
              <button
                type="button"
                className="career-choose__result-card"
                onClick={() => navigate(`/career/roadmaps/${suggestion.id}`)}
              >
                <strong className="career-choose__result-title">{suggestion.title}</strong>
                <span className="career-choose__result-desc">{suggestion.description}</span>
                <span className="career-choose__result-cta">Open roadmap →</span>
              </button>
            </>
          ) : (
            <p className="career-choose__hint">Answer all five for a specific pick.</p>
          )}
        </div>
      )}

      {suggestedIds.length > 0 && (
        <p className="career-choose__foot">
          Also matched: {suggestedIds.join(', ')}
        </p>
      )}
    </div>
  )
}

export default memo(HelpMeChoose)