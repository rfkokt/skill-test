import { generateDailyVerificationCodeForScript } from "../utils";
import { Problem } from "./types";

export const reactStudentSubjects: Problem = {
  id: "react-student-subjects",
  title: "Match Students with Subjects",
  difficulty: "Easy",
  examples: [
    {
      input: `students = [
  { id: 1, name: "Budi" },
  { id: 2, name: "Siti" }
];

subjects = [
  { id: 1, subject: "Math" },
  { id: 1, subject: "English" },
  { id: 2, subject: "Biology" }
];`,
      output: `<pre>[
  { "id": 1, "name": "Budi", "subjects": ["Math", "English"] },
  { "id": 2, "name": "Siti", "subjects": ["Biology"] }
]</pre>`,
      explanation:
        "Setiap siswa dicari mata pelajarannya menggunakan filter berdasarkan id. Hasilnya berupa array siswa dengan daftar subjects.",
    },
  ],
  constraints: [
    "Tidak boleh menggunakan library eksternal.",
    "Gunakan kombinasi filter, map, dan find.",
    "Jika siswa tidak punya mata pelajaran, tampilkan array kosong.",
  ],
  tags: ["React", "JavaScript", "Array", "Map", "Filter"],
  estimatedTime: "20 minutes",
  requiresWebcam: true,
  language: "react",
  languages: ["javascript"],
  reactPropName: "data",
  verificationCode: generateDailyVerificationCodeForScript(),
  requiresCoding: true,
  requiresVerificationCode: true,
  description: `
Buat komponen React bernama \`StudentSubjectList\` yang menerima props:
- \`students\`: array objek { id, name }
- \`subjects\`: array objek { id, subject }

**Tugas:**
1. Untuk setiap siswa, cari daftar subject dengan mencocokkan \`id\`.
2. Simpan daftar subject dalam bentuk array string di property \`subjects\`.
3. Render setiap siswa dengan daftar subject mereka.
4. Jika semua array kosong, tampilkan:
\`\`\`jsx
<p className="no-data">No data available</p>
\`\`\`

### Contoh:
Jika props:
\`\`\`js
students = [
  { id: 1, name: "Budi" },
  { id: 2, name: "Siti" }
]

subjects = [
  { id: 1, subject: "Math" },
  { id: 1, subject: "English" },
  { id: 2, subject: "Biology" }
]
\`\`\`

Maka hasil render harus:
\`\`\`
<div className="list">
  <div className="card">
    <h1>
      Budi
    </h1>
    <ul>
      <li>Math</li>
      <li>English</li>
    </ul>
  </div>
  <div className="card">
    <h1>
      Siti
    </h1>
    <ul>
      <li>Biology</li>
    </ul>
  </div>
</div>
\`\`\`
`.trim(),
  solutions: {
    javascript: {
      initialCodeTemplate: `function StudentSubjectList({ data }) {
  const { students = [], subjects = [] } = data

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
              students: [
                { id: 1, name: "Budi" },
                { id: 2, name: "Siti" },
              ],
              subjects: [
                { id: 1, subject: "Math" },
                { id: 1, subject: "English" },
                { id: 2, subject: "Biology" },
              ],
            },
          ],
          expected: `<div className="list">
  <div className="card">
    <h1>
      Budi
    </h1>
    <ul>
      <li>Math</li>
      <li>English</li>
    </ul>
  </div>
  <div className="card">
    <h1>
      Siti
    </h1>
    <ul>
      <li>Biology</li>
    </ul>
  </div>
</div>`,
        },
        {
          input: [
            {
              students: [],
              subjects: [],
            },
          ],
          expected: `<p className="no-data">No data available</p>`,
        },
      ],
    },
  },
};
