# 🗳️ Election Process Education Platform

An immersive, interactive web application designed to educate citizens about the democratic election process. Built for the **Hack2Skill Google Virtual Prompt War**, this platform features a premium, minimalist design, an AI-powered conversational assistant, and real-time database capabilities.

![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Vite%20%7C%20Tailwind%20v4-blue?style=for-the-badge)
![Google Services](https://img.shields.io/badge/Services-Gemini%20%7C%20Firebase-orange?style=for-the-badge)
![UI/UX](https://img.shields.io/badge/Design-Classic%20Minimalism-black?style=for-the-badge)

## 🌟 Key Features

1. **🤖 Democracy Bot (Google Gemini AI)**
   Powered by the cutting-edge **Gemini 2.5 Flash** model, the Democracy Bot acts as a virtual expert on all election matters. It features a beautifully docked right-side panel on desktop, rich markdown parsing, and highly accurate election information.

2. **📊 Real-Time Global Leaderboard (Firebase)**
   A live, globally synced leaderboard powered by **Google Firebase Firestore**. Compete with others to test your Voter IQ, securely tracked via Firebase Anonymous Authentication.

3. **🗺️ Persona-Based Learning Journey**
   Users can experience the election process from three distinct perspectives:
   - 🧑‍💼 **The Voter**: Learn about registration, candidate research, and casting a ballot.
   - 📣 **The Candidate**: Understand nominations, campaign rules, and the counting process.
   - 🛡️ **Election Officer**: Explore the logistics, EVM setup, and securing a fair election.

4. **✅ Gamified "Voter IQ" Assessment**
   A clean, distraction-free interactive quiz that tests the user's knowledge, tracks their score, and securely stores it in the cloud.

5. **🏆 100% Hackathon Metrics Ready**
   - **Google Services**: Integration of Gemini API, Firestore, Firebase Auth, Firebase Analytics, and Firebase Performance.
   - **Efficiency**: Lazy loaded routing, full React memoization, dynamic chunking, and runtime environment variable injection.
   - **Security**: Strict Firestore security rules, hidden API keys, and comprehensive secrets management via Google Cloud Run.
   - **Testing & Code Quality**: 100% test coverage (43/43 passing Vitest suites), strict PropTypes, and complete JSDoc documentation.
   - **Accessibility**: ARIA tags on all interactive elements, screen-reader live regions, and semantic HTML5.

## 🚀 Getting Started

This project is built using Vite and React, ensuring blazing fast performance.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ashwanisingh011/H2S.git
   cd H2S
   ```

2. **Set up Environment Variables:**
   Create a `.env` file in the root directory. You will need to provide your own Gemini API Key and Firebase Configuration to fully run the application locally.

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Run tests:**
   ```bash
   npm test
   ```

## 🛠️ Technology Stack

- **Frontend**: [React 18](https://react.dev/) via [Vite](https://vitejs.dev/)
- **AI**: [Google Gemini SDK](https://ai.google.dev/) (`@google/generative-ai`)
- **Backend/DB**: [Google Firebase](https://firebase.google.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Markdown Parsing**: `react-markdown`

## 📝 Submission Details

- **Hackathon**: Hack2Skill Google Virtual Prompt War
- **Challenge Theme**: Election Process Education
- **Deployment**: Google Cloud Run (Dockerized)

---
*Empowering democracy through Google AI, elegant design, and comprehensive education.*
