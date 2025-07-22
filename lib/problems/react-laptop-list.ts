import { generateDailyVerificationCodeForScript } from "../utils";
import { Problem } from "./types";

export const reactLaptopListProblem: Problem = {
  id: "react-laptop-list",
  title: "Render Laptop List",
  difficulty: "Easy",
  examples: [
    {
      input: `laptops = [
  { id: 1, name: "Asus TUF", type: "Laptop", screen_size: "17 inch" },
  { id: 2, name: "Axioo", type: "Laptop", screen_size: "13 inch" }
]`,
      output: `<div className="list">
  <div className="card">
    <h3>Asus TUF</h3>
    <p>Laptop</p>
    <p>17 inch</p>
  </div>
  <div className="card">
    <h3>Axioo</h3>
    <p>Laptop</p>
    <p>13 inch</p>
  </div>
</div>`,
      explanation:
        "Data ditampilkan sesuai struktur HTML dan field yang diminta.",
    },
  ],
  constraints: [
    "Jangan gunakan library eksternal selain React.",
    "Gunakan metode bawaan JavaScript seperti Array.prototype.map.",
    "Gunakan JSX dan pastikan penggunaan className sesuai standar React.",
    "Gunakan key unik saat melakukan mapping komponen dalam list.",
  ],
  tags: [
    "React",
    "JavaScript",
    "Array Methods",
    "JSX",
    "Conditional Rendering",
  ],
  estimatedTime: "10 minutes",
  requiresWebcam: true,
  language: "react",
  languages: ["javascript"],
  reactPropName: "laptops",
  verificationCode: generateDailyVerificationCodeForScript(),
  requiresCoding: true,
  requiresVerificationCode: false,
  description: `
Buatlah sebuah komponen React bernama \`LaptopList\` yang menerima properti \`laptops\` berupa array objek.

Setiap objek dalam array memiliki struktur berikut:
- \`id\` (number): ID unik
- \`name\` (string): Nama laptop
- \`type\` (string): Jenis perangkat, misalnya "Laptop"
- \`screen_size\` (string): Ukuran layar, misalnya "17 inch"

Tampilkan daftar laptop dalam elemen container \`<div className="list">\`.  
Setiap item laptop harus dirender dalam elemen \`<div className="card">\`, berisi:

- Nama laptop dalam elemen \`<h3>\`
- Tipe dalam elemen \`<p>\`
- Ukuran layar dalam elemen \`<p>\`

Jika data \`laptops\` kosong, null, atau undefined, tampilkan elemen:
\`\`\`jsx
<p className="no-laptops">No laptops found</p>
\`\`\`

Gunakan sintaks JSX, dan pastikan menggunakan \`className\` alih-alih \`class\`, sesuai standar React.
`.trim(),

  solutions: {
    javascript: {
      initialCodeTemplate: `
function LaptopList({ laptops }) {
  return (
    <div className="list">
      // Add your code here
    </div>
  );
}

// [
//   {
//     id: 1,
//     name: "Asus TUF",
//     type: "Laptop",
//     screen_size: "17 inch",
//   },
// ],
`,
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
