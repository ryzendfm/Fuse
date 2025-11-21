import { useState, useEffect, FC } from 'react';
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

const App: FC = () => {
    // Auth State
    const [session, setSession] = useState(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    // App State
    const [viewType, setViewType] = useState<MediaType>('movie');
    const [activeTab, setActiveTab] = useState<string>('movie'); // 'movie' | 'tv' | 'library' | 'recent'
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
            if (activeTab === 'movie' || activeTab === 'tv') {
                resetAndFetch();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewType, activeGenre, session, activeTab]);

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
        // Ensure we are in a view that supports search
        if (activeTab !== 'movie' && activeTab !== 'tv') {
            setActiveTab('movie');
            setViewType('movie');
        }
    };

    const handleSwitchType = (type: MediaType) => {
        setViewType(type);
        setActiveTab(type);
        setActiveGenre(undefined);
        setSearchQuery('');
    };

    const handleMobileTabChange = (tab: string) => {
        setActiveTab(tab);
        if (tab === 'movie') {
            setViewType('movie');
            setActiveGenre(undefined);
            setSearchQuery('');
        } else if (tab === 'tv') {
            setViewType('tv');
            setActiveGenre(undefined);
            setSearchQuery('');
        }
        // Library and Recent are separate views
    };

    const handleLogoClick = () => {
        setSearchQuery('');
        setActiveGenre(undefined);
        setViewType('movie');
        setActiveTab('movie');
        setPage(1);
        setSelectedItem(null);
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const mainContainer = document.getElementById('mainContainer');
        if (mainContainer) mainContainer.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleItemClick = (item: ContentItem) => {
        setSelectedItem(item);
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
                session={session}
            />

            <Sidebar />

            <main className="flex-1 overflow-y-auto relative bg-[#0e0e10] scroll-smooth pb-20 md:pb-0" id="mainContainer">
                
                {/* Content Logic based on Tab */}
                {(activeTab === 'movie' || activeTab === 'tv') ? (
                    <>
                        {/* Hero Section: Visible on Home AND Genre views, hidden on Search */}
                        {!searchQuery && <Hero item={heroItem} onPlay={() => handleItemClick(heroItem!)} />}

                        {/* Desktop Toggle - HIDDEN ON MOBILE */}
                        <div className={`hidden md:flex justify-center relative z-20 mb-8 pointer-events-none ${!searchQuery ? '-mt-8' : 'mt-24'}`}>
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
                        
                        {/* Mobile Spacer for when toggle is hidden and we are in search/grid mode */}
                        <div className={`md:hidden h-20 ${!searchQuery ? 'hidden' : 'block'}`}></div>

                        {/* Content Wrapper with Padding */}
                        <div className={`relative z-10 px-4 md:px-8 ${!searchQuery ? 'mt-0' : 'pt-4'}`}>
                            
                            {/* Filter/Header Section */}
                            <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
                                <h2 className="text-2xl font-bold text-white drop-shadow-md mt-4 md:mt-0">
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

                            <ContentGrid items={contentList} onItemClick={handleItemClick} />

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
                    </>
                ) : (
                    // Placeholder Views for Library and Recent
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-fade-in mt-10 md:mt-0">
                        <div className="w-24 h-24 bg-[#1f1f22]/50 rounded-full flex items-center justify-center mb-6">
                            {activeTab === 'library' ? (
                                <svg className="w-10 h-10 text-[#46d369]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                                </svg>
                            ) : (
                                <svg className="w-10 h-10 text-[#46d369]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            )}
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">
                            {activeTab === 'library' ? 'Your Library' : 'Recent Activity'}
                        </h2>
                        <p className="text-gray-400 max-w-xs">
                            This feature is currently under development. Check back soon for updates!
                        </p>
                    </div>
                )}
            </main>

            {/* Mobile Bottom Navigation Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0e0e10]/95 backdrop-blur-lg border-t border-white/5 z-50 h-[70px] flex items-center justify-around px-2 pb-2">
                <button 
                    onClick={() => handleMobileTabChange('movie')} 
                    className={`flex flex-col items-center justify-center w-16 h-full space-y-1 transition-all ${activeTab === 'movie' ? 'text-[#46d369]' : 'text-[#888]'}`}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                    </svg>
                </button>
                <button 
                    onClick={() => handleMobileTabChange('tv')} 
                    className={`flex flex-col items-center justify-center w-16 h-full space-y-1 transition-all ${activeTab === 'tv' ? 'text-[#46d369]' : 'text-[#888]'}`}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                </button>
                <button 
                    onClick={() => handleMobileTabChange('library')} 
                    className={`flex flex-col items-center justify-center w-16 h-full space-y-1 transition-all ${activeTab === 'library' ? 'text-[#46d369]' : 'text-[#888]'}`}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                    </svg>
                </button>
                <button 
                    onClick={() => handleMobileTabChange('recent')} 
                    className={`flex flex-col items-center justify-center w-16 h-full space-y-1 transition-all ${activeTab === 'recent' ? 'text-[#46d369]' : 'text-[#888]'}`}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </button>
            </div>

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