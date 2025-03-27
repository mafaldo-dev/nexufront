"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, Loader2 } from "lucide-react";
import image from '../assets/image1.avif'
import Image from "next/image";

export default function Search() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault(); // Evita recarregar a página ao enviar o formulário
    setLoading(true);
    if (!query.trim()) return;

    router.push(`/Results?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen bg-gray-700 from-blue-50 to-white p-4 md:p-8">
      <div className="max-w-3xl mt-24 mx-auto pt-8 md:pt-16">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-2 text-white">
          NexusEarth
        </h1>
        <p className="text-white text-center mb-8">
          Encontre o que você está procurando
        </p>

        {/* <RandomBannerImage /> */}
        <Image src={image} width={400} height={200} className="rounded-xl flex m-auto mb-12" alt="Banner"/>

        <form onSubmit={handleSearch} className="relative mb-8">
          <Input
            type="text"
            placeholder="Digite sua busca aqui..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full h-12 bg-white pl-4 pr-12 text-lg rounded-xl border-2 border-blue-200 focus:border-blue-400"
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
