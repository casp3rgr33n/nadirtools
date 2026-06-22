"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function HeaderNav() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') || '');
  
  useEffect(() => {
    setSearch(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    router.replace(`/?q=${encodeURIComponent(val)}`);
  };

  const setCategory = (cat: string) => {
    setSearch(cat);
    router.replace(`/?q=${encodeURIComponent(cat)}`);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flex: 1, justifyContent: 'flex-end' }}>
      {/* Quick Access Categories */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {["Networking", "Security", "Finance", "Developer"].map(cat => (
          <button 
            key={cat} 
            onClick={() => setCategory(cat)} 
            style={{
              background: search.toLowerCase() === cat.toLowerCase() ? "rgba(255, 215, 94, 0.15)" : "transparent",
              border: search.toLowerCase() === cat.toLowerCase() ? "1px solid rgba(255, 215, 94, 0.4)" : "1px solid rgba(0, 255, 179, 0.2)",
              color: search.toLowerCase() === cat.toLowerCase() ? "#ffd75e" : "#00ffb3",
              fontSize: "0.8rem",
              fontWeight: 600,
              padding: "0.4rem 0.8rem",
              borderRadius: "9999px",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            {cat}
          </button>
        ))}
        {search && (
          <button onClick={() => setCategory("")} style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#94a3b8",
            fontSize: "0.8rem",
            fontWeight: 600,
            padding: "0.4rem 0.8rem",
            borderRadius: "9999px",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}>
            Clear
          </button>
        )}
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative', width: '300px' }}>
        <svg style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#00ffb3', pointerEvents: 'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="text"
          placeholder="Search tools..."
          value={search}
          onChange={handleSearch}
          style={{
            width: '100%',
            background: 'rgba(20, 32, 22, 0.4)',
            border: '1px solid rgba(255, 215, 94, 0.4)',
            borderRadius: '9999px',
            padding: '0.5rem 1rem 0.5rem 2.5rem',
            color: '#f8fafc',
            fontSize: '0.9rem',
            outline: 'none',
            transition: 'all 0.2s ease'
          }}
        />
      </div>
    </div>
  );
}
