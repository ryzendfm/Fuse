import { FC } from 'react';

const Sidebar: FC = () => {
    const items = ['Action', 'Comedy', 'Sci-Fi', 'Horror', 'Drama', 'Anime', 'Thriller', 'Romance'];

    return (
        <aside className="w-[240px] bg-[#18181b] hidden lg:flex flex-col border-r border-black overflow-y-auto shrink-0 pt-[60px]">
            <div className="p-4 text-xs font-bold text-[#666] uppercase tracking-wider mt-2">Recommended</div>
            <div className="px-2 space-y-1">
                {items.map((item) => (
                    <div 
                        key={item} 
                        className="flex items-center gap-3 p-2 rounded hover:bg-[#222] cursor-pointer text-sm text-gray-400 hover:text-white transition-colors group"
                    >
                        <div className="w-6 h-6 bg-[#333] rounded-full flex items-center justify-center text-xs text-[#666] group-hover:text-white">
                            {item[0]}
                        </div>
                        {item}
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default Sidebar;