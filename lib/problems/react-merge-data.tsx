import { generateDailyVerificationCodeForScript } from "../utils";
import { Problem } from "./types";

export const reactMergeData: Problem = {
  id: "react-merge-data",
  title: "Merge User Detail by ID",
  difficulty: "Easy",
  examples: [
    {
      input: `arrayUsers = [
  { id: 1, name: "Rudi" },
  { id: 2, name: "Ayu" }
];

arrayDetails = [
  { id_user: 1, email: "rudi@mail.com" },
  { id_user: 2, email: "ayu@mail.com" }
];`,
      output: `<pre>[
  {
    "id": 1,
    "name": "Rudi",
    "email": "rudi@mail.com"
  },
  {
    "id": 2,
    "name": "Ayu",
    "email": "ayu@mail.com"
  }
]</pre>`,
      explanation: "Kedua array digabung berdasarkan id yang sama.",
    },
  ],
  constraints: [
    "Jangan gunakan library eksternal.",
    "Gabungkan array menggunakan metode array JavaScript seperti map dan find.",
  ],
  tags: ["React", "TypeScript", "Array", "JSX"],
  estimatedTime: "10 minutes",
  requiresWebcam: false,
  language: "react",
  languages: ["javascript"],
  reactPropName: "data",
  verificationCode: generateDailyVerificationCodeForScript(),
  requiresCoding: true,
  requiresVerificationCode: false,
  description: `
Buatlah komponen React dengan TypeScript bernama \`MergedUserList\` yang menerima props:
- \`arrayUsers\`: array objek berisi \`id\` dan \`name\`
- \`arrayDetails\`: array objek berisi \`id_user\` dan \`email\`

Gabungkan dua array tersebut berdasarkan \`id\`, dan tampilkan hasil akhirnya.

### Contoh:
Jika props-nya adalah:
\`\`\`ts
arrayUsers = [
  { id: 1, name: "Rudi" },
  { id: 2, name: "Ayu" }
]

arrayDetails = [
  { id: 1, email: "rudi@mail.com" },
  { id: 2, email: "ayu@mail.com" }
]
\`\`\`

Maka hasilnya harus:
\`\`\`
<div className="list">
  <div className="card">
    <h1>
      Rudi
    </h1>
    <p>
      rudi@mail.com
    </p>
  </div>
  <div className="card">
    <h1>
      Ayu
    </h1>
    <p>
      ayu@mail.com
    </p>
  </div>
</div>
\`\`\`

Jika salah satu dari array kosong atau tidak cocok, tampilkan:
\`\`\`jsx
<p className="no-data">No data available</p>
\`\`\`
`.trim(),
  solutions: {
    javascript: {
      initialCodeTemplate: `function MergedUserList({ data }) {
  const { arrayUsers, arrayDetails } = data

  return (
    <div className="list">
     {/* Write your code here */}
    </div>
  )
}
`,
      testCases: [
        {
          input: [
            {
              arrayUsers: [
                { id: 1, name: "Rudi" },
                { id: 2, name: "Ayu" },
              ],
              arrayDetails: [
                { id: 1, email: "rudi@mail.com" },
                { id: 2, email: "ayu@mail.com" },
              ],
            },
          ],
          expected: `<div className="list">
  <div className="card">
    <h1>
      Rudi
    </h1>
    <p>
      rudi@mail.com
    </p>
  </div>
  <div className="card">
    <h1>
      Ayu
    </h1>
    <p>
      ayu@mail.com
    </p>
  </div>
</div>`,
        },
        {
          input: [{ arrayUsers: [], arrayDetails: [] }],
          expected: `<p className="no-data">No data available</p>`,
        },
      ],
    },
  },
};
