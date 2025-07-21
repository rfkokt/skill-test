// problems/database-design.ts
import { Problem } from "./types";

export const databaseDesignProblem: Problem = {
  id: "database-design",
  title: "E-commerce Database Design",
  difficulty: "Medium",
  language: "sql",
  description:
    "Design a database schema for an e-commerce platform. The platform needs to store information about users, products, orders, and reviews. Explain your design choices and the relationships between tables.",
  examples: [
    {
      input: "Design a database for an e-commerce platform",
      output:
        "A comprehensive database design with tables for users, products, orders, and reviews",
      explanation:
        "The design should include primary keys, foreign keys, and appropriate relationships between tables.",
    },
  ],
  constraints: [
    "Must include tables for users, products, orders, and reviews",
    "Define appropriate relationships between tables",
    "Include primary keys and foreign keys",
    "Consider data types for each column",
  ],
  tags: ["Database Design", "SQL", "E-commerce", "Schema Design"],
  estimatedTime: "30 min",
  requiresWebcam: false,
  languages: ["sql"],
  verificationCode: "DB101",
  requiresCoding: false,
  requiresVerificationCode: false,
  solutions: {
    sql: {
      initialCodeTemplate:
        "-- Write your database schema design here\n-- Include CREATE TABLE statements and explanations",
      testCases: [
        {
          input: ["Design a database schema"],
          expected:
            "A comprehensive database design with appropriate tables and relationships",
        },
      ],
    },
  },
};
