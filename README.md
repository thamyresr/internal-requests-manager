# Internal Requests Manager

A modern, user-friendly web application built with **Vue 3** for managing internal company requests. Track access requests, equipment orders, purchases, support tickets, and more with an intuitive interface and comprehensive dashboard.

![Vue 3](https://img.shields.io/badge/Vue-3.5.25-4FC08D?style=flat&logo=vuedotjs)
![Vite](https://img.shields.io/badge/Vite-7.3.1-646CFF?style=flat&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.18-06B6D4?style=flat&logo=tailwindcss)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Available Scripts](#-available-scripts)
- [How to Use](#-how-to-use)
- [Authentication](#-authentication)
- [Project Purpose](#-project-purpose)

---

## ✨ Features

- **📊 Interactive Dashboard** - Get a real-time overview of all internal requests
- **🔐 User Authentication** - Simple email-based login with persistent sessions
- **📝 Request Management** - Create, edit, and track internal requests
- **🏷️ Request Types** - Support for Access, Equipment, Purchase, and Support request types
- **⚡ Priority Levels** - Organize requests by High, Medium, and Low priority
- **🔄 Status Tracking** - Monitor request progress through Open, In Progress, and Completed statuses
- **🎯 Smart Filtering** - Filter requests by status and type for better organization
- **📱 Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **🎨 Modern UI** - Clean, professional interface with visual hierarchy and excellent UX
- **⚙️ JSON Server Backend** - Mock API with json-server for development and testing

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Vue 3** | Progressive JavaScript framework for building user interfaces |
| **Vite** | Next-generation frontend build tool with lightning-fast HMR |
| **Vue Router** | Official router for single-page application navigation |
| **Tailwind CSS** | Utility-first CSS framework for rapid UI development |
| **JSON Server** | Zero-setup mock API for rapid prototyping and testing |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v16 or higher (LTS recommended)
- **npm** v8 or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd internal-requests-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the JSON Server API**
   ```bash
   npm run api
   ```
   This starts the mock API server at `http://localhost:3001`.
   Keep this terminal running while using the app.

4. **In another terminal, run the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

> On Windows PowerShell, use `npm.cmd` if `npm` is blocked by the execution policy, for example `npm.cmd run dev`.

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server with hot module replacement |
| `npm run build` | Build the project for production to the `dist/` folder |
| `npm run preview` | Preview the production build locally |
| `npm run api` | Start JSON Server with the mock database (port 3001) |
| `npm run test:e2e` | Run the Playwright end-to-end test suite |
| `npm run test:e2e:headed` | Run Playwright tests in headed browser mode |
| `npm run test:e2e:slow` | Run Playwright tests in headed mode with slow motion |

---

## Testing

Run the full Playwright test suite:

```bash
npm run test:e2e
```

Run only the create request flow:

```bash
npm run test:e2e -- tests/create-request.spec.js
```

The create request test also runs an accessibility scan on the request creation form using `accessibility-checker`.

Accessibility reports are generated in:

```text
test-results/accessibility-checker/
```

Useful report files:

```text
test-results/accessibility-checker/create-request-form.json
test-results/accessibility-checker/create-request-form-violations.json
test-results/accessibility-checker/summary.json
```

---

## 💻 How to Use

### Login
1. Open the application at `http://localhost:5173`
2. You'll be redirected to the login page
3. Enter any email address and click "Sign In"
4. Your session will be saved in localStorage and persist across page refreshes

### Dashboard
- View all your internal requests at a glance
- See request summaries with status indicators
- Check priority levels and assignee information
- Filter requests by status or type using the filter controls

### Creating a Request
1. Click the "New Request" button on the dashboard
2. Fill in the request details:
   - **Title**: Brief description of your request
   - **Description**: Detailed explanation
   - **Type**: Choose from Access, Equipment, Purchase, or Support
   - **Priority**: Set as High, Medium, or Low
   - **Assignee**: Assign to a team member
   - **Due Date**: Set a deadline
3. Click "Submit" to create the request

### Editing a Request
1. Click the edit icon on any request in the dashboard
2. Modify the request details as needed
3. Click "Update" to save your changes

### Sign Out
1. Click your email address or the sign-out button in the header
2. You'll be logged out and returned to the login page

---

## 🔐 Authentication

The application uses a simple localStorage-based authentication system for development purposes:

- **Email-based login**: Users sign in with any email address
- **Session persistence**: User sessions are saved in browser localStorage
- **Automatic redirection**: Unauthenticated users are automatically redirected to the login page
- **Route protection**: All routes except `/login` require authentication

**Note**: This authentication system is suitable for development and portfolio demonstration only. For production use, implement proper backend authentication with secure tokens and password hashing.

---

## 🎯 Project Purpose

This project was created as a **portfolio piece** to demonstrate:

✅ Building real-world frontend applications with Vue 3  
✅ Component organization and reusability  
✅ Professional routing with route guards  
✅ State management with composable stores  
✅ Clean UI/UX design patterns for internal tools  
✅ Modern Vue 3 composition API patterns  
✅ Responsive design principles  
✅ Integration with mock APIs  

---

## 📌 Notes

- The data persists via JSON Server's `db.json` file during development
- Tailwind CSS is used for styling with a utility-first approach
- The application uses Vue Router's composition API integration
- All authentication is client-side for development purposes

---

## 🚀 Future Enhancements

Potential features for future versions:

- Real backend API integration
- Advanced filtering and search
- Request timeline/history tracking
- User profile management
- Admin dashboard
- Role-based access control

---

## 👤 Author

Created as a portfolio project to showcase modern Vue 3 development skills.
