"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

export interface CodeEditorProps {
  // A very loose shape; adapt as needed
  problem: {
    id: string
    title: string
    description: string
    difficulty?: "Easy" | "Medium" | "Hard"
    languages?: string[]
  }
  onFinishTest: () => void
  onExitTest: () => void
  timeLeft: number
  tabSwitchCount: number
  refreshCount: number
}

export default function CodeEditor({
  problem,
  onFinishTest,
  onExitTest,
  timeLeft,
  tabSwitchCount,
  refreshCount,
}: CodeEditorProps) {
  const [language, setLanguage] = useState(problem.languages?.[0] ?? "javascript")
  const [code, setCode] = useState("")

  return (
    <section className="flex flex-col gap-6 p-6 overflow-y-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between bg-card border rounded-lg p-4 shadow">
        <div className="flex items-center gap-3">
          <h2 className="font-bold text-lg">{problem.title}</h2>
          {problem.difficulty && (
            <Badge
              className={
                problem.difficulty === "Easy"
                  ? "bg-emerald-500 text-white"
                  : problem.difficulty === "Medium"
                    ? "bg-amber-500 text-white"
                    : "bg-rose-500 text-white"
              }
            >
              {problem.difficulty}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span>
            Time&nbsp;Left: {Math.floor(timeLeft / 60)}:{("0" + (timeLeft % 60)).slice(-2)}
          </span>
          <span>Tab&nbsp;Warn: {tabSwitchCount}</span>
          <span>Refresh&nbsp;Warn: {refreshCount}</span>
          <Button variant="destructive" size="sm" onClick={onExitTest}>
            <X className="w-4 h-4 mr-1" /> Exit
          </Button>
        </div>
      </div>

      {/* Problem description */}
      <div className="prose dark:prose-invert max-w-none bg-card p-4 border rounded-lg">
        <h3>Description</h3>
        <p className="whitespace-pre-line">{problem.description}</p>
      </div>

      {/* Simple editor */}
      <div className="flex flex-col gap-4">
        <Tabs defaultValue={language} onValueChange={(val) => setLanguage(val)}>
          <TabsList className="grid w-full max-w-sm grid-cols-2">
            {(problem.languages ?? ["javascript", "python"]).map((lang) => (
              <TabsTrigger key={lang} value={lang}>
                {lang}
              </TabsTrigger>
            ))}
          </TabsList>

          {(problem.languages ?? ["javascript", "python"]).map((lang) => (
            <TabsContent key={lang} value={lang}>
              <textarea
                className="w-full h-56 p-3 font-mono text-sm bg-background border rounded-lg"
                placeholder={`Write your ${lang} solution here...`}
                value={language === lang ? code : ""}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
              />
            </TabsContent>
          ))}
        </Tabs>

        <div className="flex gap-2">
          <Button onClick={onFinishTest}>Finish Test</Button>
          <Button variant="outline" onClick={onExitTest}>
            Exit Without Finishing
          </Button>
        </div>
      </div>
    </section>
  )
}
