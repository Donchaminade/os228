"use client";

import Image from "next/image";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { motion } from "framer-motion";

export default function Navbar() {
	const { theme, toggleTheme } = useTheme();

	return (
		<motion.nav
			className="sticky md:top-4 top-0 z-50 w-full"
			initial={{ y: -100, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
		>
			<div className=" max-w-6xl backdrop-blur border border-border md:rounded-2xl px-4 mx-auto flex h-16 items-center justify-between">
				<motion.div
					className="flex items-center"
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
				>
					<Image
						src="/tg.png"
						alt="Drapeau du Togo"
						width={24}
						height={24}
						className=" object-contain w-7 mr-2"
					/>
					<h1 className="text-xl font-bold text-foreground">OS228</h1>
				</motion.div>

				<motion.div
					className="flex items-center space-x-4"
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5, delay: 0.3 }}
				>
					<Button asChild>
						<a
							href="https://github.com/Docteur-Parfait/os228"
							target="_blank"
							rel="noopener noreferrer"
							className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-2"
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
							Contribuer
						</a>
					</Button>

					<Switch
						onCheckedChange={toggleTheme}
						className="data-[state=checked]:bg-secondary [&>span]:bg-white"
						checked={theme == "dark"}
					/>
				</motion.div>
			</div>
		</motion.nav>
	);
}
