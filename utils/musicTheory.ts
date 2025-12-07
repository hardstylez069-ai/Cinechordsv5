import { Progression, ChordData } from '../types';

const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const getNoteIndex = (note: string): number => {
  const n = note.toUpperCase();
  // Handle flats by converting to sharps for simplicity in this engine
  const flatsMap: {[key: string]: string} = { "DB": "C#", "EB": "D#", "GB": "F#", "AB": "G#", "BB": "A#" };
  if (flatsMap[n]) return NOTES.indexOf(flatsMap[n]);
  
  return NOTES.indexOf(n);
};

export const transposeNote = (noteObj: string, semitones: number): string => {
  // Parsing Scientific Pitch Notation e.g. "C#3"
  // Regex: Group 1 (Note+Accidental), Group 2 (Octave)
  const regex = /^([a-gA-G][#b]?)(-?\d+)$/;
  const match = noteObj.match(regex);
  
  if (!match) return noteObj; // Return original if parse fails

  let note = match[1];
  let octave = parseInt(match[2], 10);

  let noteIdx = getNoteIndex(note);
  if (noteIdx === -1) return noteObj;

  let newIndex = noteIdx + semitones;
  
  // Handle octave shifts
  while (newIndex >= 12) {
    newIndex -= 12;
    octave += 1;
  }
  while (newIndex < 0) {
    newIndex += 12;
    octave -= 1;
  }

  return `${NOTES[newIndex]}${octave}`;
};

export const transposeChordName = (name: string, semitones: number): string => {
  // Regex to separate Root from Quality (e.g. "C" from "m7", "F#" from "maj9")
  const regex = /^([A-G][#b]?)(.*)$/;
  const match = name.match(regex);

  if (!match) return name;

  const root = match[1];
  const quality = match[2];

  let noteIdx = getNoteIndex(root);
  if (noteIdx === -1) return name;

  let newIndex = noteIdx + semitones;
  while (newIndex >= 12) newIndex -= 12;
  while (newIndex < 0) newIndex += 12;

  return `${NOTES[newIndex]}${quality}`;
};

export const transposeProgression = (progression: Progression, semitones: number): Progression => {
  if (semitones === 0) return progression;

  // Determine new Key Label
  let newKey = progression.key;
  // Try to parse key (e.g. "C Minor")
  const keyParts = newKey.split(' ');
  if (keyParts.length > 0) {
     const newRoot = transposeChordName(keyParts[0], semitones);
     newKey = `${newRoot} ${keyParts.slice(1).join(' ')}`;
  }

  const newChords = progression.chords.map(chord => ({
    ...chord,
    name: transposeChordName(chord.name, semitones),
    notes: chord.notes.map(n => transposeNote(n, semitones)),
    melodyNotes: chord.melodyNotes ? chord.melodyNotes.map(n => transposeNote(n, semitones)) : []
  }));

  return {
    ...progression,
    key: newKey,
    chords: newChords
  };
};