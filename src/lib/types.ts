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
    description?: string;
    votes?: number;
    isVotedByUser?: boolean;
}

export interface Comment {
    id: number;
    issueId: number;
    authorId: number;
    authorName: string;
    content: string;
    createdAt: string;
    role?: "citizen" | "staff";
}

export interface User {
    id: number;
    email: string;
    fullName: string;
    role: "CITIZEN" | "STAFF" | "ADMIN";
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

export interface Assignment {
    id: number;
    issueId: number;
    departmentId: number;
    departmentName: string;
    staffId?: number;
    staffName?: string;
    notes?: string;
    assignedAt: string;
}