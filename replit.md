# Household COO - ADHD-Friendly Kiosk Interface

## Overview

The Household COO is a static web application designed as an ADHD-friendly kiosk interface for managing household tasks. The system prioritizes three types of tasks: Important, Urgent, and Savings-related items. Built with accessibility and cognitive load reduction in mind, it features extra-large headlines, high contrast colors, large touch targets, and minimal motion to create an optimal experience for users with ADHD. The application is designed for deployment on Raspberry Pi devices in kiosk mode, providing a dedicated household management station.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The application is built using **Next.js with TypeScript** and configured for static export (`output: 'export'`) to enable offline deployment on Raspberry Pi devices. The frontend uses **React with App Router** for navigation and **Tailwind CSS with shadcn/ui** components for consistent, accessible styling. The routing structure includes a home page with three spotlight cards and individual list pages for each task dimension (importance, urgency, savings).

### State Management
**Zustand** is used for global state management with **localStorage persistence** to maintain data across sessions. The state includes tasks, user feedback, budget information, integration statuses, and sync timestamps. All data persistence is handled client-side without requiring a backend database.

### UI/UX Design Patterns
The interface follows strict **ADHD-friendly design principles**: 5xl headlines as dominant visual elements, extra small supporting text, generous white space, 80px+ touch targets, and minimal animations. The design uses a three-card spotlight system to reduce cognitive overload while highlighting the most important tasks in each dimension. The application now uses a **dark mode color scheme** with high contrast white text on dark gray backgrounds for reduced eye strain and improved readability in various lighting conditions.

### Task Scoring and Prioritization
Tasks are scored using **mock LLM-based algorithms** with numeric fields for importance (0-100), urgency (0-100), and savings score (0-100). The system includes a feedback mechanism where users can provide thumbs up/down ratings that adjust task scores by ±3 points. Savings tasks are filtered to only show items with positive `savingsUsd` values.

### Budget Management
The application implements a **running balance budget system** rather than daily budgets. Users can add funds manually, and instruction requests consume from the balance at a configurable rate ($0.02 default). The system prevents instruction requests when insufficient funds are available and maintains a transaction ledger with all budget activities.

### Data Architecture
Tasks contain comprehensive metadata including title, summary, source type (Gmail/WhatsApp), timestamps, due dates, savings amounts, and status tracking. The system supports task actions (external links) and citations for instruction panels. All data is structured for easy import/export via JSON.

### Error Handling and Simulation
LLM services are mocked with realistic delays and error simulation (10% connection failure rate). The system handles insufficient balance scenarios gracefully and provides clear error states without fallback behaviors that could confuse users.

## External Dependencies

### UI Component Library
- **@radix-ui/***: Comprehensive set of accessible UI primitives including dialogs, dropdowns, switches, and form components
- **shadcn/ui**: Pre-built component system built on Radix UI with Tailwind CSS styling
- **lucide-react**: Icon library providing consistent iconography throughout the interface

### State and Data Management
- **zustand**: Lightweight state management for global application state
- **@tanstack/react-query**: Data fetching and caching layer (configured but minimal usage due to static nature)
- **date-fns**: Date formatting and manipulation utilities for timestamp display

### Styling and Animation
- **tailwindcss**: Utility-first CSS framework with custom ADHD-friendly color variables
- **class-variance-authority**: Utility for creating consistent component variants
- **clsx** and **tailwind-merge**: Class name manipulation utilities

### Development and Build Tools
- **vite**: Fast development server and build tool
- **typescript**: Type safety throughout the application
- **wouter**: Lightweight client-side routing library

### Database Integration (Prepared but Not Required)
- **drizzle-orm** and **@neondatabase/serverless**: Database ORM and connection utilities configured for potential PostgreSQL integration
- **drizzle-zod**: Schema validation integration (currently used for type definitions)

### Form and Validation
- **react-hook-form**: Form state management and validation
- **@hookform/resolvers**: Form validation resolvers
- **zod**: Schema validation library

The application is specifically designed to run without external API dependencies, making it suitable for offline deployment in kiosk environments while maintaining the flexibility to add real integrations in the future.