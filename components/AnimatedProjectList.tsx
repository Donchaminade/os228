"use client";

import ProjectCard from "./ProjectCard";
import { ProjectWithStats } from "../data/projects";
import Masonry from "react-masonry-css";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

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
          {paginatedProjects.map((project, index) => (
            <motion.div
              key={project.id}
              className="mb-8"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </Masonry>
      ) : (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="text-6xl mb-4"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
          >
            🔍
          </motion.div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Aucun projet trouvé
          </h3>
          <p className="text-muted-foreground">
            {searchQuery
              ? `Aucun projet ne correspond à "${searchQuery}"`
              : "Aucun projet disponible pour le moment"}
          </p>
          {searchQuery && (
            <Button
             variant="ghost"
              onClick={() => setSearchQuery("")}
              className="mt-4 text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Effacer la recherche
            </Button>
          )}
        </motion.div>
      )}
    </>
  );
}
