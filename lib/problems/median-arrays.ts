// problems/median-arrays.ts
import { Problem } from "./types";

export const medianArraysProblem: Problem = {
  id: "median-arrays",
  title: "Median of Two Sorted Arrays",
  difficulty: "Hard",
  language: "javascript",
  description:
    "Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the median of the two sorted arrays.\n\nThe overall run time complexity should be `O(log(m + n))`.",
  examples: [
    {
      input: "nums1 = [1,3], nums2 = [2]",
      output: "2.0",
      explanation: "merged array = [1,2,3] and median is 2.",
    },
    {
      input: "nums1 = [1,2], nums2 = [3,4]",
      output: "2.5",
      explanation: "merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.",
    },
  ],
  constraints: [
    "m == nums1.length",
    "n == nums2.length",
    "0 <= m <= 1000",
    "0 <= n <= 1000",
    "1 <= m + n <= 2000",
    "-10⁶ <= nums1[i], nums2[i] <= 10⁶",
  ],
  tags: ["Array", "Binary Search", "Divide and Conquer"],
  estimatedTime: "45 min",
  requiresWebcam: true,
  languages: ["javascript", "python"],
  verificationCode: "MEDIAN303",
  requiresCoding: true,
  requiresVerificationCode: true,
  solutions: {
    javascript: {
      initialCodeTemplate: `function findMedianSortedArrays(nums1, nums2) {
  // Write your solution here
  // Hint: Consider merging the arrays and finding the median,
  // or use a more efficient approach like binary search.
}`,
      testCases: [
        { input: [[1, 3], [2]], expected: 2.0 },
        {
          input: [
            [1, 2],
            [3, 4],
          ],
          expected: 2.5,
        },
        {
          input: [
            [0, 0],
            [0, 0],
          ],
          expected: 0.0,
        },
        { input: [[], [1]], expected: 1.0 },
        { input: [[2], []], expected: 2.0 },
      ],
    },
    python: {
      initialCodeTemplate: `def find_median_sorted_arrays(nums1, nums2):
    # Write your solution here
    # Hint: Consider merging the arrays and finding the median,
    # or use a more efficient approach like binary search.
    pass`,
      testCases: [
        { input: [[1, 3], [2]], expected: 2.0 },
        {
          input: [
            [1, 2],
            [3, 4],
          ],
          expected: 2.5,
        },
        {
          input: [
            [0, 0],
            [0, 0],
          ],
          expected: 0.0,
        },
        { input: [[], [1]], expected: 1.0 },
        { input: [[2], []], expected: 2.0 },
      ],
    },
  },
};
