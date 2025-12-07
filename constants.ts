import { Mood, Progression } from './types';

export const MOOD_PRESETS = [
  { id: Mood.EPIC, label: 'Epic Trailer', icon: 'Sword' },
  { id: Mood.TRIUMPHANT, label: 'Victory', icon: 'Trophy' },
  { id: Mood.HOPEFUL, label: 'Hopeful', icon: 'Sun' },
  { id: Mood.FANTASY, label: 'Fantasy', icon: 'Wand2' },
  { id: Mood.ROMANTIC, label: 'Romance', icon: 'Heart' },
  { id: Mood.NOSTALGIC, label: 'Nostalgia', icon: 'Clock' },
  { id: Mood.SAD, label: 'Sadness', icon: 'CloudRain' },
  { id: Mood.INTROSPECTIVE, label: 'Lyrical/NF', icon: 'Mic' },
  { id: Mood.DREAMY, label: 'Ethereal', icon: 'Cloud' },
  { id: Mood.MYSTERIOUS, label: 'Mystery', icon: 'Moon' },
  { id: Mood.TENSION, label: 'Tension', icon: 'Zap' },
  { id: Mood.CYBERPUNK, label: 'Cyberpunk', icon: 'Cpu' },
  { id: Mood.ACTION, label: 'Action', icon: 'Activity' },
  { id: Mood.GRITTY, label: 'Gritty', icon: 'Skull' },
  { id: Mood.HORROR, label: 'Horror', icon: 'Ghost' },
  // Zimmer Presets
  { id: Mood.ZIMMER_EPIC, label: 'Zimmer: Epic', icon: 'Zap' },
  { id: Mood.ZIMMER_EMOTIONAL, label: 'Zimmer: Emotion', icon: 'Clock' },
  { id: Mood.ZIMMER_TENSION, label: 'Zimmer: Tension', icon: 'Activity' },
];

export const AVAILABLE_INSTRUMENTS = [
  { id: 'grand-piano', label: 'Grand Piano (Default)' },
  { id: 'felt-piano', label: 'Felt Piano (Soft)' },
  { id: 'electric-piano', label: 'Electric Keys (FM)' },
  { id: 'cinematic-pad', label: 'Cinematic Pad' },
  { id: 'dark-synth', label: 'Dark Synth (Stranger Things)' },
  { id: 'celesta', label: 'Celesta (Magical)' },
];

