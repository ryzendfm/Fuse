import { FC } from 'react';
import { GENRES } from '../constants';

interface SidebarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    activeGenre: number | undefined;
    onGenreChange: (genreId: number | undefined) => void;
    isExpanded: boolean;
    onHover: (state: boolean) => void;
}

const Sidebar: FC<SidebarProps> = ({ activeTab, onTabChange, activeGenre, onGenreChange, isExpanded, onHover }) => {
    const navItems = [
        { 
            id: 'movie', 
            label: 'Movies', 
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"></path>
                </svg>
            )
        },
        { 
            id: 'tv', 
            label: 'TV Shows', 
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
            )
        },
        { 
            id: 'library', 
            label: 'Library', 
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
            )
        },
        { 
            id: 'recent', 
            label: 'Recent', 
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            )
        },
    ];

    return (
        <aside 
            className={`hidden md:flex flex-col fixed left-0 top-0 bottom-0 bg-[#0e0e10]/95 backdrop-blur-md border-r border-white/5 z-[110] pt-[70px] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isExpanded ? 'w-64 shadow-2xl' : 'w-20'}`}
            onMouseEnter={() => onHover(true)}
            onMouseLeave={() => onHover(false)}
        >
            <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 scrollbar-hide flex flex-col gap-2">
                
                {/* Primary Navigation */}
                <div className="w-full">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={`relative w-full flex items-center h-14 transition-all duration-200 group ${
                                activeTab === item.id 
                                ? 'text-[#46d369] bg-[#46d369]/5' 
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            {activeTab === item.id && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#46d369] rounded-r-full shadow-[0_0_10px_rgba(70,211,105,0.5)]"></div>
                            )}
                            
                            {/* Icon Container - Perfectly centered in collapsed state (w-20 = 80px) */}
                            <div className="w-20 h-full flex items-center justify-center flex-shrink-0 z-10">
                                {item.icon}
                            </div>
                            
                            <span className={`font-medium text-sm whitespace-nowrap transition-opacity duration-300 transform ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                                {item.label}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Divider */}
                <div className={`mx-4 my-2 border-t border-white/10 transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}></div>

                {/* Genres Section */}
                <div className="w-full space-y-1">
                     <div className={`px-6 mb-2 text-xs font-bold text-gray-500 uppercase tracking-wider transition-opacity duration-300 ${isExpanded ? 'opacity-100 delay-75' : 'opacity-0 h-0 overflow-hidden'}`}>
                        Genres
                    </div>
                    
                    {/* All Genres */}
                    <button 
                        onClick={() => onGenreChange(undefined)}
                        className={`relative w-full flex items-center h-12 transition-all duration-200 group ${
                            activeGenre === undefined
                            ? 'text-white' 
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }`}
                        title="All Genres"
                    >
                         {activeGenre === undefined && (
                             <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#46d369] rounded-r-full shadow-[0_0_8px_rgba(70,211,105,0.4)]"></div>
                         )}
                         <div className="w-20 h-full flex items-center justify-center flex-shrink-0">
                            <div className={`w-2 h-2 rounded-full transition-colors ${activeGenre === undefined ? 'bg-[#46d369]' : 'bg-gray-600 group-hover:bg-gray-400'}`}></div>
                        </div>
                        <span className={`text-sm font-medium whitespace-nowrap transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
                            All Genres
                        </span>
                    </button>

                    {GENRES.map((genre) => (
                        <button 
                            key={genre.id}
                            onClick={() => onGenreChange(genre.id)}
                            className={`relative w-full flex items-center h-12 transition-all duration-200 group ${
                                activeGenre === genre.id 
                                ? 'text-white' 
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                            title={genre.name}
                        >
                            {activeGenre === genre.id && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#46d369] rounded-r-full shadow-[0_0_8px_rgba(70,211,105,0.4)]"></div>
                            )}
                            <div className="w-20 h-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-gray-600 group-hover:text-gray-400">
                                {isExpanded ? (
                                     <div className={`w-1.5 h-1.5 rounded-full transition-colors ${activeGenre === genre.id ? 'bg-[#46d369]' : 'bg-gray-700 group-hover:bg-gray-500'}`}></div>
                                ) : (
                                    genre.name.substring(0, 1)
                                )}
                            </div>
                            <span className={`text-sm font-medium whitespace-nowrap transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
                                {genre.name}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;