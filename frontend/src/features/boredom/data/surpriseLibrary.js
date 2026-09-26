/**
 * The surprise library — every boredom machine result lives here.
 *
 * Rules for adding an entry:
 *
 *  1. Keep the SHAPE, not the layout. Each type has a fixed contract (below)
 *     and SurpriseReveal knows how to render it. Don't invent new fields for
 *     one item.
 *
 *  2. `lines` is the staggered reveal — short, spoken-word sentences. The
 *     magic lands on the last line, so order them as a small story.
 *
 *  3. Facts must be true and survive a skeptical reader. If a claim is
 *     contested, say so in the copy. If you are not certain, leave it out.
 *
 *  4. Links must be stable, real URLs. Wikipedia articles, publisher
 *     homepages and well-known show sites only — never a guessed video id.
 *
 *  5. No campus content. No notices, no calculators, no deadlines. This is the
 *     escape hatch from routine, not another feed of it.
 *
 * Type contracts:
 *   fact      { title, lines[], link?{label,href} }
 *   prompt    { title, lines[], options?[2] }
 *   game      { title, blurb, meta, route }
 *   activity  { title, duration, steps[], player? }
 *   read      { title, blurb, meta, href }
 *   watch     { title, blurb, meta, href }
 *   listen    { title, blurb, meta, href }
 */
import { SURPRISE_CATEGORY, SURPRISE_TYPE } from '../domain/surpriseTypes.js'

const fact = (id, category, title, lines, link, tags) => ({
  id,
  type: SURPRISE_TYPE.fact,
  category,
  title,
  lines,
  link,
  tags,
  enabled: true,
})

const prompt = (id, category, title, lines, options, tags) => ({
  id,
  type: SURPRISE_TYPE.prompt,
  category,
  title,
  lines,
  options,
  tags,
  enabled: true,
})

const game = (id, category, title, blurb, meta, route, tags) => ({
  id,
  type: SURPRISE_TYPE.game,
  category,
  title,
  blurb,
  meta,
  route,
  tags,
  enabled: true,
})

const activity = (id, category, title, duration, steps, player, tags) => ({
  id,
  type: SURPRISE_TYPE.activity,
  category,
  title,
  duration,
  steps,
  player,
  tags,
  enabled: true,
})

const media = (type, id, category, title, blurb, meta, href, tags) => ({
  id,
  type,
  category,
  title,
  blurb,
  meta,
  href,
  tags,
  enabled: true,
})

