import { useState, useEffect, FC, FormEvent } from 'react';
import { supabase } from '../services/supabaseClient';

interface NavbarProps {
    onSearch: (query: string) => void;
    onLogoClick?: () => void;
    session: any;
    isSidebarExpanded: boolean;
    isModalOpen?: boolean;
}

const Navbar: FC<NavbarProps> = ({ onSearch, onLogoClick, session, isSidebarExpanded, isModalOpen }) => {
    const [inputValue, setInputValue] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Add background on scroll
    useEffect(() => {
        const handleScroll = () => {
            const mainContainer = document.getElementById('mainContainer');
            if (mainContainer && mainContainer.scrollTop > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        const mainContainer = document.getElementById('mainContainer');
        if (mainContainer) {
            mainContainer.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (mainContainer) mainContainer.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            onSearch(inputValue);
            setIsSearchOpen(false);
        }
    };

    const clearSearch = () => {
        setInputValue('');
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsUserMenuOpen(false);
    };

    const handleLogoAction = () => {
        if (onLogoClick) {
            onLogoClick();
            setInputValue(''); // Also clear local search input
        } else {
            window.location.reload();
        }
    };

    const avatarLetter = session?.user?.email?.[0]?.toUpperCase() || 'U';

    return (
        <nav 
            className={`fixed top-0 left-0 right-0 h-[70px] z-[100] flex items-center px-4 md:pr-8 transition-all duration-300 ${isSidebarExpanded ? 'md:pl-72' : 'md:pl-28'} ${(scrolled || isSearchOpen || isModalOpen) ? 'bg-[#0e0e10]/95 backdrop-blur-md' : 'bg-gradient-to-b from-black/90 via-black/60 to-transparent'}`}
        >
            {/* Universal Search Overlay */}
            {isSearchOpen && (
                <div className="w-full flex items-center animate-fade-in justify-center">
                    <form onSubmit={handleSubmit} className="relative flex-1 max-w-2xl group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400 group-focus-within:text-[#46d369] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                        <input 
                            type="text" 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="w-full bg-[#1f1f22] border border-white/10 focus:border-[#46d369]/50 text-white text-base rounded-full py-2.5 pl-12 pr-24 shadow-2xl focus:bg-black focus:ring-2 focus:ring-[#46d369]/20 focus:outline-none transition-all duration-300 placeholder-gray-500 font-medium" 
                            placeholder="Search for movies, shows..." 
                            autoFocus
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-1">
                            {inputValue && (
                                <button 
                                    type="button"
                                    onClick={clearSearch}
                                    className="p-2 text-gray-500 hover:text-white transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            )}
                            <button 
                                type="button"
                                onClick={() => setIsSearchOpen(false)}
                                className="text-xs font-bold text-gray-400 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors uppercase tracking-wide"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Standard Navbar Content */}
            <div className={`relative flex items-center justify-between w-full h-full ${isSearchOpen ? 'hidden' : 'flex'}`}>
                <div className="flex items-center gap-2 cursor-pointer group select-none relative z-10" onClick={handleLogoAction}>
                    <span 
                        className="text-white text-2xl md:text-3xl tracking-tighter group-hover:text-[#46d369] transition-colors drop-shadow-md"
                        style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}
                    >
                        fuse
                    </span>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-2 md:gap-4 ml-auto relative z-10">
                    
                    {/* Search Trigger Button */}
                    <button 
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 text-white transition-colors drop-shadow-md" 
                        onClick={() => setIsSearchOpen(true)}
                        aria-label="Search"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </button>
                    
                    {/* Profile Button */}
                    <div className="relative h-10 w-10 flex items-center justify-center">
                        <button 
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} 
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2b2b30] to-[#1f1f22] border border-white/10 shadow-lg flex items-center justify-center group overflow-hidden shrink-0"
                        >
                                <div className="w-full h-full rounded-full bg-gradient-to-br from-[#46d369]/80 to-[#2ea043]/80 opacity-0 group-hover:opacity-100 transition-opacity absolute inset-0"></div>
                                <span className="relative font-bold text-lg text-gray-300 group-hover:text-white leading-none pt-0.5">{avatarLetter}</span>
                        </button>
                        {isUserMenuOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)}></div>
                                <div className="absolute right-0 top-14 w-56 bg-[#1f1f22] border border-white/10 rounded-xl shadow-2xl py-2 z-50 animate-fade-in">
                                    <div className="px-4 py-3 border-b border-white/5 mb-1">
                                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Signed in as</p>
                                        <p className="text-sm text-white font-bold truncate">{session?.user?.email}</p>
                                    </div>
                                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors">
                                        Sign Out
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;