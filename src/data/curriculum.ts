import { SubjectInfo, CurriculumChapter, QuizQuestion, SubjectId, ClassLevel } from '../types';

export const ALL_CLASSES: ClassLevel[] = [
  'Class 1',
  'Class 2',
  'Class 3',
  'Class 4',
  'Class 5',
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10',
];

export const SUBJECTS: SubjectInfo[] = [
  {
    id: 'mathematics',
    nameEn: 'Mathematics',
    nameBn: 'Mathematics',
    classes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    icon: 'Calculator',
    color: 'from-amber-500 to-orange-600',
    topics: [
      'Numbers & Arithmetic',
      'Fractions & Decimals',
      'Percentages & Profit-Loss',
      'Algebra & Equations',
      'Geometry & Angles',
      'Mensuration & Area',
      'Statistics & Mean',
      'Trigonometry',
    ],
  },
  {
    id: 'higher_mathematics',
    nameEn: 'Higher Mathematics',
    nameBn: 'Higher Mathematics',
    classes: [9, 10],
    icon: 'Sigma',
    color: 'from-indigo-600 to-violet-700',
    topics: [
      'Set and Function',
      'Algebraic Expressions',
      'Geometry & Vector',
      'Binomial Expansion',
      'Trigonometric Ratio',
      'Coordinate Geometry',
      'Probability',
      'Logarithm',
    ],
  },
  {
    id: 'science',
    nameEn: 'Science',
    nameBn: 'Science',
    classes: [1, 2, 3, 4, 5, 6, 7, 8],
    icon: 'Atom',
    color: 'from-emerald-500 to-teal-700',
    topics: [
      'Living & Non-Living Things',
      'Plants & Photosynthesis',
      'Human Body & Nutrition',
      'Force, Motion & Energy',
      'Light, Sound & Heat',
      'Matter & Environment',
      'Earth and Universe',
    ],
  },
  {
    id: 'physics',
    nameEn: 'Physics',
    nameBn: 'Physics',
    classes: [9, 10],
    icon: 'Zap',
    color: 'from-cyan-500 to-blue-700',
    topics: [
      'Motion & Velocity',
      "Force & Newton's Laws",
      'Work, Power & Energy',
      'States of Matter & Pressure',
      'Waves and Sound',
      'Light, Reflection & Refraction',
      'Current Electricity',
      'Magnetism',
    ],
  },
  {
    id: 'chemistry',
    nameEn: 'Chemistry',
    nameBn: 'Chemistry',
    classes: [9, 10],
    icon: 'FlaskConical',
    color: 'from-purple-500 to-pink-600',
    topics: [
      'Concepts of Chemistry',
      'States of Matter',
      'Structure of Atom',
      'Periodic Table',
      'Chemical Bonds',
      'Concept of Mole & Chemical Calculation',
      'Chemical Reactions',
      'Acids & Bases',
    ],
  },
  {
    id: 'biology',
    nameEn: 'Biology',
    nameBn: 'Biology',
    classes: [9, 10],
    icon: 'Dna',
    color: 'from-green-500 to-emerald-700',
    topics: [
      'Cell and Tissues',
      'Cell Division',
      'Bioenergetics & Photosynthesis',
      'Transport in Organisms',
      'Gaseous Exchange & Respiration',
      'Excretion & Human Kidney',
      'Heredity and Evolution',
    ],
  },
  {
    id: 'bangla',
    nameEn: 'Bangla',
    nameBn: 'Bangla',
    classes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    icon: 'BookOpenText',
    color: 'from-rose-500 to-red-600',
    topics: [
      'Grammar & Sentence Structure',
      'Vocabulary & Morphology',
      'Idioms & Proverbs',
      'Comprehension & Summary',
      'Literature & Critical Reading',
      'Essay & Formal Letter Writing',
    ],
  },
  {
    id: 'english',
    nameEn: 'English',
    nameBn: 'English',
    classes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    icon: 'Languages',
    color: 'from-blue-500 to-indigo-600',
    topics: [
      'Parts of Speech',
      'Tense & Right Form of Verbs',
      'Voice Change & Narration',
      'Transformation of Sentences',
      'Prepositions & Idioms',
      'Reading Comprehension & Vocabulary',
      'Paragraph & Formal Letters',
    ],
  },
  {
    id: 'ict',
    nameEn: 'ICT',
    nameBn: 'ICT',
    classes: [6, 7, 8, 9, 10],
    icon: 'Cpu',
    color: 'from-sky-500 to-blue-600',
    topics: [
      'Computer & Digital Devices',
      'Internet, Cyber Safety & Security',
      'Spreadsheet & Word Processing',
      'Basic Programming Logic',
      'Database Concepts',
      'Digital Technologies & Online Services',
    ],
  },
  {
    id: 'bangladesh_global_studies',
    nameEn: 'Bangladesh & Global Studies',
    nameBn: 'Bangladesh & Global Studies',
    classes: [3, 4, 5, 6, 7, 8, 9, 10],
    icon: 'Globe',
    color: 'from-amber-600 to-yellow-700',
    topics: [
      'History of Bangladesh Liberation War',
      'Geography & Natural Resources',
      'Society, Culture & Constitution',
      'Citizenship & Fundamental Rights',
      'Climate Change & Disaster Management',
    ],
  },
];

