import { generateDailyVerificationCodeForScript } from "../utils";
import { Problem } from "./types";

export const reactUniqueTagsCount: Problem = {
  id: "react-unique-tags-count",
  title: "List Unique Tags with Usage Count",
  difficulty: "Easy",
  examples: [
    {
      input: `posts = [
  { id: 1, title: "Intro React", tags: ["React", "JS", " Frontend "] },
  { id: 2, title: "Tips JS", tags: ["js", "  ", "Best-Practices"] },
  { id: 3, title: "React State", tags: ["react", "state", "frontend"] }
];`,
      output: `<pre>[
  { "tag": "react", "count": 2 },
  { "tag": "frontend", "count": 2 },
  { "tag": "js", "count": 2 },
  { "tag": "best-practices", "count": 1 },
  { "tag": "state", "count": 1 }
]</pre>`,
      explanation:
        "Tag dinormalisasi (trim + lowercase), string kosong diabaikan. Hasil diurutkan berdasarkan count DESC lalu tag ASC.",
    },
  ],
  constraints: [
    "Jangan gunakan library eksternal.",
    "Gunakan kombinasi map / flatMap (atau reduce), filter, reduce, dan sort.",
    "Normalisasi setiap tag: trim whitespace dan ubah ke lowercase.",
    "Abaikan tag yang kosong setelah normalisasi.",
    "Urutkan hasil akhir berdasarkan count menurun; jika sama, urutkan tag secara alfabetis menaik.",
  ],
  tags: ["React", "JavaScript", "Array", "Reduce", "Sorting"],
  estimatedTime: "20 minutes",
  requiresWebcam: true,
  language: "react",
  languages: ["javascript"],
  reactPropName: "data",
  verificationCode: generateDailyVerificationCodeForScript(),
  requiresCoding: true,
  requiresVerificationCode: true,
  description: `
Buat komponen React bernama \`TagUsageList\` yang menerima props:
- \`posts\`: array objek \`{ id: number, title: string, tags: string[] }\`

**Tugas:**
1. Kumpulkan seluruh tag dari semua post.
2. Normalisasi setiap tag: \`trim()\` dan \`toLowerCase()\`.
3. Abaikan tag yang menjadi string kosong setelah normalisasi.
4. Hitung banyaknya kemunculan setiap tag (\`count\`).
5. Urutkan hasil: \`count\` **menurun**, lalu \`tag\` **menaik**.
6. Render daftar tag beserta \`count\`-nya.

### Contoh:
Jika props:
\`\`\`js
posts = [
  { id: 1, title: "Intro React", tags: ["React", "JS", " Frontend "] },
  { id: 2, title: "Tips JS", tags: ["js", "  ", "Best-Practices"] },
  { id: 3, title: "React State", tags: ["react", "state", "frontend"] }
]
\`\`\`

Maka hasil render harus:
\`\`\`
<div className="tag-list">
  <div className="tag">
    <h2>
      react
    </h2>
    <p>
      2
    </p>
  </div>
  <div className="tag">
    <h2>
      frontend
    </h2>
    <p>
      2
    </p>
  </div>
  <div className="tag">
    <h2>
      js
    </h2>
    <p>
      2
    </p>
  </div>
  <div className="tag">
    <h2>
      best-practices
    </h2>
    <p>
      1
    </p>
  </div>
  <div className="tag">
    <h2>
      state
    </h2>
    <p>
      1
    </p>
  </div>
</div>
\`\`\`

Jika tidak ada tag valid, tampilkan:
\`\`\`jsx
<p className="no-data">No tags</p>
\`\`\`
`.trim(),
  solutions: {
    javascript: {
      initialCodeTemplate: `function TagUsageList({ data }) {
  const { posts = [] } = data

  // Hint:
  // 1) Ambil semua tags (gunakan flatMap atau reduce).
  // 2) Normalisasi (trim + toLowerCase) dan filter yang kosong.
  // 3) Hitung frekuensi dengan reduce -> { tag: count }.
  // 4) Ubah ke array dan sort: count DESC, tag ASC.
  // 5) Render list, atau "No tags" jika tidak ada.

  return (
    <div className="tag-list">
      {/* Write your code here */}
    </div>
  )
}
`,
      testCases: [
        {
          input: [
            {
              posts: [
                {
                  id: 1,
                  title: "Intro React",
                  tags: ["React", "JS", " Frontend "],
                },
                {
                  id: 2,
                  title: "Tips JS",
                  tags: ["js", "  ", "Best-Practices"],
                },
                {
                  id: 3,
                  title: "React State",
                  tags: ["react", "state", "frontend"],
                },
              ],
            },
          ],
          expected: `<div className="tag-list">
  <div className="tag">
    <h2>
      react
    </h2>
    <p>
      2
    </p>
  </div>
  <div className="tag">
    <h2>
      frontend
    </h2>
    <p>
      2
    </p>
  </div>
  <div className="tag">
    <h2>
      js
    </h2>
    <p>
      2
    </p>
  </div>
  <div className="tag">
    <h2>
      best-practices
    </h2>
    <p>
      1
    </p>
  </div>
  <div className="tag">
    <h2>
      state
    </h2>
    <p>
      1
    </p>
  </div>
</div>`,
        },
        {
          // Semua tag kosong / whitespace
          input: [
            {
              posts: [
                { id: 1, title: "A", tags: ["  ", "   "] },
                { id: 2, title: "B", tags: [" "] },
              ],
            },
          ],
          expected: `<p className="no-data">No tags</p>`,
        },
        {
          // Tidak ada post
          input: [{ posts: [] }],
          expected: `<p className="no-data">No tags</p>`,
        },
      ],
    },
  },
};
