export interface ChordData {
  name: string;
  roman: string;
  notes: string[]; // e.g., ["C3", "E3", "G3"]
  melodyNotes: string[]; // e.g., ["G4", "C5"] - Top line melody notes
  duration: number; // in beats (quarter notes)
  description: string;
}

export interface TheoryAnalysis {
  summary: string;
  voiceLeading: string;
  hyperMeter: string;
}

export interface Progression {
  title: string;
  description: string;
  theoryAnalysis?: TheoryAnalysis; // Structured analysis
  bpm: number;
  key: string;
  chords: ChordData[];
}

export enum Mood {
  EPIC = 'Epic & Heroic (Trailer Music)',
  TRIUMPHANT = 'Triumphant & Victorious (Sports/Victory)',
  HOPEFUL = 'Hopeful & Uplifting (Corporate/Inspirational)',
  FANTASY = 'Magical & Wonder (Disney/Fantasy)',
  ROMANTIC = 'Romantic & Sentimental (Love Theme)',
  NOSTALGIC = 'Nostalgic & Bittersweet (Coming of Age)',
  SAD = 'Sad & Melancholic (Drama)',
  INTROSPECTIVE = 'Intense & Introspective (Storytelling Hip-Hop/NF Style)',
  DREAMY = 'Dreamy & Ambient (Ethereal)',
  MYSTERIOUS = 'Mysterious & Investigative (Crime/Thriller)',
  TENSION = 'Tense & Suspenseful (Tick Tock)',
  HORROR = 'Dark & Horror (Scary)',
  CYBERPUNK = 'Futuristic & Sci-Fi (Synthwave/Blade Runner)',
  ACTION = 'Fast & Action-Packed (Chase Scene)',
  GRITTY = 'Gritty & Urban (Crime/Street)',
  // Zimmer Specifics
  ZIMMER_EPIC = 'Zimmer: Epic Wall of Sound (Dune/Blade Runner)',
  ZIMMER_EMOTIONAL = 'Zimmer: Emotional Build (Time/Lion King)',
  ZIMMER_TENSION = 'Zimmer: High Tension (Dark Knight/Dunkirk)'
}

export enum Complexity {
  BASIC = 'Basic (Triads)',
  STANDARD = 'Standard (7ths)',
  EXTENDED = 'Extended (9ths, 11ths)',
  JAZZ = 'Complex (Altered/Jazz)'
}

export enum Voicing {
  CLOSE = 'Close (Compact/Pop)',
  OPEN = 'Open (Balanced)',
  CINEMATIC = 'Cinematic (Wide/Spacious)',
  SHELL = 'Shell (Jazz/Neo-Soul)'
}

export enum Inversion {
  ROOT = 'Root Position (Stable)',
  FIRST = '1st Inversion (Melodic Bass)',
  SECOND = '2nd Inversion (Unstable/Passing)',
  MIXED = 'Mixed Inversions (Smooth Voice Leading)'
}

export enum MelodyStyle {
  LYRICAL = 'Lyrical (Long, Singing Lines)',
  HOMOPHONIC = 'Homophonic (Clear Lead & Support)',
  CHORD_TONE = 'Chord Tone (Vertical/Stable)',
  STEPWISE = 'Stepwise (Conjunct/Smooth)',
  DISJUNCT = 'Disjunct (Leaping/Dramatic)',
  ARPEGGIATED = 'Arpeggiated (Broken Chords)',
  SEQUENCED = 'Sequenced (Repeating Pattern)',
  RHYTHMIC = 'Rhythmic (Short, Catchy Motifs)',
  MINIMAL = 'Minimal (Sparse, Atmospheric)',
  FLOWING = 'Flowing (Continuous Motion)',
  ASCENDING = 'Ascending (Building Tension)',
  DESCENDING = 'Descending (Resolving)',
  MOTIVIC = 'Motivic (Thematic Hook)',
  CALL_AND_RESPONSE = 'Call & Response (Conversational)'
}

export interface AudioState {
  isPlaying: boolean;
  currentChordIndex: number;
  isReady: boolean;
  playingSource: 'main' | 'custom' | null;
}