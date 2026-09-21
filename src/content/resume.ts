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
      "I'm a Computer Science student at the University of Waterloo who likes building software that has to work in the real world, from firmware on a sensor insole to inference-time compression of large language models.",
      'Right now I am researching how compressible each SwiGLU projection is inside open LLMs. Before that I placed top 100 globally in the HRT × Partcl chip placement challenge, built the inventory and checkout backend at Pioneer & Legend Canada, and made Balance Track, a gait-recording insole developed with a physician.',
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
        { code: 'CS 135', name: 'Functional Programming (Racket)' },
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
      role: 'Software Developer Intern',
      company: 'Pioneer & Legend Canada',
      location: 'Toronto, ON',
      start: '2026-06',
      end: '2026-08',
      summary: 'Inventory, order and checkout services for an e-commerce storefront with 500+ products.',
      bullets: [
        'Replaced separate sales and shipping stock counts with one inventory service for 500+ products by designing the product, inventory, order and shipment tables and the 12 Python API endpoints every order flows through.',
        'Cut last-unit overselling to zero by adding 15-minute cart reservations that move a unit from available to reserved inside a single database transaction at add-to-cart and release it automatically when the hold expires.',
        'Made checkout safe to retry across 2,000+ orders by giving every payment a unique order ID enforced by a database constraint, so a resubmitted checkout is rejected at the database instead of charging the customer twice.',
      ],
      tech: ['Python', 'SQL', 'REST APIs'],
    },
  ],

  projects: [
    {
      slug: 'thin-gate-glu',
      name: 'Thin-Gate GLU',
      tagline: 'Research on which SwiGLU projection survives low-rank compression best. To be submitted to CPAL 2027.',
      dates: { start: '2026-09', end: null },
      tech: ['PyTorch', 'Hugging Face Transformers', 'SVD', 'WikiText-2', 'Kaggle T4'],
      metrics: [
        { value: '41 / 42', label: 'equal-rank settings where the gate beat the up-projection' },
        { value: '7', label: 'open LLMs tested, up to 1.7B parameters' },
        { value: '63k', label: 'tokens per second on Kaggle T4s in float32' },
      ],
      caseStudy: {
        problem:
          'SwiGLU feed-forward blocks have three projections: gate, up and down. If one of them tolerates a low-rank approximation much better than the others, that is where a compression budget should go. Nobody had measured it head to head at equal rank.',
        approach: [
          'Truncated each projection with plain and whitened SVD across 6 rank fractions in 7 open LLMs up to 1.7B parameters, and scored every variant on WikiText-2 perplexity.',
          'Kept comparisons fair by matching parameter counts within 1.5% between the projections being compared.',
          'Guarded the code with 6 PyTorch tests, including exact full-rank reconstruction and causal masking, then ran the full sweep in float32 on Kaggle T4s at 63k tokens/s.',
        ],
        results: [
          'The gate is the most compressible SwiGLU projection, beating the up-projection in 41 of 42 equal-rank settings.',
          'The advantage is rank-dependent: the gate is most tolerant in all 7 models at half rank, but the down-projection overtakes it in 5 of 7 models below quarter rank.',
        ],
      },
    },
    {
      slug: 'hrt-partcl-macro-placement',
      name: 'HRT × Partcl Macro Placement Challenge',
      tagline: 'A GNN + RL chip placement pipeline for 200,000+ node circuits. Top 100 globally.',
      dates: { label: 'Top 100 globally' },
      tech: ['PyTorch', 'GNN', 'Reinforcement Learning', 'NVIDIA DREAMPlace', 'AutoDMP'],
      metrics: [
        { value: 'Top 100', label: 'globally in the challenge' },
        { value: '24.7%', label: 'lower proxy cost than the simulated-annealing baseline' },
        { value: '0', label: 'macro overlaps on all 17 IBM ICCAD04 benchmarks' },
      ],
      caseStudy: {
        problem:
          'Macro placement decides where the big blocks on a chip go. A bad placement inflates wirelength and congestion, and any overlap between macros is an outright failure. The challenge scored placements on the 17 IBM ICCAD04 benchmarks with the official TILOS evaluator.',
        approach: [
          'Encoded each netlist as a heterogeneous tripartite graph of macros, nets and ports, with KNN spatial edges so the model could see congestion while placing.',
          'Trained a graph neural network policy with reinforcement learning, optimizing it directly against the official TILOS proxy cost of wirelength, density and congestion.',
          'Integrated AutoDMP on NVIDIA DREAMPlace as a GPU legalization pass that removes overlaps and tightens wirelength in about 72 seconds per design.',
        ],
        results: [
          'Beat the simulated-annealing baseline by 24.7% on average proxy cost across all 17 benchmarks.',
          'Delivered zero macro overlaps on every benchmark, the hard constraint, and placed top 100 globally.',
        ],
      },
    },
    {
      slug: 'balance-track',
      name: 'Balance Track',
      tagline: 'A gait-recording ESP32 insole for people with vestibular disorders, built with a physician.',
      dates: { start: '2025-09', end: '2026-04' },
      tech: ['ESP32', 'Arduino C++', 'I2C', 'MPU6050', 'BMP280', 'Python', 'NumPy/SciPy', 'pytest', 'STL / 3D Printing'],
      metrics: [
        { value: '1.2M+', label: 'samples from 20 physician-reviewed sessions' },
        { value: '100 Hz', label: 'IMU and pressure sampling over I2C' },
        { value: '28', label: 'pytest tests on simulated gaits' },
      ],
      caseStudy: {
        problem:
          'People with vestibular disorders walk differently, but that difference is usually only measured in a clinic. Guided by a physician in Fresno, California, I wanted a device patients could wear that records how they walk and turns it into a corrective insole.',
        approach: [
          'Wrote ESP32 firmware in C++ that reads an MPU6050 and BMP280 over I2C at 100 Hz, fuses gyro and accelerometer with a complementary filter after a 2-second bias calibration, and streams sessions over WiFi.',
          'Built a Python pipeline that detects heel strikes with a Butterworth low-pass filter and an adaptive two-cluster threshold, then z-scores cadence, stride-time variability and foot roll against height- and weight-scaled norms.',
          'Mapped each abnormal metric to a 3–12 mm thickness rule (arch bump, heel wedge, heel rim) and meshed the result into a watertight binary STL for 3D printing.',
        ],
        results: [
          'Turned 1.2M+ samples from 20 physician-reviewed sessions into per-stride gait metrics.',
          'The full pipeline, from raw samples to printable insole, is verified by 28 pytest tests on simulated gaits.',
        ],
      },
    },
    {
      slug: 'cs50-ai',
      name: 'CS50 AI (Harvard)',
      tagline: 'Neural networks, constraint solving, and reinforcement learning projects.',
      dates: { start: '2025-06', end: '2025-08' },
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
      items: ['Python', 'C++ (Arduino)', 'C', 'Java', 'JavaScript', 'HTML/CSS', 'SQL'],
    },
    {
      label: 'Frameworks & Libraries',
      items: ['NumPy', 'SciPy', 'PyTorch', 'Hugging Face Transformers', 'Flask', 'SQLite'],
    },
    {
      label: 'Robotics & Embedded',
      items: ['ROS 2 (Humble)', 'Gazebo', 'Foxglove', 'ESP32', 'Arduino IDE', 'I2C', 'IMU sensor fusion (MPU6050)', 'BMP280', '3D printing (STL)'],
    },
    {
      label: 'Tools',
      items: ['Git/GitHub', 'Docker', 'pytest', 'Valgrind', 'Cursor', 'Claude Code'],
    },
  ],
}
