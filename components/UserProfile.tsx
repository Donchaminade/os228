"use client";

import { signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { LogOut, Edit, GitCommit } from "lucide-react";
import Image from "next/image";

interface UserProfileProps {
	username: string;
	avatar_url: string;
	name?: string | null;
	email?: string | null;
	os228Contributions?: number;
}

export default function UserProfile({
	username,
	avatar_url,
	os228Contributions = 0,
}: UserProfileProps) {
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.3 }}
			className="w-full mb-16"
		>
			<div className="flex flex-col md:flex-row items-center md:items-start gap-8 max-w-6xl mx-auto">
				<motion.div
					className="relative"
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ delay: 0.1 }}
				>
					<div className="relative w-40 h-40 md:w-48 md:h-48">
						<div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/50 rounded-lg blur-md opacity-50" />
						<div className="relative w-full h-full border-2 border-primary/30 rounded-none overflow-hidden shadow-2xl">
							<Image
								src={avatar_url || "/placeholder-avatar.png"}
								alt={username}
								fill
								className="object-cover"
							/>
						</div>
						<div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-primary/50" />
						<div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-primary/50" />
						<div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-primary/50" />
						<div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-primary/50" />
					</div>
				</motion.div>

				<motion.div
					className="flex-1 text-center md:text-left"
					initial={{ x: -20, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					transition={{ delay: 0.2 }}
				>
					<div className="mb-4">
						<p className="text-sm text-muted-foreground font-mono mb-2">
							{">> BOOT PROFILE..."}
						</p>
						<h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
							Hello, {username}
						</h1>
						{os228Contributions > 0 && (
							<div className="flex items-center gap-2 text-sm text-muted-foreground justify-center md:justify-start">
								<GitCommit className="w-4 h-4" />
								<span>{os228Contributions} contributions sur os228</span>
							</div>
						)}
					</div>

					<motion.div
						className="flex flex-wrap gap-4 justify-center md:justify-start"
						initial={{ y: 10, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.3 }}
					>
						<Button
							variant="outline"
							className="border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/10 transition-all"
							onClick={() => window.open(`https://github.com/${username}`, "_blank")}
						>
							<Edit className="w-4 h-4 mr-2" />
							Edit Profile
						</Button>
						<Button
							variant="outline"
							className="border-2 border-red-500/30 hover:border-red-500/50 hover:bg-red-500/10 text-red-500 hover:text-red-400 transition-all"
							onClick={() => signOut({ callbackUrl: "/" })}
						>
							<LogOut className="w-4 h-4 mr-2" />
							Logout
						</Button>
					</motion.div>
				</motion.div>
			</div>
		</motion.div>
	);
}

