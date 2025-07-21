// problems/reverse-string.ts
import { Problem } from "./types";

export const reverseStringProblem: Problem = {
  id: "reverse-string",
  title: "Reverse String",
  difficulty: "Easy",
  language: "python",
  description:
    "Given a string `s`, return the string with its characters reversed.",
  examples: [
    {
      input: `s = "hello"`,
      output: `"olleh"`,
      explanation: `The reversed string is "olleh".`,
    },
    {
      input: `s = "Python"`,
      output: `"nohtyP"`,
      explanation: `The reversed string is "nohtyP".`,
    },
  ],
  constraints: [
    "1 <= s.length <= 1000",
    "s consists of printable ASCII characters.",
  ],
  tags: ["String", "Python"],
  estimatedTime: "15 min",
  requiresWebcam: false,
  languages: ["python"],
  verificationCode: "REV404",
  requiresCoding: true,
  requiresVerificationCode: false,
  solutions: {
    python: {
      initialCodeTemplate: `def reverse_string(s):
    # Write your solution here
    return s[::-1]`,
      testCases: [
        { input: ["hello"], expected: "olleh" },
        { input: ["Python"], expected: "nohtyP" },
        { input: ["a"], expected: "a" },
        { input: [""], expected: "" },
      ],
    },
  },
};
