import { Progression } from '../types';

const TICKS_PER_BEAT = 480;

function stringToBytes(str: string): number[] {
  return str.split('').map(c => c.charCodeAt(0));
}

function writeVarInt(value: number): number[] {
  if (value === 0) return [0];
  const bytes = [];
  let v = value;
  while (v > 0) {
    bytes.push(v & 0x7F);
    v >>= 7;
  }
  // Reverse and set MSB for all but last
  bytes.reverse();
  for (let i = 0; i < bytes.length - 1; i++) {
    bytes[i] |= 0x80;
  }
  return bytes;
}

function noteNameToMidi(note: string): number {
  // Matches C3, C#3, Db3, C-1 etc.
  const regex = /^([a-gA-G])(#|b)?(-?\d+)$/;
  const match = note.match(regex);
  if (!match) return 60; // Default center C

  const name = match[1].toUpperCase();
  const accidental = match[2] || '';
  const octave = parseInt(match[3], 10);

  const offsets: Record<string, number> = {
    'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11
  };
  
  let pitch = offsets[name];
  if (accidental === '#') pitch += 1;
  if (accidental === 'b') pitch -= 1;

  // MIDI note 0 is C-1. ( -1 + 1 ) * 12 + 0 = 0
  // C4 is 60. (4 + 1) * 12 + 0 = 60.
  return (octave + 1) * 12 + pitch;
}

function numToBytes(num: number, bytes: number): number[] {
  const res = [];
  for (let i = bytes - 1; i >= 0; i--) {
    res.push((num >> (8 * i)) & 0xFF);
  }
  return res;
}

interface MidiEvent {
  ticks: number;
  type: number;
  note: number;
  velocity: number;
}

export const generateMidiBlob = (progression: Progression): Blob => {
  // To handle complex timing (melody notes spaced out), we'll create a list of absolute time events
  // and then convert to delta times.
  let events: MidiEvent[] = [];
  let currentTick = 0;

  progression.chords.forEach(chord => {
    const durationTicks = Math.round(chord.duration * TICKS_PER_BEAT);
    
    // 1. Add Chord Notes (Block)
    chord.notes.forEach(n => {
      const midiNote = noteNameToMidi(n);
      // Note On
      events.push({ ticks: currentTick, type: 0x90, note: midiNote, velocity: 0x45 }); // ~69 velocity (softer)
      // Note Off
      events.push({ ticks: currentTick + durationTicks, type: 0x80, note: midiNote, velocity: 0x00 });
    });

    // 2. Add Melody Notes (Distributed)
    if (chord.melodyNotes && chord.melodyNotes.length > 0) {
      const segmentTicks = Math.floor(durationTicks / chord.melodyNotes.length);
      
      chord.melodyNotes.forEach((n, i) => {
        const midiNote = noteNameToMidi(n);
        const startTick = currentTick + (i * segmentTicks);
        // Make melody slightly longer than segment for legato, but ensure note off doesn't overlap identically 
        // with next note on if same pitch to avoid confusion in some synths, though MIDI allows it.
        // Let's keep it strictly within segment for simplicity in this implementation.
        const endTick = startTick + segmentTicks;

        events.push({ ticks: startTick, type: 0x90, note: midiNote, velocity: 0x64 }); // ~100 velocity (louder)
        events.push({ ticks: endTick, type: 0x80, note: midiNote, velocity: 0x00 });
      });
    }

    currentTick += durationTicks;
  });

  // Sort events by tick
  events.sort((a, b) => a.ticks - b.ticks);

  // Convert to Delta Times
  const trackEvents: number[] = [];
  
  // Set Tempo
  const microsecondsPerBeat = Math.round(60000000 / progression.bpm);
  trackEvents.push(0x00, 0xFF, 0x51, 0x03, ...numToBytes(microsecondsPerBeat, 3));

  let lastTick = 0;
  events.forEach(e => {
    const delta = e.ticks - lastTick;
    trackEvents.push(...writeVarInt(delta));
    trackEvents.push(e.type, e.note, e.velocity);
    lastTick = e.ticks;
  });

  // End of Track
  trackEvents.push(0x00, 0xFF, 0x2F, 0x00);

  // Header Chunk
  const header = [
    ...stringToBytes("MThd"),
    ...numToBytes(6, 4), // Length
    ...numToBytes(0, 2), // Format 0
    ...numToBytes(1, 2), // 1 Track
    ...numToBytes(TICKS_PER_BEAT, 2)
  ];

  // Track Chunk
  const trackHeader = [
    ...stringToBytes("MTrk"),
    ...numToBytes(trackEvents.length, 4)
  ];

  const fileData = new Uint8Array([
    ...header,
    ...trackHeader,
    ...trackEvents
  ]);

  return new Blob([fileData], { type: 'audio/midi' });
};