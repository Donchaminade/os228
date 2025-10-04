"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { projectsData, ProjectWithStats } from "../data/projects";
import { cache } from "../lib/cache";
import { extractGitHubInfo, getGitHubStats, GitHubStats } from "../lib/github";
interface ProjectsContextType {
  projects: ProjectWithStats[];
  searchQuery: string;
  sortBy: "name" | "stars" | "id";
  displayedProjects: ProjectWithStats[];
  totalProjects: number;
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: "name" | "stars" | "id") => void;
  loadMoreProjects: () => void;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(
  undefined
);

const ITEMS_PER_LOAD = 12;

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<ProjectWithStats[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"name" | "stars" | "id">("id");
  const [displayedCount, setDisplayedCount] = useState<number>(ITEMS_PER_LOAD);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    const initializeProjects = async () => {
      setIsLoading(true);

      const initialProjects: ProjectWithStats[] = projectsData.map(
        (project) => ({
          ...project,
          isLoadingStats: true,
        })
      );

      setProjects(initialProjects);

      const updatedProjects = await Promise.all(
        initialProjects.map(async (project) => {
          try {
            const githubInfo = extractGitHubInfo(project.link);
            if (!githubInfo) {
              return { ...project, isLoadingStats: false };
            }

            const cacheKey = `github-stats-${githubInfo.owner}-${githubInfo.repo}`;
            let stats = cache.get<GitHubStats>(cacheKey);

            if (!stats) {
              stats = await getGitHubStats(githubInfo.owner, githubInfo.repo);
              if (stats) {
                cache.set(cacheKey, stats, 5 * 60 * 1000);
              }
            }

            return {
              ...project,
              githubStats: stats || undefined,
              isLoadingStats: false,
            };
          } catch (error) {
            console.error(
              `Erreur lors du chargement des stats pour ${project.name}:`,
              error
            );
            return { ...project, isLoadingStats: false };
          }
        })
      );

      setProjects(updatedProjects);
      setIsLoading(false);
    };

    initializeProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;

    return projects.filter(
      (project) =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.technologies.some((tech) =>
          tech.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        project.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [projects, searchQuery]);

  const sortedProjects = useMemo(() => {
    const sorted = [...filteredProjects];

    switch (sortBy) {
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name, "fr"));
        break;
      case "stars":
        sorted.sort((a, b) => {
          const starsA = a.githubStats?.stars || 0;
          const starsB = b.githubStats?.stars || 0;

          if (starsA !== starsB) {
            return starsB - starsA;
          }

          return b.id - a.id;
        });
        break;
      case "id":
      default:
        sorted.sort((a, b) => b.id - a.id);
        break;
    }

    return sorted;
  }, [filteredProjects, sortBy]);

  const totalProjects = sortedProjects.length;
  const hasMore = displayedCount < totalProjects;

  const displayedProjects = useMemo(() => {
    return sortedProjects.slice(0, displayedCount);
  }, [sortedProjects, displayedCount]);

  const loadMoreProjects = () => {
    if (hasMore && !isLoadingMore) {
      setIsLoadingMore(true);
      // Simuler un délai pour l'effet de chargement
      setTimeout(() => {
        setDisplayedCount((prev) =>
          Math.min(prev + ITEMS_PER_LOAD, totalProjects)
        );
        setIsLoadingMore(false);
      }, 500);
    }
  };

  const handleSetSearchQuery = (query: string) => {
    setSearchQuery(query);
    setDisplayedCount(ITEMS_PER_LOAD);
  };

  const handleSetSortBy = (sort: "name" | "stars" | "id") => {
    setSortBy(sort);
    setDisplayedCount(ITEMS_PER_LOAD);
  };

  const contextValue: ProjectsContextType = {
    projects,
    searchQuery,
    sortBy,
    displayedProjects,
    totalProjects,
    isLoading,
    isLoadingMore,
    hasMore,
    setSearchQuery: handleSetSearchQuery,
    setSortBy: handleSetSortBy,
    loadMoreProjects,
  };

  return (
    <ProjectsContext.Provider value={contextValue}>
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectsProvider");
  }
  return context;
}
