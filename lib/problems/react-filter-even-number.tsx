import { generateDailyVerificationCodeForScript } from "../utils";
import { Problem } from "./types";

export const reactFilterEvenNumbers: Problem = {
  id: "react-filter-even-numbers",
  title: "Filter Bilangan Genap",
  difficulty: "Easy",
  examples: [
    {
      input: `numbers = [1, 2, 3, 4, 5, 6];`,
      output: `<pre>[2, 4, 6]</pre>`,
      explanation: "Hanya bilangan genap yang ditampilkan.",
    },
  ],
  constraints: [
    "Tidak boleh menggunakan library eksternal.",
    "Gunakan metode array JavaScript seperti filter.",
  ],
  tags: ["React", "JavaScript", "Array", "Filter"],
  estimatedTime: "20 minutes",
  requiresWebcam: true,
  language: "react",
  languages: ["javascript"],
  reactPropName: "data",
  verificationCode: generateDailyVerificationCodeForScript(),
  requiresCoding: true,
  requiresVerificationCode: true,
  description: `
Buatlah komponen React bernama \`EvenNumberList\` yang menerima props:
- \`numbers\`: array bilangan bulat.

Tampilkan hanya bilangan **genap** dari array tersebut di dalam elemen list.

### Contoh:
Jika props-nya adalah:
\`\`\`js
numbers = [1, 2, 3, 4, 5, 6]
\`\`\`

Maka hasilnya harus:
\`\`\`
<ul className="number-list">
  <li>2</li>
  <li>4</li>
  <li>6</li>
</ul>
\`\`\`

Jika tidak ada bilangan genap, tampilkan:
\`\`\`jsx
<p className="no-data">No even numbers</p>
\`\`\`
`.trim(),
  solutions: {
    javascript: {
      initialCodeTemplate: `function EvenNumberList({ data }) {
  const { numbers } = data

  return (
    <div>
      {/* Write your code here */}
    </div>
  )
}
`,
      testCases: [
        {
          input: [{ numbers: [1, 2, 3, 4, 5, 6] }],
          expected: `<ul className="number-list">
  <li>2</li>
  <li>4</li>
  <li>6</li>
</ul>`,
        },
        {
          input: [{ numbers: [1, 3, 5, 7] }],
          expected: `<p className="no-data">No even numbers</p>`,
        },
      ],
    },
  },
};
