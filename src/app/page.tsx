"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import logo from '../assets/NexusEarth.png'

import { useSearchHandler } from "@/hooks/useSeachHandler";

export default function Search() {
	const [query, setQuery] = useState("");
	const [loading, setLoading] = useState(false);
	const { searchTerm, setSearchTerm, handleSearch } = useSearchHandler(query);

	return (
		<div className="min-h-screen from-blue-50 to-white p-4 md:p-8">
			<div className="max-w-3xl flex flex-col mt-18 mx-auto pt-8 md:pt-16">
				<Image
					className="flex items-center m-auto"
					src={logo}
					width={200}
					height={70}
					alt="logo nexus Earth"
				/>
				<p className="text-black font-semibold text-center mb-8">
					Encontre o que você está procurando
				</p>
				<form onSubmit={handleSearch} className="relative mb-8">
					<Input
						type="text"
						placeholder="Digite sua busca aqui..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						autoFocus
						className="w-full h-12 bg-gray-200 pl-4 pr-12 text-lg rounded-xl border-2 border-blue-200 focus:border-blue-400"
					/>
					<Button
						type="submit"
						className="absolute right-2 top-2 rounded-full w-8 h-8 p-0 bg-blue-500 hover:bg-blue-600"
						disabled={loading}
					>
						{loading ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<SearchIcon className="h-4 w-4" />
						)}
					</Button>
				</form>
			</div>
		</div>
	);
}
