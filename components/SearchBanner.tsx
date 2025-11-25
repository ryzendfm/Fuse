import { FC } from 'react';
import { ContentItem } from '../types';
import { BACK_BASE, IMG_BASE } from '../constants';

interface SearchBannerProps {
    item: ContentItem;
    onClick: () => void;
}

const SearchBanner: FC<SearchBannerProps> = ({ item, onClick }) => {
    if (!item) return null;

    const bgImage = item.backdrop_path ? `${BACK_BASE}${item.backdrop_path}` : (item.poster_path ? `${IMG_BASE}${item.poster_path}` : '');

    return (
        <div 
            onClick={onClick}
            className="relative w-full h-[45vh] min-h-[350px] group cursor-pointer overflow-hidden"
        >
            {/* Background Image */}
            <div className="absolute inset-0">
                {bgImage ? (
                    <img 
                        src={bgImage} 
                        alt={item.title || item.name}
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-[#1f1f22]"></div>
                )}
            </div>

            {/* Overlays */}
            {/* Top gradient for navbar readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0e0e10]/80 via-transparent to-transparent opacity-80 h-32"></div>
            
            {/* Side gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0e0e10] via-[#0e0e10]/40 to-transparent"></div>

            {/* Main vertical gradient - Smoother fade */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e10] via-[#0e0e10]/60 to-transparent"></div>
            
            {/* Extra strong bottom blend to completely hide the edge */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0e0e10] via-[#0e0e10] to-transparent"></div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 flex flex-col justify-end z-10 pb-10">
                <div className="inline-flex items-center gap-2 bg-[#46d369]/20 backdrop-blur-md border border-[#46d369]/30 px-3 py-1 rounded-full w-fit mb-3">
                    <svg className="w-3 h-3 text-[#46d369]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    <span className="text-[#46d369] text-xs font-bold uppercase tracking-wider">Top Result</span>
                </div>

                <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 leading-tight drop-shadow-lg max-w-3xl">
                    {item.title || item.name}
                </h1>

                <div className="flex items-center gap-4 text-xs md:text-sm text-gray-300 font-medium mb-3">
                    <span className="bg-white/10 px-2 py-0.5 rounded text-white">
                        {(item.release_date || item.first_air_date || 'N/A').split('-')[0]}
                    </span>
                    <span className="flex items-center gap-1 text-[#46d369]">
                        {(item.vote_average * 10).toFixed(0)}% Match
                    </span>
                </div>

                <p className="text-gray-300 text-xs md:text-sm line-clamp-2 max-w-2xl drop-shadow-md mb-4 hidden md:block">
                    {item.overview}
                </p>

                <button 
                    className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded hover:bg-gray-200 transition-colors font-bold text-sm w-fit mt-1 shadow-lg"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    Watch Now
                </button>
            </div>
        </div>
    );
};

export default SearchBanner;