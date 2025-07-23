# SAIT Placement Portal

> **Streamlining campus recruitment for students, companies, and institutions.**


The **SAIT Placement Portal** is a digital platform designed to simplify and optimize the job placement process. It enables students to discover job opportunities tailored to their skills, allows companies to find top-tier candidates effortlessly, and empowers institutions to monitor and enhance placement performance.

---

## ✨ Features

### 🎓 For Students

- **Automated Job Matching**: Receive personalized job recommendations based on your skills, with real-time updates.
- **Resume Management**: Upload resumes in PDF format, manage multiple versions, and extract skills automatically.
- **Mock Test Platform**: Prepare for interviews with categorized tests in:
  - Data Structures & Algorithms  
  - Web Development  
  - Quantitative Aptitude  
  - ...and more, with performance tracking.
- **Profile Management**: Maintain a centralized profile with academic records and professional details.

---

### 🏢 For Companies

- **Streamlined Hiring**: Discover suitable candidates quickly through intelligent, skill-based matching.
- **Improved Candidate Quality**: Access enhanced student profiles with extracted and verified skillsets.
- **Faster Recruitment**: Reduce hiring time through automation and optimized data access.

---

### 🏫 For Institution (SAIT)

- **Improved Placement Rates**: Boost the effectiveness of campus recruitment initiatives.
- **Student Tracking**: Monitor student engagement, progress, and readiness within the platform.
- **Stronger Employer Relationships**: Simplify coordination with hiring companies and improve institutional branding.

---

## 🚀 Getting Started

To run the SAIT Placement Portal locally, follow these steps:

### Prerequisites

- **Flutter SDK** *(if extending to mobile apps)*  
- **Node.js** and **npm/yarn** – For React.js development  
- **Supabase Account** – Backend-as-a-Service used for authentication, database, file storage, and real-time features

---

## 🛠️ Built With

### Frontend

- **React.js** – Core framework for building the web interface  
- **Material-UI** – Modern and responsive UI components  
- **React Router** – Navigation and routing within the application  

### Backend & Database

- **Supabase** – Backend platform offering:
  - **PostgreSQL** – For structured data storage  
  - **Authentication** – Secure login/session management  
  - **File Storage** – For resume uploads  
  - **Real-Time Features** – Live updates and notifications  

---

## 💡 How to Use

### 🧑‍🎓 Student Flow

1. **Register/Login** – Create an account and access the dashboard.
2. **Profile Setup** – Add Student ID, Department, CGPA, Year of Study, skills, and resume.
3. **Job Matching** – View personalized job recommendations with Field Compatibility Scores.
4. **Mock Tests** – Attempt categorized technical and aptitude tests with time tracking.
5. **Resume Management** – Upload and version resumes; auto-extract key skills.

### 🏢 Company & Institution Flow

- Companies: Register, post job requirements, and filter candidates based on skills and profiles.
- Institutions: Monitor placement performance, track student activities, and manage employer relationships.

---

## 🛣️ Roadmap

- Enhance job matching algorithms for better precision and relevance.
- Expand the mock test library with more categories and adaptive testing.
- Build advanced analytics dashboards for stakeholders.
- Integrate AI-driven features like resume scoring and personalized interview feedback.


---

## ✅ Success Metrics

- **Increased Placement Rates** – More students successfully placed.
- **Higher Engagement** – Active participation from students and companies.
- **System Performance** – Fast response times, accurate recommendations, and user satisfaction.

---



































































# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
