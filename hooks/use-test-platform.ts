"use client";

import type React from "react";

import { problemsData } from "@/lib/problems";
import {
  convertTimeToSeconds,
  extractComponentName,
  formatTime,
} from "@/lib/utils";
import * as Babel from "@babel/standalone";
import { useCallback, useEffect, useRef, useState } from "react";

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
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [code, setCode] = useState("");
  const [showRefreshModal, setShowRefreshModal] = useState(false);
  const [showTabWarning, setShowTabWarning] = useState(false);
  const [showExitConfirmationModal, setShowExitConfirmationModal] =
    useState(false);
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);
  const [showInactivityModal, setShowInactivityModal] = useState(false);
  const [showFinishTestModal, setShowFinishTestModal] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [userHtmlOutputs, setUserHtmlOutputs] = useState<(string | null)[]>([]); // Changed to array
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);
  const [selectedEditorLanguage, setSelectedEditorLanguage] =
    useState<string>("javascript");
  const [completedProblems, setCompletedProblems] = useState<string[]>([]);
  const [inProgressTest, setInProgressTest] = useState<InProgressTest | null>(
    null
  );

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hiddenTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hiddenStartTimeRef = useRef<number | null>(null);

  const currentProblem = selectedProblemId
    ? problemsData[selectedProblemId]
    : null;

  // Webcam control functions
  const startWebcam = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setWebcamStream(stream);
    } catch (err) {
      console.error("Error accessing webcam:", err);
      alert(
        "Could not access webcam. Please ensure you have a webcam and have granted permission."
      );
    }
  }, []);

  const stopWebcam = useCallback(() => {
    if (webcamStream) {
      webcamStream.getTracks().forEach((track) => track.stop());
      setWebcamStream(null);
    }
  }, [webcamStream]);

  // Effect to set webcam stream to video element
  useEffect(() => {
    if (videoRef.current && webcamStream) {
      videoRef.current.srcObject = webcamStream;
    }
    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [webcamStream]);

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
    setIsTimerRunning(false);
    stopWebcam();
    setCurrentScreen("selection");
    setSelectedProblemId("");
    setViolationCount(0);
    setTestResults([]);
    setConsoleOutput([]);
    setUserHtmlOutputs([]); // Reset to empty array
    setShowTimeUpModal(false);
    setShowInactivityModal(false);
    setShowFinishTestModal(false);
    if (hiddenTimerRef.current) {
      clearTimeout(hiddenTimerRef.current);
      hiddenTimerRef.current = null;
    }
    hiddenStartTimeRef.current = null;
  }, [stopWebcam]);

  // Function to fail the test due to inactivity - now shows modal instead of alert
  const failTestDueToInactivity = useCallback(() => {
    setShowInactivityModal(true);
  }, []);

  // Function to handle time up - now shows modal instead of alert
  const handleTimeUp = useCallback(() => {
    setShowTimeUpModal(true);
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
        alert(
          `Anda telah keluar dari soal ini ${MAX_EXITS} kali. Tes dianggap gagal.`
        );
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

  // Timer logic - updated to use modal instead of alert
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isTimerRunning && timeLeft === 0) {
      handleTimeUp();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft, handleTimeUp]);

  // Tab switching detection and refresh prevention
  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      setViolationCount((prev) => prev + 1);
      setShowTabWarning(true);
      stopWebcam();

      if (!hiddenTimerRef.current) {
        hiddenStartTimeRef.current = Date.now();
        hiddenTimerRef.current = setTimeout(() => {
          failTestDueToInactivity();
        }, 30000);
      }

      if (violationCount >= 3) {
        alert("Test terminated due to multiple violations.");
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
    stopWebcam,
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
        stopWebcam();
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
      stopWebcam();
      if (hiddenTimerRef.current) {
        clearTimeout(hiddenTimerRef.current);
      }
    };
  }, [
    handleVisibilityChange,
    handleBeforeUnload,
    handleLeavingConfirmation,
    stopWebcam,
  ]);

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
      setIsTimerRunning(true);
      if (currentProblem.requiresWebcam) {
        startWebcam();
      }
      setTimeLeft(convertTimeToSeconds(currentProblem.estimatedTime));
    }
  }, [currentProblem, startWebcam]);

  const handleCancelStartTest = useCallback(() => {
    setCurrentScreen("selection");
    setSelectedProblemId("");
  }, []);

  const updateLivePreviewAndConsole = useCallback(() => {
    setConsoleOutput([]);
    if (!currentProblem) {
      setUserHtmlOutputs([]);
      return;
    }

    const capturedLogs: string[] = [];
    const customConsole = {
      log: (...args: any[]) => {
        capturedLogs.push(
          args
            .map((arg) => {
              if (typeof arg === "object" && arg !== null) {
                try {
                  return JSON.stringify(arg, null, 2);
                } catch (e) {
                  return String(arg);
                }
              }
              return String(arg);
            })
            .join(" ")
        );
      },
      warn: (...args: any[]) =>
        capturedLogs.push("WARN: " + args.map(String).join(" ")),
      error: (...args: any[]) =>
        capturedLogs.push("ERROR: " + args.map(String).join(" ")),
    };

    const problemSolution = currentProblem.solutions[selectedEditorLanguage];
    if (!problemSolution) {
      setUserHtmlOutputs([]);
      setConsoleOutput(["Live execution for this language is not supported."]);
      return;
    }

    try {
      if (selectedEditorLanguage === "javascript") {
        if (currentProblem.id.startsWith("react-")) {
          const React = {
            createElement: (type: string, props: any, ...children: any[]) => {
              const flatChildren = children
                .flat()
                .filter((child) => child !== null && child !== undefined);
              let propsStr = "";
              if (props) {
                propsStr = Object.entries(props)
                  .map(([key, value]) => {
                    if (key === "className") return `className="${value}"`;
                    if (key === "src") return `src="${value}"`;
                    if (key === "alt") return `alt="${value}"`;
                    return "";
                  })
                  .filter(Boolean)
                  .join(" ");
              }

              if (type === "img") {
                return `<${type} ${propsStr} />`;
              }
              return `<${type}${
                propsStr ? " " + propsStr : ""
              }>${flatChildren.join("")}</${type}>`;
            },
          };

          const userFunction = new Function(
            "React",
            "console",
            "return " + code
          )(React, customConsole);

          // Generate preview outputs for all test cases
          const previewOutputs: (string | null)[] = [];
          if (problemSolution.testCases.length > 0) {
            for (let i = 0; i < problemSolution.testCases.length; i++) {
              try {
                const propName = currentProblem.reactPropName;
                if (propName) {
                  const props = {
                    [propName]: problemSolution.testCases[i].input[0],
                  };
                  previewOutputs.push(userFunction(props));
                } else {
                  const errorMsg = `Error: 'reactPropName' is not defined for this React problem.`;
                  previewOutputs.push(errorMsg);
                  customConsole.error(errorMsg);
                }
              } catch (err) {
                const errorMsg = `Error in preview for test case ${i + 1}: ${
                  (err as Error).message
                }`;
                previewOutputs.push(errorMsg);
                customConsole.error(
                  `Error rendering preview for test case ${i + 1}: ${
                    (err as Error).message
                  }`
                );
              }
            }
          }
          setUserHtmlOutputs(previewOutputs);
        } else {
          const userFunction = new Function("console", "return " + code)(
            customConsole
          );
          setUserHtmlOutputs([]);
          try {
            userFunction(
              problemSolution.testCases[0]?.input[0],
              problemSolution.testCases[0]?.input[1]
            );
          } catch (err) {
            customConsole.error(
              `Error executing code for preview: ${(err as Error).message}`
            );
          }
        }
      } else if (selectedEditorLanguage === "python") {
        customConsole.log(
          "Python code preview is static. Live execution is not supported."
        );
        setUserHtmlOutputs([]);
      }
    } catch (error) {
      const errorMsg = `Compilation error for preview: ${
        (error as Error).message
      }`;
      setUserHtmlOutputs([errorMsg]);
      customConsole.error(errorMsg);
    } finally {
      setConsoleOutput(capturedLogs);
    }
  }, [code, currentProblem, selectedEditorLanguage]);

  useEffect(() => {
    const handler = setTimeout(() => {
      updateLivePreviewAndConsole();
    }, 500);
    return () => clearTimeout(handler);
  }, [
    code,
    currentProblem,
    selectedEditorLanguage,
    updateLivePreviewAndConsole,
  ]);

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
      if ((e.metaKey || e.ctrlKey) && e.key === "/") {
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

  const runTests = useCallback(async () => {
    if (!currentProblem) return;

    setIsRunningTests(true);
    setShowResults(false);
    setUserHtmlOutputs([]);
    setConsoleOutput([]);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const capturedLogs: string[] = [];
    const customConsole = {
      log: (...args: any[]) => {
        capturedLogs.push(
          args
            .map((arg) => {
              if (typeof arg === "object" && arg !== null) {
                try {
                  return JSON.stringify(arg, null, 2);
                } catch (e) {
                  return String(arg);
                }
              }
              return String(arg);
            })
            .join(" ")
        );
      },
      warn: (...args: any[]) =>
        capturedLogs.push("WARN: " + args.map(String).join(" ")),
      error: (...args: any[]) =>
        capturedLogs.push("ERROR: " + args.map(String).join(" ")),
    };

    const problemSolution = currentProblem.solutions[selectedEditorLanguage];
    if (!problemSolution) {
      setTestResults([
        {
          testCase: "Language Not Supported",
          input: null,
          expected: null,
          actual: null,
          passed: false,
          error: `Execution for ${selectedEditorLanguage} is not supported in this environment.`,
        },
      ]);
      setIsRunningTests(false);
      setShowResults(true);
      markProblemAsCompleted(currentProblem.id);
      localStorage.removeItem("inProgressTest");
      return;
    }

    try {
      if (selectedEditorLanguage === "javascript") {
        if (currentProblem.id.startsWith("react-")) {
          const results = [];
          const allHtmlOutputs: (string | null)[] = [];

          const React = {
            createElement: (type: string, props: any, ...children: any[]) => {
              const flatChildren = children
                .flat()
                .filter((child) => child !== null && child !== undefined);
              let propsStr = "";
              if (props) {
                propsStr = Object.entries(props)
                  .map(([key, value]) => {
                    if (key === "className") return `className="${value}"`;
                    if (key === "src") return `src="${value}"`;
                    if (key === "alt") return `alt="${value}"`;
                    return "";
                  })
                  .filter(Boolean)
                  .join(" ");
              }

              if (type === "img") {
                return `<${type} ${propsStr} />`;
              }
              return `<${type}${
                propsStr ? " " + propsStr : ""
              }>${flatChildren.join("")}</${type}>`;
            },
          };

          let transpiledCode = "";
          try {
            transpiledCode =
              Babel.transform(code, {
                presets: ["react"], // support JSX
              }).code || "";
          } catch (e) {
            setTestResults([
              {
                testCase: "Compilation Error",
                input: null,
                expected: null,
                actual: null,
                passed: false,
                error: "Babel compile failed: " + (e as Error).message,
              },
            ]);
            setUserHtmlOutputs([
              `Error compiling code: ${(e as Error).message}`,
            ]);
            setConsoleOutput(capturedLogs);
            setIsRunningTests(false);
            setShowResults(true);
            return;
          }

          let userFunction: any;

          try {
            const componentName = extractComponentName(code);
            if (!componentName) {
              setTestResults([
                {
                  testCase: "Error",
                  input: null,
                  expected: null,
                  actual: null,
                  passed: false,
                  error:
                    "Cannot detect component name. Make sure to name your function with PascalCase (e.g. UserList).",
                },
              ]);
              return;
            }
            userFunction = new Function(
              "React",
              "console",
              `${transpiledCode}; return ${componentName};`
            )(React, customConsole);
          } catch (err) {
            setTestResults([
              {
                testCase: "Runtime Error",
                input: null,
                expected: null,
                actual: null,
                passed: false,
                error: "Execution failed: " + (err as Error).message,
              },
            ]);
            setUserHtmlOutputs([
              `Error running code: ${(err as Error).message}`,
            ]);
            setConsoleOutput(capturedLogs);
            setIsRunningTests(false);
            setShowResults(true);
            return;
          }

          // Generate HTML outputs for all test cases
          for (let i = 0; i < problemSolution.testCases.length; i++) {
            const testCase = problemSolution.testCases[i];
            try {
              let result: any;
              const propName = currentProblem.reactPropName;
              if (propName) {
                const props = { [propName]: testCase.input[0] };
                result = userFunction(props);
                allHtmlOutputs.push(result);
              } else {
                result = `Error: 'reactPropName' is not defined for this React problem.`;
                allHtmlOutputs.push(result);
                customConsole.error(result);
              }

              const passed = result === testCase.expected;

              results.push({
                testCase: i + 1,
                input: testCase.input,
                expected: testCase.expected,
                actual: result,
                passed: passed,
                error: null,
              });
            } catch (error) {
              allHtmlOutputs.push(`Error: ${(error as Error).message}`);
              results.push({
                testCase: i + 1,
                input: testCase.input,
                expected: testCase.expected,
                actual: null,
                passed: false,
                error: (error as Error).message,
              });
            }
          }

          setUserHtmlOutputs(allHtmlOutputs);
          setTestResults(results);
        } else {
          const userFunction = new Function("console", "return " + code)(
            customConsole
          );
          const results = [];

          for (let i = 0; i < problemSolution.testCases.length; i++) {
            const testCase = problemSolution.testCases[i];
            try {
              const result = userFunction(testCase.input[0], testCase.input[1]);
              const passed =
                JSON.stringify(result) === JSON.stringify(testCase.expected);

              results.push({
                testCase: i + 1,
                input: testCase.input,
                expected: testCase.expected,
                actual: result,
                passed: passed,
                error: null,
              });
            } catch (error) {
              results.push({
                testCase: i + 1,
                input: testCase.input,
                expected: testCase.expected,
                actual: null,
                passed: false,
                error: (error as Error).message,
              });
            }
          }

          setTestResults(results);
        }
      } else if (selectedEditorLanguage === "python") {
        setTestResults([
          {
            testCase: "Execution",
            input: null,
            expected: null,
            actual: null,
            passed: false,
            error:
              "Live Python execution is not supported in this browser environment.",
          },
        ]);
        customConsole.log(
          "Python code is displayed, but live execution is not supported."
        );
      }
    } catch (error) {
      setTestResults([
        {
          testCase: "Compilation",
          input: null,
          expected: null,
          actual: null,
          passed: false,
          error: "Code compilation failed: " + (error as Error).message,
        },
      ]);
      setUserHtmlOutputs([`Error compiling code: ${(error as Error).message}`]);
      customConsole.error(`Compilation error: ${(error as Error).message}`);
    } finally {
      setConsoleOutput(capturedLogs);
    }

    setIsRunningTests(false);
    setShowResults(true);
    markProblemAsCompleted(currentProblem.id);
    localStorage.removeItem("inProgressTest");
  }, [code, currentProblem, selectedEditorLanguage, markProblemAsCompleted]);

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
    testResults,
    isRunningTests,
    showResults,
    userHtmlOutputs, // Changed from userHtmlOutput to userHtmlOutputs
    consoleOutput,
    webcamStream,
    selectedEditorLanguage,
    completedProblems,
    inProgressTest,
    textareaRef,
    videoRef,
    currentProblem,
    setCurrentScreen,
    setSelectedProblemId,
    setTimeLeft,
    setIsTimerRunning,
    setCode,
    setShowRefreshModal,
    setShowTabWarning,
    setShowExitConfirmationModal,
    setViolationCount,
    setTestResults,
    setIsRunningTests,
    setShowResults,
    setUserHtmlOutputs, // Changed from setUserHtmlOutput to setUserHtmlOutputs
    setConsoleOutput,
    setWebcamStream,
    setSelectedEditorLanguage,
    setCompletedProblems,
    setInProgressTest,
    handleGoBack,
    confirmExitAndFail,
    cancelExit,
    handleSelectProblem,
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
  };
}
