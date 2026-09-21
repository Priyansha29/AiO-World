import { QUESTIONS, QUESTION_GROUPS, getQuestion } from '../data/questions'

function QuestionPanel({ pending, onPick, onAnswer, onCancel }) {
  const pendingQuestion = pending ? getQuestion(pending) : null

  return (
    <section className="gw-panel gw-questions" aria-labelledby="gw-ask-title">
      <div className="gw-questions__head">
        <h2 id="gw-ask-title">Ask a question</h2>
        <p className="gw-hint">Ask out loud, then record what they answered.</p>
      </div>

      {pendingQuestion && (
        <div className="gw-record" role="alert">
          <p className="gw-record__q">{pendingQuestion.text}</p>
          <div className="gw-record__actions">
            <button type="button" className="gw-record__btn gw-record__btn--yes" onClick={() => onAnswer(true)}>
              YES
            </button>
            <button type="button" className="gw-record__btn gw-record__btn--no" onClick={() => onAnswer(false)}>
              NO
            </button>
            <button type="button" className="gw-textbtn" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className={`gw-questions__groups${pending ? ' is-locked' : ''}`}>
        {QUESTION_GROUPS.map((group) => (
          <div key={group.id} className="gw-questions__group">
            <h3 className="gw-questions__group-title">{group.title}</h3>
            <div className="gw-questions__list">
              {QUESTIONS.filter((q) => q.group === group.id).map((question) => (
                <button
                  key={question.id}
                  type="button"
                  className="gw-qbtn"
                  disabled={Boolean(pending)}
                  onClick={() => onPick(question.id)}
                >
                  {question.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default QuestionPanel
