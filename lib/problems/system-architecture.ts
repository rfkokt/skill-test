// problems/system-architecture.ts
import { Problem } from "./types";

export const systemArchitectureProblem: Problem = {
  id: "system-architecture",
  title: "Microservices Architecture",
  difficulty: "Hard",
  language: "text",
  description:
    "Design a microservices architecture for a video streaming platform like YouTube. Explain the different services, their responsibilities, and how they communicate with each other. Consider aspects like scalability, fault tolerance, and data consistency.",
  examples: [
    {
      input:
        "Design a microservices architecture for a video streaming platform",
      output:
        "A comprehensive architecture design with various microservices and their interactions",
      explanation:
        "The design should include services for user management, video upload/processing, recommendation engine, etc.",
    },
  ],
  constraints: [
    "Must address user authentication and authorization",
    "Include video upload, processing, and streaming services",
    "Consider search and recommendation functionality",
    "Explain communication patterns between services",
    "Address scalability and fault tolerance",
  ],
  tags: ["System Design", "Microservices", "Architecture", "Scalability"],
  estimatedTime: "45 min",
  requiresWebcam: false,
  languages: ["text"],
  verificationCode: "ARCH202",
  requiresCoding: false,
  requiresVerificationCode: false,
  solutions: {
    text: {
      initialCodeTemplate:
        "// Write your architecture design here\n// No code is required, just a detailed explanation of your design",
      testCases: [
        {
          input: ["Design a microservices architecture"],
          expected:
            "A comprehensive architecture design with appropriate services and communication patterns",
        },
      ],
    },
  },
};
