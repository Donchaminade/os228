"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ProjectWithStats, projectsData } from '../data/projects';
import { extractGitHubInfo, getGitHubStats, GitHubStats } from '../lib/github';
import { cache } from '../lib/cache';interface ProjectsContextType {
    projects: ProjectWithStats[];
    searchQuery: string;
    sortBy: "name" | "stars" | "id";
    currentPage: number;
    filteredProjects: ProjectWithStats[];
    paginatedProjects: ProjectWithStats[];
    totalPages: number;
    totalProjects: number;
    isLoading: boolean;
    setSearchQuery: (query: string) => void;
    setSortBy: (sort: "name" | "stars" | "id") => void;
    setCurrentPage: (page: number) => void;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

const ITEMS_PER_PAGE = 6;

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
    const [projects, setProjects] = useState<ProjectWithStats[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [sortBy, setSortBy] = useState<"name" | "stars" | "id">("id");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeProjects = async () => {
            setIsLoading(true);

            const initialProjects: ProjectWithStats[] = projectsData.map(project => ({
                ...project,
                isLoadingStats: true
            }));

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
                            isLoadingStats: false
                        };
                    } catch (error) {
                        console.error(`Erreur lors du chargement des stats pour ${project.name}:`, error);
                        return { ...project, isLoadingStats: false };
                    }
                })
            );

            setProjects(updatedProjects);
            setIsLoading(false);
        };

        initializeProjects();
    }, []);

    // Filtrer les projets selon la recherche
    const filteredProjects = useMemo(() => {
        if (!searchQuery.trim()) return projects;

        return projects.filter((project) =>
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
    const totalPages = Math.ceil(totalProjects / ITEMS_PER_PAGE);

    const paginatedProjects = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return sortedProjects.slice(startIndex, endIndex);
    }, [sortedProjects, currentPage]);

    const handleSetSearchQuery = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const handleSetSortBy = (sort: "name" | "stars" | "id") => {
        setSortBy(sort);
        setCurrentPage(1);
    };

    const contextValue: ProjectsContextType = {
        projects,
        searchQuery,
        sortBy,
        currentPage,
        filteredProjects: sortedProjects,
        paginatedProjects,
        totalPages,
        totalProjects,
        isLoading,
        setSearchQuery: handleSetSearchQuery,
        setSortBy: handleSetSortBy,
        setCurrentPage,
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
        throw new Error('useProjects must be used within a ProjectsProvider');
    }
    return context;
}