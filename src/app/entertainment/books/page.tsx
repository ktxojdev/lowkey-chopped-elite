"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  BookOpen, 
  Loader2, 
  X, 
  ExternalLink, 
  Calendar, 
  User 
} from "lucide-react";

interface BookDoc {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  has_fulltext?: boolean;
  ia?: string[];
  edition_count?: number;
}

const GENRES = ["Science Fiction", "Fantasy", "Cyberpunk", "Mystery", "Philosophy", "Adventure"];

export default function BooksPage() {
  const [books, setBooks] = useState<BookDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("Science Fiction");
  const [searchInput, setSearchInput] = useState("");
  const [selectedBook, setSelectedBook] = useState<BookDoc | null>(null);

  const fetchBooks = async (q: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/entertainment/books?query=${encodeURIComponent(q)}&limit=24`);
      const data = await res.json();
      if (data.docs) {
        setBooks(data.docs);
      }
    } catch (err) {
      console.error("Books fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(query);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setQuery(searchInput);
  };

  const getCover = (coverId?: number) => {
    if (coverId) {
      return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
    }
    return "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-purple-400" />
            <h1 className="text-2xl md:text-3xl font-bold text-white">Books & Literature</h1>
          </div>
          <p className="text-zinc-400 text-xs md:text-sm mt-0.5">
            Search millions of titles via server-side Open Library & Project Gutenberg proxies.
          </p>
        </div>

        <form onSubmit={handleSearch} className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search book title or author..."
            className="w-full bg-[#141024] border border-white/10 focus:border-purple-500/50 rounded-full pl-10 pr-4 py-2 text-sm text-zinc-200 placeholder-zinc-500 outline-none transition-all"
          />
        </form>
      </div>

      {/* Genre Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {GENRES.map((g) => {
          const isActive = query.toLowerCase() === g.toLowerCase();
          return (
            <button
              key={g}
              onClick={() => setQuery(g)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                  : "bg-[#161226] text-zinc-400 hover:text-white"
              }`}
            >
              {g}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-28 text-zinc-500">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400 mb-3" />
          <p className="text-sm">Querying Open Library...</p>
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">
          <p className="text-base font-medium text-zinc-300">No books found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {books.map((book) => {
            const author = book.author_name?.[0] || "Unknown Author";
            return (
              <div
                key={book.key}
                onClick={() => setSelectedBook(book)}
                className="group relative bg-[#130f22] border border-white/5 hover:border-purple-500/40 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-900/20 flex flex-col"
              >
                <div className="relative w-full aspect-[2/3] bg-[#0b0814] overflow-hidden">
                  <img
                    src={getCover(book.cover_i)}
                    alt={book.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {book.first_publish_year && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-semibold text-zinc-300 border border-white/10">
                      {book.first_publish_year}
                    </span>
                  )}
                </div>

                <div className="p-3 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-zinc-200 group-hover:text-white truncate">
                      {book.title}
                    </h3>
                    <p className="text-[11px] text-zinc-500 mt-1 truncate">
                      {author}
                    </p>
                  </div>
                  <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-purple-400 font-medium">
                    <span>Explore</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Book Details Modal */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#130f24] border border-white/10 rounded-2xl max-w-xl w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setSelectedBook(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col sm:flex-row gap-5">
              <img
                src={getCover(selectedBook.cover_i)}
                alt={selectedBook.title}
                className="w-32 sm:w-40 aspect-[2/3] object-cover rounded-xl shadow-xl shrink-0 self-center sm:self-start"
              />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white">{selectedBook.title}</h2>
                <div className="flex items-center gap-2 text-xs text-zinc-400 mt-2">
                  <User className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{selectedBook.author_name?.join(", ") || "Unknown"}</span>
                </div>
                {selectedBook.first_publish_year && (
                  <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                    <span>First published in {selectedBook.first_publish_year}</span>
                  </div>
                )}

                <div className="mt-6 flex flex-wrap gap-2">
                  <a
                    href={`https://openlibrary.org${selectedBook.key}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition-all"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Read on OpenLibrary</span>
                  </a>
                  <a
                    href={`https://www.gutenberg.org/ebooks/search/?query=${encodeURIComponent(
                      selectedBook.title
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-xs font-semibold border border-white/10 transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Project Gutenberg</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
