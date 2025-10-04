"use client";

import { useState } from "react";
import { ProjectWithStats } from "../data/projects";

interface ProjectCardProps {
  project: ProjectWithStats;
}

const MAX_DESCRIPTION_LENGTH = 150;

export default function ProjectCard({ project }: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const stats = project.githubStats;
  const loading = project.isLoadingStats || false;

  const isLongDescription = project.description.length > MAX_DESCRIPTION_LENGTH;
  const displayedDescription =
    isExpanded || !isLongDescription
      ? project.description
      : `${project.description.slice(0, MAX_DESCRIPTION_LENGTH)}...`;

  const handleCardClick = () => {
    window.open(project.link, "_blank");
  };

  return (
    <div
      className="bg-card rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-border cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold leading-6 text-card-foreground">
          {project.name}
        </h3>
        <div className="flex h-6 items-center gap-3 text-muted-foreground text-sm">
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span>Chargement...</span>
            </div>
          ) : stats ? (
            <>
              <div className="flex items-center gap-1">
                <span>⭐</span>
                <span className="font-medium">{stats.stars}</span>
              </div>
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M6 3a3 3 0 1 0 2.83 4H9v4.18A3.001 3.001 0 0 0 11 14.83V17a3 3 0 1 0 2 0v-2.17A3.001 3.001 0 0 0 15 11.18V7.83A3.001 3.001 0 1 0 13 3v4.18A3.001 3.001 0 0 0 9 7.83V7a3 3 0 0 0-3-3zm0 2a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm12 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm-6 12a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                </svg>
                <span className="font-medium">{stats.forks}</span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-1 text-muted-foreground">
              <span className="text-xs">Stats non disponibles</span>
            </div>
          )}
        </div>
      </div>
      <div className="mb-4">
        <p className="text-muted-foreground leading-relaxed">
          {displayedDescription}
        </p>
        {isLongDescription && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="text-primary hover:text-primary/80 text-sm font-medium mt-2 transition-colors duration-200 flex items-center gap-1"
          >
            {isExpanded ? (
              <>
                Voir moins
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </>
            ) : (
              <>
                Voir plus
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </>
            )}
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {project.technologies.map((tech, index) => (
          <span
            key={index}
            className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium"
          >
            {tech}
          </span>
        ))}
      </div>
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <div>
          <span className="font-medium">Auteur:</span> {project.author}
        </div>
        <div>
          <span className="font-medium">Langage:</span> {project.language}
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors duration-200"
        >
          Voir sur GitHub
          <svg
            className="ml-2 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}
