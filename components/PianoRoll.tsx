import React from 'react';

interface PianoRollProps {
  notes: string[];
  melodyNotes?: string[];
  isActive: boolean;
}

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export const PianoRoll: React.FC<PianoRollProps> = ({ notes, melodyNotes = [], isActive }) => {
  // Simple visualization: 1 octave range representation for visual flair
  // We parse the notes to highlight keys on a mini keyboard
  
  const getNoteBase = (noteName: string) => {
     // Remove octave number to get base key
     return noteName.replace(/-?\d+/, '');
  };

  const isChordNote = (keyBase: string) => {
    return notes.some(n => n.startsWith(keyBase) || n.startsWith(keyBase.replace('#', 'b'))); 
  };

  const isMelodyNote = (keyBase: string) => {
    return melodyNotes.some(n => n.startsWith(keyBase) || n.startsWith(keyBase.replace('#', 'b')));
  };

  // Keys to display in the mini visualizer (roughly middle range)
  const displayKeys = ["C", "D", "E", "F", "G", "A", "B", "C2", "D2", "E2", "F2", "G2"];

  return (
    <div className={`flex justify-center space-x-0.5 h-16 w-full max-w-[220px] overflow-hidden rounded-b-lg opacity-80 ${isActive ? 'opacity-100' : 'opacity-40 grayscale'}`}>
      {displayKeys.map((key, i) => {
         const rawKey = key.replace('2', ''); // Normalize display key name
         const isChord = isChordNote(rawKey);
         const isMelody = isMelodyNote(rawKey);
         
         let bgClass = 'bg-slate-800';
         let heightClass = 'h-full';
         
         if (isActive) {
            if (isMelody) {
               bgClass = 'bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)]';
            } else if (isChord) {
               bgClass = 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.6)]';
            }
         }

         return (
           <div 
            key={i}
            className={`
              flex-1 rounded-b-sm border-t-0 border border-slate-700 
              ${bgClass}
              ${(isChord || isMelody) && isActive ? 'translate-y-1' : ''}
              transition-all duration-300
            `}
           />
         )
      })}
    </div>
  );
};