import { generateDailyVerificationCodeForScript } from "../utils";
import { Problem } from "./types";

export const reactInteractiveButtonsProblem: Problem = {
  id: "react-interactive-buttons",
  title: "Render Interactive Button View",
  difficulty: "Easy",
  examples: [
    {
      input: `count = 5;
object = {
  name: "Manipulate",
  type: "This element",
  option: "Carefully"
};`,
      output: `
<div>
  <div className="my-5 mx-3">
    <h1>1. Count the number</h1>
    <h6>Count the data +1 every single click: 5</h6>
    <button className="btn btn-sm btn-outline-primary">Count</button>
  </div>
  <div className="my-5 mx-3">
    <h1>2. use this button to call 'countData' function</h1>
    <ChildButton />
  </div>
  <div className="my-5 mx-3">
    <h1>3. Disable count button if count reach 15</h1>
    <button className="btn btn-sm btn-outline-primary" disabled={false}>
      Disable this button
    </button>
  </div>
  <div className="my-5 mx-3">
    <h1>4. Adding Element & Object Manipulation</h1>
    <h6>Change 'type' value below:</h6>
    <h6>
      <pre>{
  "name": "Manipulate",
  "type": "This element",
  "option": "Carefully"
}</pre>
    </h6>
    <button className="btn btn-sm btn-outline-primary">
      Change the Data
    </button>
  </div>
</div>`,
      explanation:
        "Menampilkan JSX sesuai dengan nilai state awal yang disimulasikan.",
    },
  ],
  constraints: [
    "Jangan gunakan state dinamis, hanya tampilkan JSX berdasarkan input awal.",
    "Gunakan tag JSX seperti <div>, <h1>, <h6>, <button>, <pre>, dan komponen ChildButton.",
    "Gunakan atribut className, bukan class.",
    "Gunakan atribut disabled={true|false} pada button sesuai kondisi.",
  ],
  tags: ["React", "JSX", "Component", "Conditional Rendering", "Static Output"],
  estimatedTime: "30 minutes",
  requiresWebcam: false,
  language: "react",
  languages: ["javascript"],
  reactPropName: "count,object",
  verificationCode: generateDailyVerificationCodeForScript(),
  requiresCoding: true,
  requiresVerificationCode: false,
  description: `
Buatlah komponen React yang menghasilkan **struktur JSX** seperti tampilan berikut:

Komponen ini memiliki:
1. Tampilan judul dan tombol hitung yang menampilkan nilai count.
2. Komponen \`ChildButton\` yang dirender (tidak perlu diimplementasikan).
3. Tombol yang akan **disabled** jika \`count >= 15\`.
4. Elemen \`<pre>\` untuk menampilkan isi objek \`object\` dalam format JSON.

Gunakan properti berikut:
- \`count\`: number
- \`object\`: object

⚠️ **Catatan**: Soal ini hanya mengevaluasi struktur HTML dari JSX yang dihasilkan, bukan fungsionalitas React. Pastikan output sesuai dengan nilai dari props awal.

Contoh kondisi:
- Jika \`count = 15\`, tombol pada bagian ke-3 harus memiliki atribut \`disabled={true}\`.
- Jika \`object.type = "This element"\`, maka harus muncul di dalam tag \`<pre>\`.

Gunakan JSX dengan atribut \`className\`.
`.trim(),
  solutions: {
    javascript: {
      initialCodeTemplate: `function App({ count, object }) {
  return (
    <div>
      {/* Tampilkan JSX sesuai instruksi */}
    </div>
  );
}`,
      testCases: [
        {
          input: [
            5,
            {
              name: "Manipulate",
              type: "This element",
              option: "Carefully",
            },
          ],
          expected: `<div><div className="my-5 mx-3"><h1>1. Count the number</h1><h6>Count the data +1 every single click: 5</h6><button className="btn btn-sm btn-outline-primary">Count</button></div><div className="my-5 mx-3"><h1>2. use this button to call 'countData' function</h1><ChildButton /></div><div className="my-5 mx-3"><h1>3. Disable count button if count reach 15</h1><button className="btn btn-sm btn-outline-primary" disabled={false}>Disable this button</button></div><div className="my-5 mx-3"><h1>4. Adding Element & Object Manipulation</h1><h6>Change 'type' value below:</h6><h6><pre>{\n  "name": "Manipulate",\n  "type": "This element",\n  "option": "Carefully"\n}</pre></h6><button className="btn btn-sm btn-outline-primary">Change the Data</button></div></div>`,
        },
        {
          input: [
            15,
            {
              name: "Test",
              type: "Different",
              option: "Now",
            },
          ],
          expected: `<div><div className="my-5 mx-3"><h1>1. Count the number</h1><h6>Count the data +1 every single click: 15</h6><button className="btn btn-sm btn-outline-primary">Count</button></div><div className="my-5 mx-3"><h1>2. use this button to call 'countData' function</h1><ChildButton /></div><div className="my-5 mx-3"><h1>3. Disable count button if count reach 15</h1><button className="btn btn-sm btn-outline-primary" disabled={true}>Disable this button</button></div><div className="my-5 mx-3"><h1>4. Adding Element & Object Manipulation</h1><h6>Change 'type' value below:</h6><h6><pre>{\n  "name": "Test",\n  "type": "Different",\n  "option": "Now"\n}</pre></h6><button className="btn btn-sm btn-outline-primary">Change the Data</button></div></div>`,
        },
      ],
    },
  },
};
