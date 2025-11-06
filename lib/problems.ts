// problems/index.ts

import { reactFilterEvenNumbers } from "./problems/react-filter-even-number";
import { reactStudentSubjects } from "./problems/react-student-subjects";
import { interviewSession } from "./problems/interview-session";
import { Problem } from "./problems/types";

export const problemsData: { [key: string]: Problem } = {
  // "add-two-numbers": addTwoNumbersProblem,
  // "react-laptop-list": reactLaptopListProblem,
  // "react-merge-data": reactMergeData,
  "react-filter-even-numbers": reactFilterEvenNumbers,
  // "react-unique-tags-count": reactUniqueTagsCount,
  "react-student-subjects": reactStudentSubjects,
  "interview-session": interviewSession,
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
