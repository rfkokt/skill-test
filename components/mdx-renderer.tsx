import React from "react";

// Interface untuk props komponen
interface MDXRendererProps {
  content: string;
}

interface Problem {
  description: string;
}

interface LinkMatch {
  text: string;
  url: string;
  full: string;
}

// Komponen untuk rendering MDX yang lebih lengkap
export const MDXRenderer: React.FC<MDXRendererProps> = ({ content }) => {
  // Fungsi untuk parsing MDX yang lebih komprehensif
  const parseMDX = (mdxContent: string): React.ReactElement[] => {
    const lines: string[] = mdxContent.split("\n");
    const elements: React.ReactElement[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Code blocks (```)
      if (line.trim().startsWith("```")) {
        const language = line.trim().slice(3).trim();
        const codeLines: string[] = [];
        i++; // Skip opening ```

        // Collect code lines until closing ```
        while (i < lines.length && !lines[i].trim().startsWith("```")) {
          codeLines.push(lines[i]);
          i++;
        }

        const codeContent = codeLines.join("\n");
        elements.push(
          <pre
            key={elements.length}
            className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto mb-4"
          >
            <code className={language ? `language-${language}` : ""}>
              {codeContent}
            </code>
          </pre>
        );
        i++; // Skip closing ```
        continue;
      }

      // Headers
      if (line.startsWith("### ")) {
        elements.push(
          <h3 key={elements.length} className="text-xl font-semibold mb-3 mt-6">
            {line.slice(4)}
          </h3>
        );
      } else if (line.startsWith("## ")) {
        elements.push(
          <h2
            key={elements.length}
            className="text-2xl font-semibold mb-4 mt-8"
          >
            {line.slice(3)}
          </h2>
        );
      } else if (line.startsWith("# ")) {
        elements.push(
          <h1 key={elements.length} className="text-3xl font-bold mb-6">
            {line.slice(2)}
          </h1>
        );
      }
      // List items
      else if (line.trim().startsWith("- ")) {
        const listItems: string[] = [];
        let j = i;

        // Collect consecutive list items
        while (j < lines.length && lines[j].trim().startsWith("- ")) {
          listItems.push(lines[j].trim().slice(2));
          j++;
        }

        elements.push(
          <ul
            key={elements.length}
            className="list-disc list-inside mb-4 space-y-1"
          >
            {listItems.map((item, idx) => (
              <li key={idx}>{parseInlineElements(item)}</li>
            ))}
          </ul>
        );

        i = j - 1; // Adjust index
      }
      // Regular paragraphs with inline formatting
      else if (line.trim() !== "") {
        const parsedLine = parseInlineElements(line);
        elements.push(
          <p key={elements.length} className="mb-4 leading-relaxed">
            {parsedLine}
          </p>
        );
      }
      // Empty lines (spacing)
      else {
        elements.push(<div key={elements.length} className="mb-2" />);
      }

      i++;
    }

    return elements;
  };

  // Fungsi untuk parsing elemen inline (bold, italic, code, links)
  const parseInlineElements = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let keyCounter = 0;

    // Process inline code first (backticks)
    const codeRegex = /`([^`]+)`/g;
    let lastIndex = 0;
    let match;

    while ((match = codeRegex.exec(text)) !== null) {
      // Add text before the code
      if (match.index > lastIndex) {
        const beforeText = text.slice(lastIndex, match.index);
        parts.push(...processTextFormatting(beforeText, keyCounter));
        keyCounter += beforeText.length;
      }

      // Add the code element
      parts.push(
        <code
          key={keyCounter++}
          className="bg-gray-100 px-2 py-1 rounded text-sm font-mono"
        >
          {match[1]}
        </code>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex);
      parts.push(...processTextFormatting(remainingText, keyCounter));
    }

    return parts;
  };

  // Fungsi untuk memproses bold, italic, dan links
  const processTextFormatting = (
    text: string,
    startKey: number
  ): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let keyCounter = startKey;

    // Process links [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        const beforeText = text.slice(lastIndex, match.index);
        parts.push(...processBoldItalic(beforeText, keyCounter));
        keyCounter += beforeText.length;
      }

      // Add the link element
      parts.push(
        <a
          key={keyCounter++}
          href={match[2]}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {match[1]}
        </a>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex);
      parts.push(...processBoldItalic(remainingText, keyCounter));
    }

    return parts;
  };

  // Fungsi untuk memproses bold dan italic
  const processBoldItalic = (
    text: string,
    startKey: number
  ): React.ReactNode[] => {
    if (!text) return [];

    const parts: React.ReactNode[] = [];
    let keyCounter = startKey;

    // Handle bold (**text**)
    if (text.includes("**")) {
      const boldParts = text.split("**");
      boldParts.forEach((part, idx) => {
        if (idx % 2 === 1) {
          // Bold text
          parts.push(<strong key={keyCounter++}>{part}</strong>);
        } else if (part) {
          // Regular text, check for italic
          if (part.includes("*")) {
            const italicParts = part.split("*");
            italicParts.forEach((iPart, iIdx) => {
              if (iIdx % 2 === 1) {
                parts.push(<em key={keyCounter++}>{iPart}</em>);
              } else if (iPart) {
                parts.push(<span key={keyCounter++}>{iPart}</span>);
              }
            });
          } else {
            parts.push(<span key={keyCounter++}>{part}</span>);
          }
        }
      });
    } else if (text.includes("*")) {
      // Handle italic (*text*)
      const italicParts = text.split("*");
      italicParts.forEach((part, idx) => {
        if (idx % 2 === 1) {
          parts.push(<em key={keyCounter++}>{part}</em>);
        } else if (part) {
          parts.push(<span key={keyCounter++}>{part}</span>);
        }
      });
    } else {
      // Plain text
      parts.push(<span key={keyCounter++}>{text}</span>);
    }

    return parts;
  };

  return (
    <div className="text-neobrutal-text leading-relaxed space-y-4">
      {parseMDX(content)}
    </div>
  );
};