export const SAMPLE_CHAPTERS: CurriculumChapter[] = [
  {
    id: 'math-c8-ch2',
    titleBn: 'Profit and Simple Interest',
    titleEn: 'Profit and Simple Interest',
    classLevel: 'Class 8',
    subject: 'mathematics',
    keyConcepts: [
      'Principal (P = Initial Investment/Amount)',
      'Rate of Interest (r = Interest rate per annum)',
      'Time (n = Time period in years)',
      'Simple Interest Formula: I = Pnr',
      'Total Amount A = P + I = P(1 + nr)',
    ],
    formulas: [
      'I = P \\times n \\times r',
      'A = P + I = P(1 + nr)',
      'C = P(1 + r)^n \\text{ (Compound Capital)}',
    ],
    sampleQuestions: [
      'What is the simple interest on $3,000 for 5 years at an annual interest rate of 8%?',
      'At what annual rate of interest will a sum of money double in 8 years?',
    ],
  },
  {
    id: 'physics-c9-ch2',
    titleBn: 'Motion & Kinematics',
    titleEn: 'Motion and Kinematics',
    classLevel: 'Class 9',
    subject: 'physics',
    keyConcepts: [
      'Displacement and Distance',
      'Velocity and Acceleration',
      'Equations of Uniform Linear Motion',
      'Laws of Freely Falling Bodies under Gravity',
    ],
    formulas: [
      'v = u + at',
      's = \\left(\\frac{u + v}{2}\\right)t',
      's = ut + \\frac{1}{2}at^2',
      'v^2 = u^2 + 2as',
      'v = u + gt \\quad (\\text{Falling body})',
    ],
    sampleQuestions: [
      'A car accelerates from rest with a uniform acceleration of $2\\text{ m/s}^2$ for $10\\text{ s}$. Find its final velocity and total distance traveled.',
      'A cricket ball is thrown vertically upward with a velocity of $20\\text{ m/s}$. What is the maximum height it will reach?',
    ],
  },
  {
    id: 'science-c7-ch4',
    titleBn: 'Plant Nutrition & Photosynthesis',
    titleEn: 'Plant Nutrition & Photosynthesis',
    classLevel: 'Class 7',
    subject: 'science',
    keyConcepts: [
      'Definition of Photosynthesis and Site (Chloroplasts)',
      'Essential elements: Sunlight, Carbon dioxide, Water, and Chlorophyll',
      'Chemical reaction and oxygen production',
      'Balancing oxygen and carbon dioxide in the ecosystem',
    ],
    formulas: [
      '6CO_2 + 12H_2O \\xrightarrow[\\text{Chlorophyll}]{\\text{Light}} C_6H_{12}O_6 + 6H_2O + 6O_2',
    ],
    sampleQuestions: [
      'What is photosynthesis? Write down its balanced chemical equation.',
      'Why is it unhealthy to sleep directly under dense trees at night?',
    ],
  },
];

