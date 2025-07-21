"use client";

import { problemsData } from "@/lib/problems";
import {
  convertTimeToSeconds,
  extractComponentName,
  formatTime,
} from "@/lib/utils";
import { useAlertStore } from "@/store/alertStore";
import * as Babel from "@babel/standalone";
import { AlertTriangle } from "lucide-react";
import type React from "react";
import type { ClipboardEvent } from "react";
// @ts-ignore - Prettier plugins need to be imported this way
import * as babelPlugin from "prettier/plugins/babel?external";
// @ts-ignore - Prettier plugins need to be imported this way
import * as estreePlugin from "prettier/plugins/estree?external";
import * as prettier from "prettier/standalone";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTimer } from './refactored/useTimer';
import { useWebcam } from './refactored/useWebcam';
import { useCodeExecution } from './refactored/useCodeExecution';

const MAX_EXITS = 2; // Define max exits allowed

interface InProgressTest {
  problemId: string;
  timeLeft: number;
  exitCount: number;
}

export function useTestPlatform() {
  const [currentScreen, setCurrentScreen] = useState<
    "selection" | "start" | "test"
  >("selection");
  const [selectedProblemId, setSelectedProblemId] = useState<string>("");
  const [code, setCode] = useState("");
  const [showRefreshModal, setShowRefreshModal] = useState(false);
  const [showTabWarning, setShowTabWarning] = useState(false);
  const [showExitConfirmationModal, setShowExitConfirmationModal] =
    useState(false);
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);
  const [showInactivityModal, setShowInactivityModal] = useState(false);
  const [showFinishTestModal, setShowFinishTestModal] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedEditorLanguage, setSelectedEditorLanguage] =
    useState<string>("javascript");
  const [completedProblems, setCompletedProblems] = useState<string[]>([]);
  const [inProgressTest, setInProgressTest] = useState<InProgressTest | null>(
    null
  );
  const [pasteWarningCount, setPasteWarningCount] = useState(0); // State for paste warnings
  const [showPasteWarningModal, setShowPasteWarningModal] = useState(false); // State to control modal visibility

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hiddenTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hiddenStartTimeRef = useRef<number | null>(null);

  const { showAlert } = useAlertStore();

  const currentProblem = selectedProblemId
    ? problemsData[selectedProblemId]
    : null;

  const handleTimeUp = useCallback(() => {
    setShowTimeUpModal(true);
  }, []);

  const {
    timeLeft,
    isTimerRunning,
    startTimer,
    stopTimer,
    resetTimer,
    setTimeLeft,
    setIsTimerRunning,
  } = useTimer(0, handleTimeUp);

  const {
    webcamStream,
    eyeAwayCount,
    startWebcam,
    stopWebcam,
    setEyeAwayCount,
  } = useWebcam(videoRef);

  const {
    testResults,
    isRunningTests,
    consoleOutput,
    userHtmlOutputs,
    runTests,
  } = useCodeExecution(selectedProblemId, selectedEditorLanguage, code);

  useEffect(() => {
    if (isRunningTests) {
      setShowResults(true);
    }
  }, [isRunningTests]);

  // Load completed problems and in-progress test from localStorage on mount
  useEffect(() => {
    const storedCompletedProblems = localStorage.getItem("completedProblems");
    if (storedCompletedProblems) {
      try {
        setCompletedProblems(JSON.parse(storedCompletedProblems));
      } catch (e) {
        console.error(
          "Failed to parse completed problems from localStorage",
          e
        );
        setCompletedProblems([]);
      }
    }

    const storedInProgressTest = localStorage.getItem("inProgressTest");
    if (storedInProgressTest) {
      try {
        setInProgressTest(JSON.parse(storedInProgressTest));
      } catch (e) {
        console.error("Failed to parse in-progress test from localStorage", e);
        setInProgressTest(null);
      }
    }
  }, []);

  // Function to mark a problem as completed (failed or passed)
  const markProblemAsCompleted = useCallback((problemId: string) => {
    setCompletedProblems((prev) => {
      const newCompleted = [...new Set([...prev, problemId])];
      localStorage.setItem("completedProblems", JSON.stringify(newCompleted));
      return newCompleted;
    });
  }, []);

  const resetTestState = useCallback(() => {
    stopTimer();
    stopWebcam();
    setCurrentScreen("selection");
    setSelectedProblemId("");
    setViolationCount(0);
    setShowTimeUpModal(false);
    setShowInactivityModal(false);
    setShowFinishTestModal(false);
    if (hiddenTimerRef.current) {
      clearTimeout(hiddenTimerRef.current);
      hiddenTimerRef.current = null;
    }
    hiddenStartTimeRef.current = null;
  }, [stopTimer, stopWebcam]);

  // Function to fail the test due to inactivity - now shows modal instead of alert
  const failTestDueToInactivity = useCallback(() => {
    setShowInactivityModal(true);
  }, []);

  // Function to confirm time up modal
  const confirmTimeUp = useCallback(() => {
    if (currentProblem) {
      markProblemAsCompleted(currentProblem.id);
    }
    localStorage.removeItem("inProgressTest");
    resetTestState();
  }, [currentProblem, markProblemAsCompleted, resetTestState]);

  // Function to confirm inactivity modal
  const confirmInactivity = useCallback(() => {
    if (currentProblem) {
      markProblemAsCompleted(currentProblem.id);
    }
    localStorage.removeItem("inProgressTest");
    resetTestState();
  }, [currentProblem, markProblemAsCompleted, resetTestState]);

  // Function to handle finish test button
  const handleFinishTest = useCallback(() => {
    setShowFinishTestModal(true);
  }, []);

  // Function to confirm finish test
  const confirmFinishTest = useCallback(() => {
    setShowFinishTestModal(false);
    if (currentProblem) {
      markProblemAsCompleted(currentProblem.id); // Mark problem as completed
    }
    localStorage.removeItem("inProgressTest"); // Clear in-progress test
    resetTestState(); // Redirect to selection screen
  }, [currentProblem, markProblemAsCompleted, resetTestState]);

  // Function to cancel finish test
  const cancelFinishTest = useCallback(() => {
    setShowFinishTestModal(false);
  }, []);

  // New function to handle exiting a test, including exit count logic
  const handleExitTest = useCallback(
    (isIntentionalExit: boolean) => {
      if (!currentProblem || currentScreen !== "test") {
        resetTestState();
        return;
      }

      let currentExitCount = inProgressTest?.exitCount || 0;

      if (isIntentionalExit) {
        currentExitCount += 1;
      }

      if (currentExitCount >= MAX_EXITS) {
        markProblemAsCompleted(currentProblem.id);
        localStorage.removeItem("inProgressTest");
        setInProgressTest(null);
        resetTestState();
        return;
      }

      const newInProgressState = {
        problemId: currentProblem.id,
        timeLeft: timeLeft,
        exitCount: currentExitCount,
      };
      setInProgressTest(newInProgressState);
      localStorage.setItem(
        "inProgressTest",
        JSON.stringify(newInProgressState)
      );

      resetTestState();
    },
    [
      currentProblem,
      currentScreen,
      inProgressTest,
      timeLeft,
      markProblemAsCompleted,
      resetTestState,
    ]
  );

  const handleGoBack = useCallback(() => {
    setShowExitConfirmationModal(true);
  }, []);

  const confirmExitAndFail = useCallback(() => {
    setShowExitConfirmationModal(false);
    handleExitTest(true);
  }, [handleExitTest]);

  const cancelExit = useCallback(() => {
    setShowExitConfirmationModal(false);
  }, []);

  // Save inProgressTest when test is active and state changes
  useEffect(() => {
    if (currentScreen === "test" && isTimerRunning && selectedProblemId) {
      localStorage.setItem(
        "inProgressTest",
        JSON.stringify({
          problemId: selectedProblemId,
          timeLeft: timeLeft,
          exitCount: inProgressTest?.exitCount || 0,
        })
      );
    } else if (
      currentScreen === "selection" &&
      !selectedProblemId &&
      inProgressTest
    ) {
      localStorage.removeItem("inProgressTest");
      setInProgressTest(null);
    }
  }, [
    currentScreen,
    isTimerRunning,
    selectedProblemId,
    timeLeft,
    inProgressTest,
  ]);

  // Tab switching detection and refresh prevention
  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      setViolationCount((prev) => prev + 1);
      setShowTabWarning(true);

      if (!hiddenTimerRef.current) {
        hiddenStartTimeRef.current = Date.now();
        hiddenTimerRef.current = setTimeout(() => {
          failTestDueToInactivity();
        }, 30000);
      }

      if (violationCount >= 3) {
        showAlert({
          title: "Gagal!",
          description: `Anda telah melanggar peraturan karna membuka tab lain selama test berlangsung. Tes dianggap gagal.`,
          icon: AlertTriangle,
          variant: "error",
        });
        if (currentProblem) {
          markProblemAsCompleted(currentProblem.id);
        }
        localStorage.removeItem("inProgressTest");
        resetTestState();
      }
    } else {
      if (hiddenTimerRef.current) {
        clearTimeout(hiddenTimerRef.current);
        hiddenTimerRef.current = null;
      }
      hiddenStartTimeRef.current = null;
    }
  }, [
    violationCount,
    failTestDueToInactivity,
    currentProblem,
    markProblemAsCompleted,
    resetTestState,
  ]);

  const handleBeforeUnload = useCallback(
    (e: BeforeUnloadEvent) => {
      // Only prevent if we are in the test screen and not intentionally leaving
      if (currentScreen === "test" && !isLeavingConfirmedRef.current) {
        e.preventDefault();
        e.returnValue = "";

        setTimeout(() => {
          setShowRefreshModal(true);
        }, 0);
        return "";
      }
    },
    [currentScreen, stopWebcam]
  );

  const isLeavingConfirmedRef = useRef(false);

  const handleLeavingConfirmation = useCallback(() => {
    isLeavingConfirmedRef.current = true;
    handleExitTest(true);
    stopWebcam();
    window.location.reload();
  }, [handleExitTest, stopWebcam]);

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Store the confirmation handler for the modal
    if (typeof window !== "undefined") {
      (window as any).handleLeavingConfirmation = handleLeavingConfirmation;
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);

      if (hiddenTimerRef.current) {
        clearTimeout(hiddenTimerRef.current);
      }
    };
  }, [handleVisibilityChange, handleBeforeUnload, handleLeavingConfirmation]);

  const handleSelectProblem = useCallback(
    (problemId: string) => {
      if (inProgressTest && inProgressTest.problemId !== problemId) {
        localStorage.removeItem("inProgressTest");
        setInProgressTest(null);
      }
      setSelectedProblemId(problemId);
      setCurrentScreen("start");
    },
    [inProgressTest]
  );

  const handleStartTest = useCallback(() => {
    if (currentProblem) {
      const defaultLang = currentProblem.languages.includes("javascript")
        ? "javascript"
        : currentProblem.languages[0];
      setCode(currentProblem.solutions[defaultLang].initialCodeTemplate);
      setSelectedEditorLanguage(defaultLang);
      setCurrentScreen("test");
      startTimer();
      setViolationCount(0); // Reset violation count when starting a new test
      if (currentProblem.requiresWebcam) {
        startWebcam();
      }
      resetTimer(convertTimeToSeconds(currentProblem.estimatedTime));
    }
  }, [currentProblem, startWebcam, startTimer, resetTimer]);

  const handleCancelStartTest = useCallback(() => {
    setCurrentScreen("selection");
    setSelectedProblemId("");
  }, []);

  const handlePaste = useCallback(
    (event: ClipboardEvent<HTMLTextAreaElement>) => {
      event.preventDefault();
      setPasteWarningCount((prev) => prev + 1);
      setShowPasteWarningModal(true);
      if (pasteWarningCount >= 3) {
        if (currentProblem) {
          failTestDueToInactivity();
          markProblemAsCompleted(currentProblem.id);
        }
        localStorage.removeItem("inProgressTest");
        resetTestState();
      } else {
        if (hiddenTimerRef.current) {
          clearTimeout(hiddenTimerRef.current);
          hiddenTimerRef.current = null;
        }
        hiddenStartTimeRef.current = null;
      }
    },
    [pasteWarningCount]
  );

  const handleClosePasteWarningModal = () => {
    setShowPasteWarningModal(false);
  };

  const hasErrors = useCallback(() => {
    const currentTemplate =
      currentProblem?.solutions[selectedEditorLanguage]?.initialCodeTemplate;
    if (!currentTemplate) return false;

    if (selectedEditorLanguage === "javascript") {
      return (
        code.includes("// Write your solution here") ||
        code.includes("// Add your logic here")
      );
    } else if (selectedEditorLanguage === "python") {
      return code.includes("# Write your solution here");
    }
    return false;
  }, [code, currentProblem, selectedEditorLanguage]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const value = textarea.value;
        const indentation = "  "; // 2 spaces for indentation

        if (start === end) {
          // Single cursor: insert indentation
          const newValue =
            value.substring(0, start) + indentation + value.substring(end);
          setCode(newValue);
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd =
              start + indentation.length;
          }, 0);
        } else {
          // Multi-line selection: indent/de-indent selected lines
          const lines = value.split("\n");
          const startLineIndex =
            value.substring(0, start).split("\n").length - 1;
          const endLineIndex = value.substring(0, end).split("\n").length - 1;

          const newCodeLines = [...lines];
          let newSelectionStart = start;
          let newSelectionEnd = end;

          if (e.shiftKey) {
            // De-indent
            for (let i = startLineIndex; i <= endLineIndex; i++) {
              if (newCodeLines[i].startsWith(indentation)) {
                newCodeLines[i] = newCodeLines[i].substring(indentation.length);
                if (i === startLineIndex)
                  newSelectionStart = Math.max(
                    0,
                    newSelectionStart - indentation.length
                  );
                if (i === endLineIndex)
                  newSelectionEnd = Math.max(
                    0,
                    newSelectionEnd - indentation.length
                  );
              } else if (newCodeLines[i].startsWith("\t")) {
                newCodeLines[i] = newCodeLines[i].substring(1);
                if (i === startLineIndex)
                  newSelectionStart = Math.max(0, newSelectionStart - 1);
                if (i === endLineIndex)
                  newSelectionEnd = Math.max(0, newSelectionEnd - 1);
              }
            }
          } else {
            // Indent
            for (let i = startLineIndex; i <= endLineIndex; i++) {
              newCodeLines[i] = indentation + newCodeLines[i];
              if (i === startLineIndex) newSelectionStart += indentation.length;
              if (i === endLineIndex) newSelectionEnd += indentation.length;
            }
          }
          setCode(newCodeLines.join("\n"));
          setTimeout(() => {
            textarea.selectionStart = newSelectionStart;
            textarea.selectionEnd = newSelectionEnd;
          }, 0);
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        e.preventDefault();

        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const lines = code.split("\n");

        let startLine = 0;
        let charsCount = 0;
        for (let i = 0; i < lines.length; i++) {
          if (charsCount + lines[i].length + 1 > start) {
            startLine = i;
            break;
          }
          charsCount += lines[i].length + 1;
        }

        let endLine = startLine;
        if (end > start) {
          let currentChars = charsCount;
          for (let i = startLine; i < lines.length; i++) {
            if (currentChars >= end) {
              endLine = i;
              break;
            }
            currentChars += lines[i].length + 1;
            if (i === lines.length - 1 && currentChars < end) {
              endLine = i;
            }
          }
        }

        let allCommented = true;
        const commentPrefix = selectedEditorLanguage === "python" ? "#" : "//";

        for (let i = startLine; i <= endLine; i++) {
          if (!lines[i].trim().startsWith(commentPrefix)) {
            allCommented = false;
            break;
          }
        }

        const newLines = [...lines];
        let newSelectionStart = start;
        let newSelectionEnd = end;

        for (let i = startLine; i <= endLine; i++) {
          const line = newLines[i];
          if (allCommented) {
            const commentIndex = line.indexOf(commentPrefix);
            if (commentIndex !== -1) {
              newLines[i] =
                line.substring(0, commentIndex) +
                line.substring(commentIndex + commentPrefix.length);
              if (i === startLine)
                newSelectionStart = Math.max(0, start - commentPrefix.length);
              if (i === endLine)
                newSelectionEnd = Math.max(0, end - commentPrefix.length);
            }
          } else {
            newLines[i] = commentPrefix + line;
            if (i === startLine)
              newSelectionStart = start + commentPrefix.length;
            if (i === endLine) newSelectionEnd = end + commentPrefix.length;
          }
        }

        const newCode = newLines.join("\n");
        setCode(newCode);

        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = newSelectionStart;
            textareaRef.current.selectionEnd = newSelectionEnd;
          }
        }, 0);
      } else if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        runTests();
      }
    },
    [code, selectedEditorLanguage]
  );

  const formatCode = useCallback(async () => {
    if (!code || selectedEditorLanguage !== "javascript") {
      console.warn(
        "Code formatting is currently only supported for JavaScript."
      );
      return;
    }

    try {
      // Try to use Prettier if available
      let formatted = code;
      formatted = await prettier.format(code, {
        parser: "babel",
        plugins: [babelPlugin, estreePlugin],
        singleQuote: true,
        semi: false,
        tabWidth: 2,
        printWidth: 80,
      });

      setCode(formatted.trim());
    } catch (error) {
      console.error("Error formatting code:", error);
    }
  }, [code, selectedEditorLanguage, setCode]);

  return {
    currentScreen,
    selectedProblemId,
    timeLeft,
    isTimerRunning,
    code,
    showRefreshModal,
    showTabWarning,
    showExitConfirmationModal,
    showTimeUpModal,
    showInactivityModal,
    showFinishTestModal,
    violationCount,
    showPasteWarningModal,
    pasteWarningCount,
    testResults,
    isRunningTests,
    showResults,
    userHtmlOutputs,
    consoleOutput,
    webcamStream,
    selectedEditorLanguage,
    completedProblems,
    inProgressTest,
    textareaRef,
    videoRef,
    currentProblem,
    eyeAwayCount,
    setCurrentScreen,
    setSelectedProblemId,
    setTimeLeft,
    setIsTimerRunning,
    setCode,
    setShowRefreshModal,
    setShowTabWarning,
    setShowExitConfirmationModal,
    setViolationCount,
    setShowPasteWarningModal,
    setPasteWarningCount,
    setShowResults,
    setWebcamStream: () => {}, // mock function
    setCompletedProblems,
    setInProgressTest,
    handleGoBack,
    confirmExitAndFail,
    cancelExit,
    handleSelectProblem,
    handlePaste,
    handleClosePasteWarningModal,
    handleStartTest,
    handleCancelStartTest,
    runTests,
    handleKeyDown,
    hasErrors,
    formatTime,
    confirmTimeUp,
    confirmInactivity,
    handleFinishTest,
    confirmFinishTest,
    cancelFinishTest,
    formatCode,
    setEyeAwayCount,
  };
}
