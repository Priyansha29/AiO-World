/**
 * Resume Rooster - rule-based roasting (local only).
 * No AI; context-aware jokes based on actual resume evidence.
 */

export const ROOSTER_MODES = [
  { id: 'friendly', label: 'Friendly Roast', description: 'Light teasing with genuinely useful advice' },
  { id: 'savage', label: 'Savage Mode', description: 'Sharper sarcasm, still constructive' },
  { id: 'recruiter', label: "Recruiter's Hell", description: 'Skeptical recruiter POV calling out vague claims' },
]

export const ROOSTER_VERDICTS = {
  friendly: [
    "Not bad. The rooster is mildly annoyed - in a proud way.",
    "You've got potential. A few tweaks and I'll stop squawking.",
    "Respectable. With polish, this could actually impress me.",
  ],
  savage: [
    "Ouch. I need a nap after that resume.",
    "Yikes. There's talent buried under buzzwords.",
    "Still salvageable. Barely. But salvageable.",
  ],
  recruiter: [
    "I'll keep it in the 'maybe' pile - for now.",
    "Convincing... if I squint really hard.",
    "Needs receipts. Lots of receipts.",
  ],
}

export const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)]

const roastTemplates = {
  genericSummary: {
    friendly: [
      "Your summary could use a little more meat on the bones.",
      "A bit generic - tell me what problem you actually solve.",
    ],
    savage: [
      "Bro wrote a summary so generic it could apply to anyone, including my cousin's goldfish.",
      "'Results-driven individual' - results of what, exactly?",
    ],
    recruiter: [
      "This summary tells me nothing specific. Next.",
      "If I replaced your name with three others, this summary would still fit.",
    ],
  },
  buzzwords: {
    friendly: ["Some buzzwords could be backed with actual evidence."],
    savage: ["Throwing buzzwords like you're feeding the SEO chicken."],
    recruiter: ["List claims need proof - show, don't tell."],
  },
  projectNoOutcome: {
    friendly: ["Projects could explain what they achieved, not just what you used."],
    savage: ["'Worked on X using Y' - forbidden from saying what X actually does, huh?"],
    recruiter: ["No outcome, no impact. Hard pass unless you add concrete results."],
  },
  noContext: {
    friendly: ["Give context for bullets - what changed because of your work?"],
    savage: ["Your bullets are crying out for verbs with receipts."],
    recruiter: ["Responsibilities without outcomes read like a job description, not contributions."],
  },
}

export const roastResume = (text, mode = 'friendly') => {
  const roasts = []
  const lower = text.toLowerCase()

  if (lower.includes('summary') || /\bsummary\b/.test(lower)) {
    // generic check
  }

  const genericPhrases = ['hardworking', 'passionate', 'dedicated', 'go-getter', 'team player']
  for (const p of genericPhrases) {
    if (lower.includes(p)) {
      roasts.push({
        section: 'Summary/Profile',
        evidence: p,
        roast: getRandom(roastTemplates.genericSummary[mode]),
        why: 'Overused adjectives tell me little about your actual capabilities.',
        fix: 'Replace with concrete actions/outcomes tied to projects or work.',
        severity: 'moderate',
      })
    }
  }

  if (/worked on.*using|made a.*using|created.*using/.test(lower) && !/result|impact|reduced|improved|increased/.test(lower)) {
    roasts.push({
      section: 'Projects',
      evidence: 'Project descriptions focus on tech, not outcomes',
      roast: getRandom(roastTemplates.projectNoOutcome[mode]),
      why: 'What problem did you solve? What changed?',
      fix: 'Explain purpose + your contribution + measurable/genuine outcome if available.',
      severity: 'important',
    })
  }

  if (roasts.length === 0) {
    roasts.push({
      section: 'Overall',
      evidence: 'Solid baseline structure',
      roast: "Looks clean - the rooster's a little disappointed it didn't get more material to roast.",
      why: 'Good structure means focus on specifics will take it further.',
      fix: 'Add outcomes (impact, metrics if genuine) to projects/experience.',
      severity: 'minor',
    })
  }

  return {
    roasts,
    verdict: getRandom(ROOSTER_VERDICTS[mode]),
    rating: Math.max(3, 10 - roasts.length),
  }
}