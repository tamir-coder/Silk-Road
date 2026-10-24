export interface ILearningStep {
  id: string;
  title: string;
  description: string;
  minutes: number;
  activity: string;
}

export interface ILearningSubject {
  id: string;
  name: string;
  description: string;
  gradeRange: string;
  hours: number;
  steps: ILearningStep[];
}

const cleanTopic = (line: string) =>
  line
    .replace(/^\s*(?:#{1,6}\s*|[-*+]\s+|\d+[.)]\s*)/, "")
    .replace(/\s+/g, " ")
    .replace(/[.!?]+$/, "")
    .trim();

/** Build a small, ordered study path from headings and meaningful note lines. */
export const buildStepsFromStudyNotes = (content: string): ILearningStep[] => {
  const lines = content
    .replace(/\r/g, "")
    .split("\n")
    .map(cleanTopic)
    .filter((line) => line.length >= 4 && line.length <= 140);
  const topics = [...new Set(lines)].slice(0, 8);
  const fallbacks = content
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map(cleanTopic)
    .filter((line) => line.length >= 12 && line.length <= 140);
  const selectedTopics = topics.length >= 2 ? topics : [...new Set(fallbacks)].slice(0, 8);

  return selectedTopics.map((title, index) => ({
    id: `notes-${index + 1}-${
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .slice(0, 48) || "topic"
    }`,
    title,
    description: `Review this idea from your uploaded notes: ${title}.`,
    minutes: 15 + Math.min(20, Math.ceil(title.length / 8)),
    activity: `Explain “${title}” in your own words, then find one example in your notes.`,
  }));
};

export const LEARNING_SUBJECTS: ILearningSubject[] = [
  {
    id: "mathematics",
    name: "Mathematics",
    description: "Build confidence with numbers, equations, and graphs.",
    gradeRange: "Grades 6–12",
    hours: 6,
    steps: [
      {
        id: "math-number-sense",
        title: "Number sense",
        description: "Get comfortable with integers, factors, and multiples.",
        minutes: 25,
        activity: "Practice comparing and simplifying numbers.",
      },
      {
        id: "math-fractions",
        title: "Fractions & percentages",
        description: "Connect fractions, decimals, ratios, and percentages.",
        minutes: 30,
        activity: "Work through everyday ratio and percentage problems.",
      },
      {
        id: "math-expressions",
        title: "Expressions",
        description: "Use order of operations and simplify expressions.",
        minutes: 30,
        activity: "Translate a few word problems into expressions.",
      },
      {
        id: "math-equations",
        title: "Solve equations",
        description: "Find unknown values while keeping both sides balanced.",
        minutes: 35,
        activity: "Solve one-step, then two-step equations.",
      },
      {
        id: "math-graphs",
        title: "Graphs & patterns",
        description: "Read coordinates and spot how values change together.",
        minutes: 35,
        activity: "Plot a simple pattern and explain what it shows.",
      },
    ],
  },
  {
    id: "english",
    name: "English",
    description: "Strengthen grammar, vocabulary, reading, and writing.",
    gradeRange: "Grades 5–12",
    hours: 5,
    steps: [
      {
        id: "english-sentences",
        title: "Sentence foundations",
        description: "Recognize subjects, verbs, and complete thoughts.",
        minutes: 25,
        activity: "Build clear sentences from a set of words.",
      },
      {
        id: "english-tenses",
        title: "Verb tenses",
        description: "Choose the right tense to show when something happens.",
        minutes: 30,
        activity: "Rewrite a short story in the past and present.",
      },
      {
        id: "english-vocabulary",
        title: "Vocabulary in context",
        description: "Use context clues and word parts to understand new words.",
        minutes: 25,
        activity: "Guess unfamiliar words before checking a dictionary.",
      },
      {
        id: "english-reading",
        title: "Reading for meaning",
        description: "Find the main idea and support it with evidence.",
        minutes: 35,
        activity: "Summarize a short passage in two sentences.",
      },
      {
        id: "english-writing",
        title: "Clear paragraphs",
        description: "Organize a topic sentence, evidence, and explanation.",
        minutes: 35,
        activity: "Write one focused paragraph and revise it.",
      },
    ],
  },
  {
    id: "physics",
    name: "Physics",
    description: "Make sense of motion, forces, energy, and circuits.",
    gradeRange: "Grades 8–12",
    hours: 6,
    steps: [
      {
        id: "physics-measurements",
        title: "Units & measurement",
        description: "Read quantities, units, and simple scientific notation.",
        minutes: 25,
        activity: "Convert measurements and label every answer.",
      },
      {
        id: "physics-motion",
        title: "Describing motion",
        description: "Connect distance, time, speed, and simple graphs.",
        minutes: 30,
        activity: "Compare the motion of two objects from a graph.",
      },
      {
        id: "physics-forces",
        title: "Forces",
        description: "Understand balanced forces and changes in motion.",
        minutes: 35,
        activity: "Draw a force diagram for an everyday object.",
      },
      {
        id: "physics-energy",
        title: "Energy transfers",
        description: "Track how energy changes form and moves between objects.",
        minutes: 30,
        activity: "Map the energy changes in a familiar device.",
      },
      {
        id: "physics-circuits",
        title: "Simple circuits",
        description: "Explore current, voltage, and components in a circuit.",
        minutes: 35,
        activity: "Sketch a circuit and predict what happens when it changes.",
      },
    ],
  },
  {
    id: "chemistry",
    name: "Chemistry",
    description: "Understand atoms, the periodic table, and reactions.",
    gradeRange: "Grades 8–12",
    hours: 6,
    steps: [
      {
        id: "chem-matter",
        title: "Matter & particles",
        description: "Compare solids, liquids, and gases using a particle model.",
        minutes: 25,
        activity: "Explain a change of state with a particle sketch.",
      },
      {
        id: "chem-atoms",
        title: "Atoms & elements",
        description: "Identify protons, neutrons, electrons, and elements.",
        minutes: 30,
        activity: "Read the information in a periodic-table square.",
      },
      {
        id: "chem-periodic",
        title: "Periodic patterns",
        description: "Find groups, periods, and patterns in element properties.",
        minutes: 30,
        activity: "Compare two elements from the same group.",
      },
      {
        id: "chem-bonding",
        title: "How atoms bond",
        description: "Explore why atoms form simple ionic and covalent bonds.",
        minutes: 35,
        activity: "Draw a simple model of a molecule or ionic compound.",
      },
      {
        id: "chem-reactions",
        title: "Chemical reactions",
        description: "Recognize reactants, products, and conservation of atoms.",
        minutes: 35,
        activity: "Balance a simple reaction by counting each atom.",
      },
    ],
  },
  {
    id: "biology",
    name: "Biology",
    description: "Explore cells, living systems, and ecosystems.",
    gradeRange: "Grades 6–12",
    hours: 5,
    steps: [
      {
        id: "biology-life",
        title: "What makes something living?",
        description: "Recognize shared characteristics of living things.",
        minutes: 20,
        activity: "Sort examples and explain your reasoning.",
      },
      {
        id: "biology-cells",
        title: "Cells",
        description: "Identify cell structures and what they help a cell do.",
        minutes: 30,
        activity: "Label a cell and connect each part to its job.",
      },
      {
        id: "biology-systems",
        title: "Body systems",
        description: "See how groups of organs work together.",
        minutes: 30,
        activity: "Trace how oxygen moves through the body.",
      },
      {
        id: "biology-genetics",
        title: "Inheritance",
        description: "Explore how traits are passed from parents to offspring.",
        minutes: 30,
        activity: "Use a simple model to predict possible traits.",
      },
      {
        id: "biology-ecosystems",
        title: "Ecosystems",
        description: "Connect organisms through food webs and their environment.",
        minutes: 30,
        activity: "Draw a food web and predict one change to it.",
      },
    ],
  },
  {
    id: "mongolian",
    name: "Mongolian language",
    description: "Practice reading, grammar, and expressing ideas clearly.",
    gradeRange: "Grades 5–12",
    hours: 5,
    steps: [
      {
        id: "mongolian-reading",
        title: "Read with purpose",
        description: "Find the topic, main idea, and details in a passage.",
        minutes: 25,
        activity: "Write the main idea of a short passage in one sentence.",
      },
      {
        id: "mongolian-words",
        title: "Word classes",
        description: "Recognize how nouns, verbs, and modifiers work in a sentence.",
        minutes: 25,
        activity: "Mark the important word classes in a paragraph.",
      },
      {
        id: "mongolian-sentences",
        title: "Sentence structure",
        description: "Build clear sentences and connect ideas logically.",
        minutes: 30,
        activity: "Combine short sentences without changing their meaning.",
      },
      {
        id: "mongolian-evidence",
        title: "Explain with evidence",
        description: "Support an interpretation with details from a text.",
        minutes: 30,
        activity: "Choose a detail and explain how it supports your idea.",
      },
      {
        id: "mongolian-writing",
        title: "Plan & write",
        description: "Organize a beginning, supporting ideas, and a conclusion.",
        minutes: 35,
        activity: "Plan and draft a short response to a prompt.",
      },
    ],
  },
];

export const getLearningSubject = (subjectId: string) =>
  LEARNING_SUBJECTS.find((subject) => subject.id === subjectId);
