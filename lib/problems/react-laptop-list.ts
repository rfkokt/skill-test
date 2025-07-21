// problems/react-laptop-list.ts
import { generateDailyVerificationCodeForScript } from "../utils";
import { Problem } from "./types";

export const reactLaptopListProblem: Problem = {
  id: "react-laptop-list",
  title: "Laptop List Basic Map",
  difficulty: "Easy",
  examples: [
    {
      input: `laptops = [
          { id: 1, name: "Asus TUF", type: "Laptop", screen_size: "17 inch" },
          { id: 2, name: "Axioo", type: "Laptop", screen_size: "13 inch" }
        ]`,
      output: `<div class="list">
          <div class="card">
            <h3>Asus TUF</h3>
            <p>Laptop</p>
            <p>17 inch</p>
          </div>
        </div>`,
      explanation: "Mapping data sesuai dengan field yang tersedia.",
    },
  ],
  constraints: [
    "Filter laptops where screen_size === '17 inch'",
    "Each laptop has id, name, type, and screen_size properties",
    "Handle empty results with 'No laptops found' message",
  ],
  tags: ["React", "JavaScript", "Array Methods", "JSX"],
  estimatedTime: "30 min",
  requiresWebcam: true,
  language: "react",
  languages: ["javascript"],
  reactPropName: "laptops",
  verificationCode: generateDailyVerificationCodeForScript(),
  requiresCoding: true,
  requiresVerificationCode: false,
  description: `
Buat komponen React bernama \`LaptopList\` yang menerima props \`laptops\`.


Untuk setiap laptop, tampilkan:
- Nama (\`name\`) dalam \`<h3>\`
- Tipe (\`type\`) dalam \`<p>\`
- Ukuran layar (\`screen_size\`) dalam \`<p>\`

Jika data tidak ada , tampilkan \`<p class="no-laptops">No laptops found</p>\`.

Gunakan JSX.
    `.trim(),
  solutions: {
    javascript: {
      initialCodeTemplate: `function LaptopList({ laptops }) {


  return (
    <div className="list">
      
    </div>
  );
}`,
      testCases: [
        {
          input: [
            [
              {
                id: 1,
                name: "Asus TUF",
                type: "Laptop",
                screen_size: "17 inch",
              },
              {
                id: 2,
                name: "Axioo",
                type: "Laptop",
                screen_size: "13 inch",
              },
              {
                id: 3,
                name: "Zyrex",
                type: "Laptop",
                screen_size: "12 inch",
              },
            ],
          ],
          expected: `<div className="list"><div className="card"><h3>Asus TUF</h3><p>Laptop</p><p>17 inch</p></div><div className="card"><h3>Axioo</h3><p>Laptop</p><p>13 inch</p></div><div className="card"><h3>Zyrex</h3><p>Laptop</p><p>12 inch</p></div></div>`,
        },
        {
          input: [[]],
          expected: `<p className="no-laptops">No laptops found</p>`,
        },
      ],
    },
  },
};
