"use client";

import { useState } from "react";
import { ProjectWithStats } from "../data/projects";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { Loader } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

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
		<motion.div
			whileHover={{ y: -5 }}
			transition={{ duration: 0.2 }}
		>
			<Card
				className="flex flex-col hover:shadow-xl transition-shadow duration-300 cursor-pointer"
				onClick={handleCardClick}
			>
				<CardHeader>
					<div className="flex items-start justify-between">
						<CardTitle>{project.name}</CardTitle>
						<div className="flex gap-3 text-muted-foreground text-sm">
							{loading ? (
								<div className="flex items-center gap-2">
									<Loader className="w-4 h-4 text-primary" />
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
								<span className="text-xs">Stats non disponibles</span>
							)}
						</div>
					</div>
				</CardHeader>
				<CardContent className="'flex-1">
					<p className="text-muted-foreground">{displayedDescription}</p>
					{isLongDescription && (
						<button
							onClick={(e) => {
								e.stopPropagation();
								setIsExpanded(!isExpanded);
							}}
							className="text-primary cursor-pointer hover:text-primary/80 text-sm font-medium mt-2 transition-colors duration-200 flex items-center gap-1"
						>
							{isExpanded ? "Voir moins" : "Voir plus"}
						</button>
					)}
					<div className="flex flex-wrap gap-2 m-4">
						{project.technologies.map((tech, index) => (
							<motion.span
								key={index}
								className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium"
								initial={{ opacity: 0, scale: 0.8 }}
								whileInView={{ opacity: 1, scale: 1 }}
								viewport={{ once: true }}
								transition={{ duration: 0.3, delay: index * 0.05 }}
							>
								{tech}
							</motion.span>
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
				</CardContent>
				<CardFooter className="border-t mt-auto">
					<Button asChild variant="ghost">
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
					</Button>
				</CardFooter>
			</Card>
		</motion.div>
	);
}
