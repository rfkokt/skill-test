// problems/index.ts

import { addTwoNumbersProblem } from "./problems/add-two-numbers";
import { countVowelsProblem } from "./problems/count-vowels";
import { databaseDesignProblem } from "./problems/database-design";
import { longestSubstringProblem } from "./problems/longest-substring";
import { medianArraysProblem } from "./problems/median-arrays";
import { reactLaptopListProblem } from "./problems/react-laptop-list";
import { reactProductGridProblem } from "./problems/react-product-grid";
import { reactTaskListProblem } from "./problems/react-task-list";
import { reactUserListProblem } from "./problems/react-user-list";
import { reverseStringProblem } from "./problems/reverse-string";
import { systemArchitectureProblem } from "./problems/system-architecture";
import { twoSumProblem } from "./problems/two-sum";
import { Problem } from "./problems/types";

export const problemsData: { [key: string]: Problem } = {
  "two-sum": twoSumProblem,
  "add-two-numbers": addTwoNumbersProblem,
  "react-user-list": reactUserListProblem,
  "react-product-grid": reactProductGridProblem,
  "longest-substring": longestSubstringProblem,
  "median-arrays": medianArraysProblem,
  "reverse-string": reverseStringProblem,
  "react-laptop-list": reactLaptopListProblem,
  "database-design": databaseDesignProblem,
  "system-architecture": systemArchitectureProblem,
  "count-vowels": countVowelsProblem,
  "react-task-list": reactTaskListProblem,
};
