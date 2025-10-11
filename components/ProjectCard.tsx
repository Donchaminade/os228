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
import { Loader, GitFork, Star, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectCardProps {
	project: ProjectWithStats;
}

const MAX_DESCRIPTION_LENGTH = 150;

export default function ProjectCard({ project }: ProjectCardProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const [isHovered, setIsHovered] = useState(false);

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

	const getRepoOwnerAndName = () => {
		const match = project.link.match(/github\.com\/([^/]+)\/([^/]+)/);
		if (match) {
			return { owner: match[1], repo: match[2] };
		}
		return null;
	};

	const repoInfo = getRepoOwnerAndName();
	const socialImageUrl = repoInfo 
		? `https://opengraph.githubassets.com/1/${repoInfo.owner}/${repoInfo.repo}`
		: null;

	return (
		<motion.div
			whileHover={{ y: -5 }}
			transition={{ duration: 0.2 }}
			onHoverStart={() => setIsHovered(true)}
			onHoverEnd={() => setIsHovered(false)}
			className="relative"
		>
			<AnimatePresence>
				{isHovered && socialImageUrl && (
					<motion.div
						initial={{ opacity: 0, scale: 0.9, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.9, y: 20 }}
						transition={{ duration: 0.2 }}
						className="absolute inset-0 z-50 pointer-events-none"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="absolute cursor-pointer inset-0 bg-background/95 backdrop-blur-md rounded-lg border-2 border-primary shadow-2xl p-4 flex flex-col gap-3 pointer-events-auto">
							<div className="flex-1 overflow-hidden rounded-lg">
								<img
									src={socialImageUrl}
									alt={`Preview de ${project.name}`}
									className="w-full h-full object-cover"
									onError={(e) => {
										e.currentTarget.style.display = 'none';
									}}
								/>
							</div>
							
							<div className="space-y-2">
								<h3 className="font-bold text-lg text-foreground truncate">
									{project.name}
								</h3>
								
								{stats && !loading && (
									<div className="flex gap-4 text-sm text-muted-foreground">
										<div className="flex items-center gap-1">
											<Star className="w-4 h-4 text-yellow-500" />
											<span className="font-medium">{stats.stars}</span>
										</div>
										<div className="flex items-center gap-1">
											<GitFork className="w-4 h-4 text-blue-500" />
											<span className="font-medium">{stats.forks}</span>
										</div>
										<div className="flex items-center gap-1">
											<Clock className="w-4 h-4 text-green-500" />
											<span className="text-xs">
												{new Date(stats.lastUpdated).toLocaleDateString('fr-FR')}
											</span>
										</div>
									</div>
								)}

								<div className="flex flex-wrap gap-1">
									{project.technologies.slice(0, 4).map((tech, index) => (
										<span
											key={index}
											className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs font-medium"
										>
											{tech}
										</span>
									))}
									{project.technologies.length > 4 && (
										<span className="text-xs text-muted-foreground px-2 py-0.5">
											+{project.technologies.length - 4}
										</span>
									)}
								</div>

								<p className="text-sm text-muted-foreground line-clamp-2">
									{project.description}
								</p>

								<div className="pt-2 border-t border-border">
									<Button
										asChild
										variant="default"
										size="sm"
										className="w-full"
									>
										<a
											href={project.link}
											target="_blank"
											rel="noopener noreferrer"
											onClick={(e) => e.stopPropagation()}
											className="flex items-center justify-center gap-2"
										>
											<svg
												className="w-4 h-4"
												fill="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													fillRule="evenodd"
													d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
													clipRule="evenodd"
												/>
											</svg>
											Ouvrir sur GitHub
										</a>
									</Button>
								</div>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			<Card
				className="flex flex-col hover:shadow-xl transition-shadow duration-300 cursor-pointer relative"
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
