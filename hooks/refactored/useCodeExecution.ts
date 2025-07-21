import { useState, useCallback } from 'react';
import * as Babel from '@babel/standalone';
import { problemsData } from '@/lib/problems';
import { extractComponentName } from '@/lib/utils';

export const useCodeExecution = (
  problemId: string,
  language: string,
  code: string
) => {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [userHtmlOutputs, setUserHtmlOutputs] = useState<(string | null)[]>([]);

  const runTests = useCallback(async () => {
    const currentProblem = problemsData[problemId];
    if (!currentProblem) return;

    setIsRunningTests(true);
    setTestResults([]);
    setUserHtmlOutputs([]);
    setConsoleOutput([]);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const capturedLogs: string[] = [];
    const customConsole = {
      log: (...args: any[]) => {
        capturedLogs.push(
          args.map((arg) => JSON.stringify(arg, null, 2)).join(" ")
        );
      },
      warn: (...args: any[]) =>
        capturedLogs.push("WARN: " + args.map(String).join(" ")),
      error: (...args: any[]) =>
        capturedLogs.push("ERROR: " + args.map(String).join(" ")),
    };

    const problemSolution = currentProblem.solutions[language];
    if (!problemSolution) {
      // handle unsupported language
      setIsRunningTests(false);
      return;
    }

    try {
      if (language === 'javascript') {
        if (currentProblem.id.startsWith('react-')) {
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

          const transpiledCode =
            Babel.transform(code, {
              presets: ['react'],
            }).code || '';

          const componentName = extractComponentName(code);
          if (!componentName) {
            // handle error
            return;
          }
          const userFunction = new Function(
            'React',
            'console',
            `${transpiledCode}; return ${componentName};`
          )(React, customConsole);

          const results = [];
          const allHtmlOutputs: (string | null)[] = [];

          for (const testCase of problemSolution.testCases) {
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
                testCase: results.length + 1,
                input: testCase.input,
                expected: testCase.expected,
                actual: result,
                passed,
                error: null,
              });
            } catch (error) {
              allHtmlOutputs.push(`Error: ${(error as Error).message}`);
              results.push({
                testCase: results.length + 1,
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
          const userFunction = new Function('console', 'return ' + code)(
            customConsole
          );
          const results = [];
          for (const testCase of problemSolution.testCases) {
            try {
              const result = userFunction(...testCase.input);
              const passed =
                JSON.stringify(result) === JSON.stringify(testCase.expected);
              results.push({
                testCase: results.length + 1,
                input: testCase.input,
                expected: testCase.expected,
                actual: result,
                passed,
                error: null,
              });
            } catch (error) {
              results.push({
                testCase: results.length + 1,
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
      }
    } catch (error) {
      // handle compilation/runtime error
    } finally {
      setConsoleOutput(capturedLogs);
      setIsRunningTests(false);
    }
  }, [problemId, language, code]);

  return {
    testResults,
    isRunningTests,
    consoleOutput,
    userHtmlOutputs,
    runTests,
  };
};
