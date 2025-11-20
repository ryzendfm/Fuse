import React, { useEffect, useState } from 'react';
import { ContentItem, ContentDetails, CastMember, Episode, MediaType } from '../types';
import { fetchDetails, fetchCredits, fetchSeason } from '../services/tmdbService';
import { BACK_BASE, IMG_BASE, CAST_BASE } from '../constants';

interface MovieUiModalProps {
    item: ContentItem | null;
    type: MediaType;
    onClose: () => void;
}

const MovieUiModal: React.FC<MovieUiModalProps> = ({ item, type, onClose }) => {
    const [details, setDetails] = useState<ContentDetails | null>(null);
    const [cast, setCast] = useState<CastMember[]>([]);
    const [currentSeason, setCurrentSeason] = useState(1);
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [currentEpisode, setCurrentEpisode] = useState(1);
    const [showPlayer, setShowPlayer] = useState(false);
    const [server, setServer] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [isPlayerLoading, setIsPlayerLoading] = useState(false);

    useEffect(() => {
        if (item) {
            loadData();
            setShowPlayer(false);
            setServer(1);
            setCurrentSeason(1);
            setCurrentEpisode(1);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [item]);

    const loadData = async () => {
        if (!item) return;
        setIsLoading(true);
        try {
            const [det, cred] = await Promise.all([
                fetchDetails(type, item.id),
                fetchCredits(type, item.id)
            ]);
            setDetails(det);
            setCast(cred.cast);

            if (type === 'tv') {
                await loadSeasonData(item.id, 1);
            }
        } catch (error) {
            console.error("Failed to load details", error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadSeasonData = async (tvId: number, seasonNum: number) => {
        try {
            const data = await fetchSeason(tvId, seasonNum);
            setEpisodes(data.episodes);
            setCurrentSeason(seasonNum);
        } catch (error) {
            console.error("Failed to load season", error);
            setEpisodes([]);
        }
    };

    const handleSeasonChange = (seasonNum: number) => {
        if (item) loadSeasonData(item.id, seasonNum);
    };

    const handlePlay = (season = 1, episode = 1) => {
        if (type === 'tv') {
            setCurrentSeason(season);
            setCurrentEpisode(episode);
        }
        setShowPlayer(true);
        setIsPlayerLoading(true);
    };

    const getStreamUrl = () => {
        if (!item) return '';
        if (type === 'movie') {
            if (server === 1) return `https://vidsrc.cc/v2/embed/movie/${item.id}`;
            if (server === 2) return `https://embed.su/embed/movie/${item.id}`;
            return `https://player.autoembed.cc/embed/movie/${item.id}`;
        } else {
            if (server === 1) return `https://vidsrc.cc/v2/embed/tv/${item.id}/${currentSeason}/${currentEpisode}`;
            if (server === 2) return `https://embed.su/embed/tv/${item.id}/${currentSeason}/${currentEpisode}`;
            return `https://player.autoembed.cc/embed/tv/${item.id}/${currentSeason}/${currentEpisode}`;
        }
    };

    if (!item) return null;

    const backdropUrl = item.backdrop_path ? `${BACK_BASE}${item.backdrop_path}` : (item.poster_path ? `${IMG_BASE}${item.poster_path}` : '');
    const title = item.title || item.name;
    const year = (item.release_date || item.first_air_date || 'N/A').split('-')[0];
    
    return (
        <div className="fixed inset-0 z-50 bg-black overflow-y-auto animate-fade-in">
             {/* Top Navigation Overlay */}
             <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-20">
                <button onClick={onClose} className="w-10 h-10 rounded-full bg-black/50 backdrop-blur flex items-center justify-center hover:bg-white/20 transition text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <div className="flex gap-3">
                    <button className="w-10 h-10 rounded-full bg-black/50 backdrop-blur flex items-center justify-center hover:bg-white/20 transition text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                    </button>
                </div>
            </div>

            <div className="relative w-full h-[50vh] md:h-[60vh]">
                {showPlayer ? (
                    <div className="absolute inset-0 bg-black z-30">
                        {isPlayerLoading && (
                             <div className="absolute inset-0 flex items-center justify-center bg-black z-30">
                                <div className="text-center">
                                    <div className="animate-spin w-10 h-10 border-4 border-gray-600 border-t-[#46d369] rounded-full mx-auto mb-2"></div>
                                    <p className="text-gray-400 text-xs">Connecting to Server {server}...</p>
                                </div>
                            </div>
                        )}
                        <iframe 
                            src={getStreamUrl()} 
                            className="w-full h-full" 
                            frameBorder="0" 
                            allowFullScreen 
                            allow="autoplay"
                            onLoad={() => setIsPlayerLoading(false)}
                        ></iframe>
                        <button 
                            onClick={() => setShowPlayer(false)} 
                            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all z-40"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ) : (
                    <>
                        <img src={backdropUrl} className="absolute inset-0 w-full h-full object-cover opacity-70" alt="Backdrop" />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#000]"></div>
                    </>
                )}
            </div>

            <div className={`relative w-full bg-[#000] min-h-[50vh] rounded-t-[30px] z-10 px-6 pb-12 transition-all duration-300 ${showPlayer ? 'mt-0 pt-10' : '-mt-8 pt-6'}`}>
                 {/* Play FAB */}
                 {!showPlayer && (
                     <div className="absolute right-8 -top-8 z-20">
                        <button 
                            onClick={() => handlePlay(currentSeason, currentEpisode)} 
                            className="w-16 h-16 rounded-full bg-[#46d369] flex items-center justify-center shadow-[0_8px_24px_rgba(70,211,105,0.5)] hover:scale-110 transition-transform active:scale-95"
                        >
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        </button>
                    </div>
                 )}

                 {isLoading ? (
                     <div className="pt-12 flex justify-center">
                         <div className="animate-spin w-8 h-8 border-4 border-[#333] border-t-[#46d369] rounded-full"></div>
                     </div>
                 ) : (
                     <>
                        {/* Header Info */}
                        <div className="mb-6 slide-up">
                            <h1 className="text-3xl md:text-5xl font-black text-white mb-2 leading-tight">{title}</h1>
                            <div className="flex items-center gap-3 text-sm text-gray-400 font-medium">
                                <span>{year}</span>
                                <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                                <span>{details?.genres.map(g => g.name).slice(0,3).join(', ')}</span>
                                <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                                <span className="text-[#46d369]">★ {item.vote_average?.toFixed(1)}</span>
                            </div>
                        </div>

                        {/* Plot */}
                        <div className="mb-8 slide-up" style={{ animationDelay: '0.1s' }}>
                            <h3 className="text-white font-bold text-lg mb-2">The Plot</h3>
                            <p className="text-gray-400 text-sm leading-relaxed max-w-4xl">{item.overview || "No synopsis available."}</p>
                        </div>

                        {/* Cast */}
                        <div className="mb-8 slide-up" style={{ animationDelay: '0.2s' }}>
                            <h3 className="text-white font-bold text-lg mb-3">Casts</h3>
                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                {cast.slice(0, 10).map(c => (
                                    <div key={c.id} className="flex flex-col items-center gap-1 min-w-[70px]">
                                        <img 
                                            src={c.profile_path ? `${CAST_BASE}${c.profile_path}` : 'https://via.placeholder.com/60'} 
                                            className="w-[60px] h-[60px] rounded-full object-cover border-2 border-[#333]" 
                                            alt={c.name}
                                        />
                                        <span className="text-[10px] text-gray-400 text-center leading-tight line-clamp-1">{c.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Episodes (TV Only) */}
                        {type === 'tv' && details && (
                             <div className="slide-up mb-8" style={{ animationDelay: '0.3s' }}>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-white font-bold text-lg">Episodes</h3>
                                    <span className="text-xs text-gray-500">{details.number_of_episodes} Eps • {details.number_of_seasons} Seasons</span>
                                </div>
                                
                                {/* Season Selectors */}
                                <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
                                    {details.seasons?.filter(s => s.season_number > 0).map(s => (
                                        <button
                                            key={s.season_number}
                                            onClick={() => handleSeasonChange(s.season_number)}
                                            className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg text-sm font-bold border transition-all ${currentSeason === s.season_number ? 'bg-[#46d369] border-[#46d369] text-white shadow-lg' : 'bg-[#1f1f22] border-[#333] text-white hover:border-[#46d369]'}`}
                                        >
                                            S{s.season_number}
                                        </button>
                                    ))}
                                </div>

                                {/* Episode List */}
                                <div className="space-y-3">
                                    {episodes.map(ep => (
                                        <div 
                                            key={ep.id}
                                            onClick={() => handlePlay(currentSeason, ep.episode_number)}
                                            className="flex items-center gap-3 p-2 rounded hover:bg-[#1a1a1a] cursor-pointer group transition-colors"
                                        >
                                            <div className="relative w-16 h-10 bg-[#333] rounded overflow-hidden flex-shrink-0">
                                                {ep.still_path && (
                                                    <img src={`${CAST_BASE}${ep.still_path}`} className="w-full h-full object-cover" alt={ep.name} />
                                                )}
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-transparent transition-colors">
                                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-bold text-gray-200 truncate group-hover:text-[#46d369] transition-colors">
                                                    {ep.episode_number}. {ep.name}
                                                </h4>
                                                <p className="text-[10px] text-gray-500 line-clamp-1">{ep.overview || 'No info'}</p>
                                            </div>
                                            <span className="text-[10px] text-gray-600">{ep.runtime ? `${ep.runtime}m` : ''}</span>
                                        </div>
                                    ))}
                                    {episodes.length === 0 && <div className="text-sm text-gray-500">No episodes found.</div>}
                                </div>
                             </div>
                        )}

                        {/* Server Selector */}
                        <div className="mt-8 pt-6 border-t border-[#222] text-center">
                            <p className="text-xs text-gray-600 mb-2 uppercase tracking-widest">Streaming Source</p>
                            <div className="flex justify-center gap-2">
                                {[1, 2, 3].map(id => (
                                    <button 
                                        key={id}
                                        onClick={() => setServer(id)} 
                                        className={`px-3 py-1 border rounded text-xs transition-all ${server === id ? 'bg-white text-black border-white' : 'bg-[#111] border-[#333] text-gray-400 hover:text-white hover:border-[#46d369]'}`}
                                    >
                                        {id === 1 ? 'VidSrc' : id === 2 ? 'EmbedSu' : 'AutoEmbed'}
                                    </button>
                                ))}
                            </div>
                        </div>
                     </>
                 )}
            </div>
        </div>
    );
};

export default MovieUiModal;