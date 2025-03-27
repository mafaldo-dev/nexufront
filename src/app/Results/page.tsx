"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, SearchIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../assets/NexusEarth.png";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Result {
  title?: string;
  snippet?: string;
  url?: string;
  image?: string;
}

function ResultsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(query);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const fetchResults = useCallback(() => {
    if (!query) return;

    const controller = new AbortController();
    const signal = controller.signal;

    setLoading(true);

    fetch(`https://nexuback.onrender.com/api/searchAll?q=${encodeURIComponent(query)}`, { signal })
      .then((res) => res.json())
      .then((data) => {
        if (data.results && Array.isArray(data.results)) {
          const validResults = data.results.filter(
            (result: Result) => result.title && result.snippet && result.url
          );
          setResults(validResults);
        } else {
          setResults([]);
        }
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setResults([]);
        }
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    const cleanup = fetchResults();
    return cleanup;
  }, [fetchResults]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/results?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const sortedResults = (showMore ? results : results.slice(0, 10)).sort((a, b) => (b.image ? 1 : -1));

  return (
    <div className="min-h-screen p-6 text-gray-900">
      <Image src={logo} width={200} height={100} alt="Logo nexus earth" className="flex m-auto" />
      <div className="flex flex-col md:flex-row mt-24 w-full max-w-[90%] mx-auto justify-evenly gap-6 md:gap-16 items-center mb-12">
        <h2 className="text-2xl md:text-3xl text-black font-semibold mt-4 mb-4 md:mt-7 md:mb-6 text-center md:text-left">
          Resultados para <span className="text-blue-600">&quot;{query}&quot;</span>
        </h2>
        <div className="flex items-center gap-8 justify-center">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder="Digite sua busca aqui..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 bg-gray-200 pl-4 pr-12 text-lg rounded-xl border-2 border-blue-200 focus:border-blue-400"
            />
            <Button
              type="submit"
              className="absolute right-2 top-2 rounded-full w-8 h-8 p-0 bg-blue-500 hover:bg-blue-600"
              disabled={!searchTerm.trim()}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <SearchIcon className="h-4 w-4" />
              )}
            </Button>
          </form>
          <Link
            href="/"
            className="bg-blue-500 text-white hover:bg-blue-300 hover:text-white rounded-sm font-bold px-4 py-2 text-lg"
          >
            Voltar
          </Link>
        </div>
      </div>
      {loading ? (
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-blue-600" />
          <p className="text-white mt-2">Buscando...</p>
        </div>
      ) : results.length > 0 ? (
        <div className="max-w-6xl mx-auto space-y-6">
          {sortedResults.map((result, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 bg-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border"
            >
              {result.image ? (
                <Image width={90} height={90} src={result.image} alt={result.title || "Imagem"} className="w-32 h-32 object-cover rounded-lg" />
              ) : (
                <div className="w-32 h-32 bg-gray-300 rounded-lg flex items-center justify-center">
                  <span className="text-gray-600">Sem imagem</span>
                </div>
              )}

              <div className="flex-1">
                <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-lg font-medium text-blue-600 hover:underline block">
                  {result.title}
                </a>
                <p className="text-gray-700 text-sm mt-1">{result.snippet}</p>
                <p className="text-gray-500 text-xs mt-1">{result.url}</p>
              </div>
            </div>
          ))}
          <button
            onClick={() => setShowMore(!showMore)}
            className="bg-white underline cursor-pointer px-2 py-2 rounded-sm font-semibold flex m-auto text-blue-600 hover:underline"
          >
            {!showMore ? "Ver mais" : "Ver menos"}
          </button>
        </div>
      ) : (
        <p className="text-center text-gray-600">Nenhum resultado encontrado.</p>
      )}
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <ResultsPageContent />
    </Suspense>
  );
}
