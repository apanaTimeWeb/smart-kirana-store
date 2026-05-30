Hey, I want you to deeply analyze the @[app/(app)/[MODULE_NAME]] folder and refactor it into an Enterprise-Grade, Highly Scalable, and strictly "AI-Friendly" architecture. 

Currently, no one writes code manually; AI writes it. Because of this, my primary goal is extreme isolation. Tomorrow, if I ask an AI to fix a specific bug, I should only need to provide ONE exact file to the AI, completely eliminating the risk of the AI hallucinating and breaking other working functionalities. 

Please follow these strict architectural rules:

1. **Micro-Modularization (One File, One Component, One Functionality)**: 
Break down all large or mixed files. Every file must contain only one React component and handle only one specific micro-functionality. 

2. **Highly Descriptive, Self-Documenting Filenames**: 
Rename all components and files to be extremely descriptive based on exactly what they do (e.g., `[ModuleName]SearchFilter.tsx`, `[ModuleName]PaymentOptions.tsx`). Filename length doesn't matter; instant clarity for a new developer (or an AI context window) is the only priority.

3. **Backend-Ready Centralized Data (Single Source of Truth)**: 
Find all hardcoded UI data (dropdown options, filter lists, default preset arrays, payment modes, etc.) scattered across the UI components. Extract all of them into a single central `[ModuleName]Types.ts` or `[ModuleName]Constants.ts` file. 
*Why?* Because tomorrow, this hardcoded data will be replaced by a Backend API call. By keeping it all in one file today, I will only have to change one file tomorrow to integrate the API, without touching the UI components. Derive your TypeScript types directly from these central arrays.

4. **Theme Independence (No Inline Colors)**: 
Remove all hardcoded Tailwind color utilities (like `text-primary`, `bg-card`) from the JSX. Replace them with custom CSS variables (e.g., `var(--[moduleName]-primary-bg)`) and define all these variables centrally in @[[MODULE_NAME].css]. This ensures that I can copy-paste this entire folder to another project and theme it entirely from one CSS file.

5. **Update AI-Context Documentation**: 
Once the entire refactor is complete, update the project documentation in @[[MODULE_NAME]_features.md]. This document must serve as a map for future AI sessions. Clearly document the new "One File, One Component" directory structure, what each file precisely does, and where the centralized data/state is kept.

Think step-by-step. Create a detailed implementation plan first so I can review it, and then execute it perfectly without breaking existing data flows!
