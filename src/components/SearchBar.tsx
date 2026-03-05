import { useState } from "react";
import { Search, MapPin } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="glass rounded-2xl shadow-float p-1 flex items-center gap-2">
      <div className="flex items-center gap-2 pl-3 text-muted-foreground">
        <MapPin className="w-4 h-4 text-primary" />
      </div>
      <input
        type="text"
        placeholder="Where are you going?"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm py-3 px-1 outline-none font-body"
      />
      <button
        type="submit"
        className="bg-primary text-primary-foreground rounded-xl p-2.5 hover:opacity-90 transition-opacity"
      >
        <Search className="w-4 h-4" />
      </button>
    </form>
  );
};

export default SearchBar;
