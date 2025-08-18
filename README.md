# Household COO - ADHD-Friendly Kiosk Interface

A static web application designed for Raspberry Pi kiosk deployment that helps households manage important, urgent, and savings-related tasks with an ADHD-friendly interface.

## Features

### 🧠 ADHD-Friendly Design
- **Extra large task headlines** (4xl) as the dominant visual element
- **Small text for everything else** to reduce cognitive load
- **High contrast colors** and generous white space
- **Large touch targets** (80px+ for primary actions)
- **Minimal motion** to reduce distractions
- **Clear visual hierarchy** with category icons only

### 🏠 Household Management
- **Three spotlight cards**: Important, Urgent, Savings
- **Smart task prioritization** using mock LLM scoring
- **Budget management** with balance-based AI instruction costs
- **Local persistence** with localStorage
- **Export/import functionality** for data portability

### 📱 Kiosk-Optimized
- **No keyboard shortcuts** - fully touch-optimized
- **Large typography** for headlines only
- **Big hit targets** with extra padding
- **Static export** for offline deployment
- **Raspberry Pi ready** with kiosk setup scripts

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Export static files for kiosk deployment
npm run export
