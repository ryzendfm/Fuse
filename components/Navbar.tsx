import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

interface NavbarProps {
    onSearch: (query: string) => void;
    onLogoClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch, onLogoClick }) => {
    const [inputValue, setInputValue] = useState('');
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            onSearch(inputValue);
            setIsMobileSearchOpen(false);
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

    return (
        <nav 
            className={`fixed top-0 left-0 right-0 h-[70px] z-50 flex items-center px-4 md:px-8 transition-all duration-300 ${scrolled ? 'bg-[#0e0e10]/95 backdrop-blur-md' : 'bg-gradient-to-b from-black/90 via-black/60 to-transparent'}`}
        >
            {/* Mobile Search Overlay in Navbar */}
            {isMobileSearchOpen && (
                <div className="w-full flex items-center md:hidden animate-fade-in">
                    <form onSubmit={handleSubmit} className="relative flex-1 group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                        <input 
                            type="text" 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="w-full bg-[#1f1f22] border border-transparent focus:border-[#46d369]/50 text-white text-sm rounded-xl py-2.5 pl-10 pr-20 shadow-inner focus:bg-[#18181b] focus:ring-2 focus:ring-[#46d369]/20 focus:outline-none transition-all duration-300 placeholder-gray-500 font-medium" 
                            placeholder="Search..." 
                            autoFocus
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-1">
                            {inputValue && (
                                <button 
                                    type="button"
                                    onClick={clearSearch}
                                    className="p-1 text-gray-500 hover:text-white transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            )}
                            <button 
                                type="button"
                                onClick={() => setIsMobileSearchOpen(false)}
                                className="text-xs font-bold text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-white/10 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Standard Navbar Content */}
            <div className={`relative flex items-center justify-between w-full h-full ${isMobileSearchOpen ? 'hidden md:flex' : 'flex'}`}>
                <div className="flex items-center gap-2 cursor-pointer group select-none relative z-10" onClick={handleLogoAction}>
                    <span 
                        className="text-white text-2xl md:text-3xl tracking-tighter group-hover:text-[#46d369] transition-colors drop-shadow-md"
                        style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}
                    >
                        fuse
                    </span>
                </div>

                {/* Desktop Search Bar */}
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px] lg:max-w-[600px] hidden md:block z-0">
                    <form onSubmit={handleSubmit} className="relative w-full group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-500 group-focus-within:text-[#46d369] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                        <input 
                            type="text" 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="w-full bg-[#1f1f22] border border-transparent focus:border-[#46d369]/50 text-white text-sm rounded-xl py-3 pl-12 pr-10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] focus:bg-[#18181b] focus:ring-4 focus:ring-[#46d369]/10 focus:outline-none transition-all duration-300 placeholder-gray-500 font-medium" 
                            placeholder="Search for movies, shows..." 
                        />
                        {inputValue && (
                             <button 
                                type="button"
                                onClick={clearSearch}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-white transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        )}
                    </form>
                </div>

                <div className="flex items-center gap-4 relative z-10">
                    <button className="md:hidden p-2 text-white drop-shadow-md hover:bg-white/10 rounded-lg transition-colors" onClick={() => setIsMobileSearchOpen(true)}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </button>
                    <div className="relative">
                        <button 
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} 
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2b2b30] to-[#1f1f22] border border-white/10 shadow-lg flex items-center justify-center group overflow-hidden"
                        >
                             <div className="w-full h-full rounded-full bg-gradient-to-br from-[#46d369]/80 to-[#2ea043]/80 opacity-0 group-hover:opacity-100 transition-opacity absolute inset-0"></div>
                             <span className="relative font-bold text-sm text-gray-300 group-hover:text-white">U</span>
                        </button>
                        {isUserMenuOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)}></div>
                                <div className="absolute right-0 top-14 w-56 bg-[#1f1f22] border border-white/10 rounded-xl shadow-2xl py-2 z-50 animate-fade-in">
                                    <div className="px-4 py-3 border-b border-white/5 mb-1">
                                        <p className="text-sm text-white font-bold">My Account</p>
                                    </div>
                                    <a href="#" className="block px-4 py-2.5 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-colors">Profile</a>
                                    <a href="#" className="block px-4 py-2.5 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-colors">Settings</a>
                                    <div className="h-px bg-white/5 my-1"></div>
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