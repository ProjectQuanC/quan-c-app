interface Challenge {
    challenge_id: string;
    challenge_title: string;
    repo_link: string;
    points: number;
    total_test_case: number;
    Tagassign: Tagassign[]; // Array of Tagassign objects
}

interface Tagassign {
    Tag: Tag; // Related Tag object
}

interface Tag {
    tag_id: string;
    tag_name: string;
}

interface PaginationData {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface JsonResponse {
    success: boolean;
    message: string;
    paginationData?: any;
    data?: any;
}

interface UserRank {
    rank: number;
    user_id: string;
    user_github_data: JSON;
    is_current_user: boolean;
    point_total?: number;
    first_submission_time?: Date;
}

export {
    Challenge,
    Tagassign,
    Tag,
    PaginationData,
    JsonResponse,
    UserRank
}