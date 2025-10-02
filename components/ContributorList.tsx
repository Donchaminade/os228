"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getGitHubContributors, GitHubContributor } from "../lib/github";
import { cache } from "../lib/cache";

export default function ContributorList() {
  const [contributors, setContributors] = useState<GitHubContributor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContributors = async () => {
      const owner = "Docteur-Parfait";
      const repo = "os228";
      const cacheKey = `github-contributors-${owner}-${repo}`;

      try {
        setLoading(true);
        
        const cachedContributors = cache.get<GitHubContributor[]>(cacheKey);
        if (cachedContributors) {
          setContributors(cachedContributors);
          setLoading(false);
          return;
        }

        const data = await getGitHubContributors(owner, repo);
        if (data) {
          cache.set(cacheKey, data, 60 * 60 * 1000);
          setContributors(data);
        }
      } catch (error) {
        console.error("Failed to fetch contributors", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContributors();
  }, []);

  return (
    <section className="bg-card border border-border rounded-lg p-8 mt-16">
      <h3 className="text-2xl font-bold text-card-foreground mb-6 text-center">
        Nos Incroyables Contributeurs
      </h3>
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : contributors.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {contributors.map((contributor) => (
            <a
              key={contributor.id}
              href={contributor.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 text-center group"
            >
              <Image
                src={contributor.avatar_url}
                alt={`Avatar de ${contributor.login}`}
                width={64}
                height={64}
                className="rounded-full border-2 border-border group-hover:border-primary transition-all duration-300"
              />
              <p className="text-sm font-medium text-card-foreground group-hover:text-primary transition-colors">
                {contributor.login}
              </p>
            </a>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">
          Impossible de charger la liste des contributeurs pour le moment.
        </p>
      )}
    </section>
  );
}
