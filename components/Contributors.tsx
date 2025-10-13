"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface Contributor {
	id: number;
	login: string;
	avatar_url: string;
	html_url: string;
	contributions: number;
}

export default function Contributors() {
	const [contributors, setContributors] = useState<Contributor[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchContributors = async () => {
			try {
				const headers: HeadersInit = {};

				// Ajouter le token GitHub si disponible (optionnel)
				if (process.env.NEXT_PUBLIC_GITHUB_TOKEN) {
					headers.Authorization = `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`;
				}

				const response = await fetch(
					"https://api.github.com/repos/ln-dev7/os228/contributors",
					{ headers }
				);

				if (!response.ok) {
					throw new Error("Erreur lors du chargement des contributeurs");
				}

				const data = await response.json();
				setContributors(data);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Une erreur est survenue"
				);
			} finally {
				setLoading(false);
			}
		};

		fetchContributors();
	}, []);

	if (loading) {
		return (
			<div className="text-center">
				<div className="inline-flex items-center gap-2 text-muted-foreground">
					<div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-center text-muted-foreground">
				<p>{error}</p>
			</div>
		);
	}

	return (
		<div className="text-center">
			<motion.h3
				className="text-lg font-semibold text-card-foreground mb-4"
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.5 }}
			>
				Merci à nos contributeurs !
			</motion.h3>
			<div className="flex flex-wrap justify-center gap-3">
				{contributors.map((contributor, index) => (
					<motion.a
						key={contributor.id}
						href={contributor.html_url}
						target="_blank"
						rel="noopener noreferrer"
						className="group relative hover:z-10"
						title={`${contributor.login} - ${contributor.contributions} contribution${contributor.contributions > 1 ? "s" : ""}`}
						initial={{ opacity: 0, scale: 0 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true }}
						transition={{
							duration: 0.4,
							delay: index * 0.05,
							type: "spring",
							stiffness: 200
						}}
						whileHover={{ scale: 1.1 }}
					>
						<Image
							src={contributor.avatar_url}
							alt={contributor.login}
							width={48}
							height={48}
							className="rounded-full border-2 border-border hover:border-primary transition-all duration-200"
						/>
					</motion.a>
				))}
			</div>
		</div>
	);
}
