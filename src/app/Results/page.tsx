"use client";

import Link from "next/link";
import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { useSearchHandler } from "@/hooks/useSeachHandler";

import { Loader2, SearchIcon } from "lucide-react";
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
  const query = searchParams.get("q") || "";

  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [activeTab, setActiveTab] = useState("todas");

  const { searchTerm, setSearchTerm, handleSearch } = useSearchHandler(query);
  console.log(setResults)
  console.log(setLoading)
  useEffect(() => {
    if (!query) return;

    const controller = new AbortController();
    const signal = controller.signal;
    let isActive = true;

    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://nexuback.onrender.com/api/searchAll?q=${encodeURIComponent(query)}`,
          { signal }
        );
        if (!response.ok) throw new Error("Erro ao buscar resultados");

        const data = await response.json();
        if (isActive) {
          setResults(data.results || []);
        }
      } catch (error) {
        if (isActive) {
          console.error("Erro ao buscar resultados", error);
          setResults([]);
        }
      } finally {
        if (isActive) setLoading(false);
      }
    };

    fetchResults();
    return () => {
      isActive = false;
      controller.abort();
    };
  }, [query]);

  const allResults = results.filter(
    (result) => result.title && result.snippet && result.url
  );

  const imageResults = results.filter((result) => result.image);

  const newsResults = results.filter(
    (result) =>
      (result.title?.toLowerCase().includes("notícia") ||
        result.snippet?.toLowerCase().includes("notícia") ||
        result.title?.toLowerCase().includes("reportagem") ||
        result.snippet?.toLowerCase().includes("reportagem")) &&
      result.title &&
      result.snippet &&
      result.url
  );

  const renderContent = () => {
    switch (activeTab) {
      case "imagens":
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {imageResults.map((result, index) => (
              <div
                key={index}
                className="bg-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border"
              >
                <a
                  href={result.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Img
                    src={result.image!}
                    alt={result.title || "Imagem"}
                    width={100}
                    height={100}
                    className="w-full h-40 object-cover rounded-t-lg"
                  />
                  <p className="p-2 text-sm text-gray-700 truncate">
                    {result.title || "Imagem"}
                  </p>
                </a>
              </div>
            ))}
          </div>
        );

      case "noticias":
        return (
          <div className="space-y-6">
            {newsResults.map((result, index) => (
              <div
                key={index}
                className="p-4 bg-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border"
              >
                <a
                  href={result.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-medium text-blue-600 hover:underline block"
                >
                  {result.title || "Título não disponível"}
                </a>
                <p className="text-gray-700 text-sm mt-1">
                  {result.snippet || "Descrição não disponível"}
                </p>
                <p className="text-gray-500 text-xs mt-1">{result.url}</p>
              </div>
            ))}
          </div>
        );

      case "todas":
      default:
        return (
          <div className="space-y-6">
            {allResults.map((result, index) => (
              <div
                key={index}
                className="p-4 bg-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border"
              >
                <a
                  href={result.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-medium text-blue-600 hover:underline block"
                >
                  {result.title || "Título não disponível"}
                </a>
                <p className="text-gray-700 text-sm mt-1">
                  {result.snippet || "Descrição não disponível"}
                </p>
                <p className="text-gray-500 text-xs mt-1">{result.url}</p>
              </div>
            ))}

            <button
              onClick={() => setShowMore(!showMore)}
              className="bg-white underline cursor-pointer px-2 py-2 rounded-sm font-semibold flex m-auto text-blue-600 hover:underline"
            >
              {!showMore ? "Ver mais" : "Ver menos"}
            </button>
          </div>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <form onSubmit={handleSearch} className="relative mb-6">
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

      <div className="mb-6 flex justify-between items-center">
        <Link
          href="/"
          className="bg-blue-500 text-white hover:bg-blue-300 hover:text-white rounded-sm font-bold px-4 py-2 text-lg"
        >
          Voltar
        </Link>
      </div>

      <div className="flex justify-center gap-4 mb-8 border-b-2 pb-2">
        <Button
          onClick={() => setActiveTab("todas")}
          className={`px-4 py-2 font-semibold rounded-t-lg ${
            activeTab === "todas"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Todas
        </Button>
        <Button
          onClick={() => setActiveTab("imagens")}
          className={`px-4 py-2 font-semibold rounded-t-lg ${
            activeTab === "imagens"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Imagens
        </Button>
        <Button
          onClick={() => setActiveTab("noticias")}
          className={`px-4 py-2 font-semibold rounded-t-lg ${
            activeTab === "noticias"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Notícias
        </Button>
      </div>

      {loading ? (
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-blue-600" />
          <p className="text-gray-600 mt-2">Buscando...</p>
        </div>
      ) : results.length > 0 ? (
        <div>{renderContent()}</div>
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