export const PROGRESSION_TEMPLATES: Progression[] = [
  // --- CLASSICS ---
  {
    title: "Epic Journey (I-V-vi-IV)",
    description: "The quintessential heroic progression. Used in everything from Gladiator to Pop Anthems.",
    bpm: 110,
    key: "C Major",
    theoryAnalysis: {
      summary: "I - V - vi - IV. A major key classic that balances stability (I) with forward momentum (V) and emotional depth (vi).",
      voiceLeading: "Strong bass movement by 4ths and 5ths.",
      hyperMeter: "Standard 4-bar loop."
    },
    chords: [
      { name: "C", roman: "I", notes: ["C2", "G2", "C3", "E3", "G3"], melodyNotes: ["E4", "C5"], duration: 4, description: "Heroic Tonic" },
      { name: "G", roman: "V", notes: ["G1", "D2", "B2", "D3", "G3"], melodyNotes: ["D4", "B4"], duration: 4, description: "Dominant Power" },
      { name: "Am", roman: "vi", notes: ["A1", "E2", "A2", "C3", "E3"], melodyNotes: ["C5", "A4"], duration: 4, description: "Emotional Turn" },
      { name: "F", roman: "IV", notes: ["F1", "C2", "A2", "C3", "F3"], melodyNotes: ["A4", "F4"], duration: 4, description: "Uplifting Subdominant" }
    ]
  },
  {
    title: "Sentimental Ballad (I-V/7-vi-IV)",
    description: "Features a descending bassline for a nostalgic, tear-jerking feel.",
    bpm: 75,
    key: "C Major",
    theoryAnalysis: {
      summary: "Uses a 1st inversion dominant chord (G/B) to create a smooth stepwise bass line (C -> B -> A).",
      voiceLeading: "Excellent bass voice leading.",
      hyperMeter: "Lyrical phrasing."
    },
    chords: [
      { name: "C", roman: "I", notes: ["C2", "G2", "C3", "E3"], melodyNotes: ["G4"], duration: 4, description: "Stable Start" },
      { name: "G/B", roman: "V6", notes: ["B1", "G2", "D3", "G3"], melodyNotes: ["D4"], duration: 4, description: "Passing Bass" },
      { name: "Am7", roman: "vi7", notes: ["A1", "E2", "G2", "C3"], melodyNotes: ["E4"], duration: 4, description: "Melancholy Target" },
      { name: "Fadd9", roman: "IVadd9", notes: ["F1", "C2", "A2", "C3", "G3"], melodyNotes: ["A4"], duration: 4, description: "Warm Resolution" }
    ]
  },
  {
    title: "Andalusian Cadence (i-VII-VI-V)",
    description: "The sound of flamenco, tango, and dark epic tension.",
    bpm: 120,
    key: "C Minor",
    theoryAnalysis: {
      summary: "A stepwise descent through the minor mode: i - bVII - bVI - V7.",
      voiceLeading: "Parallel motion in chords is common and effective here.",
      hyperMeter: "Driving rhythm."
    },
    chords: [
      { name: "Cm", roman: "i", notes: ["C2", "G2", "C3", "Eb3"], melodyNotes: ["G4"], duration: 4, description: "Tension" },
      { name: "Bb", roman: "VII", notes: ["Bb1", "F2", "Bb2", "D3"], melodyNotes: ["F4"], duration: 4, description: "Walking Down" },
      { name: "Ab", roman: "VI", notes: ["Ab1", "Eb2", "Ab2", "C3"], melodyNotes: ["Eb4"], duration: 4, description: "Darkening" },
      { name: "G7", roman: "V7", notes: ["G1", "D2", "F2", "B2"], melodyNotes: ["D4"], duration: 4, description: "Harmonic Release" }
    ]
  },
  {
    title: "Royal Road (IV-V-iii-vi)",
    description: "The 'Odo Shinko'. Extremely popular in J-Pop, Anime, and emotional cinema.",
    bpm: 90,
    key: "C Major",
    theoryAnalysis: {
      summary: "Starts on the subdominant (IV) for immediate emotion, avoiding the tonic.",
      voiceLeading: "Circular progression feel.",
      hyperMeter: "Floating, never fully resolving."
    },
    chords: [
      { name: "Fmaj7", roman: "IVmaj7", notes: ["F2", "C3", "E3", "A3"], melodyNotes: ["C5"], duration: 4, description: "Emotional Opener" },
      { name: "G7", roman: "V7", notes: ["G2", "D3", "F3", "B3"], melodyNotes: ["B4"], duration: 4, description: "Push" },
      { name: "Em7", roman: "iii7", notes: ["E2", "B2", "D3", "G3"], melodyNotes: ["G4"], duration: 4, description: "Nostalgic Pivot" },
      { name: "Am7", roman: "vi7", notes: ["A2", "E3", "G3", "C4"], melodyNotes: ["E4"], duration: 4, description: "Soft Landing" }
    ]
  },
  {
    title: "Jazz Noir (ii-V-I-VI)",
    description: "Smoky, extended harmony for a sophisticated mood.",
    bpm: 65,
    key: "C Major",
    theoryAnalysis: {
      summary: "ii-V-I with extensions (9ths, 13ths) and an altered turnaround.",
      voiceLeading: "Guide tones (3rds and 7ths) move smoothly.",
      hyperMeter: "Relaxed."
    },
    chords: [
      { name: "Dm9", roman: "ii9", notes: ["D2", "F2", "C3", "E3", "A3"], melodyNotes: ["F4"], duration: 4, description: "Smooth Minor" },
      { name: "G13", roman: "V13", notes: ["G1", "F2", "B2", "E3"], melodyNotes: ["A4"], duration: 4, description: "Rich Dominant" },
      { name: "Cmaj9", roman: "Imaj9", notes: ["C2", "E2", "B2", "D3"], melodyNotes: ["G4"], duration: 4, description: "Lush Resolution" },
      { name: "A7alt", roman: "VI7alt", notes: ["A1", "G2", "C#3", "F3"], melodyNotes: ["Bb4"], duration: 4, description: "Tension Turnaround" }
    ]
  },
  {
    title: "Axis of Awesome (vi-IV-I-V)",
    description: "The 'Four Chords' used in thousands of pop songs.",
    bpm: 128,
    key: "C Major",
    theoryAnalysis: {
      summary: "Starts on the minor vi for a slightly darker pop feel.",
      voiceLeading: "Simple and effective.",
      hyperMeter: "Loopable."
    },
    chords: [
      { name: "Am", roman: "vi", notes: ["A2", "E3", "A3", "C4"], melodyNotes: ["E4"], duration: 4, description: "Minor Start" },
      { name: "F", roman: "IV", notes: ["F2", "C3", "F3", "A3"], melodyNotes: ["C5"], duration: 4, description: "Lift" },
      { name: "C", roman: "I", notes: ["C2", "G2", "C3", "E3"], melodyNotes: ["G4"], duration: 4, description: "Solid Tonic" },
      { name: "G", roman: "V", notes: ["G2", "D3", "G3", "B3"], melodyNotes: ["D4"], duration: 4, description: "Turnaround" }
    ]
  },

  // --- ZIMMER ADDITIONS ---
  {
    title: "Time (Inception Style)",
    description: "The famous, slow-building 4-chord loop from the climax of Inception.",
    bpm: 60,
    key: "A Minor",
    theoryAnalysis: {
      summary: "A simple i - v - VII - IV progression. The major IV chord (D) in a minor key (Dorian flavor) provides that lift of hope amidst the melancholy.",
      voiceLeading: "Very static inner voices, allowing the bass to define the movement.",
      hyperMeter: "Slow harmonic rhythm, each chord feels like a chapter."
    },
    chords: [
      { name: "Am", roman: "i", notes: ["A1", "A2", "E3", "A3", "C4"], melodyNotes: ["E4", "C5"], duration: 4, description: "The Reality" },
      { name: "Em", roman: "v", notes: ["E1", "E2", "B2", "E3", "G3"], melodyNotes: ["B4"], duration: 4, description: "The Memory" },
      { name: "G", roman: "VII", notes: ["G1", "G2", "D3", "G3", "B3"], melodyNotes: ["D5"], duration: 4, description: "The Dream" },
      { name: "D", roman: "IV", notes: ["D1", "D2", "A2", "D3", "F#3"], melodyNotes: ["A4", "F#4"], duration: 4, description: "The Hope (Dorian)" }
    ]
  },
  {
    title: "Cornfield Chase (Interstellar)",
    description: "Rapid, arpeggiated texture often played on organ. Neo-classical minimalism.",
    bpm: 100,
    key: "A Minor",
    theoryAnalysis: {
      summary: "A chromatic line cliché or circle movement. Focuses on the relationship between A minor and E major inversions.",
      voiceLeading: "Melodic voices often stay static while harmony shifts underneath.",
      hyperMeter: "Relentless and circular."
    },
    chords: [
      { name: "Am", roman: "i", notes: ["A1", "A2", "C3", "E3"], melodyNotes: ["A4", "C5", "E5", "A5"], duration: 4, description: "The Mission" },
      { name: "E/G#", roman: "V6", notes: ["G#1", "G#2", "B2", "E3"], melodyNotes: ["G#4", "B4", "E5", "G#5"], duration: 4, description: "Gravity" },
      { name: "C/G", roman: "i42", notes: ["G1", "G2", "C3", "E3"], melodyNotes: ["G4", "C5", "E5", "G5"], duration: 4, description: "Time Slip" },
      { name: "D/F#", roman: "IV6", notes: ["F#1", "F#2", "A2", "D3"], melodyNotes: ["F#4", "A4", "D5", "F#5"], duration: 4, description: "Discovery" }
    ]
  },
  {
    title: "Why So Serious? (Dark Knight)",
    description: "A simple, rising minor third tension that builds anxiety.",
    bpm: 130,
    key: "D Minor",
    theoryAnalysis: {
      summary: "Essentially oscillates between the tonic (Dm) and the Neapolitan (Eb) or similar non-functional rising tension.",
      voiceLeading: "Parallel planing (gliding chords up).",
      hyperMeter: "Unpredictable and anxious."
    },
    chords: [
      { name: "Dm", roman: "i", notes: ["D1", "D2", "A2", "F3"], melodyNotes: ["D4"], duration: 4, description: "The Joker" },
      { name: "Eb", roman: "bII", notes: ["Eb1", "Eb2", "Bb2", "G3"], melodyNotes: ["Eb4"], duration: 4, description: "Chaos Rising" },
      { name: "Dm/F", roman: "i6", notes: ["F1", "D2", "A2", "D3"], melodyNotes: ["F4"], duration: 4, description: "Instability" },
      { name: "Eb/G", roman: "bII6", notes: ["G1", "Eb2", "Bb2", "Eb3"], melodyNotes: ["G4"], duration: 4, description: "Panic" }
    ]
  },
  {
    title: "Chevaliers de Sangreal (Da Vinci)",
    description: "A Chaconne (repeating bass line) that sounds ancient and holy.",
    bpm: 80,
    key: "D Minor",
    theoryAnalysis: {
      summary: "Based on a rising bass line D - Bb - C - D. Very classical and noble.",
      voiceLeading: "Contra-motion between outer voices.",
      hyperMeter: "Ceremonial."
    },
    chords: [
      { name: "Dm", roman: "i", notes: ["D1", "A2", "D3", "F3"], melodyNotes: ["A4"], duration: 4, description: "The Bloodline" },
      { name: "Bb", roman: "VI", notes: ["Bb1", "F2", "Bb2", "D3"], melodyNotes: ["F4"], duration: 4, description: "The History" },
      { name: "C", roman: "VII", notes: ["C1", "G2", "C3", "E3"], melodyNotes: ["G4"], duration: 4, description: "The Secret" },
      { name: "Dsus4", roman: "isus4", notes: ["D1", "A2", "D3", "G3"], melodyNotes: ["A4"], duration: 4, description: "The Grail" }
    ]
  },
  {
    title: "Dune Voice (Exotic)",
    description: "Static bass pedal with shifting upper structures, creating an alien landscape.",
    bpm: 65,
    key: "D Phrygian",
    theoryAnalysis: {
      summary: "Uses Polychords (Eb over D) to create the Phrygian Dominant clash. Very atmospheric.",
      voiceLeading: "Bass stays on D while chords shift above.",
      hyperMeter: "Vast and timeless."
    },
    chords: [
      { name: "D5", roman: "i(no3)", notes: ["D1", "D2", "A2", "D3"], melodyNotes: ["A3"], duration: 4, description: "The Desert" },
      { name: "Eb/D", roman: "bII/i", notes: ["D1", "Bb2", "Eb3", "G3"], melodyNotes: ["Bb3"], duration: 4, description: "The Spice" },
      { name: "Cm/D", roman: "vii/i", notes: ["D1", "C3", "Eb3", "G3"], melodyNotes: ["C4"], duration: 4, description: "The Voice" },
      { name: "D(addb9)", roman: "i(addb9)", notes: ["D1", "A2", "Eb3", "F#3"], melodyNotes: ["Eb4"], duration: 4, description: "The Worm" }
    ]
  },

  // --- NEW ADDITIONS (PREVIOUS) ---

  {
    title: "Sci-Fi Wonder (C Lydian)",
    description: "Floaty, space-like atmosphere using the Lydian mode (#4).",
    bpm: 60,
    key: "C Major",
    theoryAnalysis: {
      summary: "Oscillates between I and II. The II chord (D major in key of C) contains the F# (Lydian note).",
      voiceLeading: "Common tone C is held while other voices shift.",
      hyperMeter: "Static and ambient."
    },
    chords: [
      { name: "Cmaj7", roman: "Imaj7", notes: ["C2", "G2", "B2", "E3", "G3"], melodyNotes: ["B4"], duration: 4, description: "Home Base" },
      { name: "D(add9)", roman: "II", notes: ["D2", "A2", "C3", "E3", "F#3"], melodyNotes: ["F#4"], duration: 4, description: "The Lydian Lift" },
      { name: "Cmaj7/G", roman: "Imaj7", notes: ["G2", "C3", "E3", "B3"], melodyNotes: ["E4"], duration: 4, description: "Inversion Return" },
      { name: "D/C", roman: "II/I", notes: ["C2", "D3", "F#3", "A3"], melodyNotes: ["A4"], duration: 4, description: "Pedal Point Tension" }
    ]
  },
  {
    title: "Hans Zimmer Tension (Phrygian)",
    description: "Dark, menacing pedal point often used in Batman or Gladiator.",
    bpm: 100,
    key: "D Minor",
    theoryAnalysis: {
      summary: "Uses the Phrygian bII chord (Eb) over the tonic pedal (D).",
      voiceLeading: "Tension and release by semitone (Eb -> D).",
      hyperMeter: "Persistent and driving."
    },
    chords: [
      { name: "Dm", roman: "i", notes: ["D2", "A2", "D3", "F3", "A3"], melodyNotes: ["D4"], duration: 4, description: "The Anchor" },
      { name: "Eb/D", roman: "bII/i", notes: ["D2", "Bb2", "Eb3", "G3"], melodyNotes: ["Eb4"], duration: 4, description: "Phrygian Clash" },
      { name: "Dm/F", roman: "i6", notes: ["F2", "A2", "D3", "A3"], melodyNotes: ["F4"], duration: 4, description: "Slight Opening" },
      { name: "Ebmaj7/D", roman: "bIImaj7", notes: ["D2", "Bb2", "D3", "G3"], melodyNotes: ["Bb4"], duration: 4, description: "Majestic Tension" }
    ]
  },
  {
    title: "Neo-Soul Walkdown (R&B)",
    description: "Smooth, jazzy chords with lush 9ths and 13ths.",
    bpm: 88,
    key: "Eb Major",
    theoryAnalysis: {
      summary: "A descending progression using secondary dominants and tritone substitutions.",
      voiceLeading: "Extremely smooth chromatic voice leading in inner voices.",
      hyperMeter: "Groovy and laid back."
    },
    chords: [
      { name: "Cm9", roman: "vi9", notes: ["C2", "G2", "Bb2", "D3", "Eb3"], melodyNotes: ["G4"], duration: 4, description: "Cool Minor" },
      { name: "Bb13", roman: "V13", notes: ["Bb1", "Ab2", "C3", "D3", "G3"], melodyNotes: ["C5"], duration: 4, description: "Dominant Color" },
      { name: "Abmaj9", roman: "IVmaj9", notes: ["Ab1", "Eb2", "G2", "C3", "Bb3"], melodyNotes: ["Eb4"], duration: 4, description: "Lush Landing" },
      { name: "G7alt", roman: "III7alt", notes: ["G1", "F2", "B2", "Eb3", "Ab3"], melodyNotes: ["B3"], duration: 4, description: "Tension Turnaround" }
    ]
  },
  {
    title: "Spy Thriller (007 Style)",
    description: "The classic 'James Bond' minor harmonic movement.",
    bpm: 100,
    key: "E Minor",
    theoryAnalysis: {
      summary: "Moves the 5th of the chord up chromatically: Em -> Em(#5) -> Em6.",
      voiceLeading: "The 'Line Cliché' creates the mystery.",
      hyperMeter: "Sneaky."
    },
    chords: [
      { name: "Em", roman: "i", notes: ["E2", "B2", "E3", "G3"], melodyNotes: ["B3"], duration: 4, description: "The Spy" },
      { name: "Em(#5)", roman: "i(#5)", notes: ["E2", "C3", "E3", "G3"], melodyNotes: ["C4"], duration: 4, description: "The Move" },
      { name: "Em6", roman: "i6", notes: ["E2", "C#3", "E3", "G3"], melodyNotes: ["C#4"], duration: 4, description: "The Reveal" },
      { name: "Cmaj7", roman: "VI", notes: ["C2", "G2", "B2", "E3"], melodyNotes: ["B3"], duration: 4, description: "The Escape" }
    ]
  },
  {
    title: "Ghibli Waltz (Magic)",
    description: "Nostalgic, magical progression often found in Joe Hisaishi scores.",
    bpm: 110,
    key: "Bb Major",
    theoryAnalysis: {
      summary: "Uses the IV-iv minor plagal cadence trick, but with a half-diminished twist.",
      voiceLeading: "Melancholy yet hopeful.",
      hyperMeter: "Waltzing 3/4 feel (simulated in 4/4)."
    },
    chords: [
      { name: "Bbmaj9", roman: "Imaj9", notes: ["Bb2", "F3", "A3", "C4", "D4"], melodyNotes: ["F4"], duration: 4, description: "Floating Home" },
      { name: "Am7(b5)", roman: "viiø", notes: ["A2", "Eb3", "G3", "C4"], melodyNotes: ["G4"], duration: 4, description: "Magical Pivot" },
      { name: "D7(b9)", roman: "V7/vi", notes: ["D2", "F#3", "C4", "Eb4"], melodyNotes: ["A4"], duration: 4, description: "Tension" },
      { name: "Gm9", roman: "vi9", notes: ["G2", "D3", "F3", "Bb3", "A4"], melodyNotes: ["D5"], duration: 4, description: "Resolution" }
    ]
  },
  {
    title: "Dark Trap (Phrygian/Natural)",
    description: "Menacing, repetitive progression for modern hip-hop.",
    bpm: 140,
    key: "C Minor",
    theoryAnalysis: {
      summary: "Simple triad movement focusing on the half-step relationship between G and Ab.",
      voiceLeading: "Blocky and aggressive.",
      hyperMeter: "Loop-heavy."
    },
    chords: [
      { name: "Cm", roman: "i", notes: ["C3", "G3", "C4", "Eb4"], melodyNotes: ["G4"], duration: 4, description: "Grim" },
      { name: "Gm", roman: "v", notes: ["G2", "D3", "G3", "Bb3"], melodyNotes: ["D4"], duration: 4, description: "Low" },
      { name: "Ab", roman: "VI", notes: ["Ab2", "Eb3", "Ab3", "C4"], melodyNotes: ["Eb4"], duration: 4, description: "Impact" },
      { name: "Bb", roman: "VII", notes: ["Bb2", "F3", "Bb3", "D4"], melodyNotes: ["F4"], duration: 4, description: "Turn" }
    ]
  },
  {
    title: "Disney Major Lift",
    description: "The 'Secondary Dominant' trick that creates a swelling, magical feeling.",
    bpm: 85,
    key: "E Major",
    theoryAnalysis: {
      summary: "Uses a V/vi (G#7) to pull strongly to the relative minor (C#m), creating strong emotion.",
      voiceLeading: "Leading tone G# pushes to A.",
      hyperMeter: "Soaring."
    },
    chords: [
      { name: "E", roman: "I", notes: ["E2", "B2", "E3", "G#3"], melodyNotes: ["B3"], duration: 4, description: "Once upon a time" },
      { name: "G#7", roman: "V7/vi", notes: ["G#2", "D#3", "F#3", "C4"], melodyNotes: ["C4"], duration: 4, description: "The Lift" },
      { name: "C#m", roman: "vi", notes: ["C#2", "G#2", "C#3", "E3"], melodyNotes: ["E4"], duration: 4, description: "The Heart" },
      { name: "Aadd9", roman: "IV", notes: ["A2", "E3", "B3", "C#4"], melodyNotes: ["E4"], duration: 4, description: "Wide Wonder" }
    ]
  },
  {
    title: "Cyberpunk Chase (Aeolian)",
    description: "Fast-paced, synth-heavy progression for futuristic action.",
    bpm: 135,
    key: "F Minor",
    theoryAnalysis: {
      summary: "Aeolian mode. Oscillates between i and VI with driving energy.",
      voiceLeading: "Parallel motion accepted for synth power.",
      hyperMeter: "Relentless."
    },
    chords: [
      { name: "Fm", roman: "i", notes: ["F2", "C3", "F3", "Ab3"], melodyNotes: ["C4"], duration: 4, description: "Run" },
      { name: "Db", roman: "VI", notes: ["Db2", "Ab2", "Db3", "F3"], melodyNotes: ["Ab3"], duration: 4, description: "Slide" },
      { name: "Eb", roman: "VII", notes: ["Eb2", "Bb2", "Eb3", "G3"], melodyNotes: ["Bb3"], duration: 4, description: "Jump" },
      { name: "Cm", roman: "v", notes: ["C2", "G2", "C3", "Eb3"], melodyNotes: ["G3"], duration: 4, description: "Hide" }
    ]
  },
  {
    title: "Post-Rock Build (B Minor)",
    description: "Melancholic, wide open voicings for explosive emotional climaxes.",
    bpm: 110,
    key: "B Minor",
    theoryAnalysis: {
      summary: "Simple diatonic chords voiced widely to create a 'wall of sound'.",
      voiceLeading: "Common tones (D and F#) kept at top.",
      hyperMeter: "Building."
    },
    chords: [
      { name: "Bm11", roman: "i11", notes: ["B1", "F#2", "A2", "D3", "E3"], melodyNotes: ["F#4"], duration: 4, description: "The Void" },
      { name: "Gmaj9", roman: "VImaj9", notes: ["G1", "D2", "F#2", "A2", "B2"], melodyNotes: ["D4"], duration: 4, description: "The Rise" },
      { name: "Dadd9", roman: "III", notes: ["D2", "A2", "D3", "E3", "F#3"], melodyNotes: ["A4"], duration: 4, description: "The Peak" },
      { name: "Aadd9/C#", roman: "VII", notes: ["C#2", "A2", "E3", "B3"], melodyNotes: ["E4"], duration: 4, description: "The Fall" }
    ]
  },
  {
    title: "Interstellar Space (Loop)",
    description: "Based on the concept of 'No Time for Caution'. A loop that never resolves.",
    bpm: 60,
    key: "A Minor",
    theoryAnalysis: {
      summary: "Uses a descending bassline while keeping the melody static.",
      voiceLeading: "Tension increases with each chord.",
      hyperMeter: "Infinite."
    },
    chords: [
      { name: "Am", roman: "i", notes: ["A1", "E2", "A2", "C3"], melodyNotes: ["E4"], duration: 4, description: "Orbit" },
      { name: "F/A", roman: "VI/i", notes: ["A1", "F2", "A2", "C3"], melodyNotes: ["F4"], duration: 4, description: "Drift" },
      { name: "C/G", roman: "III", notes: ["G1", "E2", "G2", "C3"], melodyNotes: ["E4"], duration: 4, description: "View" },
      { name: "G/B", roman: "VII", notes: ["B1", "D2", "G2", "B2"], melodyNotes: ["D4"], duration: 4, description: "Darkness" }
    ]
  },
  {
    title: "80s Power Ballad",
    description: "Big hair, big drums, big emotions.",
    bpm: 80,
    key: "F Major",
    theoryAnalysis: {
      summary: "I - V - vi - IV with specific voice leading to sound 'anthemic'.",
      voiceLeading: "Strong root movement.",
      hyperMeter: "Lighters in the air."
    },
    chords: [
      { name: "F", roman: "I", notes: ["F2", "C3", "F3", "A3"], melodyNotes: ["C4"], duration: 4, description: "Verse" },
      { name: "C/E", roman: "V", notes: ["E2", "C3", "G3", "C4"], melodyNotes: ["G4"], duration: 4, description: "Build" },
      { name: "Dm", roman: "vi", notes: ["D2", "A2", "D3", "F3"], melodyNotes: ["A4"], duration: 4, description: "Chorus Hit" },
      { name: "Bbadd9", roman: "IV", notes: ["Bb1", "F2", "C3", "D3"], melodyNotes: ["F4"], duration: 4, description: "Sustain" }
    ]
  },
  {
    title: "Gospel Passing (Uplifting)",
    description: "Uses a diminished passing chord for that 'church' sound.",
    bpm: 70,
    key: "C Major",
    theoryAnalysis: {
      summary: "I -> #ivdim7 -> V. The sharp 4 diminished pulls strongly to the 5.",
      voiceLeading: "Chromatic bass line F -> F# -> G.",
      hyperMeter: "Soulful."
    },
    chords: [
      { name: "C", roman: "I", notes: ["C2", "G2", "C3", "E3"], melodyNotes: ["G4"], duration: 4, description: "Praise" },
      { name: "F", roman: "IV", notes: ["F2", "C3", "F3", "A3"], melodyNotes: ["A4"], duration: 4, description: "Lift" },
      { name: "F#dim7", roman: "#iv°7", notes: ["F#2", "C3", "Eb3", "A3"], melodyNotes: ["C5"], duration: 4, description: "The Spirit" },
      { name: "G7sus4", roman: "V7sus", notes: ["G2", "D3", "F3", "C4"], melodyNotes: ["D4"], duration: 4, description: "Glory" }
    ]
  },
  {
    title: "Villain's Monologue",
    description: "A chromatic descent for a character explaining their evil plan.",
    bpm: 70,
    key: "C Minor",
    theoryAnalysis: {
      summary: "Uses 1st and 3rd inversions to create a creeping bass line.",
      voiceLeading: "C -> Bb -> A -> Ab.",
      hyperMeter: "Unsettling."
    },
    chords: [
      { name: "Cm", roman: "i", notes: ["C2", "G2", "Eb3", "G3"], melodyNotes: ["C4"], duration: 4, description: "The Plan" },
      { name: "Cm/Bb", roman: "i42", notes: ["Bb1", "G2", "Eb3", "G3"], melodyNotes: ["Eb4"], duration: 4, description: "The Reason" },
      { name: "Am7(b5)", roman: "viø", notes: ["A1", "Gb2", "C3", "Eb3"], melodyNotes: ["C4"], duration: 4, description: "The Twist" },
      { name: "Abmaj7", roman: "VI", notes: ["Ab1", "Eb2", "G2", "C3"], melodyNotes: ["G3"], duration: 4, description: "The Threat" }
    ]
  },
  {
    title: "Dream Pop (Shoegaze)",
    description: "Washed out, hazy chords with extended harmonies.",
    bpm: 100,
    key: "Gb Major",
    theoryAnalysis: {
      summary: "Heavy use of Major 7th and Major 9th intervals.",
      voiceLeading: "Parallel planing.",
      hyperMeter: "Hazy."
    },
    chords: [
      { name: "Gbmaj7", roman: "I", notes: ["Gb2", "Db3", "F3", "Bb3"], melodyNotes: ["Db4"], duration: 4, description: "Haze" },
      { name: "Ebm9", roman: "vi", notes: ["Eb2", "Bb2", "Db3", "F3", "Gb3"], melodyNotes: ["Bb4"], duration: 4, description: "Memory" },
      { name: "Cbmaj7", roman: "IV", notes: ["B1", "Gb2", "Bb2", "Eb3"], melodyNotes: ["Gb4"], duration: 4, description: "Float" },
      { name: "Db7", roman: "V", notes: ["Db2", "Ab2", "Cb3", "F3"], melodyNotes: ["Ab4"], duration: 4, description: "Drift" }
    ]
  },
  {
    title: "Western Showdown",
    description: "Ennio Morricone style simplicity. Sparse and dry.",
    bpm: 90,
    key: "A Minor",
    theoryAnalysis: {
      summary: "i - III - VII - i. Pure triads, open spacing.",
      voiceLeading: "Stark and direct.",
      hyperMeter: "Staring contest."
    },
    chords: [
      { name: "Am", roman: "i", notes: ["A1", "E2", "A2", "C3"], melodyNotes: ["E4"], duration: 4, description: "The Good" },
      { name: "C", roman: "III", notes: ["C2", "G2", "C3", "E3"], melodyNotes: ["G4"], duration: 4, description: "The Bad" },
      { name: "G", roman: "VII", notes: ["G1", "D2", "G2", "B2"], melodyNotes: ["D4"], duration: 4, description: "The Ugly" },
      { name: "Am", roman: "i", notes: ["A1", "E2", "A2", "C3"], melodyNotes: ["A4"], duration: 4, description: "Draw" }
    ]
  },
  {
    title: "Anime Emotion (Variant)",
    description: "Extended 'Royal Road' often used in J-Rock choruses.",
    bpm: 160,
    key: "G Major",
    theoryAnalysis: {
      summary: "IV - V - iii - vi - ii - V - I. A complete narrative arc in a loop.",
      voiceLeading: "Fast harmonic rhythm.",
      hyperMeter: "Energetic."
    },
    chords: [
      { name: "Cmaj7", roman: "IV", notes: ["C2", "G2", "B2", "E3"], melodyNotes: ["B3"], duration: 2, description: "Start" },
      { name: "D7", roman: "V", notes: ["D2", "A2", "C3", "F#3"], melodyNotes: ["A3"], duration: 2, description: "Push" },
      { name: "Bm7", roman: "iii", notes: ["B1", "F#2", "A2", "D3"], melodyNotes: ["D4"], duration: 2, description: "Fall" },
      { name: "Em7", roman: "vi", notes: ["E2", "B2", "D3", "G3"], melodyNotes: ["G4"], duration: 2, description: "Catch" }
    ]
  },
  {
    title: "Picardy Third (Resolution)",
    description: "Ending a minor progression on a Major chord. Very classical.",
    bpm: 70,
    key: "C Minor",
    theoryAnalysis: {
      summary: "i - iv - V - I (Major). The switch to C Major at the end is 'The Picardy Third'.",
      voiceLeading: "Strong V-I cadence.",
      hyperMeter: "Finality."
    },
    chords: [
      { name: "Cm", roman: "i", notes: ["C2", "G2", "Eb3", "G3"], melodyNotes: ["C4"], duration: 4, description: "Darkness" },
      { name: "Fm", roman: "iv", notes: ["F2", "C3", "Ab3", "C4"], melodyNotes: ["F4"], duration: 4, description: "Struggle" },
      { name: "G7", roman: "V7", notes: ["G2", "D3", "F3", "B3"], melodyNotes: ["D4"], duration: 4, description: "Hope?" },
      { name: "C", roman: "I", notes: ["C2", "G2", "E3", "G3"], melodyNotes: ["E4"], duration: 4, description: "Light." }
    ]
  },
  {
    title: "Pop Punk Anthem",
    description: "Power chords and teenage angst. I - V - vi - IV.",
    bpm: 160,
    key: "E Major",
    theoryAnalysis: {
      summary: "Simple, effective, high energy.",
      voiceLeading: "Who cares? Play it loud.",
      hyperMeter: "Jump."
    },
    chords: [
      { name: "E5", roman: "I", notes: ["E2", "B2", "E3"], melodyNotes: ["E4"], duration: 4, description: "Skate" },
      { name: "B5", roman: "V", notes: ["B1", "F#2", "B2"], melodyNotes: ["D#4"], duration: 4, description: "Park" },
      { name: "C#5", roman: "vi", notes: ["C#2", "G#2", "C#3"], melodyNotes: ["E4"], duration: 4, description: "Life" },
      { name: "A5", roman: "IV", notes: ["A1", "E2", "A2"], melodyNotes: ["C#4"], duration: 4, description: "Pizza" }
    ]
  },
  {
    title: "Minor Plagal (Sad)",
    description: "The 'iv - I' cadence. Often termed the most 'heartbreaking' cadence.",
    bpm: 60,
    key: "C Major",
    theoryAnalysis: {
      summary: "Uses the minor iv (Fm) in a Major key (C). The Ab falls to G.",
      voiceLeading: "Ab -> G is the 'tearjerker' note movement.",
      hyperMeter: "Sobbing."
    },
    chords: [
      { name: "C", roman: "I", notes: ["C2", "G2", "C3", "E3"], melodyNotes: ["E4"], duration: 4, description: "Happy" },
      { name: "F", roman: "IV", notes: ["F2", "C3", "F3", "A3"], melodyNotes: ["A4"], duration: 4, description: "Longing" },
      { name: "Fm6", roman: "iv6", notes: ["F2", "D3", "F3", "Ab3"], melodyNotes: ["D4"], duration: 4, description: "Heartbreak" },
      { name: "C", roman: "I", notes: ["C2", "G2", "C3", "E3"], melodyNotes: ["C4"], duration: 4, description: "Acceptance" }
    ]
  },
  {
    title: "Circle of Fifths",
    description: "The strongest harmonic movement in western music.",
    bpm: 120,
    key: "C Major",
    theoryAnalysis: {
      summary: "Root motion by descending 5ths (or ascending 4ths). vi-ii-V-I.",
      voiceLeading: "Perfect mechanical resolution.",
      hyperMeter: "Continuous."
    },
    chords: [
      { name: "Am7", roman: "vi", notes: ["A2", "E3", "G3", "C4"], melodyNotes: ["C5"], duration: 2, description: "6" },
      { name: "Dm7", roman: "ii", notes: ["D2", "A2", "C3", "F3"], melodyNotes: ["A4"], duration: 2, description: "2" },
      { name: "G7", roman: "V", notes: ["G2", "D3", "F3", "B3"], melodyNotes: ["B4"], duration: 2, description: "5" },
      { name: "Cmaj7", roman: "I", notes: ["C2", "G2", "B2", "E3"], melodyNotes: ["G4"], duration: 2, description: "1" }
    ]
  }
];

