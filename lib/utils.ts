import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// lib/utils.ts

export const convertTimeToSeconds = (timeString: string): number => {
  const match = timeString.match(/(\d+)\s*min/);
  if (match && match[1]) {
    return Number.parseInt(match[1], 10) * 60;
  }
  return 3600; // Default to 60 minutes if parsing fails
};

export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const extractComponentName = (code: string): string | null => {
  const fnDeclMatch = code.match(/function\s+([A-Z]\w*)\s*\(/); // function ComponentName(...)
  if (fnDeclMatch) return fnDeclMatch[1];

  const constFnMatch = code.match(/const\s+([A-Z]\w*)\s*=\s*\(/); // const ComponentName = (props) =>
  if (constFnMatch) return constFnMatch[1];

  return null;
};

export const formatHtml = (htmlString: string | null): string => {
  if (!htmlString) return "No HTML content to display.";

  try {
    // Basic HTML formatting without Prettier
    let formatted = htmlString;

    // 1. Add newlines between tags
    formatted = formatted.replace(/>\s*</g, ">\n<");

    // 2. Indent nested tags
    let indentLevel = 0;
    const lines = formatted.split("\n");

    const processedLines = lines.map((line) => {
      // Decrease indent if closing tag
      if (line.match(/<\/[^>]+>/)) {
        indentLevel = Math.max(0, indentLevel - 1);
      }

      // Add current indent
      const indentedLine = "  ".repeat(indentLevel) + line.trim();

      // Increase indent if opening tag (and not self-closing)
      if (line.match(/<[^/][^>]*>/) && !line.match(/<[^>]+\/>/)) {
        indentLevel += 1;
      }

      return indentedLine;
    });

    // 3. Join lines and clean up excessive newlines
    formatted = processedLines
      .join("\n")
      .replace(/\n{3,}/g, "\n\n") // Remove multiple empty lines
      .trim();

    return formatted;
  } catch (error) {
    console.error("Error formatting HTML:", error);
    return htmlString;
  }
};
export function removeSurroundingQuotes(str: string) {
  if (!str) return "";
  return str.replace(/^["'](.*)["']$/, "$1");
}

export function formatHtmlManually(html: string): string {
  const INDENT = "  ";
  let formatted = "";
  let indentLevel = 0;

  html = removeSurroundingQuotes(html) // hapus quote di awal/akhir
    .replace(/\\"/g, '"') // escape quote jadi normal
    .replace(/>\s+</g, "><") // hapus whitespace antar tag
    .trim();

  const tokens = html.split(/(?=<)|(?<=>)/g).filter(Boolean);

  for (const token of tokens) {
    if (token.match(/^<\/\w/)) {
      indentLevel--;
    }

    formatted += INDENT.repeat(indentLevel) + token.trim() + "\n";

    if (token.match(/^<\w(?!.*\/>)/) && !token.includes("</")) {
      indentLevel++;
    }
  }

  return formatted.trim();
}
