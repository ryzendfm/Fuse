import { FC } from 'react';
import { ContentItem } from '../types';
import { BACK_BASE } from '../constants';

interface HeroProps {
    item: ContentItem | null;
    onPlay: () => void;
}

const Hero: FC<HeroProps> = ({ item, onPlay }) => {
    if (!item) return null;

    return (
        <div className="relative w-full h-[65vh] min-h-[550px] md:h-[70vh] group">
            <img 
                src={`${BACK_BASE}${item.backdrop_path}`} 
                alt={item.title || item.name}
                className="absolute inset-0 w-full h-full object-cover opacity-80 transition-opacity duration-700"
            />
            {/* Overlay Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e10] via-[#0e0e10]/20 to-black/60"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#0e0e10]/80 via-transparent to-transparent"></div>
            
            {/* Content Container */}
            <div className="absolute bottom-0 left-0 w-full p-4 md:p-12 z-10 pb-20 md:pb-32">
                {/* Title: No Wrap, Fade Gradient Mask */}
                <div className="w-full md:w-[90%]">
                    <h1 
                        className="text-4xl md:text-6xl font-black text-white mb-4 text-shadow leading-tight whitespace-nowrap overflow-hidden"
                        style={{
                             maskImage: 'linear-gradient(to right, black 75%, transparent 100%)',
                             WebkitMaskImage: 'linear-gradient(to right, black 75%, transparent 100%)'
                        }}
                    >
                        {item.title || item.name}
                    </h1>
                </div>
                
                <div className="flex items-center gap-3 text-sm text-gray-300 mb-4 font-medium">
                    <span className="text-[#46d369]">{(item.vote_average * 10).toFixed(0)}% Match</span>
                    <span>{item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0]}</span>
                </div>

                <p className="text-sm md:text-lg text-gray-200 line-clamp-3 mb-6 drop-shadow-md leading-relaxed max-w-2xl">{item.overview}</p>
                
                <div className="flex gap-4">
                    <button 
                        onClick={onPlay}
                        className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded hover:bg-gray-200 transition-colors font-bold text-sm md:text-base"
                    >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        Play Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Hero;