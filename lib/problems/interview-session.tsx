import { generateDailyVerificationCodeForScript } from "../utils";
import { Problem } from "./types";

export const interviewSession: Problem = {
  id: "interview-session",
  title: "Interview Session",
  difficulty: "Medium",
  examples: [
    {
      input: `Interview Questions Ready`,
      output: `Interview platform loaded with monitoring active`,
      explanation:
        "Platform siap untuk sesi wawancara dengan webcam dan anti-cheating monitoring.",
    },
  ],
  constraints: [
    "Kamera wajib aktif selama sesi wawancara",
    "Tidak boleh meninggalkan tab selama sesi berlangsung",
    "Pastikan lingkungan yang tenang dan profesional",
    "Siapkan jawaban untuk pertanyaan teknis dan non-teknis",
  ],
  tags: ["Interview", "Webcam", "Monitoring", "Professional"],
  estimatedTime: "45 minutes",
  requiresWebcam: true,
  language: "interview",
  languages: ["interview"],
  reactPropName: "sessionData",
  verificationCode: generateDailyVerificationCodeForScript(),
  requiresCoding: false,
  requiresVerificationCode: false,
  description: `
## 📋 **Interview Session Platform**

Selamat datang di platform wawancara online kami. Platform ini dirancang untuk sesi wawancara Web Development dengan monitoring keamanan.

### 🎯 **Tujuan Session:**
- Evaluasi kemampuan teknis dan soft skill
- Assess problem-solving dan communication skills
- Review experience dan portfolio
- Discuss career goals dan expectations

### 📝 **Area yang akan dievaluasi:**

#### **Technical Skills (20-25 menit):**
1. **Frontend Development:**
   - React/Next.js experience
   - JavaScript/TypeScript proficiency
   - CSS/Tailwind styling approach
   - State management solutions

2. **Backend & Database:**
   - API design experience
   - Database knowledge (SQL/NoSQL)
   - Authentication & authorization
   - Performance optimization

3. **General Development:**
   - Version control (Git)
   - Testing strategies
   - Code review process
   - DevOps understanding

#### **Soft Skills (15-20 menit):**
1. **Communication:**
   - Ability to explain technical concepts
   - Team collaboration experience
   - Problem-solving approach

2. **Professional Experience:**
   - Previous project experiences
   - Challenges and solutions
   - Learning and growth mindset

3. **Cultural Fit:**
   - Work style preferences
   - Team dynamics
   - Career aspirations

### 🔒 **Security & Monitoring:**
- **Webcam Required:** Kamera harus aktif selama session
- **Tab Monitoring:** Deteksi jika berpindah tab (max 3 violations)
- **Session Recording:** Aktivitas dicatat untuk evaluasi
- **Professional Environment:** Pastikan background yang sesuai

### 📋 **What to Prepare:**
- Resume/CV dan portfolio
- Contoh project yang pernah dikerjakan
- Penjelasan tentang konsep teknis yang dikuasai
- Pertanyaan tentang perusahaan dan posisi

### ⚠️ **Important Notes:**
- Session akan otomatis berakhir jika terlalu banyak violations
- Pastikan koneksi internet stabil
- Gunakan headset untuk audio yang jelas
- Test kamera dan microphone sebelum memulai

### 🚀 **Getting Started:**
1. Klik "Start Interview" untuk memulai sesi
2. Allow access ke camera dan microphone
3. Tunggu interviewer bergabung
4. Session akan dimulai otomatis

**Ready untuk interview Anda?** Pastikan semua persiapan sudah lengkap sebelum memulai session ini.
`.trim(),
  solutions: {
    interview: {
      initialCodeTemplate: `// Interview Session Platform
// No coding required - this is an interview session

// Session Information:
// Duration: 45 minutes
// Monitoring: Webcam + Tab Detection Active
// Violations Allowed: Max 3 tab switches

// Instructions:
// 1. Keep your camera on throughout the session
// 2. Do not switch tabs during the interview
// 3. Maintain a professional environment
// 4. Be prepared to discuss your experience

// Ready for your interview session?
// Click "Start Interview" to begin when prompted.

console.log("Interview platform loaded successfully");
console.log("Webcam monitoring: Active");
console.log("Tab detection: Active");
console.log("Session timer: Ready to start");

// Interview will begin once the interviewer joins...
`,
      testCases: [
        {
          input: [
            { sessionType: "web-development-interview", duration: "45min" },
          ],
          expected: "Interview session ready with monitoring active",
        },
        {
          input: [{ sessionType: "technical-interview", duration: "30min" }],
          expected: "Technical interview setup completed",
        },
      ],
    },
  },
};
