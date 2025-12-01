export interface Issue {
    id: number;
    title: string;
    category: string;
    severity: "LOW" | "MEDIUM" | "HIGH";
    status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
    address: string;
    createdAt: string;
    reporterId: number;
    reporterName: string;
    description?: string; // Optional as it wasn't in the list response, but likely needed
    votes?: number; // Optional, might be added later
    isVotedByUser?: boolean;
}

export interface Comment {
    id: number;
    issueId: number;
    authorId: number;
    authorName: string;
    content: string;
    createdAt: string;
    role?: "citizen" | "staff"; // Optional as it's not in the current response
}

export interface User {
    id: number;
    email: string;
    fullName: string;
    role: "CITIZEN" | "STAFF";
    createdAt?: string;
}

export interface PageableResponse<T> {
    content: T[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        };
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    last: boolean;
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}
export interface Issue {
    id: number;
    title: string;
    category: string;
    severity: "LOW" | "MEDIUM" | "HIGH";
    status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
    address: string;
    createdAt: string;
    reporterId: number;
    reporterName: string;
    description?: string; // Optional as it wasn't in the list response, but likely needed
    votes?: number; // Optional, might be added later
    isVotedByUser?: boolean;
}

export interface Comment {
    id: number;
    issueId: number;
    authorId: number;
    authorName: string;
    content: string;
    createdAt: string;
    role?: "citizen" | "staff"; // Optional as it's not in the current response
}

export interface User {
    id: number;
    email: string;
    fullName: string;
    role: "CITIZEN" | "STAFF";
    createdAt?: string;
}

export interface PageableResponse<T> {
    content: T[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        };
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    last: boolean;
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}
export interface newIssue {
    reporterId: number;
    title: string;
    category: string;
    severity: "LOW" | "MEDIUM" | "HIGH";
    address: string;
    description?: string;
}

export interface Department {
    id: number;
    name: string;
}