# Product Requirements Document (PRD)

## Document Information
- **Product Name**: Household COO
- **Version**: 0.0.1
- **Last Updated**: September 24, 2025
- **Author**: [Author Name]
- **Stakeholders**: Ozair Ali, Maria Schwarz
- **Status**: Draft

---

## 1. Executive Summary

### 1.1 Product Vision
The Household COO streamlines busy parents' lives by checking their email and an option WhatsApp bot, surfacing important and urgent tasks, and providing guidelines on how to achieve those tasks.

### 1.2 Problem Statement
Young parents, particularly dual income couples, have limited time to get everything done, including work commitments, spending time with children, social activities, maintaining their health, etc. As a result, they do not get a chance to continuously check their emails and stay ahead of regular household tasks. While regular chores such as laundry, cooking and taking out the trash may be scheduled, other one-offs can often slip under the radar. This may include, among other examples, changes in daycare drop-off and pickup times, parking permits, maintenance of household items, etc. In addition, they may not be aware of financially lucrative opportunities that land in their inbox, because they can rarely go through their entire inbox. So while they may have regular tasks scheduled, there may be other **important**, **urgent** and **financially lucrative** tasks that slip under the radar until it's too late.

The Household COO manages these tasks by (i) scanning a linked Gmail inbox to surface any tasks that may be important, urgent or financially lucrative, (ii) connecting to a WhatsApp bot where users can share tasks or chores that they think of, and (iii) building a plan to accompolish these tasks by using any context it can infer and connecting to a basic search tool 

### 1.3 Success Metrics
- **Primary KPIs**: # of tasks marked as "completed" by user, net promoter scores from user interviews 
- **Secondary Metrics**: # of touchpoints per day, # of daily interactions, 
- **Success Criteria**: User engages with application daily by either (i) reviewing a task, (ii) marking a task as completed or (iii) reviewing the instructions for a task

---

## 2. Product Overview

### 2.1 Product Description
Household COO helps young dual income couples with children manage their daily life by reviewing their inbox and communicating through a WhatsApp bot to keep a track of important, urgent, and financially lucrative tasks. It presents these tasks one at a time to not overwhelm the users, and also provides instructions for how to achieve those tasks. Those instructions may include links to forms that need to be filled, or information that the COO gleans from the internet.  

### 2.2 Target Audience
- **Primary Users**: Couple in their 30s in high-powered careers, primarily in HCOL cities, with young children in daycare or elementary school.
- **Secondary Users**: Older parents with kids in middle or high school looking to juggle schedules; individuals with neurodiversity who need help in managing their lives.
- **User Personas**: Mid to late 30s urban professional, living in HCOL city, household income of roughly 300-400k per year, fairly stressful job, married, young children aged 3 and 1, children are in daycare, has a mortgage, financially stable but feels insecure, trying to better manage household to keep standard of living, wants to provide the best for children and spend time with them, wants to delegate as much of household chores as possible and affordable

### 2.3 Value Proposition

The Household COO helps a stressed and overworked parent feel like they are on top of their shit, especially when it comes to managing tasks that may otherwise have fallen through the cracks. They feel like competent parents who are able to spend more meaningful time with their kids without continuously worrying about chores and spending hours trying to figure out how to do them.

---

## 3. Product Requirements

### 3.1 Functional Requirements

#### 4.1.1 Core Features
- **Feature 1**: Geenrate tasks by reading emails in a linked inbox
- **Feature 2**: Categorize tasks in order of how important they are, how urgent they are and how much they could save for a family
- **Feature 3**: Allow users to add tasks through a conversation with a WhatsApp bot
- **Feature 4**: Prompts users to identify the task added through the WhatsApp bot conversation along the three dimensions of importance, urgency and financial security. If user does not provide categorization, a categorization is automatically generated
- **Feature 5**: Allows users to check off tasks and automatically floats the next most important/urgent/financially feasible task onto the list
- **Feature 6**: Card-based UI surfaces only a single task per category at any given time to not overwhelm the user
- **Feature 7**: Generates a how-to for each task by utilizing an LLM with search tools. The helpful how-to provides a detailed breakdown on the steps a user could take to achieve the task, including relevant links or forms, if any.
- **Feature 8**: Refreshes the list every 24 hours, making sure that the tasks remain relevant and up to date
- **Feature 9**: Users add credit to power the LLM API for HH COO
- **Feature 10**: HH COO keeps track of LLM credits and displays credits remaining to the user

#### 4.1.2 User Stories
```
As a busy parent of toddlers, I want an assistant that manages and plans my tasks so that I can spend more time with my kids and worry less

Acceptance Criteria:
- [ ] Can retrieve and read all emails in a linked inbox 
- [ ] Allows user to enter tasks through a WhatsApp bot 
- [ ] Extract tasks from emails using an LLM
- [ ] Rank tasks along three dimensions: importance, urgency and financial feasibility
- [ ] Surfaces three tasks, corresponding to the most important, most urgent and most financially lucrative
- [ ] Builds a plan of execution for **each** task
- [ ] Users can mark task as completed or dismiss tasks
- [ ] Surface next task once a single task is marked as completed or dismissed

```

---

## 5. Technical Specifications

### 5.1 Architecture Overview
[High-level system architecture and technology stack]

### 5.2 Technology Stack
- **Frontend**: React + TypeScript + Vite + Tailwind CSS + Wouter + Zustand + Radix UI
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL + Drizzle ORM
- **Infrastructure**: Single-port deployment

### 5.3 Integration Requirements
- **APIs**: 
  - Gmail API for email scanning and task extraction
  - WhatsApp Business API for bot integration
  - LLM API (OpenAI/Anthropic) for task analysis and instruction generation
- **Third-party Services**: 
  - Email authentication (OAuth2 for Gmail)
  - WhatsApp webhook for bot messages
- **Data Sources**: 
  - Gmail inbox for task discovery
  - WhatsApp messages for manual task input

### 5.4 Data Requirements
- **Data Models**: 
  - Tasks: Core task entities with importance/urgency/savings scoring
  - Budget Transactions: AI service usage tracking and billing
  - Feedback: User feedback on task categorization for ML improvement
- **Data Flow**: 
  - Email → Gmail API → Task extraction → Database → Frontend display
  - WhatsApp → Webhook → Task creation → Database → Frontend display
  - User interaction → Frontend → Backend API → Database updates
- **Data Storage**: 
  - PostgreSQL for persistent data storage
  - Local storage for client-side budget tracking

---

## 6. User Experience (UX) Requirements

### 6.1 Design Principles
Refer to design-audit-principles.mdc in .cursor\rules 

### 6.2 User Interface Requirements
- **Design System**: 
- **Responsive Design**: Should be adaptable to multiple devices, including screens attached to a Raspberry Pi
- **Accessibility**: 

---
