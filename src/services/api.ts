import { PageableResponse, Issue, Comment, User, newIssue, Department, Assignment } from "../lib/types";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// Reads the stored Basic token and builds the Authorization header
const getAuthHeader = (): Record<string, string> => {
    const token = localStorage.getItem("authToken");
    return token
        ? {
            Authorization: `Basic ${token}`,
            Accept: "application/json",
        }
        : { Accept: "application/json" };
};

export const api = {
    // email === the email stored in app_user (ex: admin@demo.local)
    login: async (email: string, password: string): Promise<void> => {
        if (!email || !password) {
            throw new Error("Email and password are required");
        }
        console.log(`[api.login] Attempting login for: ${email}`);
        const token = btoa(`${email}:${password}`);
        console.log(`[api.login] Generated token: ${token}`);

        const headers = {
            Authorization: `Basic ${token}`,
            Accept: "application/json",
        };

        // Test the credentials by calling a protected endpoint
        const response = await fetch(
            `${BASE_URL}/api/issues`,
            { headers }
        );

        if (!response.ok) {
            console.error(`[api.login] Failed with status: ${response.status}`);
            if (response.status === 401)
                throw new Error("Invalid credentials");
            throw new Error("Login failed");
        }

        // Store token (and optionally email/role) for later requests
        localStorage.setItem("authToken", token);
        localStorage.setItem("userEmail", email);

        // Fetch current user to get the actual role
        try {
            const user = await api.getCurrentUser();
            const role = user.role.toLowerCase(); // "CITIZEN" -> "citizen"
            localStorage.setItem("userRole", role);
            console.log(`[api.login] Stored user role: ${role}`);
        } catch (err) {
            console.error("[api.login] Failed to fetch user role, defaulting to citizen", err);
            localStorage.setItem("userRole", "citizen");
        }

        console.log("Login successful");
    },

    // optional: front-end signup using the same logic as the script
    signup: async (
        email: string,
        password: string,
        fullName: string,
        requestedRole: "CITIZEN" | "STAFF" = "CITIZEN"
    ): Promise<void> => {
        const body = {
            email,
            fullName,
            password,
            requestedRole,
            reason: null,
        };

        console.log("[api.signup] Request body:", body);

        const response = await fetch(`${BASE_URL}/api/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(body),
        });

        console.log(`[api.signup] Response status: ${response.status}`);

        if (!response.ok && response.status !== 201) {
            throw new Error("Signup failed");
        }

        // Only auto-login if it's a citizen signup
        if (requestedRole === "CITIZEN") {
            console.log("Auto-login after signup");
            await api.login(email, password);
        }
    },

    logout: () => {
        localStorage.clear();
    },

    getIssues: async (
        page = 0,
        size = 20
    ): Promise<PageableResponse<Issue>> => {
        const userId = localStorage.getItem("userId");
        const response = await fetch(
            `${BASE_URL}/api/issues?page=${page}&size=${size}${userId ? `&userId=${userId}` : ""}`,
            {
                headers: getAuthHeader(),
            }
        );

        if (!response.ok) {
            if (response.status === 401) throw new Error("Unauthorized");
            throw new Error("Failed to fetch issues");
        }
        return response.json();
    },

    getIssueById: async (id: string): Promise<Issue> => {
        const response = await fetch(`${BASE_URL}/api/issues/${id}?userId=${localStorage.getItem("userId")}`, {
            headers: getAuthHeader(),
        });

        if (!response.ok) {
            if (response.status === 401) throw new Error("Unauthorized");
            throw new Error("Failed to fetch issue");
        }
        return response.json();
    },
    getCommentsByIssueId: async (id: string): Promise<Comment[]> => {
        const response = await fetch(`${BASE_URL}/api/issues/${id}/comments`, {
            headers: getAuthHeader(),
        });

        if (!response.ok) {
            if (response.status === 401) throw new Error("Unauthorized");
            throw new Error("Failed to fetch comments");
        }
        return response.json();
    },

    addComment: async (issueId: string, content: string, authorId: number): Promise<Comment> => {
        const response = await fetch(`${BASE_URL}/api/issues/${issueId}/comments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeader(),
            },
            body: JSON.stringify({ content, authorId }),
        });

        if (!response.ok) {
            if (response.status === 401) throw new Error("Unauthorized");
            throw new Error("Failed to add comment");
        }
        return response.json();
    },

    getCurrentUser: async (): Promise<User> => {
        const response = await fetch(`${BASE_URL}/api/auth/me`, {
            headers: getAuthHeader(),
        });

        if (!response.ok) {
            if (response.status === 401) throw new Error("Unauthorized");
            throw new Error("Failed to fetch current user");
        }
        const user = await response.json();
        console.log("[api.getCurrentUser] Response:", user);
        localStorage.setItem("userId", user.id.toString());
        return user;
    },

    upvoteIssue: async (issueId: string): Promise<void> => {
        const response = await fetch(`${BASE_URL}/api/issues/${issueId}/votes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeader(),
            },
            body: JSON.stringify({ voterId: localStorage.getItem("userId") }),
        });

        if (!response.ok) {
            if (response.status === 401) throw new Error("Unauthorized");
            throw new Error("Failed to upvote issue");
        }
    },

    removeUpvote: async (issueId: string): Promise<void> => {
        const response = await fetch(`${BASE_URL}/api/issues/${issueId}/votes?voterId=${localStorage.getItem("userId")}`, {
            method: "DELETE",
            headers: getAuthHeader(),
        });

        if (!response.ok) {
            if (response.status === 401) throw new Error("Unauthorized");
            throw new Error("Failed to remove upvote");
        }
    },
    addIssue: async (issue: newIssue): Promise<Issue> => {
        const response = await fetch(`${BASE_URL}/api/issues`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeader(),
            },
            body: JSON.stringify(issue),
        });

        if (!response.ok) {
            if (response.status === 401) throw new Error("Unauthorized");
            throw new Error("Failed to add issue");
        }
        return response.json();
    },

    getDepartments: async (): Promise<Department[]> => {
        const response = await fetch(`${BASE_URL}/api/departments`, {
            headers: getAuthHeader(),
        });

        if (!response.ok) {
            if (response.status === 401) throw new Error("Unauthorized");
            throw new Error("Failed to fetch departments");
        }
        return response.json();
    },

    getStaffUsers: async (): Promise<User[]> => {
        const response = await fetch(`${BASE_URL}/api/auth/staff`, {
            headers: getAuthHeader(),
        });

        if (!response.ok) {
            if (response.status === 401) throw new Error("Unauthorized");
            throw new Error("Failed to fetch staff users");
        }
        return response.json();
    },

    assignIssue: async (issueId: string, departmentId: number, staffId: number | null, notes: string): Promise<void> => {
        const url = `${BASE_URL}/api/issues/${issueId}/assignments`;
        const body = {
            departmentId,
            staffId,
            notes
        };
        console.log(`[api.assignIssue] Sending POST to ${url} with body:`, body);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeader(),
            },
            body: JSON.stringify(body),
        });

        console.log(`[api.assignIssue] Response status: ${response.status}`);

        if (!response.ok) {
            if (response.status === 401) throw new Error("Unauthorized");
            throw new Error("Failed to assign issue");
        }
    },

    getAssignments: async (issueId: string): Promise<Assignment[]> => {
        const response = await fetch(`${BASE_URL}/api/issues/${issueId}/assignments`, {
            headers: getAuthHeader(),
        });

        if (!response.ok) {
            if (response.status === 401) throw new Error("Unauthorized");
            throw new Error("Failed to fetch assignments");
        }
        return response.json();
    },

    deleteIssue: async (issueId: string): Promise<void> => {
        const response = await fetch(`${BASE_URL}/api/issues/${issueId}`, {
            method: "DELETE",
            headers: getAuthHeader(),
        });

        if (!response.ok) {
            if (response.status === 401) throw new Error("Unauthorized");
            throw new Error("Failed to delete issue");
        }
    },

    deleteComment: async (issueId: string, commentId: number): Promise<void> => {
        const response = await fetch(`${BASE_URL}/api/issues/${issueId}/comments/${commentId}`, {
            method: "DELETE",
            headers: getAuthHeader(),
        });

        if (!response.ok) {
            if (response.status === 401) throw new Error("Unauthorized");
            throw new Error("Failed to delete comment");
        }
    },
};

