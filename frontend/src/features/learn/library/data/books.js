/**
 * The library catalogue — every record AiO shows, in one array.
 *
 * Content policy (please keep extending it the same way):
 *   - A row is `sourceType: "external"` whenever AiO does not host the file;
 *     it links to the official/author-hosted/legal source and nothing else.
 *   - A row is `sourceType: "hosted"` ONLY when AiO has permission to host the
 *     file (public domain, open licence, author-authorized or AiO-original).
 *   - `demo: true` rows are clearly-labelled placeholders — original AiO
 *     text (`demoContentRef`) or an authorized-but-not-yet-uploaded path
 *     (`storagePath` with no live file yet).
 *
 * No row invents a hosted PDF for a book AiO does not hold the rights to; no
 * external row points anywhere but its legitimate source.
 *
 * `category` is the single primary subject; `subjects` broadens it for
 * filters. Both use keys from `domain/library-types.js` CATEGORIES.
 */

export const BOOKS = [
  // ── External — free, openly licensed, author-hosted ──────────────────────
  {
    id: 'automate-the-boring-stuff',
    title: 'Automate the Boring Stuff with Python',
    author: 'Al Sweigart',
    description:
      'Free-to-read practical guide to Python for everyday tasks — files, web scraping, email and workflows.',
    category: 'programming',
    subjects: ['computer-science', 'career', 'web'],
    tags: ['python', 'automation', 'beginner'],
    format: 'Web',
    sourceType: 'external',
    license: 'Openly licensed (CC BY-NC-SA)',
    featured: true,
    addedAt: '2026-09-14',
    externalUrl: 'https://automatetheboringstuff.com/',
  },

  {
    id: 'pro-git',
    title: 'Pro Git',
    author: 'Scott Chacon & Ben Straub',
    description:
      'The canonical free Git book — from basics to branching, remotes and a full reference.',
    category: 'software-engineering',
    subjects: ['web', 'cloud', 'career'],
    tags: ['git', 'version-control', 'reference'],
    format: 'Web',
    sourceType: 'external',
    license: 'Openly licensed (CC BY-NC-SA 3.0)',
    featured: true,
    addedAt: '2026-09-12',
    externalUrl: 'https://git-scm.com/book/en/v2',
  },

  {
    id: 'think-python',
    title: 'Think Python: How to Think Like a Computer Scientist',
    author: 'Allen B. Downey',
    description:
      'An experiment-driven introduction to Python and programming fundamentals, free from the author.',
    category: 'programming',
    subjects: ['computer-science'],
    tags: ['python', 'beginner', 'algorithms'],
    format: 'PDF / HTML',
    sourceType: 'external',
    license: 'Openly licensed (CC BY-NC 3.0)',
    addedAt: '2026-09-10',
    externalUrl: 'https://greenteapress.com/wp/think-python-2e/',
  },

  {
    id: 'sicp',
    title: "Structure and Interpretation of Computer Programs",
    author: 'Harold Abelson & Gerald Jay Sussman',
    description:
      'The MIT classic on programming as a way of thinking — abstractions, recursion and language design.',
    category: 'computer-science',
    subjects: ['programming'],
    tags: ['scheme', 'abstraction', 'classic'],
    format: 'HTML / PDF',
    sourceType: 'external',
    license: 'Openly licensed (CC BY-NC-SA 4.0)',
    addedAt: '2026-09-08',
    externalUrl: 'https://sarabander.github.io/sicp/',
  },

  {
    id: 'ostep',
    title: 'Operating Systems: Three Easy Pieces',
    author: 'Remzi H. Arpaci-Dusseau & Andrea C. Arpaci-Dusseau',
    description:
      'A free and friendly operating-systems text covering virtualization, concurrency and persistence.',
    category: 'os',
    subjects: ['computer-science', 'embedded'],
    tags: ['os', 'processes', 'memory', 'storage'],
    format: 'Web',
    sourceType: 'external',
    license: 'Openly licensed (CC BY-NC-ND 4.0)',
    addedAt: '2026-09-05',
    externalUrl: 'https://pages.cs.wisc.edu/~remzi/OSTEP/',
  },

  {
    id: 'deep-learning',
    title: 'Deep Learning',
    author: 'Ian Goodfellow, Yoshua Bengio & Aaron Courville',
    description:
      'The comprehensive MIT-press deep learning text, published free online by the authors.',
    category: 'ai',
    subjects: ['computer-science', 'mathematics'],
    tags: ['neural-networks', 'ml', 'reference'],
    format: 'Web',
    sourceType: 'external',
    license: 'Openly licensed (author-hosted)',
    addedAt: '2026-09-03',
    externalUrl: 'https://www.deeplearningbook.org/',
  },

  {
    id: 'security-engineering',
    title: 'Security Engineering',
    author: 'Ross Anderson',
    description:
      'A widely-freely-available guide to building secure systems — threats, protocols and human factors.',
    category: 'cybersecurity',
    subjects: ['computer-science', 'os'],
    tags: ['security', 'threats', 'protocols'],
    format: 'Web',
    sourceType: 'external',
    license: 'Openly licensed (author-hosted)',
    featured: true,
    addedAt: '2026-09-01',
    externalUrl: 'https://www.cl.cam.ac.uk/~rja14/book.html',
  },

  {
    id: 'use-the-index-luke',
    title: 'Use The Index, Luke',
    author: 'Markus Winand',
    description:
      'A free, opinionated guide to SQL indexing and tooling that databases and ORMs rarely explain.',
    category: 'databases',
    subjects: ['web', 'software-engineering'],
    tags: ['sql', 'indexing', 'performance'],
    format: 'Web',
    sourceType: 'external',
    license: 'Openly licensed (author-hosted)',
    addedAt: '2026-08-28',
    externalUrl: 'https://use-the-index-luke.com/',
  },

  {
    id: 'sre-book',
    title: 'Site Reliability Engineering',
    author: 'Betsy Beyer, Chris Jones, Jennifer Petoff & Niall Richard Murphy',
    description:
      "Google's freely available SRE book — operating reliable services at scale, from dev through incidents.",
    category: 'cloud',
    subjects: ['os', 'computer-science', 'software-engineering'],
    tags: ['reliability', 'devops', 'operations'],
    format: 'Web',
    sourceType: 'external',
    license: 'Openly licensed (CC BY-NC-SA 4.0)',
    addedAt: '2026-08-25',
    externalUrl: 'https://sre.google/sre-book/table-of-contents/',
  },

  {
    id: 'game-programming-patterns',
    title: 'Game Programming Patterns',
    author: 'Robert Nystrom',
    description:
      'Reusable patterns for game code — sequence, behavior and decoupling — free from the author.',
    category: 'software-engineering',
    subjects: ['programming', 'design'],
    tags: ['design-patterns', 'games', 'architecture'],
    format: 'Web',
    sourceType: 'external',
    license: 'Openly licensed (CC BY-NC 4.0)',
    addedAt: '2026-08-22',
    externalUrl: 'https://gameprogrammingpatterns.com/',
  },

  {
    id: 'javascript-info',
    title: 'The Modern JavaScript Tutorial',
    author: 'Ilya Kantor',
    description:
      'A student-friendly, free walkthrough of JavaScript from language basics to browser APIs.',
    category: 'web',
    subjects: ['programming'],
    tags: ['javascript', 'frontend', 'beginner'],
    format: 'Web',
    sourceType: 'external',
    license: 'Openly licensed (CC BY-NC-SA 4.0)',
    addedAt: '2026-08-19',
    externalUrl: 'https://javascript.info/',
  },

  {
    id: 'linux-command-line',
    title: 'The Linux Command Line',
    author: 'William E. Shotts Jr.',
    description:
      'A complete free introduction to the Linux shell, filesystem, scripting and the terminal mindset.',
    category: 'os',
    subjects: ['embedded', 'cybersecurity'],
    tags: ['linux', 'bash', 'terminal'],
    format: 'PDF',
    sourceType: 'external',
    license: 'Openly licensed (CC BY-NC-ND 4.0)',
    addedAt: '2026-08-15',
    externalUrl: 'https://linuxcommand.org/tlcl.php',
  },

  {
    id: 'lessons-in-electric-circuits',
    title: 'Lessons In Electric Circuits',
    author: 'Tony R. Kuphaldt',
    description:
      'A free, openly licensed textbook of DC/AC analysis plus digital and semiconductor circuits.',
    category: 'embedded',
    subjects: ['mathematics', 'computer-science'],
    tags: ['electronics', 'circuits', 'hardware'],
    format: 'Web',
    sourceType: 'external',
    license: 'Openly licensed (CC BY 4.0)',
    addedAt: '2026-08-12',
    externalUrl: 'https://www.allaboutcircuits.com/textbook/',
  },

  {
    id: 'book-of-proof',
    title: 'Book of Proof',
    author: 'Richard Hammack',
    description:
      'A free introduction to mathematical proof, logic and sets — the math foundation behind CS theory.',
    category: 'mathematics',
    subjects: ['computer-science', 'dsa'],
    tags: ['proofs', 'logic', 'discrete'],
    format: 'PDF',
    sourceType: 'external',
    license: 'Openly licensed (CC BY-NC-ND 4.0)',
    addedAt: '2026-08-09',
    externalUrl: 'https://www.people.vcu.edu/~rhammack/BookOfProof/',
  },

  {
    id: 'kurose-ross-networking',
    title: 'Computer Networking: A Top-Down Approach',
    author: 'James F. Kurose & Keith W. Ross',
    description:
      'The classic networks text, application-first — supported by the authors’ official companion site.',
    category: 'networking',
    subjects: ['computer-science', 'cloud'],
    tags: ['networks', 'tcp-ip', 'protocols'],
    format: 'EPUB / Printed',
    sourceType: 'external',
    license: 'Commercial textbook (official companion site)',
    featured: true,
    addedAt: '2026-08-06',
    externalUrl: 'https://gaia.cs.umass.edu/kurose_ross/',
  },

  {
    id: 'nature-of-code',
    title: 'The Nature of Code',
    author: 'Daniel Shiffman',
    description:
      'Simulate natural systems with code — forces, physics, steering and emergence — free online.',
    category: 'programming',
    subjects: ['design', 'ai'],
    tags: ['creative-coding', 'simulation', 'p5'],
    format: 'Web',
    sourceType: 'external',
    license: 'Openly licensed (CC BY-NC 3.0)',
    featured: true,
    addedAt: '2026-08-02',
    externalUrl: 'https://natureofcode.com/',
  },

  {
    id: 'practical-typography',
    title: 'Practical Typography',
    author: 'Matthew Butterick',
    description:
      'A short, free, opinionated guide to typography — legibility, fonts, and layout decisions that matter.',
    category: 'design',
    subjects: ['web'],
    tags: ['typography', 'ui', 'readability'],
    format: 'Web',
    sourceType: 'external',
    license: 'Openly licensed (author-hosted)',
    addedAt: '2026-07-29',
    externalUrl: 'https://practicaltypography.com/',
  },

  // ── Hosted demo entries — original AiO content, or authorized-but-unuploaded ─
  {
    id: 'demo-how-to-learn',
    title: 'Demo: How to Learn to Code',
    author: 'AiO World',
    description:
      'An original AiO short guide on learning strategy: picking a path, going deep, building project-first. Readable inside AiO.',
    category: 'computer-science',
    subjects: ['programming', 'career'],
    tags: ['learning', 'study', 'demo'],
    format: 'Text',
    sourceType: 'hosted',
    fileType: 'text',
    license: 'AiO original (demo)',
    demo: true,
    addedAt: '2026-09-20',
    demoContentRef: 'how-to-learn-to-code',
  },

  {
    id: 'demo-git-in-one-sitting',
    title: 'Demo: Git in One Sitting',
    author: 'AiO World',
    description:
      'A short, original walkthrough of version control — the working tree, branching, and a daily flow. Readable inside AiO.',
    category: 'software-engineering',
    subjects: ['web', 'cloud'],
    tags: ['git', 'version-control', 'demo'],
    format: 'Text',
    sourceType: 'hosted',
    fileType: 'text',
    license: 'AiO original (demo)',
    demo: true,
    addedAt: '2026-09-18',
    demoContentRef: 'git-in-one-sitting',
  },

  {
    id: 'demo-dsa-quick-reference',
    title: 'Demo: Data Structures Quick Reference',
    author: 'AiO World',
    description:
      'A demo PDF record for the library pipeline. The authorized file has not been uploaded yet — the reader explains when it lands.',
    category: 'dsa',
    subjects: ['computer-science'],
    tags: ['dsa', 'arrays', 'graphs', 'demo'],
    format: 'PDF',
    sourceType: 'hosted',
    fileType: 'pdf',
    license: 'Demo — authorized file not uploaded yet',
    demo: true,
    addedAt: '2026-09-16',
    storagePath: 'library/books/data-structures-and-algorithms/dsa-quick-reference.pdf',
  },
]

export function getBook(id) {
  return BOOKS.find((book) => book.id === id) ?? null
}