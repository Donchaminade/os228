"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import AnimatedProjectList from "../components/AnimatedProjectList";
import Contributors from "../components/Contributors";
import InfiniteScroll from "../components/InfiniteScroll";
import Navbar from "../components/Navbar";
import ProjectCardSkeleton from "../components/ProjectCardSkeleton";
import ProjectFilters from "../components/ProjectFilters";
import UserProfile from "../components/UserProfile";
import { useProjects } from "../contexts/ProjectsContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";
import { UserContributions } from "@/types/contributions";
import { Loader } from "lucide-react";

export default function Home() {
	const [initialLoading, setInitialLoading] = useState(true);
	const { data: session, status } = useSession();
	const [contributions, setContributions] = useState<UserContributions | null>(null);
	const [loadingContributions, setLoadingContributions] = useState(false);
	
	const {
		searchQuery,
		sortBy,
		displayedProjects,
		totalProjects,
		isLoading,
		isLoadingMore,
		hasMore,
		selectedLanguages,
		setSearchQuery,
		setSortBy,
		setSelectedLanguages,
		loadMoreProjects,
	} = useProjects();

	useEffect(() => {
		const timer = setTimeout(() => {
			setInitialLoading(false);
		}, 1500);
		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		if (status === "authenticated") {
			fetchContributions();
		}
	}, [status]);

	const fetchContributions = async () => {
		try {
			setLoadingContributions(true);
			const response = await fetch("/api/contributions");
			if (response.ok) {
				const data = await response.json();
				setContributions(data);
			}
		} catch (err) {
			console.error("Erreur lors de la récupération des contributions:", err);
		} finally {
			setLoadingContributions(false);
		}
	};

	const itemsPerPage = 6;

	return (
		<div className="min-h-screen bg-background">
			<Navbar />

			<main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				{status === "authenticated" && session?.user ? (
					<section className="mb-16">
						{loadingContributions ? (
							<div className="flex items-center justify-center py-12">
								<Loader className="w-8 h-8 animate-spin text-primary" />
							</div>
						) : (
							<UserProfile
								username={(session.user as any)?.username || ""}
								avatar_url={(session.user as any)?.avatar || ""}
								name={session.user?.name}
								email={session.user?.email}
								os228Contributions={
									contributions?.repositories.find(
										(repo) => repo.repo.full_name === "Docteur-Parfait/os228"
									)?.contributions || 0
								}
							/>
						)}
					</section>
				) : (
					<motion.div
						className="text-center mb-16"
						initial={{ opacity: 0, y: -30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
					>
						<motion.h1
							className="text-4xl md:text-5xl font-bold text-foreground mb-6"
							initial={{ opacity: 0, scale: 0.9 }}
							whileInView={{ opacity: 1, scale: 1 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.2 }}
						>
							OpenSource
							<motion.span
								className="text-red-500"
								initial={{ opacity: 0, x: -10 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.4, delay: 0.4 }}
							>
								2
							</motion.span>
							<motion.span
								className="text-primary"
								initial={{ opacity: 0, x: -10 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.4, delay: 0.5 }}
							>
								2
							</motion.span>
							<motion.span
								className="text-yellow-500"
								initial={{ opacity: 0, x: -10 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.4, delay: 0.6 }}
							>
								8
							</motion.span>
						</motion.h1>

						<motion.p
							className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.4 }}
						>
							Bienvenue sur la plateforme qui regroupe les projets open source du
							Togo dans le cadre du Hacktoberfest 2025. Découvrez, contribuez et
							participez à l&apos;écosystème technologique togolais.
						</motion.p>
					</motion.div>
				)}

				<section className="mb-16">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-100px" }}
						transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
					>
						<ProjectFilters
							onSearch={setSearchQuery}
							onSort={setSortBy}
							onLanguageChange={setSelectedLanguages}
							searchQuery={searchQuery}
							sortBy={sortBy}
							selectedLanguages={selectedLanguages}
							isLoadingStats={isLoading}
						/>
					</motion.div>

					{/* Liste des projets */}
					{initialLoading || isLoading ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
							{[...Array(itemsPerPage)].map((_, index) => (
								<ProjectCardSkeleton key={index} />
							))}
						</div>
					) : (
						<InfiniteScroll
							onLoadMore={loadMoreProjects}
							hasMore={hasMore}
							isLoading={isLoadingMore}
						>
							<AnimatedProjectList
								paginatedProjects={displayedProjects}
								searchQuery={searchQuery}
								setSearchQuery={setSearchQuery}
							/>
						</InfiniteScroll>
					)}
				</section>

				<motion.div
					initial={{ opacity: 0, y: 50 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-100px" }}
					transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
				>
					<Card className="text-center">
						<CardHeader>
							<motion.h3
								className="text-2xl font-bold text-card-foreground"
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: 0.2 }}
							>
								Rejoignez la communauté !
							</motion.h3>
						</CardHeader>
						<CardContent>
							<motion.p
								className="text-muted-foreground mb-6 max-w-2xl mx-auto"
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: 0.3 }}
							>
								Vous avez un projet open source ou vous souhaitez contribuer ?
								Ajoutez votre projet à notre plateforme et participez au
								Hacktoberfest 2025.
							</motion.p>

							<motion.div
								className="flex flex-col sm:flex-row gap-4 justify-center"
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: 0.4 }}
							>
								<Button asChild variant="default">
									<a
										href="https://github.com/Docteur-Parfait/os228"
										target="_blank"
										rel="noopener noreferrer"
										className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
									>
										<svg
											className="w-4 h-4"
											fill="currentColor"
											viewBox="0 0 24 24"
											aria-hidden="true"
										>
											<path
												fillRule="evenodd"
												d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
												clipRule="evenodd"
											/>
										</svg>
										Contribuer au projet
									</a>
								</Button>
								<Button asChild variant="outline">
									<a
										href="https://github.com/Docteur-Parfait/os228/blob/main/data/projects.json"
										target="_blank"
										rel="noopener noreferrer"
										className="border border-border text-foreground hover:bg-secondary px-6 py-3 rounded-lg font-medium transition-colors duration-200"
									>
										Ajouter un projet
									</a>
								</Button>
							</motion.div>
						</CardContent>
					</Card>
				</motion.div>
			</main>

			<motion.div
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1 }}
				viewport={{ once: true, margin: "-100px" }}
				transition={{ duration: 0.8 }}
			>
				<Card className="bg-card border-t border-border mt-16">
					<CardContent className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="text-center space-y-8">
							<Contributors />

							<motion.div
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, delay: 0.2 }}
							>
								<p className="mb-4 text-card-foreground">
									OS228 - OpenSource 228 | Hacktoberfest 2025
								</p>
								<p className="text-sm text-muted-foreground">
									Fait avec ❤️ par la communauté Night Coding
								</p>
							</motion.div>
						</div>
					</CardContent>
				</Card>
			</motion.div>
		</div>
	);
}