// Pre-defined rich demo responses for when running offline / without an API key
export const DEMO_RESPONSES: Record<string, string> = {
  fraction: `### Fractions — Simplified Concept & Step-by-Step Guide

A fraction represents **an equal part of a whole quantity or item**.

---

#### 1. Intuitive Real-Life Example
Imagine you have a fresh **pizza** or **flatbread**. You slice it evenly into **4 equal parts**:
* You eat **1 slice**.
* What fraction of the total pizza did you eat? $\\frac{1}{4}$ (one out of four parts).

Here:
* **Top Number (Numerator):** The number of parts taken or considered ($1$)
* **Bottom Number (Denominator):** The total number of equal parts in the whole ($4$)

---

#### 2. Three Fundamental Types of Fractions
1. **Proper Fraction:** Numerator is smaller than Denominator. Examples: $\\frac{2}{5}, \\frac{3}{7}$
2. **Improper Fraction:** Numerator is equal to or greater than Denominator. Examples: $\\frac{7}{4}, \\frac{5}{3}$
3. **Mixed Fraction:** A whole number combined with a proper fraction. Example: $1\\frac{3}{4}$

---

#### 3. Step-by-Step Addition with Like Denominators
Let us add $\\frac{1}{4} + \\frac{2}{4}$:
* Since the denominators (bottom numbers) are identical ($4$), keep the denominator as $4$ and add the numerators directly:
$$\\frac{1 + 2}{4} = \\frac{3}{4}$$

---

#### 4. Practice Challenge for You
> **Question:** A guava is cut into 5 equal slices. Abir eats 2 slices. What fraction of the guava did Abir eat?
*(Feel free to reply with your answer in chat, and I will check it for you!)*`,

  algebra: `### Solving Linear Algebraic Equations (Step-by-Step)

Let us solve the linear equation: $3x + 7 = 25$

---

### Given
Equation: $$3x + 7 = 25$$

### Required
Find the value of the unknown variable $x$.

---

### Solution (Step-by-Step)

* **Step 1: Isolate the variable term by transposing constants**
Subtract $7$ from both sides of the equation:
$$3x = 25 - 7$$
$$3x = 18$$

* **Step 2: Divide by the coefficient of the variable**
Divide both sides by $3$:
$$x = \\frac{18}{3}$$
$$x = 6$$

---

### Final Answer
The required solution is: $$x = 6$$

---

### Verification (Check)
Left-Hand Side (LHS) $= 3(6) + 7 = 18 + 7 = 25$
Right-Hand Side (RHS) $= 25$
$\\therefore \\text{LHS} = \\text{RHS}$ (Our solution is 100% verified and correct!)`,

  photosynthesis: `### Photosynthesis — Core Science Lesson

#### 1. Definition
Photosynthesis is the biochemical process by which green plants, in the presence of sunlight and chlorophyll, utilize water ($H_2O$) and carbon dioxide ($CO_2$) to synthesize carbohydrates/glucose ($C_6H_{12}O_6$) and release oxygen ($O_2$) as a vital byproduct.

---

#### 2. Balanced Chemical Equation
$$6CO_2 + 12H_2O \\xrightarrow[\\text{Chlorophyll}]{\\text{Sunlight}} C_6H_{12}O_6 + 6H_2O + 6O_2 \\uparrow$$

---

#### 3. Four Essential Elements
1. **Sunlight:** The fundamental source of light and radiant energy.
2. **Chlorophyll:** The green pigment located in leaf chloroplasts that absorbs solar energy.
3. **Water ($H_2O$):** Absorbed from the soil through root hairs.
4. **Carbon Dioxide ($CO_2$):** Absorbed from atmospheric air via stomatal pores in leaves.

---

#### 4. Ecological & Human Significance
* Produces nearly all the **oxygen** required for respiration by living organisms.
* Absorbs greenhouse carbon dioxide from the atmosphere, maintaining planetary climate balance.

---

#### 5. Common Misconception
❌ **Misconception:** Photosynthesis continues at the same rate during the night.
✅ **Fact:** The light-dependent phase strictly requires sunlight, so active photosynthesis occurs primarily during daylight hours.`,

  grammar: `### Right Form of Verbs & Tense — English Grammar Masterclass

Let's master the foundation of English sentences easily.

---

#### Rule 1: Subject-Verb Agreement (Third Person Singular)
When the subject is **3rd Person Singular Number** (He, She, It, Rahat, Rina) and the sentence is in **Present Indefinite Tense**, add **-s / -es** to the base verb.

* ❌ Incorrect: *He go to school every day.*
* ✅ Correct: **He goes to school every day.**
* ❌ Incorrect: *The sun rise in the east.*
* ✅ Correct: **The sun rises in the east.**

---

#### Rule 2: Universal Truth & Habitual Fact
Universal truths and natural laws always remain in the Simple Present Tense.
* Example: **Water boils at 100°C.**
* Example: **The earth moves around the sun.**

---

#### Rule 3: Modal Auxiliaries
After modal verbs (**can, could, may, might, should, must, will, shall**), the main verb is always in its **Base Form ($V_1$)**.
* ✅ You **should respect** your teachers. (Not *respects* or *respected*)
* ✅ She **can solve** this math problem.

---

#### Practice Challenge for You:
Fill in the blank:
> *Rafi always ______ (read) the newspaper in the morning.*
*(Reply in chat to check your answer!)*`,
};

