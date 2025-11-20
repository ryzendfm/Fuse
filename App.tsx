import React, { useState, useEffect } from 'react';
import { supabase } from './services/supabaseClient';
import Auth from './components/Auth';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Hero from './components/Hero';
import ContentGrid from './components/ContentGrid';
import MovieUiModal from './components/MovieUiModal';
import { fetchDiscover, fetchSearch } from './services/tmdbService';
import { ContentItem, MediaType } from './types';
import { GENRES } from './constants';

const App: React.FC = () => {
    // Auth State
    const [session, setSession] = useState(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    // App State
    const [viewType, setViewType] = useState<MediaType>('movie');
    const [contentList, setContentList] = useState<ContentItem[]>([]);
    const [heroItem, setHeroItem] = useState<ContentItem | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [activeGenre, setActiveGenre] = useState<number | undefined>(undefined);
    const [searchQuery, setSearchQuery] = useState('');
    
    const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);

    // Check Session on Mount
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setIsAuthLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Initial Load & Type Change (Only if logged in)
    useEffect(() => {
        if (session) {
            resetAndFetch();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewType, activeGenre, session]);

    // Search trigger
    useEffect(() => {
        if (searchQuery && session) {
            setPage(1);
            fetchData(1, true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery]);

    const resetAndFetch = () => {
        setPage(1);
        setSearchQuery('');
        fetchData(1, true);
    };

    const fetchData = async (pageNum: number, reset = false) => {
        setLoading(true);
        try {
            let data;
            if (searchQuery) {
                data = await fetchSearch(viewType, searchQuery, pageNum);
            } else {
                // Resolve correct Genre ID based on View Type
                let genreQuery = activeGenre;
                if (viewType === 'tv' && activeGenre) {
                    const genreObj = GENRES.find(g => g.id === activeGenre);
                    if (genreObj) genreQuery = genreObj.tvId;
                }
                data = await fetchDiscover(viewType, pageNum, genreQuery);
            }

            if (reset) {
                setContentList(data.results);
                // Set hero item for Discover OR Genre filtering (keep hero visible unless searching)
                if (data.results.length > 0 && !searchQuery) {
                    setHeroItem(data.results[0]);
                } else if (reset && !searchQuery) {
                     // If no results, keep previous hero or null, but typically shouldn't happen with correct IDs
                     setHeroItem(data.results[0] || null);
                }
            } else {
                setContentList(prev => [...prev, ...data.results]);
            }
            setTotalPages(data.total_pages);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLoadMore = () => {
        if (page < totalPages) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchData(nextPage, false);
        }
    };

    const handleGenreClick = (genreId?: number) => {
        setActiveGenre(genreId);
        setSearchQuery(''); 
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setActiveGenre(undefined);
    };

    const handleSwitchType = (type: MediaType) => {
        setViewType(type);
        setActiveGenre(undefined);
        setSearchQuery('');
    };

    const handleLogoClick = () => {
        setSearchQuery('');
        setActiveGenre(undefined);
        setViewType('movie');
        setPage(1);
        setSelectedItem(null);
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const mainContainer = document.getElementById('mainContainer');
        if (mainContainer) mainContainer.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (isAuthLoading) {
        return (
            <div className="h-screen bg-[#0e0e10] flex items-center justify-center">
                <div className="animate-spin w-10 h-10 border-4 border-[#333] border-t-[#46d369] rounded-full"></div>
            </div>
        );
    }

    if (!session) {
        return <Auth />;
    }

    return (
        <div className="flex h-screen overflow-hidden bg-[#0e0e10] text-white font-inter">
            <Navbar 
                onSearch={handleSearch} 
                onLogoClick={handleLogoClick}
            />

            <Sidebar />

            <main className="flex-1 overflow-y-auto relative bg-[#0e0e10] scroll-smooth" id="mainContainer">
                
                {/* Hero Section: Visible on Home AND Genre views, hidden on Search */}
                {!searchQuery && <Hero item={heroItem} onPlay={() => setSelectedItem(heroItem)} />}

                {/* Media Type Toggle - Redesigned */}
                {/* Margin logic: -mt-8 to overlap Hero if present, otherwise mt-24 to clear navbar */}
                <div className={`flex justify-center relative z-20 mb-8 pointer-events-none ${!searchQuery ? '-mt-8' : 'mt-24'}`}>
                    <div className="flex bg-black/60 backdrop-blur-xl border border-white/10 p-1.5 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] pointer-events-auto">
                        <button 
                            onClick={() => handleSwitchType('movie')} 
                            className={`relative px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 overflow-hidden group ${viewType === 'movie' ? 'text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            {viewType === 'movie' && (
                                <div className="absolute inset-0 bg-gradient-to-r from-[#46d369] to-[#2ea043] animate-fade-in -z-10"></div>
                            )}
                            Movies
                        </button>
                        <button 
                            onClick={() => handleSwitchType('tv')} 
                            className={`relative px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 overflow-hidden group ${viewType === 'tv' ? 'text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            {viewType === 'tv' && (
                                <div className="absolute inset-0 bg-gradient-to-r from-[#46d369] to-[#2ea043] animate-fade-in -z-10"></div>
                            )}
                            TV Shows
                        </button>
                    </div>
                </div>

                {/* Content Wrapper with Padding */}
                <div className={`relative z-10 px-4 md:px-8 ${!searchQuery ? 'mt-0' : 'pt-4'}`}>
                    
                    {/* Filter/Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
                        <h2 className="text-2xl font-bold text-white drop-shadow-md">
                            {searchQuery ? `Results for "${searchQuery}"` : (activeGenre ? `${GENRES.find(g => g.id === activeGenre)?.name || 'Genre'} ${viewType === 'movie' ? 'Movies' : 'Shows'}` : `Trending ${viewType === 'movie' ? 'Movies' : 'TV Shows'}`)}
                        </h2>
                        
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            <button 
                                onClick={() => handleGenreClick(undefined)}
                                className={`text-sm font-medium transition-colors whitespace-nowrap px-3 py-1 rounded-lg ${!activeGenre ? 'bg-white text-black' : 'bg-[#1f1f22] text-gray-400 hover:bg-[#333] hover:text-white'}`}
                            >
                                All
                            </button>
                            {GENRES.map(g => (
                                <button 
                                    key={g.id}
                                    onClick={() => handleGenreClick(g.id)}
                                    className={`text-sm font-medium transition-colors whitespace-nowrap px-3 py-1 rounded-lg ${activeGenre === g.id ? 'bg-white text-black' : 'bg-[#1f1f22] text-gray-400 hover:bg-[#333] hover:text-white'}`}
                                >
                                    {g.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <ContentGrid items={contentList} onItemClick={setSelectedItem} />

                    {loading && (
                        <div className="py-12 flex justify-center w-full">
                            <div className="animate-spin w-8 h-8 border-4 border-[#333] border-t-[#46d369] rounded-full"></div>
                        </div>
                    )}

                    {!loading && page < totalPages && (
                        <div className="flex justify-center mt-8 pb-12">
                            <button 
                                onClick={handleLoadMore} 
                                className="bg-[#333] px-6 py-2 rounded font-bold text-sm hover:bg-[#444] transition-colors text-white"
                            >
                                Load More
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {selectedItem && (
                <MovieUiModal 
                    item={selectedItem} 
                    type={selectedItem.media_type as MediaType || viewType} 
                    onClose={() => setSelectedItem(null)} 
                />
            )}
        </div>
    );
};

export default App;