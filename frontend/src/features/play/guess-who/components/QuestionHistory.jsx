import { getQuestion } from '../data/questions'

function QuestionHistory({ history }) {
  return (
    <section className="gw-panel gw-history" aria-labelledby="gw-history-title">
      <h2 id="gw-history-title">Question history</h2>
      {history.length === 0 ? (
        <p className="gw-history__empty">No questions recorded yet.</p>
      ) : (
        <ol className="gw-history__list">
          {history.map((entry) => {
            const question = getQuestion(entry.questionId)
            return (
              <li key={entry.id} className="gw-history__item">
                <span className="gw-history__check" aria-hidden="true">
                  ✓
                </span>
                <span className="gw-history__text">{question ? question.text : 'Question'}</span>
                <span className={`gw-history__answer gw-history__answer--${entry.answer ? 'yes' : 'no'}`}>
                  {entry.answer ? 'YES' : 'NO'}
                </span>
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}

export default QuestionHistory
