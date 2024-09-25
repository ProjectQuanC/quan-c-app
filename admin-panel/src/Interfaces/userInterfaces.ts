export interface Submission {
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

export interface AppData {
  user_id: string;
  role: string;
  total_points: number;
  submissions_history: Submission[];
}

export interface UserData {
  data: any;
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string;
  company: string;
  blog: string;
  location: string;
  email: string | null;
  hireable: boolean | null;
  bio: string;
  twitter_username: string | null;
  notification_email: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  app_data: AppData;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data: UserData;
}
