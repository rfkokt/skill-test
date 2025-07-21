// problems/types.ts
export interface Problem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  estimatedTime: string;
  requiresWebcam: boolean;
  language: string;
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  tags: string[];
  languages: string[];
  reactPropName?: string;
  verificationCode: string;
  requiresCoding: boolean;
  requiresVerificationCode: boolean;
  solutions: {
    [key: string]: {
      initialCodeTemplate: string;
      testCases: {
        input: any[];
        expected: any;
      }[];
    };
  };
}
