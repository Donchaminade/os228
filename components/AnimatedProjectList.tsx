"use client";

import ProjectCard from "./ProjectCard";
import { ProjectWithStats } from "../data/projects";

interface AnimatedProjectListProps {
  paginatedProjects: ProjectWithStats[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function AnimatedProjectList({
  paginatedProjects,
  searchQuery,
  setSearchQuery,
}: AnimatedProjectListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-300">
      {paginatedProjects.length > 0 ? (
        paginatedProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))
      ) : (
        <div className="text-center py-12 col-span-full">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Aucun projet trouvé
          </h3>
          <p className="text-muted-foreground">
            {searchQuery
              ? `Aucun projet ne correspond à "${searchQuery}"`
              : "Aucun projet disponible pour le moment"}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Effacer la recherche
            </button>
          )}
        </div>
      )}
    </div>
  );
}
