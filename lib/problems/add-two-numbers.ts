// problems/add-two-numbers.ts
import { Problem } from "./types";

export const addTwoNumbersProblem: Problem = {
  id: "add-two-numbers",
  title: "Add Two Numbers",
  difficulty: "Medium",
  language: "javascript",
  description:
    "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.\n\nYou may assume the two numbers do not contain any leading zero, except the number 0 itself.",
  examples: [
    {
      input: "l1 = [2,4,3], l2 = [5,6,4]",
      output: "[7,0,8]",
      explanation: "342 + 465 = 807.",
    },
  ],
  constraints: [
    "The number of nodes in each linked list is in the range [1, 100].",
    "0 ≤ Node.val ≤ 9",
    "It is guaranteed that the list represents a number that does not have leading zeros.",
  ],
  tags: ["Linked List", "Math", "Recursion"],
  estimatedTime: "60 min",
  requiresWebcam: true,
  languages: ["javascript"],
  verificationCode: "CODE456",
  requiresCoding: true,
  requiresVerificationCode: false,
  solutions: {
    javascript: {
      initialCodeTemplate:
        "function addTwoNumbers(l1, l2) {\n  // Write your solution here\n}",
      testCases: [
        {
          input: [
            [2, 4, 3],
            [5, 6, 4],
          ],
          expected: [7, 0, 8],
        },
      ],
    },
  },
};