export const INITIAL_PROGRESSION = {
  title: "Welcome to CineChords",
  description: "Select a mood or describe your scene to generate a custom progression.",
  theoryAnalysis: {
    summary: "This progression uses a classic 'i - VI - iv - V7' movement. Note the use of the Harmonic Minor V7 (G7) in C Minor, which creates a strong gravitational pull back to the tonic (Cm) due to the leading tone (B natural).",
    voiceLeading: "The bass line moves strongly by skips (C -> Ab -> F -> G), outlining the tonal center. The inner voices move smoothly, with the Eb in Cm connecting to Eb in Ab, then shifting to C in Fm.",
    hyperMeter: "Bars 1 (Cm) and 3 (Fm) serve as strong metric pillars, establishing stability. Bars 2 (Ab) and 4 (G7) act as transitional harmonies, pushing the momentum forward."
  },
  bpm: 80,
  key: "C Minor",
  chords: [
    { name: "Cm", roman: "i", notes: ["C3", "G3", "C4", "Eb4", "G4"], melodyNotes: ["C5", "G4"], duration: 4, description: "The foundation (Tonic)" },
    { name: "Ab", roman: "VI", notes: ["Ab2", "Eb3", "Ab3", "C4", "Eb4"], melodyNotes: ["C5", "Eb5"], duration: 4, description: "Major lift (Submediant)" },
    { name: "Fm", roman: "iv", notes: ["F2", "C3", "F3", "Ab3", "C4"], melodyNotes: ["F5", "C5", "Ab4"], duration: 4, description: "Emotional turn (Subdominant)" },
    { name: "G7", roman: "V7", notes: ["G2", "D3", "G3", "B3", "F4"], melodyNotes: ["G4", "B4", "D5"], duration: 4, description: "Tension resolution (Dominant)" }
  ]
};