export const SURPRISE_LIBRARY = [
  // ── DISCOVER · facts ─────────────────────────────────────────────────────
  fact(
    'fact-octopus-hearts',
    SURPRISE_CATEGORY.discover,
    'Three hearts and blue blood',
    [
      'Octopuses have three hearts.',
      'Two of them pump blood to the gills. The third pumps it to the rest of the body.',
      'And the blood is blue — because it carries oxygen on copper, not iron.',
    ],
    {
      label: 'Follow the weird world of octopuses',
      href: 'https://en.wikipedia.org/wiki/Octopus',
    },
    ['biology', 'ocean'],
  ),
  fact(
    'fact-berry',
    SURPRISE_CATEGORY.discover,
    'The berry thing',
    [
      'Bananas are berries. Botanically, properly, berries.',
      'Tomatoes are too. So are grapes, and dates, and bananas.',
      'Strawberries? Not remotely. Neither is the raspberry.',
    ],
    {
      label: "Now you're wondering what isn't a berry",
      href: 'https://en.wikipedia.org/wiki/Berry_(botany)',
    },
    ['biology', 'food'],
  ),
  fact(
    'fact-shannon',
    SURPRISE_CATEGORY.discover,
    'Bigger than the universe',
    [
      'Chess has more possible games than there are atoms in the observable universe.',
      'Not more positions. More actual games — every possible way the pieces could move.',
      'The estimate comes from a number called the Shannon number. It is a genuinely humbling number.',
    ],
    {
      label: 'See how big that number really is',
      href: 'https://en.wikipedia.org/wiki/Shannon_number',
    },
    ['maths', 'games'],
  ),
  fact(
    'fact-oxford-aztec',
    SURPRISE_CATEGORY.discover,
    'Older than an empire',
    [
      'Oxford University was teaching by 1096.',
      'The Aztec Empire was founded in 1428.',
      'So when the first Aztecs were building Tenochtitlan, Oxford had already been teaching for three hundred years.',
    ],
    {
      label: 'How a university out-empires an empire',
      href: 'https://en.wikipedia.org/wiki/Oxford_University',
    },
    ['history'],
  ),
  fact(
    'fact-sharks-trees',
    SURPRISE_CATEGORY.discover,
    'Sharks came first',
    [
      'Sharks appeared roughly 450 million years ago.',
      'Trees showed up around 380 million years ago.',
      'Every shark that has ever lived has been swimming around a world that, for its first seventy million years, had no trees at all.',
    ],
    {
      label: 'Meet the ones that were here first',
      href: 'https://en.wikipedia.org/wiki/Shark',
    },
    ['biology', 'time'],
  ),
  fact(
    'fact-wombat',
    SURPRISE_CATEGORY.discover,
    'Cube-shaped',
    [
      "Wombat droppings are cubes.",
      'Actual cubes. Not rounded. Not square-ish. Cubes.',
      'The reason is elasticity — their intestines squeeze waste into flat faces as it dries, so it does not roll away.',
    ],
    {
      label: 'The engineering behind cube-shaped poo',
      href: 'https://en.wikipedia.org/wiki/Wombat',
    },
    ['biology', 'animals'],
  ),
  fact(
    'fact-venus',
    SURPRISE_CATEGORY.discover,
    'A longer day than year',
    [
      'Venus takes 243 Earth days to turn once on its own axis.',
      'It takes 225 Earth days to go around the Sun.',
      'So on Venus, a day is longer than a year. Your birthday arrives before your bedtime.',
    ],
    {
      label: 'Why Venus is like that',
      href: 'https://en.wikipedia.org/wiki/Venus',
    },
    ['space'],
  ),
  fact(
    'fact-honey',
    SURPRISE_CATEGORY.discover,
    'Still good after 3000 years',
    [
      'Honey was found in Egyptian tombs, thousands of years old.',
      'It was still perfectly edible.',
      'Honey is so low in water and so acidic and so full of enzymes that bacteria cannot really survive in it.',
    ],
    {
      label: 'Why honey basically never goes off',
      href: 'https://en.wikipedia.org/wiki/Honey',
    },
    ['food', 'history'],
  ),
  fact(
    'fact-anglo-zanzibar',
    SURPRISE_CATEGORY.discover,
    'The 38-minute war',
    [
      'The shortest war in recorded history lasted 38 minutes.',
      'Anglo-Zanzibar War, 27 August 1896.',
      'It started, it ended, and then everyone went to lunch.',
    ],
    {
      label: 'The whole thing, in detail',
      href: 'https://en.wikipedia.org/wiki/Anglo-Zanzibar_War',
    },
    ['history'],
  ),
  fact(
    'fact-flamingo',
    SURPRISE_CATEGORY.discover,
    'Pink by diet',
    [
      'Flamingos are born grey.',
      'They turn pink because of what they eat — carotenoids in the algae and the tiny shrimp.',
      'A flamingo that stops eating its pink food fades back to grey.',
    ],
    {
      label: 'The full flamingo backstory',
      href: 'https://en.wikipedia.org/wiki/Flamingo',
    },
    ['biology', 'birds'],
  ),
  fact(
    'fact-lightning',
    SURPRISE_CATEGORY.discover,
    'Hotter than the Sun',
    [
      'A lightning bolt hits about 30,000°C.',
      "The surface of the Sun is about 5,500°C.",
      'Which means a storm can be five times hotter than the star it is lit by.',
    ],
    {
      label: 'How hot, and for how long',
      href: 'https://en.wikipedia.org/wiki/Lightning',
    },
    ['physics', 'weather'],
  ),
  fact(
    'fact-bubble-wrap',
    SURPRISE_CATEGORY.discover,
    'Invented as wallpaper',
    [
      'Bubble wrap was invented in 1967 as textured wallpaper.',
      'It looked lovely on a wall and nobody wanted it.',
      'The inventors kept it on the desk for a year, popping it, until a shipping company asked for a version to wrap fragile things in.',
    ],
    {
      label: 'The accidental packaging industry',
      href: 'https://en.wikipedia.org/wiki/Bubble_wrap',
    },
    ['history', 'inventing'],
  ),
  fact(
    'fact-potassium',
    SURPRISE_CATEGORY.discover,
    'Slightly radioactive',
    [
      'Bananas are radioactive. Genuinely, measurably so.',
      'They contain potassium-40, and so do you — you are also slightly radioactive, and so is everything.',
      'It is such a tidy idea that scientists named the unit: the banana equivalent dose.',
    ],
    {
      label: 'How much, and why that is fine',
      href: 'https://en.wikipedia.org/wiki/Potassium-40',
    },
    ['physics', 'food'],
  ),
  fact(
    'fact-mpemba',
    SURPRISE_CATEGORY.discover,
    'The hot-freezes-faster puzzle',
    [
      'Sometimes hot water freezes faster than cold water.',
      'It is called the Mpemba effect, and it is been argued about for over a century.',
      'No single explanation covers every case. Some cupboards really do defy you.',
    ],
    {
      label: 'The century-old argument',
      href: 'https://en.wikipedia.org/wiki/Mpemba_effect',
    },
    ['physics', 'puzzle'],
  ),
  fact(
    'fact-snow-myth',
    SURPRISE_CATEGORY.discover,
    'A myth, demolished',
    [
      'You have heard that Inuit languages have a hundred words for snow.',
      'It is almost certainly a myth — it traces back to an unsourced appendix in a 1913 dictionary.',
      'It spread because it was a good line, not because it was true.',
    ],
    {
      label: 'How a fake fact becomes a permanent one',
      href: 'https://en.wikipedia.org/wiki/Linguistic_constructs_in_languages',
    },
    ['language', 'myths'],
  ),
  fact(
    'fact-brain-watts',
    SURPRISE_CATEGORY.discover,
    'A dim lightbulb',
    [
      'Your brain runs on about 20 watts.',
      'That is roughly a dim, warm lightbulb.',
      'It is doing immeasurable amounts of work, continuously, on less power than the lamp on your desk.',
    ],
    {
      label: 'What 20 watts is actually doing',
      href: 'https://en.wikipedia.org/wiki/Human_brain',
    },
    ['neuroscience'],
  ),
  fact(
    'fact-sound-water',
    SURPRISE_CATEGORY.discover,
    'Sound moves faster underwater',
    [
      'Sound travels about four times faster in water than in air.',
      'And whales use it to see.',
      'A whale call can cross an entire ocean basin and still arrive loud enough to be heard clearly.',
    ],
    {
      label: 'How whales see with sound',
      href: 'https://en.wikipedia.org/wiki/Sound',
    },
    ['physics', 'ocean'],
  ),
  fact(
    'fact-goosebumps',
    SURPRISE_CATEGORY.discover,
    'Muscles for hair you no longer have',
    [
      'Goosebumps are a leftover.',
      'The tiny muscles that raise your arm hair were useful when our ancestors were cold and furry.',
      'The reflex still fires — it just has nothing left to do.',
    ],
    {
      label: 'The vestigial reflex',
      href: 'https://en.wikipedia.org/wiki/Goosebumps',
    },
    ['biology', 'evolution'],
  ),
  fact(
    'fact-reindeer',
    SURPRISE_CATEGORY.discover,
    'Ultraviolet eyes',
    [
      'Reindeer can see ultraviolet light.',
      'To them, the lichen on the tundra and the trail of urine left by a predator are both glowing signs on a black-and-white landscape.',
      'Human eyes cannot see any of it.',
    ],
    {
      label: 'A different colour palette entirely',
      href: 'https://en.wikipedia.org/wiki/Ultraviolet',
    },
    ['biology', 'animals'],
  ),
  fact(
    'fact-eyecolour',
    SURPRISE_CATEGORY.discover,
    'Green is the rarest',
    [
      'Roughly eight percent of people have green eyes.',
      'Brown is the most common by a distance. Blue is close behind.',
      'Green is a genetic coincidence — it needs two different recessive genes to line up at once.',
    ],
    {
      label: 'The genetics behind eye colour',
      href: 'https://en.wikipedia.org/wiki/Eye_color',
    },
    ['biology', 'people'],
  ),
  fact(
    'fact-otter-hands',
    SURPRISE_CATEGORY.discover,
    'Holding hands to not drift',
    [
      'Sea otters sometimes hold paws while they sleep.',
      'So they do not separate in the current and drift off alone.',
      'It is a very small solution to a very cold problem.',
    ],
    {
      label: 'Sea otter society',
      href: 'https://en.wikipedia.org/wiki/Sea_otter',
    },
    ['biology', 'animals'],
  ),
  fact(
    'fact-eiffel',
    SURPRISE_CATEGORY.discover,
    'Taller in August',
    [
      'The Eiffel Tower is about 18 centimetres taller in summer than in winter.',
      'Iron expands when it warms up, and there is a great deal of it standing in the Paris sun.',
      'So for a few weeks a year it is very slightly a different building.',
    ],
    {
      label: 'Why the tower breathes',
      href: 'https://en.wikipedia.org/wiki/Eiffel_Tower',
    },
    ['inventing', 'scale', 'heat'],
  ),
  fact(
    'fact-cat-sweet',
    SURPRISE_CATEGORY.discover,
    'Cats cannot taste sweet',
    [
      'Cats have no working sweet receptor.',
      'Every part of that sentence is a dead end for a cat.',
      'Which is why the treat your cat loves is savoury, and the cake on the counter is not on the menu.',
    ],
    {
      label: 'Why cats sniff cake and walk away',
      href: 'https://en.wikipedia.org/wiki/Cat',
    },
    ['biology', 'animals'],
  ),
  fact(
    'fact-unicorn',
    SURPRISE_CATEGORY.discover,
    'Scotland’s other national animal',
    [
      'Scotland has two national animals. The second one is the unicorn.',
      'It has been on the Royal Household of Scotland’s crest since the 1400s.',
      'A genuine, official, heraldic unicorn. Not a bit of a joke.',
    ],
    {
      label: 'Scotland’s heraldic animals',
      href: 'https://en.wikipedia.org/wiki/National_symbols_of_Scotland',
    },
    ['history', 'puzzling'],
  ),
  fact(
    'fact-tardigrade',
    SURPRISE_CATEGORY.discover,
    'It might outlive the sun',
    [
      'Tardigrades are half-millimetre animals that live in moss, leaf litter and roof gutters.',
      'In extremes they dehydrate into a glassy state called a tun, and they can do that for decades.',
      'If the sun were to go out tomorrow, there is a real argument that tardigrades would outlast it.',
    ],
    {
      label: 'The animal that may beat the sun',
      href: 'https://en.wikipedia.org/wiki/Tardigrade',
    },
    ['biology', 'space'],
  ),
  fact(
    'fact-noctiluca',
    SURPRISE_CATEGORY.discover,
    'Rocket-powered algae',
    [
      'A type of alga called Noctiluca can jet around by contracting itself.',
      'It moves fast enough to make the water sparkle, and the sparkle is red.',
      'Bioluminescent algae on a dark beach can make a breaking wave look like it is glowing.',
    ],
    {
      label: 'The algae that makes waves glow',
      href: 'https://en.wikipedia.org/wiki/Bioluminescence',
    },
    ['ocean', 'biology'],
  ),
  fact(
    'fact-turtle-tears',
    SURPRISE_CATEGORY.discover,
    'Butterflies drink turtle tears',
    [
      'Several butterflies drink the salt that dries on the shell of a sea turtle.',
      'They need it — males need sodium, and nectar has almost none to spare.',
      'So the sea is full of salty ponds, and the butterflies have found them.',
    ],
    {
      label: 'Where butterflies get their salt',
      href: 'https://en.wikipedia.org/wiki/Butterfly',
    },
    ['ocean', 'biology'],
  ),

  // ── FUN · prompts ────────────────────────────────────────────────────────
  prompt(
    'prompt-wyr-rewind',
    SURPRISE_CATEGORY.fun,
    'Would you rather…',
    [
      'Be able to pause any conversation for ten seconds and rewind it…',
      'or be able to skip any ten seconds of your day, forwards, and nobody notices?',
    ],
    ['rewind conversations', 'skip moments of your day'],
    ['hypothetical'],
  ),
  prompt(
    'prompt-wyr-voice',
    SURPRISE_CATEGORY.fun,
    'Would you rather…',
    [
      'Only ever be able to communicate by drawing…',
      'or only ever be able to communicate by humming?',
    ],
    ['draw it', 'hum it'],
    ['hypothetical'],
  ),
  prompt(
    'prompt-wyr-chest',
    SURPRISE_CATEGORY.fun,
    'Would you rather…',
    [
      'Know exactly how to play every musical instrument, badly…',
      'or play one instrument perfectly, and only one, forever?',
    ],
    ['badly at everything', 'perfectly at one thing'],
    ['hypothetical'],
  ),
  prompt(
    'prompt-wyr-door',
    SURPRISE_CATEGORY.fun,
    'Would you rather…',
    [
      'Every doorway you walk through puts you somewhere new…',
      'or every doorway you walk through takes you back to exactly where you were five minutes ago?',
    ],
    ['new places', 'a moment to return to'],
    ['hypothetical'],
  ),
  prompt(
    'prompt-wyr-librarian',
    SURPRISE_CATEGORY.fun,
    'Would you rather…',
    [
      'Never have to read a bad book again, and miss every good one…',
      'or never be able to re-read a book you loved, and keep every bad one?',
    ],
    ['miss the good ones', 'keep the bad ones'],
    ['hypothetical'],
  ),

  // ── FUN · games ─────────────────────────────────────────────────────────
  game(
    'game-guess-who',
    SURPRISE_CATEGORY.fun,
    'Guess Who',
    'Two players, one screen. One of you picks a face, the other gets twenty questions to work out which one it is.',
    '2 players · about 3 minutes',
    '#/play/guess-who',
    ['social', 'two-player'],
  ),
  game(
    'game-play-hub',
    SURPRISE_CATEGORY.fun,
    'Whatever you are in the mood for',
    'If the specific thing above is not your mood right now, the Play page has more — and one button that picks for you.',
    'A whole shelf of games',
    '#/play',
    ['social', 'variety'],
  ),

  // ── MOVE · guided activities ─────────────────────────────────────────────
  activity(
    'act-box-breathing',
    SURPRISE_CATEGORY.move,
    'Box breathing',
    '60 seconds',
    [
      'Breathe in through your nose for four counts.',
      'Hold for four.',
      'Breathe out slowly through your mouth for four.',
      'Hold empty for four.',
      'That is one box. Keep going until the minute is up.',
    ],
    'breathing',
    ['breathing', 'desk', 'calm'],
  ),
  activity(
    'act-desk-reset',
    SURPRISE_CATEGORY.move,
    'The desk reset',
    '5 minutes',
    [
      'Roll your shoulders backwards, slowly, ten times. Then forwards, ten times.',
      'Tilt your head to one shoulder, hold ten seconds, then the other.',
      'Open and close your fists ten times, then spread your fingers wide and hold.',
      'Interlace your fingers, turn your palms away from you, and lean forward until you feel it in your back.',
      'Stand up and walk to the furthest wall in the room. Walk back slowly.',
    ],
    null,
    ['desk', 'posture', 'five-minutes'],
  ),
  activity(
    'act-sixty-shake',
    SURPRISE_CATEGORY.move,
    'Sixty seconds of noise',
    '60 seconds',
    [
      'Stand up. Feet flat, arms loose.',
      'Shake out your hands, your arms, your shoulders. Make it ridiculous.',
      'Now shake one leg out, then the other.',
      'Keep going until sixty seconds is up. Be the worst person in the room.',
    ],
    null,
    ['energy', 'one-minute'],
  ),
  activity(
    'act-twenty-twenty',
    SURPRISE_CATEGORY.move,
    'The 20-20-20 reset',
    '20 seconds',
    [
      'Look at something roughly twenty feet away — a window, a far wall, the back of the room.',
      'Hold your gaze there for twenty seconds.',
      'Blink deliberately ten times to finish.',
      'Your eyes have been holding a very small focus distance for hours. They have earned a holiday.',
    ],
    null,
    ['eyes', 'desk', 'quick'],
  ),
  activity(
    'act-eight-eight-eight',
    SURPRISE_CATEGORY.move,
    'The 8-8-8 eye movement',
    '45 seconds',
    [
      'Sit or stand tall. Let your eyes go soft.',
      'For eight seconds, gaze at something far away.',
      'For eight seconds, bring your focus to your nose.',
      'For eight seconds, blink slowly and completely.',
      'That is one round. Do one more if your eyes still feel dry.',
    ],
    null,
    ['eyes', 'quick'],
  ),
  activity(
    'act-hip-flexor',
    SURPRISE_CATEGORY.move,
    'Un-sit your hips',
    '3 minutes',
    [
      'Take one foot back into a long, staggered stance. Back heel down.',
      'Tuck your pelvis under and lean forward an inch or two.',
      'You should feel it in the front of the hip on the back leg, not in your lower back.',
      'Hold thirty seconds. Swap legs. Do it again.',
      'If you sit down for six hours a day, this is the one worth knowing about.',
    ],
    null,
    ['stretch', 'desk', 'hips'],
  ),
  activity(
    'act-doorway-chest',
    SURPRISE_CATEGORY.move,
    'Open the chest',
    '2 minutes',
    [
      'Stand in a doorway. Forearms on the frame, elbows at shoulder height.',
      'Step one foot through and lean forward gently until you feel it across the front of the chest.',
      'Hold thirty seconds. Straighten your arms a little for more.',
      'Repeat twice. Breathe into the stretch instead of holding your breath.',
    ],
    null,
    ['stretch', 'posture'],
  ),
  activity(
    'act-water',
    SURPRISE_CATEGORY.move,
    'The least interesting one',
    '30 seconds',
    [
      'Stand up and go get a glass of water.',
      'Drink all of it, slowly, while standing.',
      'Come back.',
      'That is the whole activity. It was never going to be complicated, but you did get up.',
    ],
    null,
    ['quick', 'water'],
  ),
  activity(
    'act-stairs',
    SURPRISE_CATEGORY.move,
    'One flight of stairs',
    '2 minutes',
    [
      'Find a flight of stairs. Any flight.',
      'Go up at an ordinary pace. Do not rush, do not slow down to prove anything.',
      'On the way back down, let your hand drag along the rail.',
      'That is it. You have moved, in a way that probably did not happen today.',
    ],
    null,
    ['cardio', 'quick'],
  ),

  // ── EXPLORE · reading ────────────────────────────────────────────────────
  media(
    SURPRISE_TYPE.read,
    'read-petrichor',
    SURPRISE_CATEGORY.explore,
    'The smell of rain',
    'That smell is not rain. It is what rain does to the ground — and it is a compound called petrichor that plants and bacteria make.',
    '4 min read',
    'https://en.wikipedia.org/wiki/Petrichor',
    ['science', 'everyday'],
  ),
  media(
    SURPRISE_TYPE.read,
    'read-featured',
    SURPRISE_CATEGORY.explore,
    'Wikipedia’s Featured Content',
    'The articles Wikipedia editors personally judged to be the best writing on the site. It is a bottomless, genuinely excellent rabbit hole.',
    'As long as you want',
    'https://en.wikipedia.org/wiki/Portal:Featured_content',
    ['rabbit-hole', 'writing'],
  ),
  media(
    SURPRISE_TYPE.read,
    'read-atlas',
    SURPRISE_CATEGORY.explore,
    'Atlas Obscura',
    'Entries on the strange, hidden and inexplicable — a tunnel in a mine, a town that exists for one week a year, a museum in a submarine.',
    'Browse a while',
    'https://www.atlasobscura.com/',
    ['rabbit-hole', 'places'],
  ),
  media(
    SURPRISE_TYPE.read,
    'read-mit-cold',
    SURPRISE_CATEGORY.explore,
    'Why are you cold?',
    'Four separate ways your body can lose heat, and how much each one contributes — which is not the one you would guess.',
    '6 min read',
    'https://en.wikipedia.org/wiki/Hypothermia',
    ['science', 'body'],
  ),
  media(
    SURPRISE_TYPE.read,
    'read-honey-wombat',
    SURPRISE_CATEGORY.explore,
    'The mathematics of cube-shaped droppings',
    'How an animal’s soft intestine can produce hard geometric shapes, and why the same trick shows up in fruit and in ice.',
    '7 min read',
    'https://en.wikipedia.org/wiki/Wombat',
    ['science', 'maths'],
  ),
  media(
    SURPRISE_TYPE.read,
    'read-sound-water',
    SURPRISE_CATEGORY.explore,
    'How a whale sees with sound',
    'Echolocation explained properly — the click, the echo, and the astonishing mathematics of working out where something is from sound alone.',
    '5 min read',
    'https://en.wikipedia.org/wiki/Echolocation',
    ['ocean', 'science'],
  ),
  media(
    SURPRISE_TYPE.read,
    'read-debt',
    SURPRISE_CATEGORY.explore,
    'What is debt, actually',
    'It is an IOU, a legal promise to pay later, and that is genuinely it. Everything else is ceremony.',
    '4 min read',
    'https://en.wikipedia.org/wiki/Debt',
    ['economics', 'clear'],
  ),
  media(
    SURPRISE_TYPE.read,
    'read-boredom',
    SURPRISE_CATEGORY.explore,
    'Why boredom is a feature',
    'The brain appears to use idle mind-wandering to rehearse the future, which is a fairly convincing argument for letting it happen.',
    '5 min read',
    'https://en.wikipedia.org/wiki/Boredom',
    ['psychology', 'on-topic'],
  ),

  // ── EXPLORE · watching ───────────────────────────────────────────────────
  media(
    SURPRISE_TYPE.watch,
    'watch-blue-planet',
    SURPRISE_CATEGORY.explore,
    'Blue Planet II',
    'The deep ocean sequences are the argument for making anything at all. Sceptical viewers tend to surrender during episode one.',
    'Series · wildlife',
    'https://en.wikipedia.org/wiki/Blue_Planet_II',
    ['nature', 'documentary'],
  ),
  media(
    SURPRISE_TYPE.watch,
    'watch-cosmos',
    SURPRISE_CATEGORY.explore,
    'Cosmos',
    'Still the best popular introduction to how big the universe is, and how little of it we can ever see.',
    'Series · space',
    'https://en.wikipedia.org/wiki/Cosmos_(TV_series)',
    ['space', 'documentary'],
  ),
  media(
    SURPRISE_TYPE.watch,
    'watch-perfect-days',
    SURPRISE_CATEGORY.explore,
    'Perfect Days',
    'A man cleans public toilets in Tokyo and is quietly happy. Almost nothing happens, and it is one of the most affecting films of the decade.',
    'Film · 2023',
    'https://en.wikipedia.org/wiki/Perfect_Days_(2023_film)',
    ['film', 'calm'],
  ),
  media(
    SURPRISE_TYPE.watch,
    'watch-arrival',
    SURPRISE_CATEGORY.explore,
    'Arrival',
    'The one science fiction film where the interesting question is not the aliens but what a language does to a person.',
    'Film · 2016',
    'https://en.wikipedia.org/wiki/Arrival_(2016_film)',
    ['film', 'language'],
  ),
  media(
    SURPRISE_TYPE.watch,
    'watch-totoro',
    SURPRISE_CATEGORY.explore,
    'My Neighbor Totoro',
    'Ninety minutes of summer, a bus stop, and a very large forest creature. Enormously restorative.',
    'Film · 1988',
    'https://en.wikipedia.org/wiki/My_Neighbor_Totoro',
    ['film', 'calm'],
  ),
  media(
    SURPRISE_TYPE.watch,
    'watch-planet-earth',
    SURPRISE_CATEGORY.explore,
    'Planet Earth II',
    'The series that set the standard for the genre. The scene transitions alone justify watching it.',
    'Series · wildlife',
    'https://en.wikipedia.org/wiki/Planet_Earth_(TV_series)',
    ['nature', 'documentary'],
  ),

  // ── EXPLORE · listening ──────────────────────────────────────────────────
  media(
    SURPRISE_TYPE.listen,
    'listen-radiolab',
    SURPRISE_CATEGORY.explore,
    'Radiolab',
    'Reported science as storytelling. Pick any episode — they are self-contained, so you can start anywhere.',
    'Podcast · any episode',
    'https://www.radiolab.org/',
    ['science', 'storytelling'],
  ),
  media(
    SURPRISE_TYPE.listen,
    'listen-fish',
    SURPRISE_CATEGORY.explore,
    'No Such Thing as a Fish',
    'A panel show that treats a completely ridiculous animal fact as serious news. Much better than it has any right to be.',
    'Podcast · any episode',
    'https://nosuchthingasafish.com/',
    ['animals', 'comedy'],
  ),
  media(
    SURPRISE_TYPE.listen,
    'listen-darknet',
    SURPRISE_CATEGORY.explore,
    'Darknet Diaries',
    'True stories from the darker side of the internet, told carefully. Start with the episode about the man who phoned the bank.',
    'Podcast · any episode',
    'https://darknetdiaries.com/',
    ['stories', 'tech'],
  ),
  media(
    SURPRISE_TYPE.listen,
    'listen-ted',
    SURPRISE_CATEGORY.explore,
    'A TED talk, chosen by you',
    'Not one specific talk — just the archive. It is a good place to click something and find out whether you like that.',
    'Archive · many hours',
    'https://www.ted.com/talks',
    ['ideas', 'short'],
  ),
]

/** Fast lookup for debugging and for the selector's "is this id real" checks. */
export const SURPRISE_BY_ID = new Map(SURPRISE_LIBRARY.map((item) => [item.id, item]))
