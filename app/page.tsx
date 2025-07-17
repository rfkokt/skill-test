"use client"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import StartTestModal from "@/components/start-test-modal"
import InactivityModal from "@/components/inactivity-modal"
import TabWarningModal from "@/components/tab-warning-modal"
import RefreshWarningModal from "@/components/refresh-warning-modal"
import ExitConfirmationModal from "@/components/exit-confirmation-modal"
import FinishTestModal from "@/components/finish-test-modal"
import TimeUpModal from "@/components/time-up-modal"
import ResumeTestModal from "@/components/resume-test-modal"
import ProblemSelection from "@/components/problem-selection"
import HtmlPreview from "@/components/html-preview"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTestPlatform } from "@/hooks/use-test-platform"
import { problemsData } from "@/lib/problems"
import { ArrowLeft, Camera, CheckCircle, Flag, XCircle } from "lucide-react"

export default function CodingTestPlatform() {
  const { setTheme, theme } = useTheme()

  const {
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
    userHtmlOutputs,
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
    setWebcamStream,
    setSelectedEditorLanguage,
    confirmTimeUp,
    confirmInactivity,
    handleFinishTest,
    confirmFinishTest,
    cancelFinishTest,
  } = useTestPlatform()

  // Add a global guard at the very top of the component's return logic
  if (currentScreen !== "selection" && !currentProblem) {
    console.error("currentProblem is null when it shouldn't be. Redirecting to selection screen.")
    setCurrentScreen("selection")
    setSelectedProblemId("")
    return <ProblemSelection onSelectProblem={handleSelectProblem} completedProblems={completedProblems} />
  }

  // New logic to handle resuming a test
  if (currentScreen === "selection" && inProgressTest && !selectedProblemId) {
    const problemToResume = problemsData[inProgressTest.problemId]
    if (problemToResume && !completedProblems.includes(problemToResume.id)) {
      return (
        <ResumeTestModal
          isOpen={true}
          problemTitle={problemToResume.title}
          timeLeft={inProgressTest.timeLeft}
          onConfirmResume={() => {
            setSelectedProblemId(inProgressTest.problemId)
            setTimeLeft(inProgressTest.timeLeft)
            setIsTimerRunning(true)
            setCurrentScreen("test")
            const defaultLang = problemToResume.languages.includes("javascript")
              ? "javascript"
              : problemToResume.languages[0]
            setCode(problemToResume.solutions[defaultLang].initialCodeTemplate)
            setSelectedEditorLanguage(defaultLang)
            if (problemToResume.requiresWebcam) {
              const startWebcam = async () => {
                try {
                  const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                  })
                  setWebcamStream(stream)
                } catch (err) {
                  console.error("Error accessing webcam:", err)
                  alert("Could not access webcam. Please ensure you have a webcam and have granted permission.")
                }
              }
              startWebcam()
            }
          }}
          onCancelResume={() => {
            localStorage.removeItem("inProgressTest")
            setInProgressTest(null)
          }}
        />
      )
    } else {
      localStorage.removeItem("inProgressTest")
      setInProgressTest(null)
    }
  }

  if (currentScreen === "start" && currentProblem) {
    return (
      <StartTestModal
        isOpen={true}
        onStartTest={handleStartTest}
        onClose={handleCancelStartTest}
        problemTitle={currentProblem.title}
        estimatedTime={currentProblem.estimatedTime}
        requiresWebcam={currentProblem.requiresWebcam}
      />
    )
  } else if (currentScreen === "test" && currentProblem) {
    // Generate expected HTML contents for all test cases (React problems only)
    const getExpectedHtmlContents = () => {
      if (!currentProblem.id.startsWith("react-")) return []

      const problemSolution = currentProblem.solutions[selectedEditorLanguage]
      if (!problemSolution) return []

      return problemSolution.testCases.map((testCase) => testCase.expected)
    }

    const expectedHtmlContents = getExpectedHtmlContents()

    return (
      <div className="min-h-screen bg-neobrutal-bg text-neobrutal-text">
        <RefreshWarningModal
          isOpen={showRefreshModal}
          onClose={() => setShowRefreshModal(false)}
          onConfirm={() => {
            if (typeof window !== "undefined" && (window as any).handleLeavingConfirmation) {
              ;(window as any).handleLeavingConfirmation()
            }
          }}
        />

        <TabWarningModal
          isOpen={showTabWarning}
          onClose={() => setShowTabWarning(false)}
          violationCount={violationCount}
        />

        <ExitConfirmationModal
          isOpen={showExitConfirmationModal}
          onConfirm={confirmExitAndFail}
          onCancel={cancelExit}
        />

        <TimeUpModal isOpen={showTimeUpModal} onConfirm={confirmTimeUp} problemTitle={currentProblem.title} />

        <InactivityModal
          isOpen={showInactivityModal}
          onConfirm={confirmInactivity}
          problemTitle={currentProblem.title}
        />

        <FinishTestModal
          isOpen={showFinishTestModal}
          onConfirm={confirmFinishTest}
          onCancel={cancelFinishTest}
          problemTitle={currentProblem.title}
          timeLeft={timeLeft}
          formatTime={formatTime}
        />

        {/* Floating Webcam Preview */}
        {webcamStream && currentProblem.requiresWebcam && (
          <div className="fixed top-4 right-4 z-50">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-32 h-24 rounded-lg shadow-[4px_4px_0px_0px_#333333] border-2 border-neobrutal-border object-cover"
            />
            <div className="absolute bottom-1 left-1 bg-neobrutal-softBlue text-neobrutal-softBlueText text-xs px-1 py-0.5 rounded-md flex items-center gap-1 border border-neobrutal-border">
              <Camera className="w-3 h-3" /> Monitoring
            </div>
          </div>
        )}

        {/* Top Bar with Timer */}
        <div className="border-b-2 border-neobrutal-border bg-neobrutal-card px-6 py-3 shadow-[0px_2px_0px_0px_#333333]">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-mono font-bold text-neobrutal-text">{formatTime(timeLeft)}</div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGoBack}
                className="flex items-center space-x-2 bg-transparent"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
            </div>
            <div className="flex items-center space-x-4">
              {violationCount > 0 && (
                <div className="text-sm text-neobrutal-softRedText font-medium">Violations: {violationCount}/4</div>
              )}
              {/* Removed Selesai button from here */}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto p-6 flex flex-col gap-6">
          {/* Problem Description */}
          <div className="bg-neobrutal-card rounded-lg p-6 border-2 border-neobrutal-border shadow-[4px_4px_0px_0px_#333333]">
            {/* Problem Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-neobrutal-text">{currentProblem.title}</h1>
                <Badge
                  className={`${
                    currentProblem.difficulty === "Easy"
                      ? "bg-neobrutal-softGreen text-neobrutal-softGreenText"
                      : currentProblem.difficulty === "Medium"
                        ? "bg-neobrutal-softYellow text-neobrutal-softYellowText"
                        : "bg-neobrutal-softRed text-neobrutal-softRedText"
                  } hover:bg-current`}
                >
                  {currentProblem.difficulty}
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6"></div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-neobrutal-text mb-4">Description</h2>
              <div className="text-neobrutal-text leading-relaxed space-y-4">
                {currentProblem.description.split("\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              {/* Show Expected HTML Output in Description for React problems with multiple test cases */}
              {currentProblem.id.startsWith("react-") && expectedHtmlContents.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-neobrutal-text mb-2">Expected HTML Output Preview:</h4>
                  <HtmlPreview expectedHtmlContent={expectedHtmlContents} userHtmlOutputs={null} />
                </div>
              )}
            </div>

            {/* Examples */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-neobrutal-text mb-4">Examples</h2>
              <div className="space-y-6">
                {currentProblem.examples.map((example, index) => (
                  <div key={index} className="p-4 rounded-lg">
                    <h3 className="font-semibold text-neobrutal-text mb-3">Example {index + 1}:</h3>
                    <div className="font-mono text-sm space-y-1">
                      <div>
                        <strong>Input:</strong> {(() => {
                          try {
                            const parsed = JSON.parse(example.input)
                            return (
                              <pre className="whitespace-pre-wrap break-all text-neobrutal-text/90 bg-neobrutal-bg p-2 rounded-md border border-neobrutal-border shadow-[1px_1px_0px_0px_#333333] mt-2">
                                {JSON.stringify(parsed, null, 2)}
                              </pre>
                            )
                          } catch (e) {
                            return example.input
                          }
                        })()}
                      </div>
                      {!currentProblem.id.startsWith("react-") && (
                        <div>
                          <strong>Output:</strong> {example.output}
                        </div>
                      )}
                      {example.explanation && (
                        <div className="text-neobrutal-text/80 mt-2">
                          <strong>Explanation:</strong> {example.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Constraints */}
            <div>
              <h2 className="text-lg font-semibold text-neobrutal-text mb-4">Constraints</h2>
              <ul className="font-mono text-sm text-neobrutal-text/90 space-y-1">
                {currentProblem.constraints.map((constraint, index) => (
                  <li key={index}>• {constraint}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Solution Area */}
          <div className="bg-neobrutal-card rounded-lg p-6 border-2 border-neobrutal-border shadow-[4px_4px_0px_0px_#333333]">
            {/* Solution Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-neobrutal-text">Solution</h2>
              <div className="text-sm text-neobrutal-text/80">
                Lines: {code.split("\n").length} | Characters: {code.length}
              </div>
            </div>

            {/* Language Tabs for Editor */}
            <Tabs
              defaultValue={selectedEditorLanguage}
              onValueChange={(value) => {
                setSelectedEditorLanguage(value)
                setCode(currentProblem.solutions[value].initialCodeTemplate)
              }}
              className="w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <TabsList
                  className={`grid w-full border-2 border-neobrutal-border shadow-[2px_2px_0px_0px_#333333] ${
                    currentProblem.languages.length === 1 ? "grid-cols-1" : "grid-cols-2"
                  }`}
                >
                  {currentProblem.languages.map((lang) => (
                    <TabsTrigger
                      key={lang}
                      value={lang}
                      className="flex items-center space-x-2 data-[state=active]:bg-neobrutal-softBlue data-[state=active]:text-neobrutal-softBlueText data-[state=active]:shadow-[inset_0px_0px_0px_2px_#333333]"
                    >
                      <span>{lang.charAt(0).toUpperCase() + lang.slice(1)}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {currentProblem.languages.map((lang) => (
                <TabsContent key={lang} value={lang} className="space-y-4">
                  {/* Code Editor */}
                  <div className="group border-2 border-neobrutal-border rounded-lg bg-neobrutal-bg shadow-[2px_2px_0px_0px_#333333] group-focus-within:shadow-[4px_4px_0px_0px_var(--neobrutal-border)] group-focus-within:border-neobrutal-softBlue transition-all duration-200">
                    <div className="flex h-[300px]">
                      <div className="bg-neobrutal-bg px-3 py-2 text-sm text-neobrutal-text/60 font-mono border-r-2 border-neobrutal-border min-w-[50px] overflow-y-auto">
                        {code.split("\n").map((_, index) => (
                          <div key={index} className="leading-6 flex items-center">
                            {hasErrors() && index === 0 && (
                              <div className="w-2 h-2 bg-neobrutal-softRed rounded-full mr-2"></div>
                            )}
                            {index + 1}
                          </div>
                        ))}
                      </div>
                      <div className="flex-1">
                        <textarea
                          ref={textareaRef}
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          onKeyDown={handleKeyDown}
                          className="w-full h-full p-3 font-mono text-sm text-neobrutal-text bg-transparent border-none outline-none resize-none leading-6 overflow-y-auto placeholder:text-neobrutal-text/50 focus:ring-2 focus:ring-neobrutal-softBlue focus:ring-offset-2 focus:ring-offset-neobrutal-bg"
                          placeholder={`Write your ${lang} solution here...`}
                          spellCheck={false}
                        />
                      </div>
                    </div>
                  </div>

                  {/* User's HTML Output Preview (for React problems) */}
                  {currentProblem.id.startsWith("react-") && selectedEditorLanguage === "javascript" && (
                    <HtmlPreview expectedHtmlContent={expectedHtmlContents} userHtmlOutputs={userHtmlOutputs} />
                  )}

                  {/* Console Output */}
                  {consoleOutput.length > 0 && (
                    <div className="border-2 border-neobrutal-border rounded-lg p-4 bg-neobrutal-border text-neobrutal-card shadow-[2px_2px_0px_0px_#333333]">
                      <h4 className="font-medium text-neobrutal-card mb-3">Console Output:</h4>
                      <div className="text-sm font-mono space-y-1 max-h-40 overflow-y-auto">
                        {consoleOutput.map((log, index) => (
                          <p key={index} className="text-neobrutal-card/90">{`> ${log}`}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {hasErrors() && (
                    <div className="bg-neobrutal-softRed border-2 border-neobrutal-softRedText rounded-lg p-4 shadow-[2px_2px_0px_0px_#333333]">
                      <div className="flex items-center space-x-2 mb-2">
                        <XCircle className="w-4 h-4 text-neobrutal-softRedText" />
                        <h3 className="font-semibold text-neobrutal-softRedText">
                          Validation Failed (Possible missing logic)
                        </h3>
                      </div>
                      <h4 className="font-medium text-neobrutal-softRedText mb-2">Hints:</h4>
                      <p className="text-sm text-neobrutal-softRedText mb-2">
                        • Make sure you have filled in all the necessary logic.
                      </p>
                      {selectedEditorLanguage === "javascript" && currentProblem.id.startsWith("react-") && (
                        <p className="text-sm text-neobrutal-softRedText mb-2">
                          • For React problems, ensure you return a valid React element using `React.createElement()`.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Test Results */}
                  {showResults && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-neobrutal-text">Test Results</h3>
                      {testResults.map((result, index) => (
                        <div
                          key={index}
                          className={`border-2 border-neobrutal-border rounded-lg p-4 shadow-[2px_2px_0px_0px_#333333] ${
                            result.passed
                              ? "bg-neobrutal-softGreen text-neobrutal-softGreenText"
                              : "bg-neobrutal-softRed text-neobrutal-softRedText"
                          }`}
                        >
                          <div className="flex items-center space-x-2 mb-2">
                            {result.passed ? (
                              <CheckCircle className="w-4 h-4 text-neobrutal-softGreenText" />
                            ) : (
                              <XCircle className="w-4 h-4 text-neobrutal-softRedText" />
                            )}
                            <span className="font-medium">
                              {result.testCase === "Compilation" ? "Compilation Error" : `Test Case ${result.testCase}`}
                            </span>
                          </div>
                          {result.error ? (
                            <p className="text-sm text-neobrutal-softRedText">{result.error}</p>
                          ) : (
                            <div className="text-sm space-y-1">
                              <div>
                                <strong>Input:</strong> {JSON.stringify(result.input)}
                              </div>
                              <div>
                                <strong>Expected:</strong> {JSON.stringify(result.expected)}
                              </div>
                              <div>
                                <strong>Actual:</strong> {JSON.stringify(result.actual)}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>

            {/* Action Buttons */}
            <div className="space-y-4 mt-6">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={runTests} disabled={isRunningTests}>
                  {isRunningTests ? "Running..." : "Run & Test"}
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-neobrutal-text/80 mb-4">
                  This will validate your code and run it against{" "}
                  {currentProblem.solutions[selectedEditorLanguage]?.testCases.length || 0} test cases
                </p>
                <Button
                  className="w-full bg-neobrutal-border hover:bg-neobrutal-border/90 text-neobrutal-card font-semibold py-3 shadow-[4px_4px_0px_0px_#333333] active:shadow-[2px_2px_0px_0px_#333333] active:translate-x-[2px] active:translate-y-[2px]"
                  onClick={runTests}
                  disabled={isRunningTests}
                >
                  {isRunningTests ? "⏳ Running Code..." : "▶ Run Code"}
                </Button>
                {/* Selesai button moved here */}
                <Button
                  onClick={handleFinishTest}
                  disabled={isRunningTests}
                  className="w-full mt-4 flex items-center justify-center space-x-2 bg-neobrutal-softGreen hover:bg-neobrutal-softGreen/90 text-neobrutal-softGreenText font-semibold py-3 shadow-[4px_4px_0px_0px_#333333] active:shadow-[2px_2px_0px_0px_#333333] active:translate-x-[2px] active:translate-y-[2px]"
                >
                  <Flag className="w-4 h-4" />
                  <span>Selesai</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Theme Toggle */}
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="shadow-[4px_4px_0px_0px_#333333] border-2 border-neobrutal-border bg-neobrutal-card text-neobrutal-text hover:bg-neobrutal-card/90"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    )
  } else if (currentScreen === "selection") {
    return <ProblemSelection onSelectProblem={handleSelectProblem} completedProblems={completedProblems} />
  }

  return null
}
