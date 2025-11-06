# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a skill test platform built with Next.js 15, React 19, and TypeScript. It's a comprehensive coding assessment platform that allows users to solve programming problems with real-time code execution, webcam monitoring, and anti-cheating mechanisms.

## Architecture

### Core Components

- **App Structure**: Next.js 15 app router with a single main page (`app/page.tsx`) that handles different screens (selection, start, test)
- **State Management**: Zustand for global state, combined with localStorage for persistence
- **Problem System**: Modular problem definitions in `lib/problems/` with TypeScript interfaces
- **Code Execution**: Babel for JSX transpilation, Prettier for code formatting
- **UI Components**: Radix UI + shadcn/ui components with custom neobrutalism styling
- **Editor**: CodeMirror with JavaScript/React support
- **Monitoring**: Face-api.js for webcam-based eye tracking and attention monitoring

### Key Features

- **Problem Selection**: Choose from various coding challenges (React, JavaScript, Python)
- **Live Code Execution**: Real-time preview for React components and JavaScript functions
- **Anti-Cheating System**: Tab switching detection, paste warnings, webcam monitoring
- **Test Results**: Automated test case execution with detailed feedback
- **Responsive Design**: Mobile detection and warnings

## Development Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Problem Structure

Problems are defined in `lib/problems/` with the following interface:

```typescript
interface Problem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  estimatedTime: string;
  requiresWebcam: boolean;
  language: string;
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  tags: string[];
  languages: string[];
  reactPropName?: string;
  verificationCode: string;
  requiresCoding: boolean;
  requiresVerificationCode: boolean;
  solutions: {
    [key: string]: {
      initialCodeTemplate: string;
      testCases: { input: any[]; expected: any }[];
    };
  };
}
```

## Key Files

- `app/page.tsx`: Main application component handling all screens
- `hooks/use-test-platform.ts`: Core business logic and state management
- `lib/problems.ts`: Problem registry and exports
- `components/`: UI components including modals, editor, and preview components
- `lib/utils.ts`: Utility functions for HTML formatting, time conversion, etc.

## Adding New Problems

1. Create a new file in `lib/problems/` (e.g., `my-new-problem.ts`)
2. Export the problem following the `Problem` interface
3. Add the import and export to `lib/problems.ts`
4. Ensure test cases are properly defined for all supported languages

## Styling

The app uses a custom neobrutalism design system with:
- Custom CSS variables for colors (defined in `app/globals.css`)
- Consistent shadow and border patterns
- Radix UI components with custom theming

## Important Notes

- The app includes strict anti-cheating mechanisms that track tab switching, paste events, and user attention
- Webcam monitoring is required for certain problems
- All code execution happens client-side using Babel transpilation
- State is persisted to localStorage for test resume functionality
- The app is mobile-unfriendly by design and shows warnings for mobile devices