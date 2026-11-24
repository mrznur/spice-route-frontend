export type Role = 'SUPER_ADMIN' | 'OWNER' | 'MANAGER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  restaurantId: string | null;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface BranchResponse {
  id: string;
  name: string;
  address: string | null;
  active: boolean;
  createdAt: string;
}

export interface BranchRequest {
  name: string;
  address?: string;
  active?: boolean;
}

export interface ManagerBranchInfo {
  id: string;
  name: string;
}

export interface ManagerResponse {
  id: string;
  name: string;
  email: string;
  active: boolean;
  createdAt: string;
  branches: ManagerBranchInfo[];
}

export interface CreateManagerRequest {
  name: string;
  email: string;
  password: string;
  branchIds: string[];
}

export interface UpdateManagerRequest {
  name: string;
  active?: boolean;
  branchIds: string[];
}

export interface TableResponse {
  id: string;
  branchId: string;
  label: string;
  qrToken: string;
  active: boolean;
  createdAt: string;
}

export interface TableRequest {
  label: string;
  active?: boolean;
}

export interface BulkTablesRequest {
  count: number;
  prefix?: string;
}

export interface BulkTablesResponse {
  created: TableResponse[];
  skipped: string[];
}

export interface PublicTableInfo {
  restaurantName: string;
  branchName: string;
  tableLabel: string;
}

export interface ApiError {
  status: number;
  error: string;
  errors?: Record<string, string>;
}

export interface MeResponse {
  userId: string;
  email: string;
  role: Role;
  restaurantId: string | null;
}

// ── Feedback ────────────────────────────────────────────────────
export interface FeedbackResponse {
  id: string;
  branchId: string;
  tableId: string;
  rating: number;
  comment: string | null;
  customerName: string | null;
  anonymous: boolean;
  language: string;
  createdAt: string;
}

export interface FeedbackPageResponse {
  content: FeedbackResponse[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export interface FeedbackStatsResponse {
  totalFeedback: number;
  averageRating: number | null;
  fiveStar: number;
  fourStar: number;
  threeStar: number;
  twoStar: number;
  oneStar: number;
}

export interface SubmitFeedbackRequest {
  qrToken: string;
  rating: number;
  comment?: string;
  customerName?: string;
  customerPhone?: string;
  language?: string;
}
