import type { Resume } from './types.ts'

/**
 * Single source of truth for all site content.
 * The 3D OS apps, the 2D site, and SEO metadata all read from here.
 * Never add a phone number.
 */
export const resume: Resume = {
  profile: {
    name: 'Yuvraj Randhawa',
    initials: 'YR',
    headline: 'Computer Science @ University of Waterloo',
    location: 'Waterloo, ON',
    email: 'yuvdil123@gmail.com',
    links: {
      linkedin: 'https://www.linkedin.com/in/yuvraj-randhawa-18a609309/',
      github: 'https://github.com/yuvie123',
    },
    summary: [
      "I'm a Computer Science student at the University of Waterloo who likes building software that has to work in the real world.",
      "Most recently I was a backend engineer at Pioneer & Legend Canada, writing the checkout and inventory APIs that keep a store from overselling or double-charging. Before that I built Balance Track, a sensor insole for balance therapy that I tested with physicians.",
    ],
    resumePdf: null,
  },

  education: [
    {
      school: 'University of Waterloo',
      degree: 'Honours Bachelor of Computer Science',
      location: 'Waterloo, ON',
      start: '2026-09',
      end: '2031-04',
      courses: [
        { code: 'CS 135', name: 'Functional Programming' },
        { code: 'MATH 135', name: 'Algebra' },
        { code: 'MATH 137', name: 'Calculus 1' },
        { code: 'ECON 101', name: 'Microeconomics' },
        { code: 'COMMST 223', name: 'Public Speaking' },
      ],
    },
  ],

  experience: [
    {
      id: 'pioneer-legend',
      role: 'Backend Engineer',
      company: 'Pioneer & Legend Canada',
      location: 'Brampton, ON',
      start: '2026-06',
      end: '2026-08',
      summary: 'Checkout, inventory, and catalog APIs for an e-commerce storefront.',
      bullets: [
        "Built inventory APIs that hold stock when a cart is created and release it when the cart expires, so two customers checking out the same product at once can't oversell it and the storefront and CMS show the same counts.",
        "Checked discount eligibility on the server to reject invalid or stacked promo codes, and linked each payment to a unique order ID so a retried checkout doesn't charge twice.",
        'Wrote endpoints that sync product and pricing changes between the custom backend and the CMS, so catalog data no longer had to be re-entered by hand; mismatches get flagged instead of overwritten.',
      ],
      tech: [],
    },
  ],

  projects: [
    {
      slug: 'balance-track',
      name: 'Balance Track',
      tagline: 'A self-powered ESP32 sensor insole for vestibular balance therapy.',
      start: '2025-09',
      end: '2026-04',
      tech: ['ESP32', 'Arduino C++', 'MPU6050', 'BMP280', 'I2C', 'STL / 3D Printing'],
      metrics: [
        { value: '$121', label: 'one-time cost, vs $100–$200 per clinic session' },
        { value: '2', label: 'sensors read over I2C (MPU6050 + BMP280)' },
        { value: 'STL', label: 'corrective insole exported for 3D printing' },
      ],
      caseStudy: {
        problem:
          'Vestibular balance therapy usually means repeated clinic sessions at $100–$200 each. I wanted a device patients could own that measures how they walk and turns that into something that actually helps.',
        approach: [
          'Read the MPU6050 and BMP280 over I2C on a timer and corrected gyroscope drift several times per second, which kept orientation accurate for a full walk. Sensor data is saved to CSV in batches.',
          'Detected steps from acceleration peaks, counting each heel strike once.',
          'Mapped how far each step deviated onto a thickness map that exports as an STL file for a 3D-printed corrective insole.',
        ],
        results: [
          'Costs $121 once, compared with $100–$200 per clinic session.',
          'Tested with physicians, then redesigned the main parts based on their feedback.',
        ],
      },
    },
    {
      slug: 'cs50-ai',
      name: 'CS50 AI (Harvard)',
      tagline: 'Neural networks, constraint solving, and reinforcement learning projects.',
      start: '2025-06',
      end: '2025-08',
      tech: ['Python', 'TensorFlow / Keras', 'OpenCV', 'NumPy', 'scikit-learn'],
      metrics: [
        { value: '43', label: 'road-sign classes recognized by the CNN' },
        { value: '40%', label: 'of the data held out for testing' },
        { value: '10,000', label: 'self-play games to train the Nim AI' },
      ],
      caseStudy: {
        problem:
          "Harvard's CS50 AI course covers search, optimization, machine learning, and neural networks through hands-on projects. These are the three I'm proudest of.",
        approach: [
          'Trained a convolutional neural network in TensorFlow/Keras to classify road signs from all 43 categories of the German Traffic Sign Recognition Benchmark, tuning its layers to cut overfitting.',
          'Built a crossword generator that fills any grid from a word list, modeling it as a constraint satisfaction problem and solving it with arc consistency (AC-3) and backtracking search that uses heuristics to pick the next slot.',
          'Trained a Nim AI with Q-learning over 10,000 games against itself.',
        ],
        results: [
          'The sign classifier was evaluated on 40% of the data held out from training.',
          'The Nim AI plays competitively against people.',
        ],
      },
    },
  ],

  skills: [
    {
      label: 'Languages',
      items: ['Python', 'JavaScript', 'TypeScript', 'Java', 'SQL', 'HTML/CSS', 'Racket'],
    },
    {
      label: 'Frameworks & Libraries',
      items: ['React', 'Next.js', 'Node.js', 'Express', 'Tailwind CSS', 'Flask'],
    },
    {
      label: 'Developer Tools',
      items: ['Git', 'GitHub', 'Linux/Bash', 'Vercel', 'Postman', 'npm', 'VS Code'],
    },
    {
      label: 'Databases & APIs',
      items: ['PostgreSQL', 'Supabase', 'REST APIs', 'Claude API', 'OpenAI API'],
    },
  ],
}
