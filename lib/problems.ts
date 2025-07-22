// problems/index.ts

import { reactInteractiveButtonsProblem } from "./problems/react-interactive-button";
import { reactLaptopListProblem } from "./problems/react-laptop-list";
import { Problem } from "./problems/types";

export const problemsData: { [key: string]: Problem } = {
  // "two-sum": twoSumProblem,
  // "add-two-numbers": addTwoNumbersProblem,
  // "react-user-list": reactUserListProblem,
  // "react-product-grid": reactProductGridProblem,
  // "longest-substring": longestSubstringProblem,
  // "median-arrays": medianArraysProblem,
  // "reverse-string": reverseStringProblem,
  "react-laptop-list": reactLaptopListProblem,
  "react-interactive-buttons": reactInteractiveButtonsProblem,
  // "database-design": databaseDesignProblem,
  // "system-architecture": systemArchitectureProblem,
  // "count-vowels": countVowelsProblem,
  // "react-task-list": reactTaskListProblem,
};
