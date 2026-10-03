import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Check, ChevronDown, Sparkles } from 'lucide-react';
import { soundscape, SOUNDSCAPE_TRACKS, SoundscapeTrack } from '../utils/audioSoundscape';

export const AudioController: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(soundscape.getIsPlaying());
  const [isMuted, setIsMuted] = useState(soundscape.getIsMuted());
  const [currentTrack, setCurrentTrack] = useState<SoundscapeTrack>(soundscape.getCurrentTrack());
  const [showMenu, setShowMenu] = useState(false);
  const [volume, setVolume] = useState(40);

  useEffect(() => {
    const unsubscribe = soundscape.subscribe(() => {
      setIsPlaying(soundscape.getIsPlaying());
      setIsMuted(soundscape.getIsMuted());
      setCurrentTrack(soundscape.getCurrentTrack());
    });
    return unsubscribe;
  }, []);

  const handleToggle = () => {
    if (!isPlaying) {
      soundscape.start();
    } else {
      soundscape.toggleMute();
    }
  };

  const handleSelectTrack = (trackId: SoundscapeTrack) => {
    soundscape.setTrack(trackId);
    if (!isPlaying) {
      soundscape.start();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    soundscape.setVolume(val / 100);
  };

  const activeTrackInfo = soundscape.getTrackInfo();
  const isActive = isPlaying && !isMuted;

  return (
    <div className="relative flex items-center">
      {/* Primary Pill Button */}
      <div className="flex items-center rounded-full border border-[#D8D0C5] bg-white shadow-sm overflow-hidden">
        {/* Play/Mute Toggle */}
        <button
          onClick={handleToggle}
          aria-label={isActive ? "Mute sanctuary music" : "Play sanctuary music"}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs tracking-wider transition-colors cursor-pointer ${
            isActive
              ? 'text-[#946E3A] hover:text-[#6B4C20]'
              : 'text-[#78716C] hover:text-[#1C1917]'
          }`}
        >
          {isActive ? (
            <>
              {/* Dynamic Equalizer Bars */}
              <div className="flex items-end gap-[2px] h-3.5 w-3.5 shrink-0">
                <span className="w-[2px] bg-[#946E3A] animate-[pulse_1.1s_ease-in-out_infinite] h-2.5" />
                <span className="w-[2px] bg-[#B0894F] animate-[pulse_0.7s_ease-in-out_infinite] h-3.5" />
                <span className="w-[2px] bg-[#946E3A] animate-[pulse_0.9s_ease-in-out_infinite] h-2" />
              </div>
              <span className="hidden sm:inline font-light text-[11px] uppercase tracking-widest truncate max-w-[110px]">
                {activeTrackInfo.title.split(' ')[0]}
              </span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-[#78716C] shrink-0" />
              <span className="hidden sm:inline font-light text-[11px] uppercase tracking-widest text-[#78716C]">
                Muted
              </span>
            </>
          )}
        </button>

        {/* Track Menu Trigger */}
        <button
          onClick={() => setShowMenu((prev) => !prev)}
          title="Change sanctuary soundscape"
          className="px-2 py-1.5 border-l border-[#EAE4DA] text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
        >
          <ChevronDown className="w-3 h-3 text-[#946E3A]" />
        </button>
      </div>

      {/* Dropdown Menu for Changing Music Tracks & Volume */}
      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 p-4 bg-[#FAF8F5] border border-[#E2DBD0] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-50 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#EAE4DA]">
              <div className="flex items-center gap-1.5 text-xs text-[#946E3A] uppercase tracking-widest font-semibold">
                <Music className="w-3.5 h-3.5" />
                <span>Sanctuary Music</span>
              </div>
              <span className="text-[10px] text-[#78716C] font-mono">432Hz Serenity</span>
            </div>

            {/* Track Options */}
            <div className="space-y-1.5 mb-4">
              {SOUNDSCAPE_TRACKS.map((track) => {
                const isCurrent = currentTrack === track.id;
                return (
                  <button
                    key={track.id}
                    onClick={() => {
                      handleSelectTrack(track.id);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between group ${
                      isCurrent
                        ? 'bg-white border-[#946E3A] shadow-sm text-[#1C1917]'
                        : 'bg-white/60 hover:bg-white border-[#EAE4DA] text-[#57534E]'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-xs font-medium flex items-center gap-1.5">
                        <span className="truncate">{track.title}</span>
                        {isCurrent && isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#946E3A] animate-ping shrink-0" />
                        )}
                      </div>
                      <div className="text-[10px] text-[#78716C] truncate mt-0.5">
                        {track.subtitle}
                      </div>
                    </div>

                    {isCurrent && (
                      <Check className="w-3.5 h-3.5 text-[#946E3A] shrink-0 ml-1" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Volume Control */}
            <div className="pt-3 border-t border-[#EAE4DA] space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-[#78716C]">
                <span>Volume</span>
                <span className="font-mono text-[#946E3A] text-[10px]">
                  {isMuted ? '0%' : `${volume}%`}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-full h-1 bg-[#EAE4DA] rounded-lg appearance-none cursor-pointer accent-[#946E3A]"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
