/**
 * Sidequests content seed — the curated library.
 *
 * This is editorial content, written to be true and useful rather than to fill
 * a schema. Anything that makes a claim about the world (the ages, the titles,
 * the physics) is a fact that can be checked, and the handful of numeric facts
 * here were verified before being written down. Advice-shaped items (guides,
 * workouts, recipes) carry real steps because a recipe without steps is a
 * decoration.
 *
 * There are no external image URLs. `imageUrl` is optional on the model and
 * left unset throughout, because pulling from an image host would make the
 * page depend on a third party being up; the frontend renders a generated
 * warm visual per item instead. A future CMS can start filling this field in
 * without any other change.
 */
import { type ContentType, type Difficulty, type SidequestContent } from "../types/sidequests.js";

const daysAgo = (d: number): string => new Date(Date.now() - d * 86_400_000).toISOString();

interface SeedOptions {
  type: ContentType;
  interestSlug: string;
  category: SidequestContent["category"];
  duration?: string;
  difficulty?: Difficulty;
  sourceName?: string;
  sourceUrl?: string;
  steps?: string[];
  ingredients?: string[];
  pitch?: string;
  isFeatured?: boolean;
  publishedDaysAgo?: number;
  tags?: string[];
}

function content(
  id: string,
  title: string,
  description: string,
  options: SeedOptions,
): SidequestContent {
  return {
    id,
    title,
    slug: id.replace(/^sq-/, ""),
    description,
    type: options.type,
    category: options.category,
    interestSlug: options.interestSlug,
    duration: options.duration,
    difficulty: options.difficulty,
    sourceName: options.sourceName,
    sourceUrl: options.sourceUrl,
    steps: options.steps,
    ingredients: options.ingredients,
    pitch: options.pitch,
    tags: options.tags ?? [],
    publishedAt: daysAgo(options.publishedDaysAgo ?? 14),
    isFeatured: options.isFeatured ?? false,
    isActive: true,
  };
}

