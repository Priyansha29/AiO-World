/**
 * Demo text content — original AiO-authored chapters.
 *
 * These are the only "hosted" books whose text is actually readable today:
 * they are AiO's own writing, so hosting them needs no permission grant and
 * gives the text reader real content to navigate (unlike a PDF whose pages a
 * cross-origin viewer cannot report).
 *
 * Each entry is keyed by the `demoContentRef` a book carries. A chapter body
 * is an array of paragraphs.
 */

export const DEMO_BOOKS = {
  'how-to-learn-to-code': {
    chapters: [
      {
        id: 'an-approach',
        title: 'An approach, not a talent',
        body: [
          'Nobody is born knowing how to program, and the students who look like they were are usually just further along a path you have not taken yet. Programming is a skill you acquire the same way you acquire any other: a little theory, a lot of practice, and a refusal to stop when it stops being easy.',
          'So the first thing to unlearn is the idea that you need to be "smart enough". You need to be patient enough. Small, repeated, honest practice beats hours of glamorous-but-unfinished projects every single time.',
        ],
      },
      {
        id: 'one-path',
        title: 'Pick one path and go deep',
        body: [
          'Beginners often drown in choice: every language, every framework, every "you should learn X instead" tweet. Pick one stack — one language, one tool, one beginner course or book — and stay with it until you have shipped something.',
          'Depth first is not a rule about forever. It is a rule about now. Switching later is cheap because the broad concepts transfer; switching every week means you pay the starting cost over and over and never bank the skill.',
        ],
      },
      {
        id: 'project-first',
        title: 'Project-first learning',
        body: [
          'Tutorials teach you to follow along; projects teach you to decide. As soon as you have the syntax basics, start a small project — a to-do app, a personal site, a script that saves you thirty seconds a day — and let the project pull the learning.',
          'You will search for things you "should have known". That is the process working. Every gap you close by building is a gap you will actually remember, because your code is the evidence.',
        ],
      },
      {
        id: 'staying-unstuck',
        title: 'Staying unstuck',
        body: [
          'Reading error messages before guessing, breaking a problem in half, and taking a real break are the three habits that separate people who finish from people who quit. An error message is not a failure signal; it is the compiler talking to you politely.',
          'Finally, keep a log of what you build. Three months from now, that log is your portfolio, your interview story, and your proof to yourself that you are, in fact, learning.',
        ],
      },
    ],
  },

  'git-in-one-sitting': {
    chapters: [
      {
        id: 'why-version-control',
        title: 'Why version control',
        body: [
          'Version control is a time machine with a lab notebook strapped to it. It records every state of your project and lets you return to any earlier moment, so experimentation stops being scary — you can always undo.',
          'Git also turns solo work into team work: two people can edit the same codebase without stepping on each other, because everyone works on their own copy of history and merges deliberately.',
        ],
      },
      {
        id: 'working-tree-index-repo',
        title: 'The working tree, index and repository',
        body: [
          'Three places matter. Your working tree is the files you edit. The index (or staging area) is where you collect the changes that will go into your next commit. The repository is the permanent history of commits.',
          'The flow is: edit files, `git add` to stage what feels finished, then `git commit` to record it. A commit is a checkpoint, not a life event — small, frequent commits are a sign of a healthy project.',
        ],
      },
      {
        id: 'branching',
        title: 'Branching without fear',
        body: [
          'A branch is just a movable pointer to a commit. Creating one costs nothing, which is exactly why Git encourages it: try the risky idea on its own branch, and the main branch stays safe.',
          'When the experiment works, merge it back. When it does not, delete the branch. The ability to branch cheaply is what makes "what if I refactor this?" an everyday question instead of a leap of faith.',
        ],
      },
      {
        id: 'daily-flow',
        title: 'A daily flow',
        body: [
          'A workable daily rhythm: pull the latest work, make a branch named for what you are about to do, code, commit often with honest messages, then merge and push when it is done.',
          'Write commit messages that tell your future self what happened, not how: "fix checkout total for empty carts" beats "update cart code". Three months from now the diff is irrelevant; the message is the memory.',
        ],
      },
    ],
  },
}

export function getDemoContent(ref) {
  return DEMO_BOOKS[ref] ?? null
}