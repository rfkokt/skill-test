"use client";

import { problemsData } from "@/lib/problems";
import {
  convertTimeToSeconds,
  extractComponentName,
  formatHtmlManually,
  formatTime,
} from "@/lib/utils";
import { useAlertStore } from "@/store/alertStore";
import * as Babel from "@babel/standalone";
import { autocompletion, completeFromList } from "@codemirror/autocomplete";
import { Diagnostic, linter } from "@codemirror/lint";
import * as faceapi from "face-api.js";
import { AlertTriangle } from "lucide-react";
import type React from "react";
import type { ClipboardEvent } from "react";
// @ts-ignore - Prettier plugins need to be imported this way
import * as babelPlugin from "prettier/plugins/babel?external";
// @ts-ignore - Prettier plugins need to be imported this way
import * as estreePlugin from "prettier/plugins/estree?external";
import * as prettier from "prettier/standalone";
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
  const [pasteWarningCount, setPasteWarningCount] = useState(0); // State for paste warnings
  const [showPasteWarningModal, setShowPasteWarningModal] = useState(false); // State to control modal visibility
  const [expression, setExpression] = useState<string | null>(null);
  const [isLookingAtScreen, setIsLookingAtScreen] = useState<boolean | null>(
    null
  );
  const [eyeAwayCount, setEyeAwayCount] = useState(0);
  const [faceDetected, setFaceDetected] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectionInterval = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hiddenTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hiddenStartTimeRef = useRef<number | null>(null);
  const eyeAwayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);
  const lastHeartbeatRef = useRef<number>(Date.now());

  const { showAlert } = useAlertStore();

  const currentProblem = selectedProblemId
    ? problemsData[selectedProblemId]
    : null;

  // Webcam control functions
  const startWebcam = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setWebcamStream(stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.error("Error accessing webcam:", err);
      showAlert({
        title: "Peringatan",
        description: "Pastikan Anda memberikan izin untuk mengakses webcam.",
        icon: AlertTriangle,
        variant: "warning",
      });
    }
  }, []);

  const startDetection = async () => {
    await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
    await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
    await faceapi.nets.faceExpressionNet.loadFromUri("/models");

    const video = videoRef.current;
    if (!video) return;

    detectionInterval.current = setInterval(async () => {
      if (video.readyState !== 4) return;

      const results = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      const count = results.length;
      setFaceDetected(count > 0);

      if (count === 0) {
        setExpression(null);
        setIsLookingAtScreen(null);
        return;
      }

      if (count === 1 && results[0]) {
        const exp = results[0].expressions;
        const maxExp = (
          Object.keys(exp) as (keyof faceapi.FaceExpressions)[]
        ).reduce((a, b) => (exp[a] > exp[b] ? a : b));
        setExpression(maxExp);

        const leftEye = results[0].landmarks.getLeftEye();
        const rightEye = results[0].landmarks.getRightEye();

        const getAspectRatio = (eye: faceapi.Point[]) => {
          const width = Math.hypot(eye[3].x - eye[0].x, eye[3].y - eye[0].y);
          const height = Math.hypot(eye[1].x - eye[5].x, eye[1].y - eye[5].y);
          return width / height;
        };

        if (leftEye.length >= 6 && rightEye.length >= 6) {
          const arLeft = getAspectRatio(leftEye);
          const arRight = getAspectRatio(rightEye);
          const avg = (arLeft + arRight) / 2;
          const isLooking = avg > 3.0;

          setIsLookingAtScreen(isLooking);
          if (!isLooking) {
            if (!eyeAwayTimerRef.current) {
              eyeAwayTimerRef.current = setTimeout(() => {
                setEyeAwayCount((prev) => {
                  const next = prev + 1;
                  return next;
                });
                eyeAwayTimerRef.current = null;
              }, 2000);
            }
          }
        }
      }

      // Kosongkan canvas
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }, 300);
  };

  useEffect(() => {
    if (webcamStream && videoRef.current) {
      console.log("🎯 Video element sudah siap, mulai deteksi wajah");
      startDetection();
    }
  }, [webcamStream, videoRef.current]);

  useEffect(() => {
    return () => {
      if (detectionInterval.current) clearInterval(detectionInterval.current);
      if (webcamStream) {
        webcamStream.getTracks().forEach((track) => track.stop());
      }
    };
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
  useEffect(() => {
    if (showResults && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showResults]);

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
        showAlert({
          title: "Gagal!",
          description: `Anda telah melanggar peraturan karna membuka tab lain selama test berlangsung. Tes dianggap gagal.`,
          icon: AlertTriangle,
          variant: "error",
        });

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
    if (document.hidden && currentScreen === "test") {
      // 1. Hitung pelanggaran
      setViolationCount((prev) => {
        const newCount = prev + 1;
        setShowTabWarning(true);
        return newCount;
      });

      // 2. Set timer 15 detik untuk auto-fail
      if (!hiddenTimerRef.current) {
        hiddenStartTimeRef.current = Date.now();

        hiddenTimerRef.current = setTimeout(() => {
          failTest(
            "Anda membuka tab lain lebih dari 15 detik. Tes dianggap gagal."
          );
          hiddenTimerRef.current = null;
          hiddenStartTimeRef.current = null;
        }, 15000); // 15 detik
      }
    } else {
      // Tab kembali terlihat
      if (hiddenTimerRef.current) {
        clearTimeout(hiddenTimerRef.current);
        hiddenTimerRef.current = null;
      }
      hiddenStartTimeRef.current = null;
    }
  }, [
    currentScreen,
    showAlert,
    currentProblem,
    markProblemAsCompleted,
    resetTestState,
  ]);

  // Fungsi terpisah untuk menggagalkan tes
  const failTest = useCallback(
    (message: string) => {
      showAlert({
        title: "Gagal!",
        description: message,
        icon: AlertTriangle,
        variant: "error",
      });

      if (currentProblem) {
        markProblemAsCompleted(currentProblem.id);
      }

      localStorage.removeItem("inProgressTest");
      resetTestState();
    },
    [showAlert, currentProblem, markProblemAsCompleted, resetTestState]
  );

  // Jangan lupa tambahkan useEffect untuk pengecekan violation count
  useEffect(() => {
    if (violationCount >= 4) {
      failTest(
        "Anda telah melanggar peraturan karena membuka tab lain selama tes berlangsung. Tes dianggap gagal."
      );
    }
  }, [violationCount, failTest]);

  const handleWindowBlur = useCallback(() => {
    if (currentScreen === "test" && document.hasFocus()) {
      // Tambahan proteksi untuk Alt+Tab, Windows+Tab, etc.
      setViolationCount((prev) => prev + 1);
      setShowTabWarning(true);
    }
  }, [currentScreen]);

  const handleBeforeUnload = useCallback(
    (e: BeforeUnloadEvent) => {
      if (currentScreen === "test" && !isLeavingConfirmedRef.current) {
        e.preventDefault();
        e.returnValue =
          "Anda yakin ingin meninggalkan tes? Progress akan hilang.";
        return "Anda yakin ingin meninggalkan tes? Progress akan hilang.";
      }
    },
    [currentScreen]
  );

  const isLeavingConfirmedRef = useRef(false);

  const handleLeavingConfirmation = useCallback(() => {
    isLeavingConfirmedRef.current = true;
    handleExitTest(true);
    stopWebcam();
    window.location.reload();
  }, [handleExitTest, stopWebcam]);

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    // Store the confirmation handler for the modal
    if (typeof window !== "undefined") {
      (window as any).handleLeavingConfirmation = handleLeavingConfirmation;
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);

      if (hiddenTimerRef.current) {
        clearTimeout(hiddenTimerRef.current);
      }
    };
  }, [
    handleVisibilityChange,
    handleBeforeUnload,
    handleLeavingConfirmation,
    handleWindowBlur,
  ]);
  useEffect(() => {
    if (currentScreen === "test") {
      heartbeatRef.current = setInterval(() => {
        const isHidden = document.hidden;
        const hasFocus = document.hasFocus();
        const isVisible = document.visibilityState === "visible";
        const now = Date.now();
        const timeSinceLastBeat = now - lastHeartbeatRef.current;

        // Jika lebih dari 5 detik tanpa heartbeat, anggap frozen
        if (timeSinceLastBeat > 15000) {
          failTest("Halaman terdeteksi tidak aktif. Tes dianggap gagal.");
          return;
        }

        lastHeartbeatRef.current = now;
      }, 1000);
    }

    return () => {
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
      }
    };
  }, [currentScreen]);

  const strictVisibilityCheck = useCallback(() => {
    // Kombinasi multiple checks
    const isHidden = document.hidden;
    const hasFocus = document.hasFocus();
    const isVisible = document.visibilityState === "visible";

    if (currentScreen === "test" && (!isVisible || !hasFocus || isHidden)) {
      setViolationCount((prev) => prev + 1);
      setShowTabWarning(true);

      // Timer 15 detik
      if (!hiddenTimerRef.current) {
        hiddenTimerRef.current = setTimeout(() => {
          failTest("Halaman tidak dalam fokus lebih dari 15 detik.");
        }, 15000);
      }
    } else if (isVisible && hasFocus && !isHidden) {
      // Clear timer jika kembali normal
      if (hiddenTimerRef.current) {
        clearTimeout(hiddenTimerRef.current);
        hiddenTimerRef.current = null;
      }
    }
  }, [currentScreen]);

  // Check setiap detik
  useEffect(() => {
    if (currentScreen === "test") {
      const interval = setInterval(strictVisibilityCheck, 15000);
      return () => clearInterval(interval);
    }
  }, [currentScreen, strictVisibilityCheck]);

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
      setViolationCount(0); // Reset violation count when starting a new test
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

  const handlePaste = useCallback(
    (event: ClipboardEvent<HTMLTextAreaElement>) => {
      event.preventDefault();
      setPasteWarningCount((prev) => prev + 1);
      setShowPasteWarningModal(true);
      if (pasteWarningCount >= 4) {
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

    // Helper function untuk extract component name (sama seperti di testing)
    const extractComponentName = (code: string): string | null => {
      // Cari function declaration dengan PascalCase
      const functionMatch = code.match(/function\s+([A-Z][a-zA-Z0-9]*)/);
      if (functionMatch) return functionMatch[1];

      // Cari arrow function dengan PascalCase
      const arrowMatch = code.match(/const\s+([A-Z][a-zA-Z0-9]*)\s*=/);
      if (arrowMatch) return arrowMatch[1];

      // Cari export default function
      const exportMatch = code.match(
        /export\s+default\s+function\s+([A-Z][a-zA-Z0-9]*)/
      );
      if (exportMatch) return exportMatch[1];

      // Cari export default arrow function
      const exportArrowMatch = code.match(
        /export\s+default\s+([A-Z][a-zA-Z0-9]*)/
      );
      if (exportArrowMatch) return exportArrowMatch[1];

      return null;
    };

    try {
      if (selectedEditorLanguage === "javascript") {
        if (currentProblem.id.startsWith("react-")) {
          // React implementation yang sama seperti di testing
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
                    if (
                      key === "style" &&
                      typeof value === "object" &&
                      value !== null
                    ) {
                      const styleStr = Object.entries(value)
                        .map(
                          ([k, v]) =>
                            `${k.replace(/([A-Z])/g, "-$1").toLowerCase()}:${v}`
                        )
                        .join(";");
                      return `style="${styleStr}"`;
                    }
                    if (typeof value === "string") return `${key}="${value}"`;
                    return "";
                  })
                  .filter(Boolean)
                  .join(" ");
              }

              if (type === "img") {
                return `<${type} ${propsStr} />`;
              }
              return `<${type}${propsStr ? " " + propsStr : ""}>${flatChildren.join("")}</${type}>`;
            },
          };

          // Transpile JSX menggunakan Babel (sama seperti di testing)
          let transpiledCode = "";
          try {
            // Pastikan Babel tersedia
            if (typeof Babel === "undefined") {
              customConsole.error(
                "Babel is not available. JSX transpilation failed."
              );
              setUserHtmlOutputs([
                "Error: Babel is not available for JSX transpilation.",
              ]);
              setConsoleOutput(capturedLogs);
              return;
            }

            transpiledCode =
              Babel.transform(code, {
                presets: ["react"], // support JSX
              }).code || "";
          } catch (e) {
            const errorMsg = `Babel compile failed: ${(e as Error).message}`;
            customConsole.error(errorMsg);
            setUserHtmlOutputs([
              `Error compiling code: ${(e as Error).message}`,
            ]);
            setConsoleOutput(capturedLogs);
            return;
          }

          // Extract component name
          const componentName = extractComponentName(code);
          if (!componentName) {
            const errorMsg =
              "Cannot detect component name. Make sure to name your function with PascalCase (e.g. UserList).";
            customConsole.error(errorMsg);
            customConsole.log("Available code:", code.slice(0, 200) + "...");
            setUserHtmlOutputs([errorMsg]);
            setConsoleOutput(capturedLogs);
            return;
          }

          // Create user function
          let userFunction: any;
          try {
            // Method 1: Coba dengan approach seperti di testing code
            try {
              userFunction = new Function(
                "React",
                "console",
                `${transpiledCode}; return ${componentName};`
              )(React, customConsole);
            } catch (directErr) {
              customConsole.log(
                `Direct method failed: ${(directErr as Error).message}`
              );
            }

            // Method 2: Jika method 1 gagal atau hasilnya undefined
            if (typeof userFunction !== "function") {
              customConsole.log(
                `Trying eval method for component '${componentName}'...`
              );

              // Buat konteks eksekusi yang isolated
              const executeCode = new Function(
                "React",
                "console",
                `
                ${transpiledCode}
                
                // Coba berbagai cara untuk mengakses component
                if (typeof ${componentName} !== 'undefined') {
                  return ${componentName};
                }
                
                // Jika tidak ada, coba cari di window/global scope
                if (typeof window !== 'undefined' && window.${componentName}) {
                  return window.${componentName};
                }
                
                // Coba eval langsung
                try {
                  return eval('${componentName}');
                } catch (e) {
                  console.error('Eval failed:', e.message);
                }
                
                // Last resort: coba extract function dari code secara manual
                const codeStr = \`${transpiledCode}\`;
                const funcRegex = new RegExp('function\\\\s+${componentName}\\\\s*\\\\([^)]*\\\\)\\\\s*\\\\{', 'g');
                const arrowRegex = new RegExp('(?:const|let|var)\\\\s+${componentName}\\\\s*=\\\\s*\\\\([^)]*\\\\)\\\\s*=>');
                
                if (funcRegex.test(codeStr) || arrowRegex.test(codeStr)) {
                  try {
                    eval(codeStr);
                    return eval('${componentName}');
                  } catch (evalErr) {
                    console.error('Manual eval failed:', evalErr.message);
                  }
                }
                
                return undefined;
                `
              );

              userFunction = executeCode(React, customConsole);
            }

            // Method 3: Jika masih gagal, coba parse dan execute secara manual
            if (typeof userFunction !== "function") {
              customConsole.log(`Trying manual parsing method...`);

              // Coba buat function wrapper
              const wrappedCode = `
                ${transpiledCode}
                
                // Return the component if it exists
                return (function() {
                  if (typeof ${componentName} === 'function') {
                    return ${componentName};
                  }
                  
                  // Jika component adalah arrow function yang di-assign ke const
                  try {
                    return eval('(${componentName})');
                  } catch (e) {
                    console.error('Component access failed:', e.message);
                    return null;
                  }
                })();
              `;

              try {
                userFunction = new Function("React", "console", wrappedCode)(
                  React,
                  customConsole
                );
              } catch (wrapErr) {
                customConsole.error(
                  `Wrapped execution failed: ${(wrapErr as Error).message}`
                );
              }
            }

            // Final validation
            if (typeof userFunction !== "function") {
              const errorMsg = `All methods failed: '${componentName}' is not accessible as a function. Got: ${typeof userFunction}`;
              customConsole.error(errorMsg);
              customConsole.log("Full transpiled code:", transpiledCode);

              // Debug: coba lihat apa yang ada di transpiled code
              const availableFunctions = transpiledCode.match(
                /function\s+([A-Za-z][A-Za-z0-9]*)/g
              );
              const availableConsts = transpiledCode.match(
                /(?:const|let|var)\s+([A-Za-z][A-Za-z0-9]*)\s*=/g
              );

              customConsole.log("Available functions:", availableFunctions);
              customConsole.log("Available constants:", availableConsts);

              setUserHtmlOutputs([errorMsg]);
              setConsoleOutput(capturedLogs);
              return;
            }
          } catch (err) {
            const errorMsg = `Execution failed: ${(err as Error).message}`;
            customConsole.error(errorMsg);
            setUserHtmlOutputs([
              `Error running code: ${(err as Error).message}`,
            ]);
            setConsoleOutput(capturedLogs);
            return;
          }

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
                  const result = userFunction(props);
                  previewOutputs.push(result);
                } else {
                  const errorMsg = `Error: 'reactPropName' is not defined for this React problem.`;
                  previewOutputs.push(errorMsg);
                  customConsole.error(errorMsg);
                }
              } catch (err) {
                const errorMsg = `Error in preview for test case ${i + 1}: ${(err as Error).message}`;
                previewOutputs.push(errorMsg);
                customConsole.error(
                  `Error rendering preview for test case ${i + 1}: ${(err as Error).message}`
                );
              }
            }
          }
          setUserHtmlOutputs(previewOutputs);
        } else {
          // Handle non-React JavaScript
          try {
            const userFunction = new Function("console", "return " + code)(
              customConsole
            );
            setUserHtmlOutputs([]);

            if (problemSolution.testCases[0]) {
              userFunction(
                problemSolution.testCases[0]?.input[0],
                problemSolution.testCases[0]?.input[1]
              );
            }
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
      const errorMsg = `Compilation error for preview: ${(error as Error).message}`;
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
      const textarea = textareaRef.current;
      if (!textarea) return;

      if (e.key === "Tab") {
        e.preventDefault();

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const value = textarea.value;
        const indentation = "  ";

        if (start === end) {
          const newValue =
            value.substring(0, start) + indentation + value.substring(end);
          setCode(newValue);
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd =
              start + indentation.length;
          }, 0);
        } else {
          const lines = value.split("\n");
          const startLineIndex =
            value.substring(0, start).split("\n").length - 1;
          const endLineIndex = value.substring(0, end).split("\n").length - 1;

          const newCodeLines = [...lines];
          let newSelectionStart = start;
          let newSelectionEnd = end;

          if (e.shiftKey) {
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
      } else if (e.key === "Enter") {
        setTimeout(() => {
          const pos = textarea.selectionStart;
          const before = code.slice(0, pos);
          const lines = before.split("\n");
          const currentLine = lines.at(-2)?.trim() || "";

          // 🧠 SNIPPET: Expand "for"
          if (
            selectedEditorLanguage === "javascript" &&
            currentLine === "for"
          ) {
            const snippet = `for (let i = 0; i < array.length; i++) {\n  \n}`;
            lines[lines.length - 2] = snippet;

            const newCode = lines.join("\n") + code.slice(pos);

            setCode(newCode);

            // Cursor ke dalam block
            setTimeout(() => {
              textarea.selectionStart = textarea.selectionEnd =
                newCode.indexOf("\n  \n") + 3;
            }, 0);
            return;
          }

          // ✨ Auto-indent baris baru
          const previousLine = lines.at(-2) || "";
          const indentMatch = previousLine.match(/^(\s+)/);
          const currentIndent = indentMatch ? indentMatch[1] : "";

          const updatedCode =
            code.slice(0, pos) + currentIndent + code.slice(pos);
          setCode(updatedCode);

          // Pindahkan cursor setelah indentasi
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd =
              pos + currentIndent.length;
          }, 0);

          // Otomatis format jika javascript
          if (selectedEditorLanguage === "javascript") {
            formatCode();
          }
        }, 0);
      }
    },
    [code, selectedEditorLanguage]
  );

  const customSnippets = autocompletion({
    override: [
      completeFromList([
        {
          label: "for",
          type: "keyword",
          apply: "for (let i = 0; i < array.length; i++) {\n  \n}",
          info: "For loop",
        },
        {
          label: "if",
          type: "keyword",
          apply: "if (condition) {\n  \n}",
          info: "If statement",
        },
        {
          label: "log",
          type: "function",
          apply: "console.log($1)",
          info: "Console log",
        },
      ]),
    ],
  });

  const evalLinter = linter((view) => {
    const code = view.state.doc.toString();
    const diagnostics: Diagnostic[] = [];

    const index = code.indexOf("eval(");
    if (index !== -1) {
      diagnostics.push({
        from: index,
        to: index + 4,
        severity: "warning",
        message: "Avoid using eval() for security reasons.",
      });
    }

    return diagnostics;
  });

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
              return `<${type}${propsStr ? " " + propsStr : ""}>${flatChildren.join("")}</${type}>`;
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
              const passed =
                formatHtmlManually(result) ===
                formatHtmlManually(testCase.expected);

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
    showPasteWarningModal,
    pasteWarningCount,
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
    eyeAwayCount,
    customSnippets,
    evalLinter,
    resultsRef,
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
    resetTestState,
  };
}
