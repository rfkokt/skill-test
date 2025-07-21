// problems/longest-substring.ts
import { Problem } from "./types";

export const longestSubstringProblem: Problem = {
  id: "longest-substring",
  title: "Longest Substring Without Repeating Characters",
  difficulty: "Medium",
  language: "javascript",
  description:
    "Given a string `s`, find the length of the longest substring without repeating characters.",
  examples: [
    {
      input: `s = "abcabcbb"`,
      output: `3`,
      explanation: `The answer is "abc", with the length of 3.`,
    },
    {
      input: `s = "bbbbb"`,
      output: `1`,
      explanation: `The answer is "b", with the length of 1.`,
    },
    {
      input: `s = "pwwkew"`,
      output: `3`,
      explanation: `The answer is "wke", with the length of 3. Note that the answer is a substring, not subsequence.`,
    },
  ],
  constraints: [
    "0 <= s.length <= 5 * 10⁴",
    "s consists of English letters, digits, symbols and spaces.",
  ],
  tags: ["Hash Table", "String", "Sliding Window"],
  estimatedTime: "30 min",
  requiresWebcam: true,
  languages: ["javascript", "python"],
  verificationCode: "SUBSTR202",
  requiresCoding: true,
  requiresVerificationCode: true,
  solutions: {
    javascript: {
      initialCodeTemplate: `function lengthOfLongestSubstring(s) {
  // Write your solution here
}`,
      testCases: [
        { input: ["abcabcbb"], expected: 3 },
        { input: ["bbbbb"], expected: 1 },
        { input: ["pwwkew"], expected: 3 },
        { input: [" "], expected: 1 },
        { input: ["au"], expected: 2 },
      ],
    },
    python: {
      initialCodeTemplate: `def length_of_longest_substring(s):
    # Write your solution here
    pass`,
      testCases: [
        { input: ["abcabcbb"], expected: 3 },
        { input: ["bbbbb"], expected: 1 },
        { input: ["pwwkew"], expected: 3 },
        { input: [" "], expected: 1 },
        { input: ["au"], expected: 2 },
      ],
    },
  },
};
