// userTypes.ts

export interface UserState {
  loading: boolean;
  user: User | null;
  error: string | null;
}

export interface AppData {
  user_id: string;
  role: string;
  total_points: number;
  submissions_history: SubmissionHistory[];
}

export interface SubmissionHistory {
  challengeId: string;
  repoLink: string;
  challengeTitle: string;
  status: boolean;
  passedTestCaseValue: number;
  passedTestCaseCount: number;
  totalTestCase: number;
  challengePoints: number;
  createdAt: string;
}

export interface User {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  name: string;
  app_data: AppData;
}