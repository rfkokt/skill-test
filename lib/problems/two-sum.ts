// problems/two-sum.ts
import { Problem } from "./types";

export const twoSumProblem: Problem = {
  id: "two-sum",
  title: "Two Sum",
  difficulty: "Easy",
  language: "javascript",
  description:
    "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
  examples: [
    {
      input: "nums = [2,7,11,15], target = 9",
      output: "[0,1]",
      explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
    },
    {
      input: "nums = [3,2,4], target = 6",
      output: "[1,2]",
    },
    {
      input: "nums = [3,3], target = 6",
      output: "[0,1]",
    },
  ],
  constraints: [
    "2 ≤ nums.length ≤ 10⁴",
    "-10⁹ ≤ nums[i] ≤ 10⁹",
    "-10⁹ ≤ target ≤ 10⁹",
    "Only one valid answer exists.",
  ],
  tags: ["Array", "Hash Table"],
  estimatedTime: "60 min",
  requiresWebcam: true,
  languages: ["javascript"],
  verificationCode: "CODE123",
  requiresCoding: true,
  requiresVerificationCode: true,
  solutions: {
    javascript: {
      initialCodeTemplate:
        "function twoSum(nums, target) {\n  // Write your solution here\n}",
      testCases: [
        { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
        { input: [[3, 2, 4], 6], expected: [1, 2] },
        { input: [[3, 3], 6], expected: [0, 1] },
      ],
    },
  },
};
