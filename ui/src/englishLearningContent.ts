type EnglishStepCopy = {
  title: string;
  description: string;
  activity: string;
};

type EnglishSubjectCopy = {
  name: string;
  description: string;
  gradeRange: string;
  steps: Record<string, EnglishStepCopy>;
};

export const ENGLISH_LEARNING_CONTENT: Record<string, EnglishSubjectCopy> = {
  mathematics: {
    name: "Mathematics",
    description: "Build confidence with numbers, equations, and graphs.",
    gradeRange: "Grades 6–12",
    steps: {
      "math-number-sense": {
        title: "Number sense",
        description: "Get comfortable with integers, factors, and multiples.",
        activity: "Practice comparing and simplifying numbers.",
      },
      "math-fractions": {
        title: "Fractions & percentages",
        description: "Connect fractions, decimals, ratios, and percentages.",
        activity: "Work through everyday ratio and percentage problems.",
      },
      "math-expressions": {
        title: "Expressions",
        description: "Use order of operations and simplify expressions.",
        activity: "Translate a few word problems into expressions.",
      },
      "math-equations": {
        title: "Solve equations",
        description: "Find unknown values while keeping both sides balanced.",
        activity: "Solve one-step, then two-step equations.",
      },
      "math-graphs": {
        title: "Graphs & patterns",
        description: "Read coordinates and spot how values change together.",
        activity: "Plot a simple pattern and explain what it shows.",
      },
    },
  },
  english: {
    name: "English",
    description: "Strengthen grammar, vocabulary, reading, and writing.",
    gradeRange: "Grades 5–12",
    steps: {
      "english-sentences": {
        title: "Sentence foundations",
        description: "Recognize subjects, verbs, and complete thoughts.",
        activity: "Build clear sentences from a set of words.",
      },
      "english-tenses": {
        title: "Verb tenses",
        description: "Choose the right tense to show when something happens.",
        activity: "Rewrite a short story in the past and present.",
      },
      "english-vocabulary": {
        title: "Vocabulary in context",
        description: "Use context clues and word parts to understand new words.",
        activity: "Guess unfamiliar words before checking a dictionary.",
      },
      "english-reading": {
        title: "Reading for meaning",
        description: "Find the main idea and support it with evidence.",
        activity: "Summarize a short passage in two sentences.",
      },
      "english-writing": {
        title: "Clear paragraphs",
        description: "Organize a topic sentence, evidence, and explanation.",
        activity: "Write one focused paragraph and revise it.",
      },
    },
  },
  physics: {
    name: "Physics",
    description: "Make sense of motion, forces, energy, and circuits.",
    gradeRange: "Grades 8–12",
    steps: {
      "physics-measurements": {
        title: "Units & measurement",
        description: "Read quantities, units, and simple scientific notation.",
        activity: "Convert measurements and label every answer.",
      },
      "physics-motion": {
        title: "Describing motion",
        description: "Connect distance, time, speed, and simple graphs.",
        activity: "Compare the motion of two objects from a graph.",
      },
      "physics-forces": {
        title: "Forces",
        description: "Understand balanced forces and changes in motion.",
        activity: "Draw a force diagram for an everyday object.",
      },
      "physics-energy": {
        title: "Energy transfers",
        description: "Track how energy changes form and moves between objects.",
        activity: "Map the energy changes in a familiar device.",
      },
      "physics-circuits": {
        title: "Simple circuits",
        description: "Explore current, voltage, and components in a circuit.",
        activity: "Sketch a circuit and predict what happens when it changes.",
      },
    },
  },
  chemistry: {
    name: "Chemistry",
    description: "Understand atoms, the periodic table, and reactions.",
    gradeRange: "Grades 8–12",
    steps: {
      "chem-matter": {
        title: "Matter & particles",
        description: "Compare solids, liquids, and gases using a particle model.",
        activity: "Explain a change of state with a particle sketch.",
      },
      "chem-atoms": {
        title: "Atoms & elements",
        description: "Identify protons, neutrons, electrons, and elements.",
        activity: "Read the information in a periodic-table square.",
      },
      "chem-periodic": {
        title: "Periodic patterns",
        description: "Find groups, periods, and patterns in element properties.",
        activity: "Compare two elements from the same group.",
      },
      "chem-bonding": {
        title: "How atoms bond",
        description: "Explore why atoms form simple ionic and covalent bonds.",
        activity: "Draw a simple model of a molecule or ionic compound.",
      },
      "chem-reactions": {
        title: "Chemical reactions",
        description: "Recognize reactants, products, and conservation of atoms.",
        activity: "Balance a simple reaction by counting each atom.",
      },
    },
  },
  biology: {
    name: "Biology",
    description: "Explore cells, living systems, and ecosystems.",
    gradeRange: "Grades 6–12",
    steps: {
      "biology-life": {
        title: "What makes something living?",
        description: "Recognize shared characteristics of living things.",
        activity: "Sort examples and explain your reasoning.",
      },
      "biology-cells": {
        title: "Cells",
        description: "Identify cell structures and what they help a cell do.",
        activity: "Label a cell and connect each part to its job.",
      },
      "biology-systems": {
        title: "Body systems",
        description: "See how groups of organs work together.",
        activity: "Trace how oxygen moves through the body.",
      },
      "biology-genetics": {
        title: "Inheritance",
        description: "Explore how traits are passed from parents to offspring.",
        activity: "Use a simple model to predict possible traits.",
      },
      "biology-ecosystems": {
        title: "Ecosystems",
        description: "Connect organisms through food webs and their environment.",
        activity: "Draw a food web and predict one change to it.",
      },
    },
  },
  mongolian: {
    name: "Mongolian language",
    description: "Practice reading, grammar, and expressing ideas clearly.",
    gradeRange: "Grades 5–12",
    steps: {
      "mongolian-reading": {
        title: "Read with purpose",
        description: "Find the topic, main idea, and details in a passage.",
        activity: "Write the main idea of a short passage in one sentence.",
      },
      "mongolian-words": {
        title: "Word classes",
        description: "Recognize how nouns, verbs, and modifiers work in a sentence.",
        activity: "Mark the important word classes in a paragraph.",
      },
      "mongolian-sentences": {
        title: "Sentence structure",
        description: "Build clear sentences and connect ideas logically.",
        activity: "Combine short sentences without changing their meaning.",
      },
      "mongolian-evidence": {
        title: "Explain with evidence",
        description: "Support an interpretation with details from a text.",
        activity: "Choose a detail and explain how it supports your idea.",
      },
      "mongolian-writing": {
        title: "Plan & write",
        description: "Organize a beginning, supporting ideas, and a conclusion.",
        activity: "Plan and draft a short response to a prompt.",
      },
    },
  },
};
