// problems/react-task-list.ts
import { Problem } from "./types";

export const reactTaskListProblem: Problem = {
  id: "react-task-list",
  title: "React Task List Component",
  difficulty: "Easy",
  language: "javascript",
  description:
    "Create a React component that displays a list of tasks. Each task should show its description and a checkbox indicating if it's completed. Completed tasks should have a strikethrough style.",
  examples: [
    {
      input: `tasks = [
  { id: 1, description: "Learn React", completed: true },
  { id: 2, description: "Build a project", completed: false },
  { id: 3, description: "Deploy to Netlify", completed: false }
]`,
      output: `<div class="task-list">
  <div class="task-item completed">
    <input type="checkbox" checked disabled />
    <p><s>Learn React</s></p>
  </div>
  <div class="task-item">
    <input type="checkbox" disabled />
    <p>Build a project</p>
  </div>
  <div class="task-item">
    <input type="checkbox" disabled />
    <p>Deploy to Netlify</p>
  </div>
</div>`,
      explanation:
        "Tasks are rendered with a checkbox and strikethrough for completed tasks.",
    },
    {
      input: `tasks = []`,
      output: `<div class="task-list">
  <p class="no-tasks">No tasks to display</p>
</div>`,
    },
  ],
  constraints: [
    "tasks is an array of task objects",
    "Each task has id (number), description (string), and completed (boolean)",
    "Completed tasks should have a strikethrough style (e.g., using <s> tag or CSS)",
    "Checkbox should be checked if completed and disabled",
    "Handle empty arrays with 'No tasks to display' message",
  ],
  tags: ["React", "JavaScript", "Conditional Rendering", "JSX"],
  estimatedTime: "30 min",
  requiresWebcam: true,
  languages: ["javascript"],
  reactPropName: "tasks",
  verificationCode: "TASKLIST202",
  requiresCoding: true,
  requiresVerificationCode: false,
  solutions: {
    javascript: {
      initialCodeTemplate: `function TaskList({ tasks }) {
  // Add your logic here. Use 'React.createElement()' to create elements.
  // Example: console.log("Tasks:", tasks);
  // Make sure you return a valid React element.
}`,
      testCases: [
        {
          input: [
            [
              { id: 1, description: "Do laundry", completed: true },
              { id: 2, description: "Buy groceries", completed: false },
            ],
          ],
          expected: `<div className="task-list"><div className="task-item completed"><input type="checkbox" checked="" disabled="" /><p><s>Do laundry</s></p></div><div className="task-item"><input type="checkbox" disabled="" /><p>Buy groceries</p></div></div>`,
        },
        {
          input: [[]],
          expected: `<div className="task-list"><p className="no-tasks">No tasks to display</p></div>`,
        },
      ],
    },
  },
};
