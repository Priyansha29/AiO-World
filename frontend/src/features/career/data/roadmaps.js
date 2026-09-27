/**
 * The live roadmap definitions behind the Career section.
 *
 * Each entry is one full "available" roadmap. The catalogue
 * (`data/catalog.js`) reads this file to build the landing grid and the
 * filters. To add the 16th–100th roadmap:
 *
 *   1. write its definition here,
 *   2. import it into `data/catalog.js`,
 *   3. done — the grid, search, filters, detail page and Help Me Choose all
 *      pick it up automatically.
 *
 * Content is original to AiO World and student-oriented (no roadmap.sh copy).
 */

export const ROADMAPS = [
  // ── Software & Development ──────────────────────────────────────────
  {
    id: 'full-stack',
    title: 'Full-Stack Developer',
    category: 'software',
    tags: ['career-path', 'software'],
    difficulty: 'Intermediate',
    description:
      'Build complete web apps end to end — front end, back end, and the database that connects them.',
    whyStudents:
      'The most common first job title for web-focused students. Every product team needs people who can take a feature from a blank file to a deployed app, and college project labs reward exactly that skill.',
    stages: [
      {
        id: 'fs-foundations',
        title: 'Foundations',
        phase: 'learn',
        blurb: 'The three files every website is made of, plus the tool you will live in.',
        nodes: [
          { id: 'html', title: 'HTML', type: 'skill' },
          { id: 'css', title: 'CSS', type: 'skill' },
          { id: 'js-basics', title: 'JavaScript basics', type: 'skill' },
          { id: 'git', title: 'Git & GitHub', type: 'tool' },
        ],
      },
      {
        id: 'fs-frontend',
        title: 'Frontend',
        phase: 'learn',
        blurb: 'Interfaces users actually talk to.',
        nodes: [
          { id: 'react', title: 'React', type: 'skill' },
          { id: 'state', title: 'State & props', type: 'concept' },
          { id: 'fetch', title: 'Fetching data', type: 'skill' },
          { id: 'css-modern', title: 'Flexbox / Grid', type: 'skill' },
        ],
      },
      {
        id: 'fs-frontend-practice',
        title: 'Practice Frontend',
        phase: 'practice',
        blurb: 'Small, repeatable reps before any full app.',
        nodes: [
          { id: 'mini-components', title: 'Rebuild small components', type: 'practice' },
          { id: 'todo', title: 'A to-do app', type: 'project' },
          { id: 'responsive', title: 'Make it responsive', type: 'practice' },
        ],
      },
      {
        id: 'fs-backend',
        title: 'Backend & API',
        phase: 'learn',
        blurb: 'The code that runs on the server and answers the browser.',
        nodes: [
          { id: 'node', title: 'Node.js or Python (FastAPI)', type: 'skill' },
          { id: 'routes', title: 'Routes & requests', type: 'concept' },
          { id: 'auth', title: 'Auth basics', type: 'concept' },
        ],
      },
      {
        id: 'fs-database',
        title: 'Database',
        phase: 'learn',
        blurb: 'Where the data lives and how shapes talk to tables.',
        nodes: [
          { id: 'sql', title: 'SQL', type: 'skill' },
          { id: 'postgres', title: 'PostgreSQL', type: 'tool' },
          { id: 'schema', title: 'Schema design', type: 'concept' },
        ],
      },
      {
        id: 'fs-capstone',
        title: 'Build a Full-Stack Project',
        phase: 'build',
        blurb: 'One real app that uses everything above.',
        nodes: [
          { id: 'fs-project', title: 'Full-stack CRUD app', type: 'project' },
          { id: 'deploy', title: 'Deploy to a host', type: 'practice' },
          { id: 'portfolio', title: 'Put it in your portfolio', type: 'project' },
        ],
      },
      {
        id: 'fs-career',
        title: 'Internship Ready',
        phase: 'career',
        blurb: 'Package the work so it reads as proof.',
        nodes: [
          { id: 'resume', title: 'Resume with projects', type: 'practice' },
          { id: 'talk', title: 'Talk through your decisions', type: 'practice' },
          { id: 'apply', title: 'Apply with a portfolio link', type: 'practice' },
        ],
      },
    ],
  },

  {
    id: 'frontend',
    title: 'Frontend Developer',
    category: 'software',
    tags: ['career-path', 'software'],
    difficulty: 'Beginner',
    description:
      'Build the parts of a website people see and touch: layout, interaction, and feel.',
    whyStudents:
      'Fastest on-ramp with visible results — a good frontend can be a student’s first portfolio piece by the end of a semester.',
    stages: [
      {
        id: 'fe-foundations',
        title: 'Foundations',
        phase: 'learn',
        nodes: [
          { id: 'fe-html', title: 'HTML semantics', type: 'skill' },
          { id: 'fe-css', title: 'CSS layout', type: 'skill' },
          { id: 'fe-js', title: 'JavaScript fundamentals', type: 'skill' },
        ],
      },
      {
        id: 'fe-frames',
        title: 'Framework',
        phase: 'learn',
        nodes: [
          { id: 'fe-react', title: 'React', type: 'skill' },
          { id: 'fe-hooks', title: 'Hooks & state', type: 'concept' },
        ],
      },
      {
        id: 'fe-practice',
        title: 'Practice',
        phase: 'practice',
        nodes: [
          { id: 'fe-clone', title: 'Clone a landing page', type: 'practice' },
          { id: 'fe-interactive', title: 'Make a component interactive', type: 'practice' },
          { id: 'fe-a11y', title: 'Accessibility habits', type: 'concept' },
        ],
      },
      {
        id: 'fe-build',
        title: 'Build',
        phase: 'build',
        nodes: [
          { id: 'fe-portfolio', title: 'Portfolio site', type: 'project' },
          { id: 'fe-deploy', title: 'Free deployment (Vercel/Netlify)', type: 'practice' },
        ],
      },
      {
        id: 'fe-career',
        title: 'Career',
        phase: 'career',
        nodes: [
          { id: 'fe-showcase', title: 'Showcase 2–3 polished projects', type: 'practice' },
          { id: 'fe-interview', title: 'UI + beginner JS interview prep', type: 'practice' },
        ],
      },
    ],
  },

  {
    id: 'backend',
    title: 'Backend Developer',
    category: 'software',
    tags: ['career-path', 'software'],
    difficulty: 'Intermediate',
    description:
      'Write the server-side logic, data flows, and APIs that power everything the user never sees.',
    whyStudents:
      'Strong demand and less visual pressure — projects are judged on correctness, scaling behavior, and clean APIs, which college theory maps onto well.',
    stages: [
      {
        id: 'be-foundations',
        title: 'Programming core',
        phase: 'learn',
        nodes: [
          { id: 'be-dsa', title: 'Data structures & algorithms', type: 'skill' },
          { id: 'be-lang', title: 'One backend language deeply', type: 'skill' },
          { id: 'be-networks', title: 'HTTP & networking', type: 'concept' },
        ],
      },
      {
        id: 'be-servers',
        title: 'Servers & APIs',
        phase: 'learn',
        nodes: [
          { id: 'be-express', title: 'Express / FastAPI', type: 'tool' },
          { id: 'be-rest', title: 'REST design', type: 'concept' },
          { id: 'be-testing', title: 'API testing', type: 'practice' },
        ],
      },
      {
        id: 'be-data',
        title: 'Databases',
        phase: 'learn',
        nodes: [
          { id: 'be-sql', title: 'SQL & indexes', type: 'skill' },
          { id: 'be-nosql', title: 'Redis / MongoDB basics', type: 'tool' },
        ],
      },
      {
        id: 'be-systems',
        title: 'Systems thinking',
        phase: 'learn',
        nodes: [
          { id: 'be-cache', title: 'Caching', type: 'concept' },
          { id: 'be-queue', title: 'Queues & background jobs', type: 'concept' },
          { id: 'be-docker', title: 'Docker for dev', type: 'tool' },
        ],
      },
      {
        id: 'be-build',
        title: 'Build',
        phase: 'build',
        nodes: [
          { id: 'be-api', title: 'Design + ship a public API', type: 'project' },
          { id: 'be-scale', title: 'Benchmark and optimize one bottleneck', type: 'practice' },
        ],
      },
      {
        id: 'be-career',
        title: 'Career',
        phase: 'career',
        nodes: [
          { id: 'be-portfolio', title: 'Portfolio with architecture notes', type: 'practice' },
          { id: 'be-rounds', title: 'DSA + system design rounds', type: 'practice' },
        ],
      },
    ],
  },

  {
    id: 'cpp-systems',
    title: 'C++ / Systems Developer',
    category: 'software',
    tags: ['career-path', 'software', 'technology'],
    difficulty: 'Advanced',
    description:
      'Work close to the machine — memory, performance, and the software that runs on bare metal.',
    whyStudents:
      'The natural home for students from core CS theory: strong compilers background translates directly into systems, game, and embedded roles, and competitive programming here transfers well.',
    stages: [
      {
        id: 'cpp-core',
        title: 'C++ core',
        phase: 'learn',
        nodes: [
          { id: 'cpp-lang', title: 'C++ language', type: 'skill' },
          { id: 'cpp-memory', title: 'Pointers & memory', type: 'concept' },
          { id: 'cpp-oop', title: 'Classes & templates', type: 'skill' },
        ],
      },
      {
        id: 'cpp-advanced',
        title: 'Going deeper',
        phase: 'learn',
        nodes: [
          { id: 'cpp-stl', title: 'STL & algorithms', type: 'skill' },
          { id: 'cpp-modern', title: 'Modern C++ (11/17/20)', type: 'concept' },
          { id: 'cpp-asm', title: 'Assembly intuition', type: 'concept' },
        ],
      },
      {
        id: 'cpp-os',
        title: 'Operating systems lens',
        phase: 'learn',
        nodes: [
          { id: 'cpp-proc', title: 'Processes & threads', type: 'concept' },
          { id: 'cpp-mem-model', title: 'Memory model & synchronization', type: 'concept' },
        ],
      },
      {
        id: 'cpp-practice',
        title: 'Practice',
        phase: 'practice',
        nodes: [
          { id: 'cpp-dsa', title: 'DS/Algo in C++', type: 'practice' },
          { id: 'cpp-optimize', title: 'Make something 10× faster', type: 'practice' },
        ],
      },
      {
        id: 'cpp-build',
        title: 'Build',
        phase: 'build',
        nodes: [
          { id: 'cpp-project', title: 'A systems project (server/emulator)', type: 'project' },
          { id: 'cpp-debug', title: 'Debug with gdb', type: 'practice' },
        ],
      },
      {
        id: 'cpp-career',
        title: 'Career',
        phase: 'career',
        nodes: [
          { id: 'cpp-contests', title: 'Coding contest track record', type: 'practice' },
          { id: 'cpp-apply', title: 'Systems / core-engineering roles', type: 'practice' },
        ],
      },
    ],
  },

  {
    id: 'python',
    title: 'Python Developer',
    category: 'software',
    tags: ['career-path', 'software', 'technology'],
    difficulty: 'Beginner',
    description:
      'Master the most student-friendly language — from scripts and automation to backend and data.',
    whyStudents:
      'Python shows up in every second internship posting and powers most of AI/data coursework. Learning it unlocks the widest range of paths for the least effort.',
    stages: [
      {
        id: 'py-basics',
        title: 'Basics',
        phase: 'learn',
        nodes: [
          { id: 'py-syntax', title: 'Syntax & types', type: 'skill' },
          { id: 'py-functions', title: 'Functions & modules', type: 'skill' },
          { id: 'py-oop', title: 'Classes', type: 'skill' },
        ],
      },
      {
        id: 'py-intermediate',
        title: 'Intermediate',
        phase: 'learn',
        nodes: [
          { id: 'py-comprehensions', title: 'Comprehensions & generators', type: 'concept' },
          { id: 'py-errors', title: 'Errors & debugging', type: 'skill' },
          { id: 'py-environment', title: 'Virtualenv & pip', type: 'tool' },
        ],
      },
      {
        id: 'py-applied',
        title: 'Applied Python',
        phase: 'learn',
        nodes: [
          { id: 'py-fastapi', title: 'FastAPI / Flask', type: 'tool' },
          { id: 'py-requests', title: 'HTTP with requests', type: 'tool' },
          { id: 'py-numpy', title: 'NumPy / pandas (data float)', type: 'tool' },
        ],
      },
      {
        id: 'py-practice',
        title: 'Practice',
        phase: 'practice',
        nodes: [
          { id: 'py-automate', title: 'Automate a boring task', type: 'project' },
          { id: 'py-cli', title: 'A CLI tool', type: 'project' },
        ],
      },
      {
        id: 'py-build',
        title: 'Build',
        phase: 'build',
        nodes: [
          { id: 'py-api', title: 'A small backend service', type: 'project' },
          { id: 'py-tests', title: 'Test it with pytest', type: 'practice' },
        ],
      },
      {
        id: 'py-career',
        title: 'Career',
        phase: 'career',
        nodes: [
          { id: 'py-showcase', title: 'Showcase backend + automation', type: 'practice' },
          { id: 'py-roles', title: 'Data / backend / scripting roles', type: 'practice' },
        ],
      },
    ],
  },

  {
    id: 'java',
    title: 'Java Developer',
    category: 'software',
    tags: ['career-path', 'software', 'technology'],
    difficulty: 'Intermediate',
    description:
      'The language behind enterprise systems, Android, and most placement exam papers.',
    whyStudents:
      'Java is still a top filter for on-campus placements and internships in many countries; OOPS + Java questions appear in almost every core-company round.',
    stages: [
      {
        id: 'java-core',
        title: 'Java core',
        phase: 'learn',
        nodes: [
          { id: 'java-syntax', title: 'Syntax & types', type: 'skill' },
          { id: 'java-oop', title: 'OOP: classes, interfaces', type: 'skill' },
          { id: 'java-collections', title: 'Collections framework', type: 'skill' },
        ],
      },
      {
        id: 'java-advanced',
        title: 'Intermediate',
        phase: 'learn',
        nodes: [
          { id: 'java-exceptions', title: 'Exceptions & generics', type: 'concept' },
          { id: 'java-streams', title: 'Streams & lambdas', type: 'concept' },
          { id: 'java-multithreading', title: 'Multithreading basics', type: 'concept' },
        ],
      },
      {
        id: 'java-spring',
        title: 'Building apps',
        phase: 'learn',
        nodes: [
          { id: 'java-gradle', title: 'Maven / Gradle', type: 'tool' },
          { id: 'java-spring', title: 'Spring Boot basics', type: 'tool' },
          { id: 'java-junit', title: 'JUnit testing', type: 'practice' },
        ],
      },
      {
        id: 'java-dsa',
        title: 'Placement DSA',
        phase: 'practice',
        nodes: [
          { id: 'java-dsa-impl', title: 'Implement DSA in Java', type: 'practice' },
          { id: 'java-problems', title: '150–300 problems', type: 'practice' },
        ],
      },
      {
        id: 'java-build',
        title: 'Build',
        phase: 'build',
        nodes: [
          { id: 'java-project', title: 'A Spring Boot backend', type: 'project' },
          { id: 'java-rest', title: 'REST API + DB', type: 'project' },
        ],
      },
      {
        id: 'java-career',
        title: 'Career',
        phase: 'career',
        nodes: [
          { id: 'java-interview', title: 'Prepare OOP/Java interview sets', type: 'practice' },
          { id: 'java-apply', title: 'Target Java/backend + campus drives', type: 'practice' },
        ],
      },
    ],
  },

  {
    id: 'game-developer',
    title: 'Game Developer',
    category: 'software',
    tags: ['career-path', 'software'],
    difficulty: 'Intermediate',
    description:
      'Make games people play — from game logic and physics to art pipelines and shipping.',
    whyStudents:
      'Games are the most portfolio-friendly proof of programming skill, and game projects teach the full stack of performance, math, and teamwork.',
    stages: [
      {
        id: 'game-foundations',
        title: 'Foundations',
        phase: 'learn',
        nodes: [
          { id: 'game-lang', title: 'C# or C++', type: 'skill' },
          { id: 'game-math', title: 'Math for games, vectors, matrices', type: 'concept' },
          { id: 'game-patterns', title: 'Game loop & input', type: 'concept' },
        ],
      },
      {
        id: 'game-engine',
        title: 'Engine',
        phase: 'learn',
        nodes: [
          { id: 'game-unity', title: 'Godot or Unity', type: 'tool' },
          { id: 'game-physics', title: 'Physics & collisions', type: 'concept' },
          { id: 'game-scenes', title: 'Scenes, assets, animation', type: 'skill' },
        ],
      },
      {
        id: 'game-practice',
        title: 'Practice',
        phase: 'practice',
        nodes: [
          { id: 'game-jam', title: 'A game jam in a weekend', type: 'project' },
          { id: 'game-clone', title: 'Rebuild a classic (Pong/Snake)', type: 'project' },
        ],
      },
      {
        id: 'game-build',
        title: 'Build',
        phase: 'build',
        nodes: [
          { id: 'game-full', title: 'A polished playable game', type: 'project' },
          { id: 'game-levels', title: 'Levels, UI, save system', type: 'project' },
          { id: 'game-showcase', title: 'Playable demo on itch.io', type: 'practice' },
        ],
      },
      {
        id: 'game-career',
        title: 'Career',
        phase: 'career',
        nodes: [
          { id: 'game-portfolio', title: 'Game portfolio & trailer', type: 'practice' },
          { id: 'game-roles', title: 'Indie, studio, or game-dev tooling', type: 'practice' },
        ],
      },
    ],
  },

  // ── AI & Modern Development ──────────────────────────────────────────
  {
    id: 'ai-engineer',
    title: 'AI Engineer',
    category: 'ai',
    tags: ['career-path', 'ai'],
    difficulty: 'Intermediate',
    description:
      'Build applications powered by machine learning and large language models, not just run notebooks.',
    whyStudents:
      'The fastest-growing internship categories for students. AI engineering needs a pragmatic mix of Python, ML concepts, and shipped projects — all learnable as a student.',
    stages: [
      {
        id: 'ai-foundations',
        title: 'Foundations',
        phase: 'learn',
        nodes: [
          { id: 'ai-python', title: 'Python & data tools', type: 'skill' },
          { id: 'ai-linalg', title: 'Linear algebra & stats basics', type: 'concept' },
          { id: 'ai-ml', title: 'ML fundamentals', type: 'concept' },
        ],
      },
      {
        id: 'ai-ml-deep',
        title: 'Deep learning',
        phase: 'learn',
        nodes: [
          { id: 'ai-nn', title: 'Neural networks', type: 'concept' },
          { id: 'ai-framework', title: 'PyTorch or TensorFlow', type: 'tool' },
          { id: 'ai-training', title: 'Train + evaluate a model', type: 'practice' },
        ],
      },
      {
        id: 'ai-llms',
        title: 'LLM engineering',
        phase: 'learn',
        nodes: [
          { id: 'ai-llm-api', title: 'LLM APIs', type: 'tool' },
          { id: 'ai-prompt', title: 'Prompting & context', type: 'skill' },
          { id: 'ai-rag', title: 'RAG concepts', type: 'concept' },
        ],
      },
      {
        id: 'ai-project',
        title: 'Build',
        phase: 'build',
        nodes: [
          { id: 'ai-app', title: 'An AI-powered app', type: 'project' },
          { id: 'ai-eval', title: 'Evaluate & improve results', type: 'practice' },
        ],
      },
      {
        id: 'ai-career',
        title: 'Career',
        phase: 'career',
        nodes: [
          { id: 'ai-demo', title: 'Demo stories for interviews', type: 'practice' },
          { id: 'ai-apply', title: 'AI internship roles', type: 'practice' },
        ],
      },
    ],
  },

  {
    id: 'data-scientist',
    title: 'Data Scientist',
    category: 'ai',
    tags: ['career-path', 'ai'],
    difficulty: 'Intermediate',
    description:
      'Turn messy data into decisions — collecting, cleaning, analyzing, and presenting evidence.',
    whyStudents:
      'A favorite first data career: every team wants someone who can not only compute a number but say what it means. Statistics coursework maps directly onto the day job.',
    stages: [
      {
        id: 'ds-foundations',
        title: 'Data foundations',
        phase: 'learn',
        nodes: [
          { id: 'ds-python', title: 'Python', type: 'skill' },
          { id: 'ds-stats', title: 'Statistics & probability', type: 'concept' },
          { id: 'ds-pandas', title: 'pandas / NumPy', type: 'tool' },
        ],
      },
      {
        id: 'ds-wrangling',
        title: 'Wrangling',
        phase: 'practice',
        nodes: [
          { id: 'ds-clean', title: 'Clean a messy dataset', type: 'practice' },
          { id: 'ds-explore', title: 'Exploratory analysis', type: 'practice' },
        ],
      },
      {
        id: 'ds-visual',
        title: 'Visualization',
        phase: 'learn',
        nodes: [
          { id: 'ds-plot', title: 'Matplotlib / seaborn', type: 'tool' },
          { id: 'ds-story', title: 'Tell a data story', type: 'skill' },
        ],
      },
      {
        id: 'ds-model',
        title: 'Modelling',
        phase: 'learn',
        nodes: [
          { id: 'ds-ml', title: 'Core ML models', type: 'concept' },
          { id: 'ds-eval', title: 'Validation, not just accuracy', type: 'concept' },
        ],
      },
      {
        id: 'ds-project',
        title: 'Build',
        phase: 'build',
        nodes: [
          { id: 'ds-endtoend', title: 'End-to-end analysis project', type: 'project' },
          { id: 'ds-report', title: 'Write the findings clearly', type: 'project' },
        ],
      },
      {
        id: 'ds-career',
        title: 'Career',
        phase: 'career',
        nodes: [
          { id: 'ds-portfolio', title: 'Kaggle + analysis portfolio', type: 'practice' },
          { id: 'ds-apply', title: 'Data roles with a case study', type: 'practice' },
        ],
      },
    ],
  },

  {
    id: 'vibe-coding',
    title: 'Vibe Coding',
    category: 'ai',
    tags: ['career-path', 'ai', 'technology'],
    difficulty: 'Beginner',
    description:
      'Build software with AI coding tools as your pair programmer — write great specs, review everything, and keep the human in the loop.',
    whyStudents:
      'Every future job involves working with generated code, so learning to direct, review, and fix it is a survival skill — not a shortcut. It gets students shipping ideas they could not build alone.',
    stages: [
      {
        id: 'vc-mindset',
        title: 'The right mindset',
        phase: 'learn',
        blurb: 'AI is a tool, not an oracle. Generated code is a draft, never a verdict.',
        nodes: [
          { id: 'vc-not-automatic', title: 'Generated code is not automatically correct', type: 'concept' },
          { id: 'vc-spec', title: 'Writing clear specifications', type: 'skill' },
          { id: 'vc-context', title: 'Context management', type: 'skill' },
        ],
      },
      {
        id: 'vc-tools',
        title: 'The tools',
        phase: 'learn',
        nodes: [
          { id: 'vc-ai-tools', title: 'AI coding tools', type: 'tool' },
          { id: 'vc-editor', title: 'Editor & terminal fluency', type: 'tool' },
          { id: 'vc-git', title: 'Git/version control', type: 'tool' },
        ],
      },
      {
        id: 'vc-review',
        title: 'Reviewing and debugging',
        phase: 'practice',
        blurb: 'The skill in the middle: reading code you did not write and fixing what is wrong.',
        nodes: [
          { id: 'vc-review-code', title: 'Reviewing generated code', type: 'practice' },
          { id: 'vc-debug', title: 'Debugging generated code', type: 'practice' },
          { id: 'vc-understand', title: 'Understanding generated code', type: 'concept' },
        ],
      },
      {
        id: 'vc-quality',
        title: 'Quality & safety',
        phase: 'practice',
        nodes: [
          { id: 'vc-testing', title: 'Testing', type: 'practice' },
          { id: 'vc-security', title: 'Security & privacy awareness', type: 'concept' },
        ],
      },
      {
        id: 'vc-build',
        title: 'Build real things',
        phase: 'build',
        nodes: [
          { id: 'vc-project', title: 'Build a real project with AI help', type: 'project' },
          { id: 'vc-ship', title: 'Ship it and maintain it', type: 'practice' },
        ],
      },
    ],
  },

  // ── Cloud & Infrastructure ───────────────────────────────────────────
  {
    id: 'devops',
    title: 'DevOps Engineer',
    category: 'cloud',
    tags: ['career-path', 'cloud'],
    difficulty: 'Intermediate',
    description:
      'Automate the path from code to production — builds, pipelines, infrastructure as code, and reliability.',
    whyStudents:
      'Companies run on teams that ship code safely; DevOps and SRE interns are hired specifically for Linux + automation + scripting. It is infrastructure knowledge a student can practice entirely for free at home.',
    stages: [
      {
        id: 'devops-foundations',
        title: 'Foundations',
        phase: 'learn',
        nodes: [
          { id: 'devops-linux', title: 'Linux & shell', type: 'skill' },
          { id: 'devops-networking', title: 'Networking basics', type: 'concept' },
        ],
      },
      {
        id: 'devops-scripting',
        title: 'Scripting',
        phase: 'practice',
        nodes: [
          { id: 'devops-shell', title: 'Bash scripting', type: 'practice' },
          { id: 'devops-yaml', title: 'YAML + config files', type: 'skill' },
        ],
      },
      {
        id: 'devops-cicd',
        title: 'CI/CD',
        phase: 'learn',
        nodes: [
          { id: 'devops-git', title: 'Git branching strategies', type: 'skill' },
          { id: 'devops-pipelines', title: 'GitHub Actions', type: 'tool' },
          { id: 'devops-pipeline', title: 'Build a deploy pipeline', type: 'project' },
        ],
      },
      {
        id: 'devops-containers',
        title: 'Containers',
        phase: 'learn',
        nodes: [
          { id: 'devops-docker', title: 'Docker', type: 'tool' },
          { id: 'devops-compose', title: 'docker-compose', type: 'tool' },
          { id: 'devops-k8s', title: 'Kubernetes basics', type: 'concept' },
        ],
      },
      {
        id: 'devops-iac',
        title: 'Infrastructure as code',
        phase: 'learn',
        nodes: [
          { id: 'devops-terraform', title: 'Terraform basics', type: 'tool' },
          { id: 'devops-monitoring', title: 'Metrics & monitoring', type: 'concept' },
        ],
      },
      {
        id: 'devops-build',
        title: 'Build',
        phase: 'build',
        nodes: [
          { id: 'devops-live', title: 'Deploy a real app via pipeline', type: 'project' },
          { id: 'devops-blog', title: 'Document the setup', type: 'project' },
        ],
      },
      {
        id: 'devops-career',
        title: 'Career',
        phase: 'career',
        nodes: [
          { id: 'devops-troubleshoot', title: 'Practice incident troubleshooting', type: 'practice' },
          { id: 'devops-apply', title: 'DevOps / SRE internships', type: 'practice' },
        ],
      },
    ],
  },

  {
    id: 'cloud-engineer',
    title: 'Cloud Engineer',
    category: 'cloud',
    tags: ['career-path', 'cloud'],
    difficulty: 'Intermediate',
    description:
      'Design and run systems on real cloud platforms — compute, storage, networking, and cost awareness.',
    whyStudents:
      'Free-tier accounts make this fully learnable as a student, and cloud familiarity compounds into infrastructure, DevOps, and AI roles.',
    stages: [
      {
        id: 'cloud-foundations',
        title: 'Foundations',
        phase: 'learn',
        nodes: [
          { id: 'cloud-linux', title: 'Linux', type: 'skill' },
          { id: 'cloud-model', title: 'What a cloud is (IaaS/PaaS/SaaS)', type: 'concept' },
        ],
      },
      {
        id: 'cloud-core',
        title: 'Core services',
        phase: 'learn',
        nodes: [
          { id: 'cloud-vm', title: 'VMs (EC2 / Compute Engine)', type: 'tool' },
          { id: 'cloud-storage', title: 'Storage & buckets', type: 'tool' },
          { id: 'cloud-net', title: 'Networking basics', type: 'concept' },
        ],
      },
      {
        id: 'cloud-practice',
        title: 'Practice',
        phase: 'practice',
        nodes: [
          { id: 'cloud-deploy-app', title: 'Deploy an app to the cloud', type: 'project' },
          { id: 'cloud-security', title: 'IAM & least privilege', type: 'concept' },
        ],
      },
      {
        id: 'cloud-build',
        title: 'Build',
        phase: 'build',
        nodes: [
          { id: 'cloud-arch', title: 'A small cloud architecture', type: 'project' },
          { id: 'cloud-cost', title: 'Monitor cost & usage', type: 'practice' },
        ],
      },
      {
        id: 'cloud-career',
        title: 'Career',
        phase: 'career',
        nodes: [
          { id: 'cloud-cert', title: 'Associate-level cert prep', type: 'practice' },
          { id: 'cloud-apply', title: 'Cloud support/eng roles', type: 'practice' },
        ],
      },
    ],
  },

  // ── Cybersecurity ────────────────────────────────────────────────────
  {
    id: 'cybersecurity-engineer',
    title: 'Cybersecurity Engineer',
    category: 'cybersecurity',
    tags: ['career-path', 'cybersecurity'],
    difficulty: 'Intermediate',
    description:
      'Defend systems and data — learn how attacks work, then how to stop them.',
    whyStudents:
      'Security has a chronic talent shortage and strong early-career demand; a curious student with a homelab can get further than many courses.',
    stages: [
      {
        id: 'sec-foundations',
        title: 'Foundations',
        phase: 'learn',
        nodes: [
          { id: 'sec-networks', title: 'Networking fundamentals', type: 'skill' },
          { id: 'sec-linux', title: 'Linux', type: 'skill' },
          { id: 'sec-web', title: 'How the web works', type: 'concept' },
        ],
      },
      {
        id: 'sec-attack',
        title: 'Think like an attacker',
        phase: 'learn',
        nodes: [
          { id: 'sec-pentest', title: 'Penetration testing basics', type: 'concept' },
          { id: 'sec-owasp', title: 'OWASP Top 10', type: 'concept' },
          { id: 'sec-recon', title: 'Reconnaissance & tools', type: 'tool' },
        ],
      },
      {
        id: 'sec-defense',
        title: 'Defense',
        phase: 'learn',
        nodes: [
          { id: 'sec-hardening', title: 'Hardening & patching', type: 'practice' },
          { id: 'sec-monitoring', title: 'Logs & monitoring', type: 'concept' },
        ],
      },
      {
        id: 'sec-labs',
        title: 'Practice',
        phase: 'practice',
        nodes: [
          { id: 'sec-lab', title: 'A home lab with VMs', type: 'project' },
          { id: 'sec-ctf', title: 'CTF challenges', type: 'practice' },
          { id: 'sec-writeups', title: 'Write clear write-ups', type: 'practice' },
        ],
      },
      {
        id: 'sec-career',
        title: 'Career',
        phase: 'career',
        nodes: [
          { id: 'sec-cert', title: 'Entry certs (Security+, eJPT)', type: 'practice' },
          { id: 'sec-apply', title: 'SOC / security internships', type: 'practice' },
        ],
      },
    ],
  },

  // ── Engineering ──────────────────────────────────────────────────────
  {
    id: 'embedded-systems',
    title: 'Embedded Systems',
    category: 'engineering',
    tags: ['career-path', 'engineering'],
    difficulty: 'Advanced',
    description:
      'Software that runs on real hardware — microcontrollers, sensors, constraints, and C.',
    whyStudents:
      'For core/EC/EEE students especially, embedded skills turn circuit knowledge into career value, and small boards make great portfolio projects.',
    stages: [
      {
        id: 'emb-foundations',
        title: 'Foundations',
        phase: 'learn',
        nodes: [
          { id: 'emb-c', title: 'C deeply', type: 'skill' },
          { id: 'emb-arch', title: 'µController architecture', type: 'concept' },
          { id: 'emb-circuits', title: 'Basic electronics / schematics', type: 'skill' },
        ],
      },
      {
        id: 'emb-board',
        title: 'Get on a board',
        phase: 'practice',
        nodes: [
          { id: 'emb-arduino', title: 'Blink with avr-gcc (no IDE)', type: 'project' },
          { id: 'emb-gpio', title: 'GPIO, timers, interrupts', type: 'concept' },
        ],
      },
      {
        id: 'emb-rtos',
        title: 'Going real-time',
        phase: 'learn',
        nodes: [
          { id: 'emb-registers', title: 'Register-level programming', type: 'skill' },
          { id: 'emb-rtos', title: 'RTOS concepts', type: 'concept' },
          { id: 'emb-boot', title: 'Boot & toolchain', type: 'concept' },
        ],
      },
      {
        id: 'emb-project',
        title: 'Build',
        phase: 'build',
        nodes: [
          { id: 'emb-sensor', title: 'A sensor + communication project', type: 'project' },
          { id: 'emb-docs', title: 'Document the design', type: 'project' },
        ],
      },
      {
        id: 'emb-career',
        title: 'Career',
        phase: 'career',
        nodes: [
          { id: 'emb-portfolio', title: 'Portfolio with schematics', type: 'practice' },
          { id: 'emb-apply', title: 'Embedded / firmware roles', type: 'practice' },
        ],
      },
    ],
  },

  // ── Design & Product ─────────────────────────────────────────────────
  {
    id: 'ui-ux',
    title: 'UI/UX Designer',
    category: 'design',
    tags: ['career-path', 'design'],
    difficulty: 'Beginner',
    description:
      'Design interfaces people understand and enjoy — research, wireframes, prototypes, and usability.',
    whyStudents:
      'A design portfolio is more decisive than a degree for design roles, and students can build one from real class projects and app redesigns.',
    stages: [
      {
        id: 'ux-foundations',
        title: 'Foundations',
        phase: 'learn',
        nodes: [
          { id: 'ux-principles', title: 'Design principles', type: 'concept' },
          { id: 'ux-research', title: 'User research basics', type: 'skill' },
          { id: 'ux-mapping', title: 'User flows & journeys', type: 'skill' },
        ],
      },
      {
        id: 'ux-interface',
        title: 'Interface craft',
        phase: 'learn',
        nodes: [
          { id: 'ux-wireframe', title: 'Wireframing', type: 'practice' },
          { id: 'ux-tools', title: 'Figma', type: 'tool' },
          { id: 'ux-prototype', title: 'Prototyping & interactions', type: 'practice' },
        ],
      },
      {
        id: 'ux-systems',
        title: 'Design systems',
        phase: 'learn',
        nodes: [
          { id: 'ux-type', title: 'Typography & color', type: 'skill' },
          { id: 'ux-component', title: 'Components & tokens', type: 'concept' },
        ],
      },
      {
        id: 'ux-practice',
        title: 'Practice',
        phase: 'practice',
        nodes: [
          { id: 'ux-redesign', title: 'Redesign an existing app', type: 'project' },
          { id: 'ux-testing', title: 'Usability testing with friends', type: 'practice' },
        ],
      },
      {
        id: 'ux-career',
        title: 'Career',
        phase: 'career',
        nodes: [
          { id: 'ux-casestudy', title: 'A case study portfolio', type: 'project' },
          { id: 'ux-apply', title: 'Design internships', type: 'practice' },
        ],
      },
    ],
  },
]