export const PRESET_QUIZZES: Record<string, QuizQuestion[]> = {
  mathematics: [
    {
      id: 'm1',
      question: 'If $2x + 6 = 14$, what is the value of $x$?',
      options: ['3', '4', '5', '8'],
      correctIndex: 1,
      explanation: 'Solution: $2x = 14 - 6 \\implies 2x = 8 \\implies x = 4$.',
      topic: 'Algebra',
      difficulty: 'easy',
    },
    {
      id: 'm2',
      question: 'In a right-angled triangle, if perpendicular is $3\\text{ cm}$ and base is $4\\text{ cm}$, what is the hypotenuse?',
      options: ['5 cm', '6 cm', '7 cm', '25 cm'],
      correctIndex: 0,
      explanation: 'By Pythagorean Theorem: $\\text{Hypotenuse}^2 = 3^2 + 4^2 = 9 + 16 = 25 \\implies \\text{Hypotenuse} = 5\\text{ cm}$.',
      topic: 'Geometry',
      difficulty: 'medium',
    },
    {
      id: 'm3',
      question: 'What is the simple interest on 1,000 taka for 3 years at 5% per annum?',
      options: ['50 Taka', '100 Taka', '150 Taka', '200 Taka'],
      correctIndex: 2,
      explanation: 'Formula: $I = Pnr = 1000 \\times 3 \\times \\frac{5}{100} = 150$ Taka.',
      topic: 'Arithmetic & Percentage',
      difficulty: 'medium',
    },
    {
      id: 'm4',
      question: 'What is the value of $\\frac{3}{5} + \\frac{2}{10}$?',
      options: ['$\\frac{5}{15}$', '$\\frac{4}{5}$', '$\\frac{1}{2}$', '$\\frac{5}{10}$'],
      correctIndex: 1,
      explanation: 'LCM is $10$. Therefore $\\frac{6 + 2}{10} = \\frac{8}{10} = \\frac{4}{5}$.',
      topic: 'Fractions',
      difficulty: 'easy',
    },
  ],
  science: [
    {
      id: 's1',
      question: 'Which gas is released by green plants as a byproduct during photosynthesis?',
      options: ['Carbon Dioxide ($CO_2$)', 'Oxygen ($O_2$)', 'Nitrogen ($N_2$)', 'Methane ($CH_4$)'],
      correctIndex: 1,
      explanation: 'Plants consume $CO_2$ and split water molecules to release oxygen ($O_2$) into the atmosphere.',
      topic: 'Plant Science',
      difficulty: 'easy',
    },
    {
      id: 's2',
      question: "Which physical quantity's formula is derived from Newton's Second Law of Motion?",
      options: ['Velocity', 'Work', 'Force ($F = ma$)', 'Power'],
      correctIndex: 2,
      explanation: "Newton's second law states that the rate of change of momentum is proportional to applied force ($F = ma$).",
      topic: 'Physics',
      difficulty: 'medium',
    },
    {
      id: 's3',
      question: 'In the human body, which organ filters blood and removes waste urea as urine?',
      options: ['Heart', 'Lungs', 'Kidneys', 'Liver'],
      correctIndex: 2,
      explanation: 'The kidneys filter metabolic wastes from blood to form urine and maintain bodily fluid equilibrium.',
      topic: 'Biology',
      difficulty: 'medium',
    },
  ],
  english: [
    {
      id: 'e1',
      question: 'Identify the correct sentence in Present Indefinite Tense:',
      options: [
        'He go to school every day.',
        'He is going to school every day.',
        'He goes to school every day.',
        'He gone to school every day.',
      ],
      correctIndex: 2,
      explanation: 'Third-person singular subjects (He, She, It) take -s/-es with the base verb in Present Indefinite.',
      topic: 'Right Form of Verbs',
      difficulty: 'easy',
    },
    {
      id: 'e2',
      question: 'What is the passive form of "He plays cricket"?',
      options: [
        'Cricket played by him.',
        'Cricket is played by him.',
        'Cricket was played by him.',
        'Cricket is playing by him.',
      ],
      correctIndex: 1,
      explanation: 'Present Simple Passive = Object + am/is/are + V3 + by + Subject. Hence, "Cricket is played by him."',
      topic: 'Voice Change',
      difficulty: 'medium',
    },
  ],
};
