'use client';

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Result {
  title: string;
  snippet: string;
  url: string;
  image: string;
}

function ResultsPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    if (!query) return;

    setLoading(true);
    fetch(`https://nexuback.onrender.com/api/searchAll?q=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.results && Array.isArray(data.results)) {
          setResults(data.results);
        } else {
          setResults([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setResults([]);
        setLoading(false);
      });
  }, [query]);

  const render = showMore ? results : results.slice(0, 10);

  const sortedResults = render.sort((a, b) => {
    return b.image ? 1 : -1; // Move os itens sem imagem para o final
  });

  return (
    <div className="min-h-screen p-6 bg-gray-700 text-gray-900">
      <div className="flex mt-24 justify-evenly gap-92 items-center mb-12">
        <h1 className="text-3xl text-white font-semibold mt-7 mb-6">
          Resultados para <span className="text-blue-600">&quot;{query}&quot;</span>
        </h1>
        <Link
          href="/"
          className="bg-white hover:bg-blue-500 hover:text-white rounded-sm text-blue-500 font-bold px-2 py-2 text-lg"
        >
          Voltar
        </Link>
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
              className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border"
            >
              {result.image ? (
                <Image
                  src={result.image}
                  alt={result.title}
                  className="w-32 h-32 object-cover rounded-lg"
                />
              ) : (
                <div className="w-32 h-32 bg-gray-300 rounded-lg flex items-center justify-center">
                  <span className="text-gray-600">Sem imagem</span>
                </div>
              )}

              {/* Informações ao lado da imagem */}
              <div className="flex-1">
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-medium text-blue-600 hover:underline block"
                >
                  {result.title}
                </a>
                <p className="text-gray-700 text-sm mt-1">{result.snippet}</p>
                <p className="text-gray-500 text-xs mt-1">{result.url}</p>
              </div>
            </div>
          ))}
          <button
            onClick={() => setShowMore(!showMore)}
            className=" bg-white px-2 py-2 rounded-sm font-semibold flex m-auto text-blue-600 hover:underline"
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
    <Suspense fallback={<div className="text-center text-white">Carregando...</div>}>
      <ResultsPageContent />
    </Suspense>
  );
}
