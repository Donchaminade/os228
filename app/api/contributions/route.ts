import { auth } from "@/lib/auth";
import { GitHubEvent, GitHubRepository, UserContributions, GitHubContribution } from "@/types/contributions";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.accessToken) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const username = (session.user as any).username;
    const accessToken = session.accessToken;

    const eventsResponse = await fetch(
      `https://api.github.com/users/${username}/events/public?per_page=100`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!eventsResponse.ok) {
      throw new Error("Erreur lors de la récupération des événements");
    }

    const events: GitHubEvent[] = await eventsResponse.json();

    const repoContributions = new Map<string, number>();
    events.forEach((event) => {
      if (
        event.type === "PushEvent" ||
        event.type === "PullRequestEvent" ||
        event.type === "IssuesEvent" ||
        event.type === "IssueCommentEvent" ||
        event.type === "PullRequestReviewEvent"
      ) {
        const repoName = event.repo.name;
        repoContributions.set(
          repoName,
          (repoContributions.get(repoName) || 0) + 1
        );
      }
    });

    const repositories: GitHubContribution[] = [];
    for (const [repoName, contributions] of repoContributions.entries()) {
      try {
        const repoResponse = await fetch(
          `https://api.github.com/repos/${repoName}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: "application/vnd.github.v3+json",
            },
          }
        );

        if (repoResponse.ok) {
          const repoData: GitHubRepository = await repoResponse.json();
          repositories.push({
            repo: {
              name: repoData.name,
              full_name: repoData.full_name,
              description: repoData.description,
              html_url: repoData.html_url,
              language: repoData.language,
              stargazers_count: repoData.stargazers_count,
              forks_count: repoData.forks_count,
            },
            contributions,
          });
        }
      } catch (error) {
        console.error(`Erreur lors de la récupération du repo ${repoName}:`, error);
      }
    }

    repositories.sort((a, b) => b.contributions - a.contributions);

    const totalContributions = Array.from(repoContributions.values()).reduce(
      (sum, count) => sum + count,
      0
    );

    const userContributions: UserContributions = {
      username,
      avatar_url: (session.user as any).avatar,
      total_contributions: totalContributions,
      repositories: repositories.slice(0, 10), 
    };

    return NextResponse.json(userContributions);
  } catch (error) {
    console.error("Erreur lors de la récupération des contributions:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

