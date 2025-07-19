"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"; // Import Accordion components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { formatHtml } from "@/lib/utils";
import { ChevronDown, Code, Eye } from "lucide-react";
import React from "react"; // Import React for useState

interface HtmlPreviewProps {
  expectedHtmlContent: (string | null)[];
  userHtmlOutputs: (string | null)[] | null;
}

// Function to process HTML content for preview, adding inline styles for neobrutalism
const processHtmlForPreview = (htmlString: string | null) => {
  if (!htmlString) return "";

  // Replace className with class for valid HTML
  let processedHtml = htmlString
    .replace(
      /className="list"/g,
      'class="list" style="padding: 20px; background: #F0F0F0; border-radius: 8px; border: 1px solid #E0E0E0;"' // Simplified styling
    )
    .replace(
      /className="card"/g,
      'class="card" style="background: #FFFFFF; padding: 16px; margin-bottom: 12px; border-radius: 8px; border: 1px solid #E0E0E0;"' // Simplified styling
    )
    .replace(
      /className="user-list"/g,
      'class="user-list" style="padding: 20px; background: #F0F0F0; border-radius: 8px; border: 1px solid #E0E0E0;"' // Simplified styling
    )
    .replace(
      /className="user-card"/g,
      'class="user-card" style="background: #FFFFFF; padding: 16px; margin-bottom: 12px; border-radius: 8px; border: 1px solid #E0E0E0;"' // Simplified styling
    )
    .replace(
      /className="status active"/g,
      'class="status active" style="background: #D4EDDA; color: #285A3B; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;"'
    )
    .replace(
      /className="status inactive"/g,
      'class="status inactive" style="background: #F8D7DA; color: #721C24; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;"'
    )
    .replace(
      /className="no-users"/g,
      'class="no-users" style="text-align: center; color: #1A1A1A; font-style: italic; padding: 40px;"'
    )
    .replace(
      /className="product-grid"/g,
      'class="product-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px; padding: 20px; background: #F0F0F0; border-radius: 8px; border: 1px solid #E0E0E0;"' // Simplified styling
    )
    .replace(
      /className="product-card"/g,
      'class="product-card" style="background: #FFFFFF; padding: 16px; border-radius: 8px; border: 1px solid #E0E0E0;"' // Simplified styling
    )
    .replace(
      /className="price"/g,
      'class="price" style="font-size: 18px; font-weight: bold; color: #285A3B; margin: 8px 0;"'
    )
    .replace(
      /className="available"/g,
      'class="available" style="background: #D4EDDA; color: #285A3B; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;"'
    )
    .replace(
      /className="no-products"/g,
      'class="no-products" style="text-align: center; color: #1A1A1A; font-style: italic; padding: 40px;"'
    )
    .replace(
      /<h3>/g,
      '<h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600; color: #111827;">'
    )
    .replace(
      /<p>/g,
      '<p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">'
    )
    .replace(
      /<img /g,
      '<img style="width: 100%; height: 120px; object-fit: cover; border-radius: 4px; margin-bottom: 8px; background: #e5e7eb; border: 1px solid #D0D0D0;" ' // Simplified styling
    );
  // Add inline styles for common shadcn/neobrutalism classes
  // This is a simplified approach; a more robust solution might involve a CSS parser or a headless browser.
  const styleMap: { [key: string]: string } = {
    "bg-neobrutal-card":
      "background-color: #f0f0f0; border: 2px solid #333333; box-shadow: 4px 4px 0px 0px #333333;",
    "text-neobrutal-text": "color: #333333;",
    "text-neobrutal-softGreenText": "color: #228B22;",
    "bg-neobrutal-softGreen": "background-color: #90EE90;",
    "text-neobrutal-softRedText": "color: #B22222;",
    "bg-neobrutal-softRed": "background-color: #FF6347;",
    "text-neobrutal-softYellowText": "color: #DAA520;",
    "bg-neobrutal-softYellow": "background-color: #FFD700;",
    "border-neobrutal-border": "border-color: #333333;",
    "rounded-lg": "border-radius: 0.5rem;",
    "p-4": "padding: 1rem;",
    "p-2": "padding: 0.5rem;",
    "mb-2": "margin-bottom: 0.5rem;",
    flex: "display: flex;",
    "items-center": "align-items: center;",
    "justify-between": "justify-content: space-between;",
    "gap-2": "gap: 0.5rem;",
    "font-bold": "font-weight: 700;",
    "text-sm": "font-size: 0.875rem;",
    "text-xs": "font-size: 0.75rem;",
    "w-full": "width: 100%;",
    "h-10": "height: 2.5rem;",
    "px-4": "padding-left: 1rem; padding-right: 1rem;",
    "py-2": "padding-top: 0.5rem; padding-bottom: 0.5rem;",
    "shadow-[2px_2px_0px_0px_#333333]": "box-shadow: 2px 2px 0px 0px #333333;",
    "border-2": "border-width: 2px;",
    border: "border-width: 1px; border-style: solid;",
    "bg-neobrutal-bg": "background-color: #ffffff;",
    "text-neobrutal-text/90": "color: rgba(51, 51, 51, 0.9);",
    "text-neobrutal-text/80": "color: rgba(51, 51, 51, 0.8);",
    "text-neobrutal-text/70": "color: rgba(51, 51, 51, 0.7);",
    "text-neobrutal-text/60": "color: rgba(51, 51, 51, 0.6);",
    "text-neobrutal-text/50": "color: rgba(51, 51, 51, 0.5);",
    "text-neobrutal-card": "color: #f0f0f0;",
    "bg-neobrutal-border": "background-color: #333333;",
    "bg-neobrutal-softBlue": "background-color: #ADD8E6;",
    "text-neobrutal-softBlueText": "color: #00008B;",
    grid: "display: grid;",
    "grid-cols-2": "grid-template-columns: repeat(2, minmax(0, 1fr));",
    "grid-cols-3": "grid-template-columns: repeat(3, minmax(0, 1fr));",
    "grid-cols-4": "grid-template-columns: repeat(4, minmax(0, 1fr));",
    "grid-cols-5": "grid-template-columns: repeat(5, minmax(0, 1fr));",
    "grid-cols-6": "grid-template-columns: repeat(6, minmax(0, 1fr));",
    "gap-4": "gap: 1rem;",
    "gap-6": "gap: 1.5rem;",
    "flex-col": "flex-direction: column;",
    "space-y-4": "margin-top: 1rem; margin-bottom: 1rem;", // Simplified for preview
    "space-y-2": "margin-top: 0.5rem; margin-bottom: 0.5rem;", // Simplified for preview
    "space-y-1": "margin-top: 0.25rem; margin-bottom: 0.25rem;", // Simplified for preview
    "font-mono": "font-family: monospace;",
    "leading-relaxed": "line-height: 1.625;",
    "whitespace-pre-wrap": "white-space: pre-wrap;",
    "break-all": "word-break: break-all;",
    "mt-2": "margin-top: 0.5rem;",
    "mt-6": "margin-top: 1.5rem;",
    "mb-3": "margin-bottom: 0.75rem;",
    "mb-4": "margin-bottom: 1rem;",
    "mb-6": "margin-bottom: 1.5rem;",
    "mb-8": "margin-bottom: 2rem;",
    "w-32": "width: 8rem;",
    "h-24": "height: 6rem;",
    "object-cover": "object-fit: cover;",
    absolute: "position: absolute;",
    "bottom-1": "bottom: 0.25rem;",
    "left-1": "left: 0.25rem;",
    "px-1": "padding-left: 0.25rem; padding-right: 0.25rem;",
    "py-0.5": "padding-top: 0.125rem; padding-bottom: 0.125rem;",
    "min-w-[50px]": "min-width: 50px;",
    "h-[300px]": "height: 300px;",
    "h-96": "height: 24rem;",
    "max-h-40": "max-height: 10rem;",
    "max-h-32": "max-height: 8rem;",
    "overflow-y-auto": "overflow-y: auto;",
    "overflow-x-auto": "overflow-x: auto;",
    "shadow-[inset_2px_2px_0px_0px_#333333]":
      "box-shadow: inset 2px 2px 0px 0px #333333;",
    "shadow-[inset_0px_0px_0px_2px_#333333]":
      "box-shadow: inset 0px 0px 0px 2px #333333;",
    "shadow-[4px_4px_0px_0px_#333333]": "box-shadow: 4px 4px 0px 0px #333333;",
    "shadow-[1px_1px_0px_0px_#333333]": "box-shadow: 1px 1px 0px 0px #333333;",
    "active:shadow-[2px_2px_0px_0px_#333333]": "", // Handled by JS for active state
    "active:translate-x-[2px]": "", // Handled by JS for active state
    "active:translate-y-[2px]": "", // Handled by JS for active state
    "hover:bg-neobrutal-softGreen/90": "", // Handled by JS for hover state
    "hover:bg-neobrutal-border/90": "", // Handled by JS for hover state
    "hover:shadow-[1px_1px_0px_0px_#333333]": "", // Handled by JS for hover state
    "hover:translate-x-[1px]": "", // Handled by JS for hover state
    "hover:translate-y-[1px]": "", // Handled by JS for hover state
    "bg-neobrutal-primary": "background-color: #FFD700;", // Example primary color
    "text-neobrutal-primaryText": "color: #333333;", // Example primary text color
    "bg-neobrutal-accent": "background-color: #ADD8E6;", // Example accent color
    "text-neobrutal-accentText": "color: #00008B;", // Example accent text color
    "bg-neobrutal-softRed/20": "background-color: rgba(255, 99, 71, 0.2);",
    // Add more as needed based on your Tailwind config
  };

  // Apply inline styles based on classes found
  for (const [cls, style] of Object.entries(styleMap)) {
    const regex = new RegExp(`class="([^"]*\\s)?${cls}(\\s[^"]*)?"`, "g");
    processedHtml = processedHtml.replace(/className="/g, 'class="');
    processedHtml = processedHtml.replace(regex, (match, p1, p2) => {
      const hasStyle = /style="/.test(match);
      const newStyleAttr = hasStyle
        ? match.replace(/style="([^"]*)"/, (m, s) => `style="${s} ${style}"`)
        : `${match} style="${style}"`;

      return match
        .replace(/style="[^"]*"/, "")
        .replace(
          `class="${p1 || ""}${cls}${p2 || ""}"`,
          `class="${p1 || ""}${cls}${p2 || ""}" style="${newStyleAttr}"`
        );
    });
  }

  return processedHtml;
};

