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
    upvotes?: number; // Optional, might be added later
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
