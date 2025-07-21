// problems/react-user-list.ts
import { Problem } from "./types";

export const reactUserListProblem: Problem = {
  id: "react-user-list",
  title: "React User List Component",
  difficulty: "Easy",
  language: "javascript",
  description:
    "Create a React component that renders a list of users. Each user should be displayed in a card format with their name, email, and status. Active users should have a green status indicator, while inactive users should have a red indicator.\n\nYou need to map over the users array and return the appropriate JSX elements.",
  examples: [
    {
      input: `users = [
  { id: 1, name: "John Doe", email: "john@example.com", isActive: true },
  { id: 2, name: "Jane Smith", email: "jane@example.com", isActive: false },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", isActive: true }
]`,
      output: `<div class="user-list">
  <div class="user-card">
    <h3>John Doe</h3>
    <p>john@example.com</p>
    <span class="status active">Active</span>
  </div>
  <div class="user-card">
    <h3>Jane Smith</h3>
    <p>jane@example.com</p>
    <span class="status inactive">Inactive</span>
  </div>
  <div class="user-card">
    <h3>Bob Johnson</h3>
    <p>bob@example.com</p>
    <span class="status active">Active</span>
  </div>
</div>`,
      explanation:
        "Each user is rendered in a card with name as h3, email as p, and status with appropriate class.",
    },
    {
      input: `users = []`,
      output: `<div class="user-list">
  <p class="no-users">No users found</p>
</div>`,
    },
    {
      input: `users = [
  { id: 1, name: "Alice", email: "alice@test.com", isActive: false }
]`,
      output: `<div class="user-list">
  <div class="user-card">
    <h3>Alice</h3>
    <p>alice@test.com</p>
    <span class="status inactive">Inactive</span>
  </div>
</div>`,
    },
  ],
  constraints: [
    "users is an array of user objects",
    "Each user has id (number), name (string), email (string), and isActive (boolean)",
    "Component should handle empty arrays",
    "Use className instead of class for React",
    "Status text should be 'Active' or 'Inactive'",
  ],
  tags: ["React", "JavaScript", "Array Methods", "JSX"],
  estimatedTime: "30 min",
  requiresWebcam: false,
  languages: ["javascript"],
  reactPropName: "users",
  verificationCode: "REACT789",
  requiresCoding: true,
  requiresVerificationCode: false,
  solutions: {
    javascript: {
      initialCodeTemplate: `function UserList({ users }) {
  // Add your logic here. Use 'React.createElement()' to create elements.
  // Example: console.log("Users:", users);
  // Make sure you return a valid React element.
  console.log("Hello from your code!");

  if (!users || users.length === 0) {
    return React.createElement(
      'div',
      { className: 'user-list' },
      React.createElement('p', { className: 'no-users' }, 'No users found')
    );
  }

  return React.createElement(
    'div',
    { className: 'user-list' },
    users.map(user =>
      React.createElement(
        'div',
        { key: user.id, className: 'user-card' },
        React.createElement('h3', null, user.name),
        React.createElement('p', null, user.email),
        React.createElement(
          'span',
          { className: user.isActive ? 'status active' : 'status inactive' },
          user.isActive ? 'Active' : 'Inactive'
        )
      )
    )
  );
}`,
      testCases: [
        {
          input: [
            [
              {
                id: 1,
                name: "John Doe",
                email: "john@example.com",
                isActive: true,
              },
              {
                id: 2,
                name: "Jane Smith",
                email: "jane@example.com",
                isActive: false,
              },
            ],
          ],
          expected: `<div className="user-list"><div className="user-card"><h3>John Doe</h3><p>john@example.com</p><span className="status active">Active</span></div><div className="user-card"><h3>Jane Smith</h3><p>jane@example.com</p><span className="status inactive">Inactive</span></div></div>`,
        },
        {
          input: [[]],
          expected: `<div className="user-list"><p className="no-users">No users found</p></div>`,
        },
        {
          input: [
            [
              {
                id: 1,
                name: "Alice",
                email: "alice@test.com",
                isActive: false,
              },
            ],
          ],
          expected: `<div className="user-list"><div className="user-card"><h3>Alice</h3><p>alice@test.com</p><span className="status inactive">Inactive</span></div></div>`,
        },
      ],
    },
  },
};
