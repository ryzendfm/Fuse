import { FC } from 'react';

export const HeroSkeleton: FC = () => {
    return (
        <div className="relative w-full h-[65vh] min-h-[550px] md:h-[70vh] bg-[#1f1f22] animate-pulse overflow-hidden">
             {/* Gradient Overlay to match Hero visual weight */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e10] via-[#0e0e10]/20 to-black/60"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#0e0e10]/80 via-transparent to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 w-full p-4 md:p-12 pb-20 md:pb-32 z-10 flex flex-col justify-end h-full">
                {/* Title Skeleton */}
                <div className="w-3/4 md:w-1/2 h-10 md:h-16 bg-white/5 rounded-lg mb-6"></div>
                
                {/* Meta Skeleton */}
                <div className="flex gap-4 mb-6">
                    <div className="w-20 h-5 bg-white/5 rounded"></div>
                    <div className="w-16 h-5 bg-white/5 rounded"></div>
                </div>

                {/* Description Skeleton */}
                <div className="space-y-3 mb-8 max-w-2xl">
                    <div className="w-full h-4 bg-white/5 rounded"></div>
                    <div className="w-full h-4 bg-white/5 rounded"></div>
                    <div className="w-2/3 h-4 bg-white/5 rounded"></div>
                </div>
                
                {/* Button Skeleton */}
                 <div className="w-32 h-12 bg-white/10 rounded-lg"></div>
            </div>
        </div>
    );
};

export const GridSkeleton: FC = () => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pb-20">
            {[...Array(12)].map((_, i) => (
                <div key={i} className="aspect-[2/3] bg-[#1f1f22] rounded-lg animate-pulse relative overflow-hidden">
                     {/* Subtle shimmer effect */}
                     <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
                </div>
            ))}
        </div>
    );
};