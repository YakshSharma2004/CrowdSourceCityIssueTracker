# City Issue Tracker – Frontend (`cityissuetracker`)

React + TypeScript single-page app for a **Crowdsourced City Issue Tracker**.  

Citizens can log in, report issues (potholes, broken lights, garbage, etc.), upvote issues, and comment.  
City staff log in to view, filter, and manage issues.

The frontend talks to the Spring Boot backend (`cityissuetrackerserver`) over REST.

---

## Tech Stack

- **Framework:** React + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS, custom UI components (shadcn-style), Framer Motion animations
- **HTTP:** native `fetch` wrapped in a small API client (`services/api.ts`)
- **Auth:** HTTP Basic (email + password) stored as a Base64 token in `localStorage`

---

## Project Structure

```txt
cityissuetracker/
├── public/                  # Static assets (favicon, index.html mount point, etc.)
├── src/
│   ├── main.tsx             # React entry point, renders <App />
│   ├── App.tsx              # Top-level app: auth flow + page switching
│   │
│   ├── components/
│   │   ├── LoginPage.tsx        # Citizen/Staff login form (calls api.login)
│   │   ├── SignUp.tsx           # Signup form (citizen or staff, calls api.signup)
│   │   ├── MainPage.tsx         # Main issues list (filtering, sorting, search)
│   │   ├── ReportIssuePage.tsx  # Form to create a new issue
│   │   ├── IssueDetailPage.tsx  # Single issue view: comments, upvotes, status, etc.
│   │   ├── AnalyticsPage.tsx    # (Optional) dashboard/summary page
│   │   ├── Header.tsx           # Top nav bar: tabs, logout button, theme toggle
│   │   ├── FilterBar.tsx        # Search, category/status/severity filters, sort options
│   │   ├── IssueCard.tsx        # Card UI for a single issue in the list
│   │   │
│   │   ├── ThemeContext.tsx     # Dark/light/system theme provider
│   │   └── ui/                  # Reusable styled UI elements
│   │       ├── smooth-cursor.tsx    # Fancy cursor/hover effects
│   │       ├── button.tsx           # Wrapped button styles
│   │       ├── input.tsx            # Wrapped input styles
│   │       ├── card.tsx             # Card container components
│   │       └── ...                  # Other shared UI primitives
│   │
│   ├── services/
│   │   └── api.ts              # Central API client for HTTP calls to backend
│   │                            #  - login, signup, logout
│   │                            #  - getIssues, getIssueById
│   │                            #  - getCommentsByIssueId, addComment
│   │                            #  - upvoteIssue, removeUpvote
│   │                            #  - addIssue
│   │                            #  - getCurrentUser (hits /api/auth/me)
│   │
│   ├── lib/
│   │   └── types.ts            # TypeScript types/interfaces:
│   │                            #  Issue, IssueDetail, Comment, User, PageableResponse, etc.
│   │
│   └── styles/ (optional)      # Tailwind/global styles if extracted
│
├── .env                        # Frontend env vars (not committed)
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.(ts|js)

---

# Setup & Running

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Setup**
    Create a `.env` file in the root directory (if it doesn't exist) and configure your backend URL:
    ```env
    VITE_API_URL=http://localhost:8080
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:5173` (or the port shown in the terminal).

4.  **Build for Production**
    ```bash
    npm run build
    ```
