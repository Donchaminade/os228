"use client";

import { useMemo } from "react";
import { useProjects } from "../contexts/ProjectsContext";

interface ProjectFiltersProps {
  onSearch: (query: string) => void;
  onSort: (sortBy: "name" | "stars" | "id") => void;
  onLanguageChange: (languages: string[]) => void;
  searchQuery: string;
  sortBy: "name" | "stars" | "id";
  selectedLanguages: string[];
  isLoadingStats?: boolean;
}

export default function ProjectFilters({
  onSearch,
  onSort,
  onLanguageChange,
  searchQuery,
  sortBy,
  selectedLanguages,
  isLoadingStats = false,
}: ProjectFiltersProps) {
  const { projects } = useProjects();

  const allLanguages = useMemo(() => {
    const languages = new Set<string>();
    projects.forEach((p) => languages.add(p.language));
    return Array.from(languages).sort();
  }, [projects]);

  const handleLanguageClick = (language: string) => {
    const newSelection = selectedLanguages.includes(language)
      ? selectedLanguages.filter((l) => l !== language)
      : [...selectedLanguages, language];
    onLanguageChange(newSelection);
  };
	return (
		<div className="mb-8">
			{/* Barre de recherche et tri sur la même ligne sur desktop */}
			<div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
				{/* Barre de recherche */}
				<div className="relative flex-1 lg:max-w-md">
					<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<svg
							className="h-5 w-5 text-muted-foreground"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
					</div>
					<input
						type="text"
						placeholder="Rechercher un projet..."
						value={searchQuery}
						onChange={(e) => onSearch(e.target.value)}
						className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-card text-card-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
					/>
				</div>

				{/* Options de tri et indicateur */}
				<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full lg:w-auto">
					<div className="flex items-center gap-2">
						<span className="text-sm font-medium text-foreground">
							Trier par :
						</span>
						<select
							value={sortBy}
							onChange={(e) =>
								onSort(e.target.value as "name" | "stars" | "id")
							}
							className="px-3 py-2 border border-border rounded-md bg-card text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
						>
							<option value="id">Plus récent</option>
							<option value="name">Nom (A-Z)</option>
							<option value="stars">⭐ Popularité (étoiles GitHub)</option>
						</select>
						{isLoadingStats && sortBy === "stars" && (
							<div className="flex items-center gap-1 text-sm text-muted-foreground">
								<div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
								<span>Chargement des stats...</span>
							</div>
						)}
					</div>

					{/* Indicateur de résultats */}
					{searchQuery && (
						<div className="text-sm text-muted-foreground">
							<span>Recherche : &quot;{searchQuery}&quot;</span>
						</div>
					)}
				</div>
			</div>

			{/* Filtres par langage */}
      <div className="mt-6">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-foreground mr-2">
            Filtrer par langage :
          </span>
          {allLanguages.map((language) => {
            const isSelected = selectedLanguages.includes(language);
            return (
              <button
                key={language}
                onClick={() => handleLanguageClick(language)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors duration-200 border ${isSelected
                    ? "bg-primary border-primary text-primary-foreground"
                    : "bg-card hover:bg-secondary border-border text-foreground"
                  }`}>
                {language}
              </button>
            );
          })}
        </div>
      </div>



		</div>
	);
}
