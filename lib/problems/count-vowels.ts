// problems/count-vowels.ts
import { Problem } from "./types";

export const countVowelsProblem: Problem = {
  id: "count-vowels",
  title: "Count Vowels in a String",
  difficulty: "Easy",
  language: "javascript",
  description:
    "Given a string `s`, return the number of vowels ('a', 'e', 'i', 'o', 'u') in it. The comparison should be case-insensitive.",
  examples: [
    {
      input: `s = "hello"`,
      output: `2`,
      explanation: `The vowels are 'e' and 'o'.`,
    },
    {
      input: `s = "Programming"`,
      output: `4`,
      explanation: `The vowels are 'o', 'a', 'i', 'i'.`,
    },
    {
      input: `s = "Rhythm"`,
      output: `0`,
      explanation: `There are no vowels in "Rhythm".`,
    },
  ],
  constraints: [
    "0 <= s.length <= 1000",
    "s consists of English letters, digits, symbols and spaces.",
  ],
  tags: ["String", "JavaScript", "Loop"],
  estimatedTime: "15 min",
  requiresWebcam: false,
  languages: ["javascript"],
  verificationCode: "VOWEL101",
  requiresCoding: true,
  requiresVerificationCode: true,
  solutions: {
    javascript: {
      initialCodeTemplate: `function countVowels(s) {
  // Write your solution here
}`,
      testCases: [
        { input: ["hello"], expected: 2 },
        { input: ["Programming"], expected: 4 },
        { input: ["Rhythm"], expected: 0 },
        { input: ["AEIOU"], expected: 5 },
        { input: [""], expected: 0 },
      ],
    },
  },
};
