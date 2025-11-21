import { FC } from 'react';
import { ContentItem } from '../types';
import { IMG_BASE } from '../constants';

interface ContentGridProps {
    items: ContentItem[];
    onItemClick: (item: ContentItem) => void;
}

const ContentGrid: FC<ContentGridProps> = ({ items, onItemClick }) => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pb-20">
            {items.map((item) => {
                if (!item.poster_path) return null;
                return (
                    <div 
                        key={item.id} 
                        onClick={() => onItemClick(item)}
                        className="relative aspect-[2/3] bg-[#1f1f22] rounded-lg overflow-hidden cursor-pointer group hover:scale-105 transition-transform duration-300 shadow-md"
                    >
                        <img 
                            src={`${IMG_BASE}${item.poster_path}`} 
                            alt={item.title || item.name}
                            loading="lazy"
                            className="w-full h-full object-cover"
                        />
                        
                        {/* Rating Badge */}
                        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md border border-white/10 px-2 py-1 rounded-md flex items-center gap-1 z-10 shadow-sm">
                            <svg className="w-3 h-3 text-[#46d369]" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-white text-[10px] font-bold tracking-wide">
                                {item.vote_average ? item.vote_average.toFixed(1) : 'NR'}
                            </span>
                        </div>

                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                            <div className="bg-[#46d369] text-white rounded-full p-3 shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-200">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ContentGrid;