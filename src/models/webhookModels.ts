export interface WebhookPayload {
  after: string;
  before: string;
  commits: Commit[];
  event: string;
  ref: string;
  repository: Repository;
  sender: User;
}

interface Commit {
  author: Author;
  committer: Author;
  id: string;
  message: string;
  timestamp: string;
  title: string;
}

interface Author {
  date: string;
  email: string;
  name: string;
}

interface Repository {
  created_a: string;
  default_branch: string;
  description: string;
  git_url: string;
  http_url: string;
  id: number;
  name: string;
  owner: User;
  private: boolean;
  project_name: string;
  ssh_url: string;
  updated_at: string;
}

interface User {
  id: number;
  username: string;
}

export interface WebhookResponse {
  success: boolean;
  message: string;
  event: string;
  repository: {
    id: number;
    name: string;
    owner: string;
  };
  sender: {
    id: number;
    username: string;
  };
  branch: string;
  commits: Array<{
    id: string;
    message: string;
    author: string;
    timestamp: string;
  }>;
  timestamp: string;
}

export interface DispatchPayload {
  type: string;
  repoUrl: string;
  branch: string;
  commitSha: string;
}

export interface ServiceConfig {
  url: string;
  name: string;
}
