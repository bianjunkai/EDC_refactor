# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an EDC (Electronic Data Capture) Clinical Research Data Management System - a medical-grade web application for managing clinical trial data. It includes:

- **phase3_react/**: Main React + TypeScript + Vite application (active development)
- **phase3_html/**: Static HTML prototypes (legacy reference)
- **CuraUI/**: Design system documentation and examples

## Technology Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 5.x
- **UI Library**: Ant Design 5.x
- **Routing**: React Router 6
- **Icons**: @ant-design/icons
- **Date Handling**: dayjs
- **CSS**: CSS Modules + CSS Variables

## Common Commands

```bash
# Navigate to the React project
cd phase3_react

# Install dependencies
npm install

# Start development server (runs on port 5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint

# Bundle analysis (generates dist/stats.html)
npx vite build --mode analyze
```

## Project Architecture

### Directory Structure (phase3_react/src/)

```
src/
├── components/
│   ├── Layout/           # MainLayout, Header
│   ├── Common/           # StatusTag, PageHeader, Toolbar
│   └── Business/         # Domain-specific components
├── pages/                # Route-level page components
│   ├── Dashboard/        # Home page with stats
│   ├── ProjectList/      # Clinical trial projects
│   ├── SubjectList/      # Patient/subject management
│   ├── CRFDesigner/      # Case Report Form designer
│   ├── CRFForm/          # Data entry forms
│   ├── QueryManagement/  # Query/issue tracking
│   ├── QueryDetail/      # Query detail view
│   ├── DataExport/       # Data export functionality
│   ├── SystemConfig/     # System settings
│   └── VisitConfig/      # Visit scheduling config
├── hooks/                # Custom React hooks
├── utils/                # mockData.ts, helpers.ts
├── types/                # TypeScript interfaces
├── constants/            # theme.ts (colors, antd config)
├── styles/               # CSS variables, common styles
├── router.tsx            # Route definitions
└── main.tsx              # App entry point
```

### Key Architecture Patterns

1. **Route-based Code Splitting**: Pages use React.lazy() for dynamic imports, wrapped in Suspense via `LazyOutlet` component in router.tsx

2. **Path Alias**: Use `@/` prefix for src imports (configured in tsconfig.json and vite.config.ts)

3. **State Management**: Uses React built-in useState/useContext (no Redux/Zustand)

4. **Mock Data**: All data comes from `utils/mockData.ts` - no backend API yet

5. **Performance Monitoring**: Custom hooks in `hooks/usePerformance.ts` for component render tracking and Web Vitals

### Routing Structure

- `/` - Dashboard (eager loaded)
- `/projects` - Project list
- `/projects/:id/subjects` - Subjects for a project
- `/subjects` - All subjects
- `/crf-designer` - Form designer
- `/projects/:id/subjects/:subjectId/crf/:crfId` - CRF data entry
- `/queries` - Query management
- `/queries/:id` - Query detail
- `/export` - Data export
- `/config` - System configuration
- `/visit-config` - Visit configuration

## Design System

### Colors (from CuraDigital Design System)

```
Primary:     #5CB8A6 (Teal - brand color)
Primary Light: #E8F5F2
Background:  #F8F9FA
Card:        #FFFFFF
Border:      #E8E8E8

Text:
  Primary:   #333333
  Secondary: #666666
  Muted:     #999999

Status:
  Success:   #27AE60 / #10B981
  Warning:   #F39C12 / #F97316
  Error:     #E74C3C / #EF4444
  Info:      #2196F3 / #3B82F6
```

### Typography

- **Font Stack**: `'Inter', 'Noto Sans SC', sans-serif`
- **Chinese Text**: Minimum font-weight 400 (no Light/Thin)
- **Line Height**: 1.6-1.8 for Chinese content
- **Metadata Labels**: 10px, uppercase, letter-spacing: 0.05em

### Component Conventions

1. **StatusTag**: Use `getStatusColor(status)` from constants/theme.ts for consistent status colors
2. **Tables**: Must use alternating row colors (white → light green → light red pattern)
3. **Cards**: Border-radius 12px, subtle shadow
4. **Buttons**: Border-radius 8px, primary uses teal color

## Key Domain Concepts

- **Project**: Clinical trial/study
- **Subject**: Patient/participant in a trial
- **CRF**: Case Report Form - data collection forms
- **Query**: Data validation issue/question
- **Visit**: Scheduled patient visit/appointment
- **EDC**: Electronic Data Capture system

## Development Notes

- All UI text is in Chinese (medical system for Chinese users)
- Ant Design locale set to zh_CN
- dayjs locale set to zh-cn
- Uses CSS variables defined in `styles/variables.css`
- No test framework currently configured
- ESLint config uses standard React/TypeScript rules

## Build Configuration

Vite config includes:
- Path alias `@/` pointing to `./src`
- Code splitting: vendor-react, vendor-antd, vendor-utils chunks
- Production optimizations: esbuild minification, console removal
- CSS/LESS preprocessor support
