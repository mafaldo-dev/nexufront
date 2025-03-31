import { useRouter } from "next/navigation";
import { useState } from "react";

export function useSearchHandler(initialQuery = "") {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(initialQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/Results?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return { searchTerm, setSearchTerm, handleSearch };
}