export default function HtmlPreview({
  expectedHtmlContent,
  userHtmlOutputs,
}: HtmlPreviewProps) {
  const safeExpectedHtml = Array.isArray(expectedHtmlContent)
    ? expectedHtmlContent
    : [];
  const safeUserHtml = Array.isArray(userHtmlOutputs) ? userHtmlOutputs : [];

  const hasMultipleTestCases =
    safeExpectedHtml.length > 1 || safeUserHtml.length > 1;

  const defaultTab = safeExpectedHtml.length > 0 ? `expected-${0}` : "";
  const [activeTab, setActiveTab] = React.useState<string | undefined>(
    defaultTab
  );

  return (
    <Card className="border-2 border-neobrutal-border shadow-[4px_4px_0px_0px_#333333] bg-neobrutal-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          HTML Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion
          type="single"
          collapsible
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value === activeTab ? undefined : value)
          }
          className="w-full"
        >
          {safeExpectedHtml.map((content, index) => (
            <AccordionItem
              key={`expected-content-${index}`}
              value={`expected-${index}`}
              className="border-b-2 border-neobrutal-border shadow-[2px_2px_0px_0px_#333333] mb-4 rounded-lg overflow-hidden"
            >
              <AccordionTrigger className="flex items-center justify-between p-4 bg-neobrutal-card text-neobrutal-text hover:bg-neobrutal-bg/90 border-b-2 border-neobrutal-border">
                <span className="font-semibold">
                  Expected{" "}
                  {hasMultipleTestCases ? `Case ${index + 1}` : "Output"}
                </span>
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-neobrutal-bg">
                <div className="border-2 border-neobrutal-border rounded-lg p-4 bg-neobrutal-bg shadow-[2px_2px_0px_0px_#333333]">
                  <h4 className="font-medium text-neobrutal-text mb-3">
                    Rendered HTML:
                  </h4>
                  <div
                    className="w-full min-h-[100px] border-2 border-neobrutal-border rounded-lg p-4 bg-background text-foreground overflow-auto shadow-[inset_2px_2px_0px_0px_#333333]"
                    dangerouslySetInnerHTML={{
                      __html: processHtmlForPreview(content),
                    }}
                  />
                  <Collapsible className="mt-4">
                    <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-neobrutal-text/80 hover:text-neobrutal-text">
                      <Code className="h-4 w-4" />
                      Show Raw HTML
                      <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                      <pre className="bg-neobrutal-border text-neobrutal-card p-3 rounded-lg text-xs font-mono overflow-x-auto shadow-[inset_2px_2px_0px_0px_#333333]">
                        <code>
                          {formatHtml(content) || "No HTML content to display."}
                        </code>
                      </pre>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}

          {safeUserHtml.map((content, index) => (
            <AccordionItem
              key={`user-content-${index}`}
              value={`user-${index}`}
              className="border-b-2 border-neobrutal-border shadow-[2px_2px_0px_0px_#333333] mb-4 rounded-lg overflow-hidden"
            >
              <AccordionTrigger className="flex items-center justify-between p-4 bg-neobrutal-card text-neobrutal-text hover:bg-neobrutal-bg/90 border-b-2 border-neobrutal-border">
                <span className="font-semibold">
                  Your Output {hasMultipleTestCases ? `Case ${index + 1}` : ""}
                </span>
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-neobrutal-bg">
                <div className="border-2 border-neobrutal-border rounded-lg p-4 bg-neobrutal-bg shadow-[2px_2px_0px_0px_#333333]">
                  <h4 className="font-medium text-neobrutal-text mb-3">
                    Rendered HTML:
                  </h4>
                  <div
                    className="w-full min-h-[100px] border-2 border-neobrutal-border rounded-lg p-4 bg-background text-foreground overflow-auto shadow-[inset_2px_2px_0px_0px_#333333]"
                    dangerouslySetInnerHTML={{
                      __html: processHtmlForPreview(content),
                    }}
                  />
                  <Collapsible className="mt-4">
                    <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-neobrutal-text/80 hover:text-neobrutal-text">
                      <Code className="h-4 w-4" />
                      Show Raw HTML
                      <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                      <pre className="bg-neobrutal-border text-neobrutal-card p-3 rounded-lg text-xs font-mono overflow-x-auto shadow-[inset_2px_2px_0px_0px_#333333]">
                        <code>
                          {formatHtml(content) || "No HTML content to display."}
                        </code>
                      </pre>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
