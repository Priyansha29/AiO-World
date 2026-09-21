import { getQuestion } from '../data/questions'
import { playerLabel } from '../logic/gameReducer'

function QuestionHistory({ history }) {
  return (
    <section className="gw-panel gw-history" aria-labelledby="gw-history-title">
      <h2 id="gw-history-title">Questions asked</h2>
      {history.length === 0 ? (
        <p className="gw-history__empty">No questions yet. Ask one out loud and record the answer.</p>
      ) : (
        <ol className="gw-history__list">
          {history.map((entry) => {
            const question = getQuestion(entry.questionId)
            return (
              <li key={entry.id} className="gw-history__item">
                <span className="gw-history__who">{playerLabel(entry.player)}</span>
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
