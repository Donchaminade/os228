"use client";

import ProjectCard from "./ProjectCard";
import { ProjectWithStats } from "../data/projects";
import Masonry from "react-masonry-css";

interface AnimatedProjectListProps {
  paginatedProjects: ProjectWithStats[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const breakpointColumns = {
  default: 3,
  1024: 2,
  768: 1
};

export default function AnimatedProjectList({
  paginatedProjects,
  searchQuery,
  setSearchQuery,
}: AnimatedProjectListProps) {
  return (
    <>
      {paginatedProjects.length > 0 ? (
        <Masonry
          breakpointCols={breakpointColumns}
          className="flex gap-8 transition-all duration-300"
          columnClassName="masonry-column"
        >
          {paginatedProjects.map((project) => (
            <div key={project.id} className="mb-8">
              <ProjectCard project={project} />
            </div>
          ))}
        </Masonry>
      ) : (
        <div className="text-center py-12">
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
    </>
  );
}
