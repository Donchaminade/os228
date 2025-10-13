export interface GitHubContribution {
  repo: {
    name: string;
    full_name: string;
    description: string | null;
    html_url: string;
    language: string | null;
    stargazers_count: number;
    forks_count: number;
  };
  contributions: number;
}

export interface UserContributions {
  username?: string;
  avatar_url?: string;
  total_contributions: number;
  repositories: GitHubContribution[];
}

export interface GitHubEvent {
  type: string;
  repo: {
    name: string;
    url: string;
  };
  created_at: string;
}

export interface GitHubRepository {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  owner: {
    login: string;
  };
}

