"use client";

import { useEffect, useState } from "react";

interface Contributor {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

export default function Contributors() {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/repos/ln-dev7/os228/contributors"
        );

        if (!response.ok) {
          throw new Error("Erreur lors du chargement des contributeurs");
        }

        const data = await response.json();
        setContributors(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchContributors();
  }, []);

  if (loading) {
    return (
      <div className="text-center">
        <div className="inline-flex items-center gap-2 text-muted-foreground">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span>Chargement des contributeurs...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-muted-foreground">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h3 className="text-lg font-semibold text-card-foreground mb-4">
        Merci à nos contributeurs !
      </h3>
      <div className="flex flex-wrap justify-center gap-3">
        {contributors.map((contributor) => (
          <a
            key={contributor.id}
            href={contributor.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative hover:z-10"
            title={`${contributor.login} - ${contributor.contributions} contribution${contributor.contributions > 1 ? "s" : ""}`}
          >
            <img
              src={contributor.avatar_url}
              alt={contributor.login}
              className="w-12 h-12 rounded-full border-2 border-border hover:border-primary transition-all duration-200 group-hover:scale-110"
            />
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {contributor.login}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
