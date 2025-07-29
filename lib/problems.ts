// problems/index.ts

import { addTwoNumbersProblem } from "./problems/add-two-numbers";
import { reactLaptopListProblem } from "./problems/react-laptop-list";
import { reactMergeData } from "./problems/react-merge-data";
import { Problem } from "./problems/types";

export const problemsData: { [key: string]: Problem } = {
  "add-two-numbers": addTwoNumbersProblem,
  "react-laptop-list": reactLaptopListProblem,
  "react-merge-data": reactMergeData,
  // "react-product-grid": reactProductGridProblem,
  // "react-user-list": reactUserListProblem,
  // "two-sum": twoSumProblem,
  // "longest-substring": longestSubstringProblem,
  // "median-arrays": medianArraysProblem,
  // "reverse-string": reverseStringProblem,
  // "database-design": databaseDesignProblem,
  // "system-architecture": systemArchitectureProblem,
  // "count-vowels": countVowelsProblem,
  // "react-task-list": reactTaskListProblem,
};
