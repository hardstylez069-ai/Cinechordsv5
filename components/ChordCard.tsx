import React from 'react';
import { ChordData } from '../types';
import { Play, GripHorizontal, Clock, Minus, Plus } from 'lucide-react';
import { PianoRoll } from './PianoRoll';

interface ChordCardProps {
  chord: ChordData;
  isActive: boolean;
  isPlaying: boolean;
  onClick: () => void;
  index: number;
  onDragStart: (e: React.DragEvent, chord: ChordData, index: number) => void;
  onDurationChange: (newDuration: number) => void;
}

export const ChordCard: React.FC<ChordCardProps> = ({ chord, isActive, isPlaying, onClick, index, onDragStart, onDurationChange }) => {
  const handleDurationClick = (e: React.MouseEvent, delta: number) => {
    e.stopPropagation();
    const newDuration = Math.max(1, chord.duration + delta);
    onDurationChange(newDuration);
  };

  return (
    <div 
      draggable
      onDragStart={(e) => onDragStart(e, chord, index)}
      onClick={onClick}
      className={`
        relative flex flex-col items-center p-4 rounded-xl border cursor-grab active:cursor-grabbing transition-all duration-300 group
        ${isActive 
          ? 'bg-slate-800/80 border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.15)] scale-105 z-10' 
          : 'bg-slate-800/40 border-slate-700 hover:border-slate-500 hover:bg-slate-800/60'}
      `}
    >
      {/* Drag Handle Indicator */}
      <div className="absolute top-2 right-2 text-slate-600 group-hover:text-slate-400">
        <GripHorizontal className="w-4 h-4" />
      </div>

      {/* Active Indicator */}
      {isActive && isPlaying && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full animate-ping" />
      )}

      <div className="text-xs font-mono text-slate-500 mb-1 pointer-events-none">{index + 1}. {chord.roman}</div>
      
      <h3 className={`text-2xl font-bold mb-1 cinematic-font pointer-events-none ${isActive ? 'text-white' : 'text-slate-300'}`}>
        {chord.name}
      </h3>
      
      <p className="text-xs text-slate-400 text-center mb-4 line-clamp-2 min-h-[2.5em] pointer-events-none">
        {chord.description}
      </p>

      {/* Visual Piano Representation */}
      <div className="pointer-events-none mb-4">
         <PianoRoll notes={chord.notes} melodyNotes={chord.melodyNotes} isActive={isActive} />
      </div>

      {/* Duration Controls */}
      <div className="flex items-center gap-2 bg-slate-900/50 rounded-lg p-1 border border-slate-700/50 relative z-20" onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={(e) => handleDurationClick(e, -1)}
          className="p-1 hover:text-amber-500 text-slate-400 transition-colors disabled:opacity-30 disabled:hover:text-slate-400"
          disabled={chord.duration <= 1}
        >
          <Minus className="w-3 h-3" />
        </button>
        <div className="flex items-center gap-1 min-w-[3rem] justify-center" title="Duration in beats">
          <Clock className="w-3 h-3 text-slate-500" />
          <span className="text-xs font-mono font-medium">{chord.duration}b</span>
        </div>
        <button 
          onClick={(e) => handleDurationClick(e, 1)}
          className="p-1 hover:text-amber-500 text-slate-400 transition-colors"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      {/* Play Overlay on Hover */}
      <div className={`absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none z-10`}>
         <Play className="text-white fill-white w-8 h-8 drop-shadow-lg" />
      </div>
    </div>
  );
};