"use client";

import ResponsiveTabSelector from "@/components/responsive-tab-selector";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { problemsData } from "@/lib/problems";
import { Camera, Clock, Lock, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import ProblemCodeVerificationModal from "./problem-code-verification-modal";

interface Problem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  estimatedTime: string;
  requiresWebcam: boolean;
  language: string;
  requiresCoding: boolean;
  requiresVerificationCode: boolean;
}

const problems: Problem[] = Object.values(problemsData).map((problem) => ({
  id: problem.id,
  title: problem.title,
  difficulty: problem.difficulty,
  estimatedTime: problem.estimatedTime,
  requiresWebcam: problem.requiresWebcam,
  language: problem.language,
  requiresCoding: problem.requiresCoding,
  requiresVerificationCode: problem.requiresVerificationCode,
}));

interface ProblemSelectionProps {
  onSelectProblem: (problemId: string) => void;
  completedProblems?: string[];
}

export default function ProblemSelection({
  onSelectProblem,
  completedProblems = [],
}: ProblemSelectionProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-neobrutal-softGreen text-neobrutal-softGreenText";
      case "Medium":
        return "bg-neobrutal-softYellow text-neobrutal-softYellowText";
      case "Hard":
        return "bg-neobrutal-softRed text-neobrutal-softRedText";
      default:
        return "bg-neobrutal-bg text-neobrutal-text";
    }
  };

  const [selectedLanguageFilter, setSelectedLanguageFilter] = useState("All");
  const [showCompleted, setShowCompleted] = useState(true);
  const { setTheme, theme = "light" } = useTheme();

  const [showCodeVerificationModal, setShowCodeVerificationModal] =
    useState(false);
  const [problemToVerify, setProblemToVerify] = useState<{
    id: string;
    title: string;
    expectedCode: string;
  } | null>(null);

  const filteredProblems = problems.filter((problem) => {
    const matchesLanguage =
      selectedLanguageFilter === "All" ||
      problem.language === selectedLanguageFilter;
    const isCompleted = completedProblems.includes(problem.id);

    if (!showCompleted && isCompleted) {
      return false;
    }

    return matchesLanguage;
  });

  const handleSelectProblemClick = (problemId: string) => {
    const problemDetails = problemsData[problemId];
    if (problemDetails) {
      if (problemDetails.requiresVerificationCode) {
        setProblemToVerify({
          id: problemDetails.id,
          title: problemDetails.title,
          expectedCode: problemDetails.verificationCode,
        });
        setShowCodeVerificationModal(true);
      } else {
        onSelectProblem(problemDetails.id);
      }
    }
  };

  const handleCodeVerification = (enteredCode: string) => {
    if (problemToVerify && enteredCode === problemToVerify.expectedCode) {
      setShowCodeVerificationModal(false);
      onSelectProblem(problemToVerify.id);
      setProblemToVerify(null);
    } else {
      return false;
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-neobrutal-bg py-12 text-neobrutal-text">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neobrutal-text mb-4">
            Coding Skill Test
          </h1>
          <p className="text-xl text-neobrutal-text/90">
            Choose a problem to start your assessment
          </p>
        </div>

        <ResponsiveTabSelector
          items={[
            { value: "All", label: "All" },
            { value: "javascript", label: "JavaScript" },
            { value: "react", label: "ReactJs" },
            { value: "python", label: "Python" },
          ]}
          selectedValue={selectedLanguageFilter}
          onValueChange={setSelectedLanguageFilter}
          className="mb-8"
          listClassName="grid w-full grid-cols-2 sm:grid-cols-3 border-2 border-neobrutal-border shadow-[2px_2px_0px_0px_#333333]"
          triggerClassName="data-[state=active]:bg-neobrutal-softBlue data-[state=active]:text-neobrutal-softBlueText data-[state=active]:shadow-[inset_0px_0px_0px_2px_#333333]"
        />

        <div className="flex items-center space-x-2 mb-8 justify-end">
          <Switch
            id="show-completed"
            checked={showCompleted}
            onCheckedChange={setShowCompleted}
            className="data-[state=checked]:bg-neobrutal-softBlue data-[state=unchecked]:bg-neobrutal-border"
          />
          <Label htmlFor="show-completed" className="text-neobrutal-text">
            Show Completed Problems
          </Label>
        </div>

        <div className="grid gap-6">
          {filteredProblems.map((problem) => {
            const isCompleted = completedProblems.includes(problem.id);
            return (
              <div
                key={problem.id}
                className="bg-neobrutal-card rounded-lg border-2 border-neobrutal-border p-6 shadow-[4px_4px_0px_0px_#333333] hover:shadow-[6px_6px_0px_0px_#333333] transition-all duration-200 ease-in-out"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-neobrutal-text mb-3">
                      {problem.title}
                    </h3>

                    <div className="flex items-center space-x-1 text-sm text-neobrutal-text/80 mb-2">
                      <Clock className="w-4 h-4" />
                      <span>{problem.estimatedTime}</span>
                    </div>

                    <div className="flex items-center flex-wrap gap-2">
                      <Badge className={getDifficultyColor(problem.difficulty)}>
                        {problem.difficulty}
                      </Badge>
                      {problem.requiresWebcam && (
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1 bg-neobrutal-gray text-neobrutal-text"
                        >
                          <Camera className="w-3 h-3" /> Webcam
                        </Badge>
                      )}
                      {problem.requiresVerificationCode && (
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1 bg-neobrutal-softRed text-neobrutal-softRedText"
                        >
                          <Lock className="w-3 h-3" /> Locked
                        </Badge>
                      )}
                      {isCompleted && (
                        <Badge
                          variant="default"
                          className="bg-neobrutal-softGreen text-neobrutal-softGreenText"
                        >
                          Completed
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={() => handleSelectProblemClick(problem.id)}
                    className="ml-6 bg-neobrutal-softBlue hover:bg-neobrutal-softBlue/90 text-neobrutal-softBlueText"
                    disabled={isCompleted}
                  >
                    Select Problem
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="shadow-[4px_4px_0px_0px_#333333] border-2 border-neobrutal-border bg-neobrutal-card text-neobrutal-text hover:bg-neobrutal-card/90"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>

      {problemToVerify && (
        <ProblemCodeVerificationModal
          isOpen={showCodeVerificationModal}
          problemTitle={problemToVerify.title}
          expectedCode={problemToVerify.expectedCode}
          onVerify={handleCodeVerification}
          onClose={() => {
            setShowCodeVerificationModal(false);
            setProblemToVerify(null);
          }}
        />
      )}
    </div>
  );
}