export const SEED_CONTENT: SidequestContent[] = [
  /* ── Running ─────────────────────────────────────────────────────────── */
  content(
    "sq-run-first-5k",
    "Your first 5K doesn't need to be terrifying",
    "Eight weeks of walk-run intervals that build to 5K without ever running the whole thing at once.",
    {
      type: "guide",
      interestSlug: "running",
      category: "move",
      duration: "8 week plan",
      difficulty: "beginner",
      pitch: "The plan is built on intervals, not mileage. You are never more than slightly uncomfortable.",
      isFeatured: true,
      publishedDaysAgo: 9,
      tags: ["5k", "beginner", "running", "walk-run", "training plan"],
      steps: [
        "Weeks 1–2: run 90 seconds, walk 3 minutes. Repeat six times. Conversation pace throughout.",
        "Weeks 3–4: run 3 minutes, walk 2 minutes. Repeat six times.",
        "Weeks 5–6: run 5 minutes, walk 90 seconds. Repeat five times.",
        "Week 7: run 8 minutes, walk 90 seconds. Repeat four times.",
        "Week 8: run 10 minutes, walk 1 minute. Repeat four times, then try one continuous effort.",
        "Run three times a week with at least a day between. Same shoes, same route, same time if you can.",
      ],
    },
  ),
  content(
    "sq-run-sunrise-5k",
    "Run 5K before sunrise",
    "One lap, no stopwatch, no pace target. Just the city before anyone else is in it.",
    {
      type: "challenge",
      interestSlug: "running",
      category: "move",
      duration: "One morning",
      difficulty: "any",
      pitch: "Why not? The whole point is that it does not have to go well.",
      isFeatured: true,
      publishedDaysAgo: 3,
      tags: ["challenge", "running", "morning", "5k"],
      steps: [
        "Set an alarm 40 minutes earlier than usual. That is the hard part.",
        "Warm up by walking the first two minutes. You are not trying to be fast.",
        "Run the loop you already know, at a pace you could hold while talking.",
        "Walk the last two minutes rather than forcing a sprint finish.",
        "Note the time. Ignore it. Repeat next week.",
      ],
    },
  ),
  content(
    "sq-run-loop-habit",
    "The 20km loop that turns into a habit",
    "Why a single flat, repeatable route beats chasing new ones every session.",
    {
      type: "article",
      interestSlug: "running",
      category: "move",
      duration: "6 min read",
      difficulty: "any",
      sourceName: "AiO World editorial",
      publishedDaysAgo: 21,
      tags: ["habit", "running", "consistency", "route"],
    },
  ),

  /* ── Gym ─────────────────────────────────────────────────────────────── */
  content(
    "sq-gym-45min",
    "Gym in 45 minutes, three days a week",
    "A full-body template you can do between two lectures. Five movements, one superset, no machines to queue for.",
    {
      type: "workout",
      interestSlug: "gym",
      category: "move",
      duration: "45 min",
      difficulty: "beginner",
      isFeatured: true,
      publishedDaysAgo: 12,
      tags: ["gym", "strength", "beginner", "full body", "45 minutes"],
      steps: [
        "Goblet squat and Romanian deadlift, alternating, for 4 rounds of 8–10 reps.",
        "Push-up and bent-over row, alternating, for 4 rounds of 8–12 reps.",
        "Reverse lunge and plank, alternating, for 3 rounds. Plank for time, not reps.",
        "Rest 90 seconds between rounds, not between movements. The pace is the point.",
        "Add weight or a rep to every movement before you add a fourth day.",
      ],
    },
  ),
  content(
    "sq-gym-mobility-ten",
    "A 10-minute mobility routine for study spines",
    "Ten minutes for the neck, shoulders and hips that have been folded over a laptop since eight in the morning.",
    {
      type: "workout",
      interestSlug: "gym",
      category: "move",
      duration: "10 min",
      difficulty: "any",
      pitch: "No stretching myths, no cold-showers. Just the six positions that actually move.",
      publishedDaysAgo: 6,
      tags: ["mobility", "posture", "desk", "stretching", "10 minutes"],
      steps: [
        "Nose-to-chest, 10 slow. Then look left, look right. Slow, no forcing.",
        "Wall slides for 10 reps. Elbows pinned to the wall the whole time.",
        "90/90 hip switches, 10 each side, moving slowly through the whole range.",
        "Deep squat hold, 60 seconds. Breathe.",
        "Couch stretch or wall-supported lunge per side, 60 seconds each.",
      ],
    },
  ),

  /* ── MMA & boxing ────────────────────────────────────────────────────── */
  content(
    "sq-mma-footwork",
    "Beginner MMA footwork, no partner needed",
    "The orthodox stance, the lead foot, and four drills you can do in an empty room.",
    {
      type: "guide",
      interestSlug: "mma",
      category: "move",
      duration: "20 min",
      difficulty: "beginner",
      isFeatured: true,
      publishedDaysAgo: 15,
      tags: ["mma", "footwork", "stance", "drills", "beginner"],
      steps: [
        "Stance: lead foot slightly forward and light, rear heel on the ball of the foot, chin tucked.",
        "Drill one: bounce in place for 2 minutes, then 2 minutes bouncing and touching your lead foot to the floor.",
        "Drill two: step-lead-side-rear, then reverse back to centre. 10 each direction.",
        "Drill three: circle left, then circle right, keeping both feet moving and never crossing them.",
        "Drill four: shadow a jab-cross-double-leg to a knee tap and back to guard. Slow, then twice as fast.",
        "Film one round on your phone. The most common mistake is standing straight-legged and square.",
      ],
    },
  ),
  content(
    "sq-boxing-shadow-round",
    "A three-minute shadowbox round",
    "The smallest useful piece of boxing training, and the one most people skip.",
    {
      type: "workout",
      interestSlug: "boxing",
      category: "move",
      duration: "15 min",
      difficulty: "beginner",
      publishedDaysAgo: 18,
      tags: ["boxing", "shadowboxing", "cardio", "3 minutes"],
      steps: [
        "2 minutes: bounce and jab. Arms never drop below the chin.",
        "1 minute: add the cross. Rotate the back foot, do not reach with the arm.",
        "1 minute: three rounds of 20 seconds hard, 20 seconds reset.",
        "2 minutes: slips and rolls against your own shadow. Bend the knees, not the waist.",
        "1 minute: breathe. This is the part that makes the next round possible.",
      ],
    },
  ),

  /* ── Football, cycling, swimming ──────────────────────────────────────── */
  content(
    "sq-football-fiveaside",
    "Finding a five-a-side in a new city",
    "How to find one, what it costs, and why the first game is always the worst one.",
    {
      type: "resource",
      interestSlug: "football",
      category: "move",
      duration: "4 min read",
      difficulty: "any",
      publishedDaysAgo: 27,
      tags: ["football", "five-a-side", "campus", "local"],
    },
  ),
  content(
    "sq-cycling-twenty-km",
    "The 20km loop that becomes a Sunday habit",
    "A flat route, three gears, and no need for a fancier bike than you already own.",
    {
      type: "guide",
      interestSlug: "cycling",
      category: "move",
      duration: "75 min",
      difficulty: "beginner",
      publishedDaysAgo: 24,
      tags: ["cycling", "endurance", "route", "sunday"],
      steps: [
        "Find a loop with a park or water stop halfway, so a flat tyre is not the end of the ride.",
        "Start at an easy gear you could hold for two hours. Cadence above speed.",
        "Ride 15 minutes warm-up, then do three blocks of 10 minutes hard, 10 minutes easy.",
        "Fuel: water with a pinch of salt, and something small to eat before, not during.",
        "Do it twice before you try anything longer. The habit is the hard part.",
      ],
    },
  ),
  content(
    "sq-swim-breath",
    "The breathing drill that fixes freestyle",
    "Ten swims, side to side, learning to put your head where it works instead of where it is comfortable.",
    {
      type: "workout",
      interestSlug: "swimming",
      category: "move",
      duration: "20 min",
      difficulty: "beginner",
      publishedDaysAgo: 19,
      tags: ["swimming", "freestyle", "breathing", "technique"],
      steps: [
        "Blow bubbles on every third stroke until exhaling stops feeling like holding your breath.",
        "Side-glide: float on one side, head turned to breathe, front arm extended. Hold for five seconds.",
        "Three lengths bilateral breathing — breathe every three strokes, both sides.",
        "Then 200m continuous, counting your strokes to keep them long rather than fast.",
        "If you can only breathe on one side, that is the side to fix. It always is.",
      ],
    },
  ),

  /* ── Guitar ──────────────────────────────────────────────────────────── */
  content(
    "sq-guitar-first-four",
    "Learn your first four chords",
    "G, C, D and Em. Twenty minutes of practice gets you three songs by next week.",
    {
      type: "guide",
      interestSlug: "guitar",
      category: "create",
      duration: "20 min practice",
      difficulty: "beginner",
      isFeatured: true,
      publishedDaysAgo: 11,
      tags: ["guitar", "chords", "beginner", "practice", "songs"],
      steps: [
        "Tune first. A whole step down is fine and easier on the fingers.",
        "G, D and Em are open chords and share a shape family — learn all three together.",
        "C is the awkward one. Press the ring finger hardest, come from above the fretboard.",
        "Fret each chord for ten seconds, release, repeat. The ache is the training, not an injury.",
        "Once you can change Em to C in under two seconds, you can play something end to end.",
        "Learn a capo on the 2nd fret — the same four shapes then cover a different key.",
      ],
    },
  ),

  /* ── Photography ──────────────────────────────────────────────────────── */
  content(
    "sq-photo-street-ethics",
    "Street photography without being intrusive",
    "The unwritten rules, the few that are written down, and how to ask without ruining the frame.",
    {
      type: "guide",
      interestSlug: "photography",
      category: "create",
      duration: "7 min read",
      difficulty: "any",
      publishedDaysAgo: 16,
      tags: ["photography", "street", "ethics", "people", "technique"],
      steps: [
        "Shoot the back, the hands, the silhouette. It sidesteps the question entirely.",
        "If you want someone's face, ask. 'Can I take your photo?' is a complete sentence.",
        "A clear no ends the conversation, not the friendship, not the street.",
        "Children and anyone who cannot consent: don't. No exceptions, no exceptions.",
        "If you are documenting something genuinely sensitive, you owe more than a camera.",
      ],
    },
  ),
  content(
    "sq-photo-one-a-day",
    "One photo a day for seven days",
    "The cheapest way to stop feeling like you are bad at photography.",
    {
      type: "challenge",
      interestSlug: "photography",
      category: "create",
      duration: "One week",
      difficulty: "any",
      pitch: "No rule about what. A shadow counts. So does a receipt.",
      publishedDaysAgo: 8,
      tags: ["challenge", "photography", "habit", "7 days"],
      steps: [
        "Keep the same camera — the phone is fine, the phone is honestly fine.",
        "One frame only. Choosing is what turns this into a project you abandon.",
        "Shoot something within fifty metres of wherever you already are.",
        "No editing for seven days. Look at all seven together at the end.",
        "Pick the one you like least and delete it. That is the useful information.",
      ],
    },
  ),

  /* ── Art & writing ────────────────────────────────────────────────────── */
  content(
    "sq-art-30-day-drawing",
    "Draw one thing a day for thirty days",
    "Not a sketchbook challenge with an audience. Just thirty days of ten minutes.",
    {
      type: "challenge",
      interestSlug: "art",
      category: "create",
      duration: "30 days",
      difficulty: "any",
      publishedDaysAgo: 22,
      tags: ["art", "drawing", "challenge", "habit", "30 days"],
      steps: [
        "Ten minutes, timer on. Stop when it stops, not when the page is full.",
        "Draw what is in front of you, not what you think something looks like.",
        "Start with objects, not faces. Objects do not move while you work.",
        "Day 15 onward, allow yourself one bad drawing a day. That is the whole practice.",
        "Keep the pile. In two months it is more motivating than any finished piece.",
      ],
    },
  ),
  content(
    "sq-writing-journal-revisit",
    "Keeping a journal you will actually re-read",
    "The difference between a diary that becomes a guilt archive and one worth returning to.",
    {
      type: "article",
      interestSlug: "writing",
      category: "create",
      duration: "5 min read",
      difficulty: "any",
      publishedDaysAgo: 29,
      tags: ["writing", "journaling", "habit", "reflection"],
    },
  ),

  /* ── Cooking ─────────────────────────────────────────────────────────── */
  content(
    "sq-cook-hostel-five",
    "Five hostel meals that don't taste like hostel food",
    "Fifteen minutes, one pan, and ingredients you can actually buy on the way back.",
    {
      type: "recipe",
      interestSlug: "cooking",
      category: "create",
      duration: "15 min",
      difficulty: "beginner",
      isFeatured: true,
      publishedDaysAgo: 13,
      tags: ["cooking", "hostel", "budget", "quick", "pantry"],
      steps: [
        "Tadka is the one to learn: heat oil, cumin, then chilli and turmeric off the heat, then onion.",
        "Dal tadka over rice takes 12 minutes and tastes like a restaurant for the price of a dal packet.",
        "Fried rice is only fried rice if the rice was cold and dry beforehand. Fresh rice goes soggy.",
        "A garlic, chilli and pasta oil sauce is five minutes and makes instant noodles taste intentional.",
        "Bread omelette is a breakfast, a lunch and a cure for a night that went badly.",
        "Buy a chilli, garlic, cumin and turmeric once a week. Everything else is optional.",
      ],
      ingredients: [
        "Cumin seeds, dried red chilli, turmeric, garlic",
        "A few tomatoes or a tomato sachet",
        "Onion, and whatever vegetables are about to go off",
        "Instant noodles or pasta, rice",
        "Eggs, bread, whatever is left in the fridge",
      ],
    },
  ),
  content(
    "sq-cook-one-pane",
    "One pan, one spoon, ten minutes",
    "A dal and rice you can eat while a lab report is still compiling.",
    {
      type: "recipe",
      interestSlug: "cooking",
      category: "create",
      duration: "10 min",
      difficulty: "beginner",
      pitch: "One pan to wash. That is the entire premise and it is a good one.",
      publishedDaysAgo: 5,
      tags: ["cooking", "quick", "budget", "dal", "one pan"],
      steps: [
        "Wash and start the rice — it is the only thing that takes longer than the sauce.",
        "Cumin in oil until it just starts to smell, not until it browns.",
        "Onion, then tomato, then a splash of water. Ten minutes, lid on, low heat.",
        "Toasted spices, dal, and a little more water. Simmer four minutes.",
        "Salt at the end, not the start. Finish with a spoon of ghee or butter if you have it.",
      ],
      ingredients: ["Toor/moong dal", "Rice", "Cumin, turmeric, chilli", "Onion, tomato", "Ghee or butter"],
    },
  ),

  /* ── Film making ─────────────────────────────────────────────────────── */
  content(
    "sq-film-sixty-seconds",
    "Shoot a 60-second film on a phone",
    "One location, three shots, no permissions. A whole short film in an afternoon.",
    {
      type: "guide",
      interestSlug: "film",
      category: "create",
      duration: "One afternoon",
      difficulty: "beginner",
      publishedDaysAgo: 17,
      tags: ["film", "video", "phone", "short film", "editing"],
      steps: [
        "Pick one location and one subject. Constraints are the whole trick.",
        "Shoot three shots: wide to place it, medium to follow it, close for one detail.",
        "Get the sound separately and close to the lens. Audio is what people forgive last.",
        "Shoot every shot three times. Boring, but you only need one.",
        "Cut on movement, not on length. Every cut should have a reason.",
      ],
    },
  ),

  /* ── Travel & hiking ─────────────────────────────────────────────────── */
  content(
    "sq-travel-weekend-budget",
    "Plan a weekend trip on a student budget",
    "The night-train version, which costs half of flying and arrives in the morning.",
    {
      type: "guide",
      interestSlug: "travel",
      category: "explore",
      duration: "8 min read",
      difficulty: "any",
      publishedDaysAgo: 26,
      tags: ["travel", "budget", "weekend", "trains", "planning"],
      steps: [
        "Pick a destination under four hours away. Beyond that it stops being a weekend.",
        "Compare the night train to a flight on total door-to-door time, not ticket price.",
        "Book the return before you leave. A one-way is the expensive mistake.",
        "Stay in the one neighbourhood near the station. You save the whole taxi fare.",
        "Leave one day completely unplanned. That is the part you remember.",
      ],
    },
  ),
  content(
    "sq-hike-first-day",
    "Plan your first day hike: the checklist that matters",
    "Water, shoes, and the four things people forget. Everything else is optional.",
    {
      type: "guide",
      interestSlug: "hiking",
      category: "explore",
      duration: "9 min read",
      difficulty: "beginner",
      publishedDaysAgo: 20,
      tags: ["hiking", "day hike", "safety", "checklist", "outdoors"],
      steps: [
        "Check the trail length against the shortest person in the group, not the average.",
        "Tell someone your route and your expected return time. Write it down, do not just say it.",
        "One litre per person per two hours, plus more if it is above 30°C.",
        "Blisters are a footwear problem, not a luck problem. Break the shoes in first.",
        "Turn back at the halfway point if you are not certain. Every story of a rescue is this rule ignored.",
        "Carry one more layer than the forecast needs. You will be glad in the shade.",
      ],
    },
  ),

  /* ── Astronomy ───────────────────────────────────────────────────────── */
  content(
    "sq-astro-saturn-floats",
    "Saturn would float in water",
    "It is the least dense planet in the solar system, and the reason is mostly hydrogen.",
    {
      type: "fact",
      interestSlug: "astronomy",
      category: "explore",
      publishedDaysAgo: 31,
      tags: ["astronomy", "saturn", "space", "fact", "planets"],
      pitch: "You would need a bath tub the size of a small car. It is still a fun mental image.",
      isFeatured: true,
    },
  ),
  content(
    "sq-astro-sun-age",
    "The Sun is about 4.6 billion years old",
    "Middle-aged by stellar standards, and a third of its fuel already spent.",
    {
      type: "fact",
      interestSlug: "astronomy",
      category: "explore",
      publishedDaysAgo: 34,
      tags: ["astronomy", "sun", "space", "fact", "age"],
    },
  ),
  content(
    "sq-astro-north-star",
    "Find the North Star with a stick",
    "Two pointers in the Plough, a stick, and five minutes. No telescope, no phone signal.",
    {
      type: "video",
      interestSlug: "astronomy",
      category: "explore",
      duration: "5 min",
      difficulty: "any",
      publishedDaysAgo: 23,
      tags: ["astronomy", "stars", "navigation", "naked eye", "outdoors"],
      steps: [
        "Find the Plough. The two stars at the end of its bowl are the pointers.",
        "Stretch your arm toward them and find the middle star of the Plough.",
        "Your hand is the distance from the pointer gap to that middle star.",
        "Carry that hand-length across to the other side of the Plough, past the two pointer stars.",
        "The bright, steady star it lands on is Polaris, and it is almost exactly true north.",
        "It will still be there in a thousand years. That is unusual and worth noticing.",
      ],
    },
  ),

  /* ── Languages ───────────────────────────────────────────────────────── */
  content(
    "sq-lang-ten-minutes",
    "Keep a language alive with ten minutes a day",
    "The maintenance problem, which is different from the learning problem and much easier.",
    {
      type: "guide",
      interestSlug: "languages",
      category: "explore",
      duration: "10 min/day",
      difficulty: "intermediate",
      publishedDaysAgo: 25,
      tags: ["languages", "vocabulary", "immersion", "daily", "spaced repetition"],
      steps: [
        "Five minutes of review on an app, because forgetting is a curve and you fight it daily.",
        "Five minutes of input you enjoy — a song, a streamer, a recipe video. Not a textbook.",
        "Learn words in sentences, never as pairs. A single word teaches you nothing you can use.",
        "Say things out loud even when nobody is there. It is uncomfortable and it works.",
        "Review is cheaper than relearning by an enormous margin. Do the boring part.",
      ],
    },
  ),

  /* ── Food exploration ────────────────────────────────────────────────── */
  content(
    "sq-food-coffee-wave",
    "Why good coffee is cheap in the metros and expensive on campus",
    "The specialty wave went local first, and campuses are priced for captive students.",
    {
      type: "article",
      interestSlug: "food",
      category: "explore",
      duration: "5 min read",
      difficulty: "any",
      publishedDaysAgo: 28,
      tags: ["food", "coffee", "cafes", "local", "budget"],
    },
  ),

  /* ── Books ───────────────────────────────────────────────────────────── */
  content(
    "sq-book-piranesi",
    "Piranesi — Susanna Clarke",
    "A house that is also an ocean, a journal, and the only mystery that gets better the more you read.",
    {
      type: "book",
      interestSlug: "books",
      category: "unwind",
      duration: "240 pages",
      difficulty: "any",
      sourceName: "Bloomsbury",
      sourceUrl: "https://www.bloomsbury.com/uk/piranesi-9781526622426/",
      isFeatured: true,
      publishedDaysAgo: 14,
      tags: ["books", "fiction", "fantasy", "short", "prize winner"],
      pitch: "You can read it in four sittings. It is worth not rushing.",
    },
  ),
  content(
    "sq-book-hail-mary",
    "Project Hail Mary — Andy Weir",
    "A stranded engineer, a problem that keeps getting bigger, and the best problem-solving writing going.",
    {
      type: "book",
      interestSlug: "books",
      category: "unwind",
      duration: "476 pages",
      difficulty: "any",
      sourceName: "Ballantine Books",
      sourceUrl: "https://www.penguinrandomhouse.com/books/545594/project-hail-mary-by-andy-weir/",
      publishedDaysAgo: 15,
      tags: ["books", "sci-fi", "hard sf", "funny", "thriller"],
      pitch: "You will root for a rock. That is not a spoiler, it is the pitch.",
    },
  ),
  content(
    "sq-book-left-hand",
    "The Left Hand of Darkness — Ursula K. Le Guin",
    "A cold planet, a politically impossible envoy, and a book that rewards patience for decades.",
    {
      type: "book",
      interestSlug: "books",
      category: "unwind",
      duration: "304 pages",
      difficulty: "intermediate",
      sourceName: "Ace Books",
      sourceUrl: "https://www.penguinrandomhouse.com/books/59657/the-left-hand-of-darkness-by-ursula-k-le-gin/",
      publishedDaysAgo: 33,
      tags: ["books", "sci-fi", "literary", "classic", "hugo winner"],
    },
  ),

  /* ── Movies & anime ──────────────────────────────────────────────────── */
  content(
    "sq-movie-perfect-days",
    "Perfect Days (2023) — Wim Wenders",
    "A toilet cleaner, his van, his radio and his cassette walkman. The most quietly devastating film of the decade.",
    {
      type: "article",
      interestSlug: "movies",
      category: "unwind",
      duration: "124 min",
      difficulty: "any",
      sourceName: "The Match Factory",
      sourceUrl: "https://www.imdb.com/title/tt12542070/",
      isFeatured: true,
      publishedDaysAgo: 7,
      tags: ["movies", "film", "quiet", "japanese", "documentary shaped"],
      pitch: "Almost nothing happens. That is the entire recommendation.",
    },
  ),
  content(
    "sq-movie-spirited-away",
    "Spirited Away (2001) — Hayao Miyazaki",
    "The one that will still be cited as a masterpiece when you are old. It earned it.",
    {
      type: "article",
      interestSlug: "movies",
      category: "unwind",
      duration: "125 min",
      difficulty: "any",
      sourceName: "Studio Ghibli",
      sourceUrl: "https://www.imdb.com/title/tt0245429/",
      publishedDaysAgo: 30,
      tags: ["movies", "animation", "anime", "ghibli", "classic"],
    },
  ),
  content(
    "sq-anime-mushishi",
    "Mushishi (2005) — 20 episodes",
    "A wandering healer who has to be taught that most of what he is asked to fix should be left alone.",
    {
      type: "article",
      interestSlug: "anime",
      category: "unwind",
      duration: "20 episodes",
      difficulty: "any",
      sourceName: "Studio Deen",
      sourceUrl: "https://www.imdb.com/title/tt0423078/",
      isFeatured: true,
      publishedDaysAgo: 10,
      tags: ["anime", "mushishi", "slow", "atmospheric", "short"],
      pitch: "Two or three episodes in, it is already one of the most original things you will watch.",
    },
  ),
  content(
    "sq-anime-cowboy-bebop",
    "Cowboy Bebop (1998)",
    "A crew chasing its past across a solar system that is permanently having a bad day.",
    {
      type: "article",
      interestSlug: "anime",
      category: "unwind",
      duration: "26 episodes",
      difficulty: "any",
      sourceName: "Sunrise",
      sourceUrl: "https://www.imdb.com/title/tt0185936/",
      publishedDaysAgo: 36,
      tags: ["anime", "space", "bebop", "classic", "jazz"],
    },
  ),

  /* ── Podcasts ────────────────────────────────────────────────────────── */
  content(
    "sq-podcast-radiolab",
    "Radiolab — WNYC Studios",
    "Reported stories that make one strange idea feel enormous. Better with headphones and a walk.",
    {
      type: "podcast",
      interestSlug: "podcasts",
      category: "unwind",
      duration: "1 hr episodes",
      difficulty: "any",
      sourceName: "WNYC Studios",
      sourceUrl: "https://radiolab.org/series/podcast",
      isFeatured: true,
      publishedDaysAgo: 4,
      tags: ["podcasts", "science", "storytelling", "radio", "walk"],
      pitch: "Start with anything. The catalogue is generous and the backlist is the best part.",
    },
  ),
  content(
    "sq-podcast-rest-is-history",
    "The Rest Is History",
    "Two historians, one hour, and a topic you thought you had already exhausted.",
    {
      type: "podcast",
      interestSlug: "podcasts",
      category: "unwind",
      duration: "1 hr episodes",
      difficulty: "any",
      sourceName: "Goalhanger Podcasts",
      sourceUrl: "https://www.therestishistory.com/",
      publishedDaysAgo: 19,
      tags: ["podcasts", "history", "comedy", "british", "long form"],
    },
  ),

  /* ── Gaming ──────────────────────────────────────────────────────────── */
  content(
    "sq-game-coop-games",
    "Co-op games worth playing with someone in the next room",
    "Games built around two people and a sofa, plus which ones also work over a call.",
    {
      type: "guide",
      interestSlug: "gaming",
      category: "unwind",
      duration: "6 min read",
      difficulty: "any",
      publishedDaysAgo: 17,
      tags: ["gaming", "co-op", "couch", "multiplayer", "friends"],
      steps: [
        "It Takes Two (2021) and A Way Out (2013) are both built strictly for two. Neither has a solo mode.",
        "For a laptop-and-a-call evening, anything with drop-in drop-out is better than a campaign.",
        "Stardew Valley (2016) multiplayer is the rare one that works with people on different schedules.",
        "Put one controller on the sofa and one on a chair. Sounds silly, works extremely well.",
        "Agree a hard stop time before you start. Co-op has no natural ending.",
      ],
    },
  ),

  /* ── F1 ──────────────────────────────────────────────────────────────── */
  content(
    "sq-f1-downforce",
    "Why do F1 cars generate so much downforce?",
    "Inverted wings, the floor, and a rear wing shaped mostly by what happens when it spins around.",
    {
      type: "article",
      interestSlug: "f1",
      category: "discover",
      duration: "6 min read",
      difficulty: "any",
      sourceName: "AiO World editorial",
      isFeatured: true,
      publishedDaysAgo: 6,
      tags: ["f1", "downforce", "aerodynamics", "formula 1", "explainer"],
      pitch: "The car is upside down. That one fact explains most of the rest.",
    },
  ),
  content(
    "sq-f1-pit-stop",
    "What actually happens during a pit stop",
    "From red light to green light, in a few seconds, with four people holding jack in the wrong place at first.",
    {
      type: "video",
      interestSlug: "f1",
      category: "discover",
      duration: "9 min",
      difficulty: "any",
      sourceName: "AiO World editorial",
      publishedDaysAgo: 13,
      tags: ["f1", "pit stop", "strategy", "formula 1", "racing"],
    },
  ),

  /* ── Cars, chess, robotics, DIY ──────────────────────────────────────── */
  content(
    "sq-cars-used-inspection",
    "How to check a used car before you commit",
    "Twelve things to look at in the ten minutes before you go see it.",
    {
      type: "guide",
      interestSlug: "cars",
      category: "discover",
      duration: "10 min read",
      difficulty: "beginner",
      publishedDaysAgo: 21,
      tags: ["cars", "used cars", "buying", "inspection", "checklist"],
      steps: [
        "Cold start engine. Ask to see it start cold, not warmed up in the drive.",
        "Look for paint under the door edges and the bonnet lip. Overspray hides a panel replacement.",
        "Tyre wear tells you whether the wheels have been aligned, and whether they will be again.",
        "Ask for the service history. Gaps are the story.",
        "Check the underside for fresh welds or fresh fluid.",
        "Take it for a drive over a bad speed bump, badly surfaced road, and a long straight.",
        "Get an independent inspection before you negotiate. It changes who blinks.",
      ],
    },
  ),
  content(
    "sq-chess-four-tactics",
    "Four chess tactics every beginner should learn",
    "Fork, pin, skewer, discovered attack. Ninety percent of beginner games end in one of them.",
    {
      type: "guide",
      interestSlug: "chess",
      category: "discover",
      duration: "12 min",
      difficulty: "beginner",
      isFeatured: true,
      publishedDaysAgo: 8,
      tags: ["chess", "tactics", "beginner", "training", "puzzles"],
      steps: [
        "Fork: one piece attacks two. It only works if both targets matter.",
        "Pin: a piece is stuck behind another and cannot legally move off the line.",
        "Skewer: the reverse of a pin. One piece falls, and the thing behind it is now hanging.",
        "Discovered attack: move something out of the way and check what was hiding behind it.",
        "Do eight tactics puzzles a day. Not eight games. Puzzles, with the clock running.",
      ],
    },
  ),
  content(
    "sq-robotics-line-follower",
    "Build a first line-following robot",
    "Two sensors, three wires, and the moment it works the first time without you touching it.",
    {
      type: "article",
      interestSlug: "robotics",
      category: "discover",
      duration: "1 project",
      difficulty: "intermediate",
      publishedDaysAgo: 16,
      tags: ["robotics", "arduino", "sensors", "project", "beginner"],
    },
  ),
  content(
    "sq-diy-loose-tap",
    "Fix a dripping tap without calling anyone",
    "A washer and ten minutes. Half of this is knowing which end is the handle.",
    {
      type: "guide",
      interestSlug: "diy",
      category: "discover",
      duration: "15 min",
      difficulty: "beginner",
      publishedDaysAgo: 24,
      tags: ["diy", "repair", "tap", "plumbing", "saving money"],
      steps: [
        "Turn off the isolation valve under the basin, and confirm the drip has stopped.",
        "Cover the drain so a dropped grub screw does not disappear down it.",
        "The handle grub screw is a set screw. It backs out anti-clockwise and is almost always the whole problem.",
        "If it still drips, the washer has gone flat. Turn the tap off, lift the handle, replace the washer.",
        "Take the old washer with you. Take a photo of the assembly before you touch it.",
      ],
    },
  ),

  /* ── Finance ─────────────────────────────────────────────────────────── */
  content(
    "sq-finance-50-30-20",
    "The 50/30/20 rule, and where it comes from",
    "Half needs, a third wants, a fifth saving. It is older than it feels.",
    {
      type: "article",
      interestSlug: "finance",
      category: "discover",
      duration: "6 min read",
      difficulty: "beginner",
      sourceName: "AiO World editorial",
      isFeatured: true,
      publishedDaysAgo: 11,
      tags: ["finance", "budgeting", "saving", "money", "basics"],
      pitch: "Proposed in Elizabeth Warren's 2005 book All Your Worth. It is a starting point, not a law.",
    },
  ),
  content(
    "sq-finance-emergency-fund",
    "Start a small emergency fund this month",
    "Not a month's expenses. One bad week. That is a finishable goal.",
    {
      type: "guide",
      interestSlug: "finance",
      category: "discover",
      duration: "1 month",
      difficulty: "beginner",
      publishedDaysAgo: 20,
      tags: ["finance", "saving", "emergency fund", "money", "habit"],
      steps: [
        "Pick a number you could reach this month without selling anything. That is the target.",
        "Put it somewhere you will not see it daily. Out of sight, out of reach.",
        "Automate it on payday. A manual transfer is a decision, and decisions get skipped.",
        "The point is not the amount. The point is that you have never done this before and now you have.",
        "Raise it by one more bad week every few months. Do not aim for a number that scares you.",
      ],
    },
  ),

  /* ── Gardening ───────────────────────────────────────────────────────── */
  content(
    "sq-gardening-balcony-herbs",
    "Six herbs that survive a balcony and a forgetful student",
    "Choose these six and you will actually still have some in three months.",
    {
      type: "guide",
      interestSlug: "gardening",
      category: "discover",
      duration: "7 min read",
      difficulty: "beginner",
      publishedDaysAgo: 26,
      tags: ["gardening", "balcony", "herbs", "plants", "low effort"],
      steps: [
        "Basil, mint, coriander, rosemary, thyme and chives. All six tolerate a pot and irregular care.",
        "Pots need drainage holes. Without them you will rot the roots and blame the plant.",
        "Six hours of sun is the working minimum. Less than that and you are growing a very slow plant.",
        "Pinch the growing tips rather than pulling whole stems. It makes the plant bushier.",
        "Water when the top two centimetres are dry, not on a schedule. Stick a finger in.",
        "Mint will take over anything. Give it its own pot and do not feel guilty about it.",
      ],
    },
  ),

  /* ── The deliberately weird ones ─────────────────────────────────────── */
  content(
    "sq-fact-octopus-hearts",
    "Octopuses have three hearts",
    "Two pump blood through the gills and one through the body — and the main one stops when they swim.",
    {
      type: "fact",
      interestSlug: "astronomy",
      category: "explore",
      pitch: "Three hearts, blue blood, and eight arms that each have a mind of their own. Worth ten minutes of your evening.",
      isFeatured: true,
      publishedDaysAgo: 2,
      tags: ["fact", "octopus", "biology", "sea", "animals"],
    },
  ),
  content(
    "sq-fact-venus-day",
    "A day on Venus is longer than a year on Venus",
    "It takes about 243 Earth days to turn once, and only about 225 to go around the Sun.",
    {
      type: "fact",
      interestSlug: "astronomy",
      category: "explore",
      publishedDaysAgo: 34,
      tags: ["fact", "venus", "planets", "astronomy", "space"],
    },
  ),
  content(
    "sq-challenge-phone-walk",
    "A 15-minute walk without your phone",
    "Leave it in your pocket. Notice what you would have scrolled past.",
    {
      type: "challenge",
      interestSlug: "hiking",
      category: "explore",
      duration: "15 min",
      difficulty: "any",
      pitch: "The urge to check is uncomfortable for about four minutes and then it is gone.",
      publishedDaysAgo: 5,
      tags: ["challenge", "walk", "phone", "attention", "outdoors"],
    },
  ),

  /* ── Event references ────────────────────────────────────────────────── */
  content(
    "sq-eventref-open-mic",
    "Campus Open Mic — a night of very short sets",
    "What actually happens at an open mic, and how to sign up when you have never performed before.",
    {
      type: "event_reference",
      interestSlug: "guitar",
      category: "create",
      duration: "2 hr",
      difficulty: "any",
      isFeatured: true,
      publishedDaysAgo: 9,
      tags: ["open mic", "music", "performance", "campus", "event"],
    },
  ),
];

export const SEED_CONTENT_BY_ID: ReadonlyMap<string, SidequestContent> = new Map(
  SEED_CONTENT.map((item) => [item.id, item]),
);
