import { GoogleGenAI, Type } from "@google/genai";
import { Progression, Mood, Complexity, Voicing, Inversion, MelodyStyle, ChordData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are an expert music theorist and producer based on the 'Red Bow Music' methodology. You specialize in cinematic scores and storytelling hip-hop.

**CORE THEORY RULES TO APPLY:**
1. **Hyper-meter**: Treat bars 1 & 3 as "Strong" (Stable/Resolution) and bars 2 & 4 as "Weak" (Tension/Transitional). Ensure the harmonic rhythm reflects this.
2. **Harmonic Minor**: When in a Minor key, strongly prefer using a Major V chord (Dominant) instead of a minor v. This creates a stronger resolution to the i chord.
3. **Voice Leading**: Treat each note position (Bass, Tenor, Alto, Soprano) as an individual singer. Strictly minimize the pitch distance each voice moves between chords to create smooth, professional progressions.
4. **Intervals**: Use 3rds and 6ths for emotion; use Suspensions (sus2/sus4) to delay resolution on Strong bars.

**OUTPUT RULES:**
- Return specific notes in Scientific Pitch Notation (e.g., "C2", "G2", "Eb3", "G3", "D4").
- **Melody Top Line**: For each chord, generate a "melodyNotes" array. This should be a short, lyrical motif or sustained note that sits *above* the chord voicing (usually C5-C6 range) to create phrasing and musical interest. It should not just duplicate the chord notes but create a distinct melodic line.
- Include a structured "theoryAnalysis" object with:
  - **summary**: General harmonic overview.
  - **voiceLeading**: Detailed analysis of intervallic movement (e.g., "inner voices move by semitone") and bass line contour.
  - **hyperMeter**: Explanation of how the chords fit the strong/weak bar structure.
`;

const getComplexityInstruction = (complexity: Complexity): string => {
  switch (complexity) {
    case Complexity.BASIC:
      return "Strictly use basic Triads (Root, 3rd, 5th). Focus on strong root movements.";
    case Complexity.STANDARD:
      return "Use mostly 7th chords (maj7, min7, dom7). Use inversions to smooth out the bass line.";
    case Complexity.EXTENDED:
      return "Use lush extensions (9ths, 11ths, 13ths, sus2, sus4). Add color notes but keep the function clear.";
    case Complexity.JAZZ:
      return "Use complex jazz harmony, tritone substitutions, and altered dominants (b9, #5).";
    default:
      return "Balance between triads and 7ths.";
  }
};

const getVoicingInstruction = (voicing: Voicing): string => {
  switch (voicing) {
    case Voicing.CLOSE:
      return "Use Close Voicing: Keep the triad/7th compact within one octave. Good for intimate, pop-style piano.";
    case Voicing.OPEN:
      return "Use Open Voicing: Spread notes across 1.5 to 2 octaves. Avoid intervals smaller than a 5th in the bass register.";
    case Voicing.CINEMATIC:
      // Based on PDF Page 15 "Better (according to me)" styling
      return "Use 'Red Bow Cinematic' Voicing: Create a massive, full sound. Double the Root in the bass (e.g., C1 + C2). Place the 5th in the lower-mid range. Place the 3rd and extensions in the upper-mid range (C3+). This creates clarity and power.";
    case Voicing.SHELL:
      return "Use Shell Voicings: Play only the Root, 3rd, and 7th. Omit the 5th unless essential for alteration. Good for jazz/neo-soul to leave space.";
    default:
      return "Standard piano voicing.";
  }
};

const getInversionInstruction = (inversion: Inversion): string => {
  switch (inversion) {
    case Inversion.ROOT:
      return "Strictly use Root Position for all chords (Root in the bass). This creates a solid, stable sound.";
    case Inversion.FIRST:
      return "Prioritize 1st Inversion chords (3rd in the bass) where possible to create a smoother, more melodic bassline.";
    case Inversion.SECOND:
      return "Use 2nd Inversion chords (5th in the bass) frequently to create instability and forward momentum.";
    case Inversion.MIXED:
      return "Freely mix inversions to maximize smooth voice leading. The bass line should move stepwise as much as possible.";
    default:
      return "Balance stability and voice leading.";
  }
};

const getMelodyInstruction = (style: MelodyStyle): string => {
  switch (style) {
    case MelodyStyle.HOMOPHONIC:
      return "Generate a 'Homophonic' melody: Create a clear, dominant top line that moves in rhythmic lock-step with the underlying harmony. The melody should be the primary focus, supported directly by the chords.";
    case MelodyStyle.CHORD_TONE:
      return "Generate a 'Vertical/Chord Tone' melody: Strictly prioritize notes that exist within the current chord (Root, 3rd, 5th, 7th). Outline the harmony clearly. This creates a very stable, consonant sound.";
    case MelodyStyle.STEPWISE:
      return "Generate a 'Stepwise/Conjunct' melody: Move primarily by whole steps or half steps (seconds). Avoid large leaps. Create a smooth, connected ribbon of sound that weaves through the changes.";
    case MelodyStyle.DISJUNCT:
      return "Generate a 'Disjunct/Leaping' melody: Use larger intervals (4ths, 5ths, 6ths, octaves) frequently. These leaps should highlight emotional chord tones or add dramatic flair.";
    case MelodyStyle.ARPEGGIATED:
      return "Generate an 'Arpeggiated' melody: Break the current chord into individual notes played in sequence (up or down). Use this to create a flowing, harplike texture over the harmony.";
    case MelodyStyle.SEQUENCED:
      return "Generate a 'Sequenced' melody: Establish a short melodic shape (motif) in the first bar, and then repeat that exact same contour (transposed to fit the new chord) in subsequent bars.";
    case MelodyStyle.LYRICAL:
      return "Generate a 'Lyrical' melody: Use sustained notes, stepwise motion, and emotional interval leaps (e.g., minor 6ths). Focus on singability.";
    case MelodyStyle.RHYTHMIC:
      return "Generate a 'Rhythmic' melody: Use short, repetitive motifs with syncopation. Create a hooky, rhythmic pattern.";
    case MelodyStyle.MINIMAL:
      return "Generate a 'Minimal' melody: Use very few notes (1-2 per chord). Focus on adding color tones (9ths, 11ths) sparingly. Let the chords breathe.";
    case MelodyStyle.FLOWING:
      return "Generate a 'Flowing' melody: Use continuous 8th note runs or arpeggiated figures that weave through the harmony. Maintain momentum.";
    case MelodyStyle.ASCENDING:
       return "Generate an 'Ascending' melody: Ensure the melodic contour generally rises throughout the progression to build tension or hope. Start low, end high.";
    case MelodyStyle.DESCENDING:
       return "Generate a 'Descending' melody: Ensure the melodic contour generally falls, creating a sense of sadness, resignation, or resolution. Start high, end low.";
    case MelodyStyle.MOTIVIC:
       return "Generate a 'Motivic' melody: Create a very distinct, memorable 3-4 note shape that repeats (possibly sequenced) over every chord to establish a main theme.";
    case MelodyStyle.CALL_AND_RESPONSE:
       return "Generate a 'Call and Response' melody: Alternating phrasing. Bar 1 acts as a 'Question' (ending on unstable note), Bar 2 as an 'Answer' (resolving). Repeat pattern.";
    default:
      return "Generate a singable top-line melody.";
  }
}

export const generateProgression = async (
  moods: (Mood | string)[], 
  additionalContext: string, 
  chordCount: number = 4,
  complexity: Complexity = Complexity.EXTENDED,
  voicing: Voicing = Voicing.CINEMATIC,
  inversion: Inversion = Inversion.MIXED,
  melodyStyle: MelodyStyle = MelodyStyle.LYRICAL,
  targetKey: string = "Auto",
  targetBpm: string = "Auto"
): Promise<Progression> => {
  
  const complexityPrompt = getComplexityInstruction(complexity);
  const voicingPrompt = getVoicingInstruction(voicing);
  const inversionPrompt = getInversionInstruction(inversion);
  const melodyPrompt = getMelodyInstruction(melodyStyle);
  const moodString = moods.join(' + ');
  
  let keyInstruction = 'If the mood implies "Sad", "Lyrical", or "Epic", prefer a **Minor Key**.';
  if (targetKey !== "Auto") {
    keyInstruction = `Strictly use the key of **${targetKey}**.`;
  }

  let bpmInstruction = "";
  if (targetBpm !== "Auto") {
    bpmInstruction = `Strictly use a tempo of **${targetBpm} BPM**.`;
  }

  const prompt = `
    Create a high-quality, realistic piano chord progression based on the following theory constraints.
    
    **Parameters:**
    - Mood/Genre: "${moodString}"
    - Context: "${additionalContext}"
    - Length: ${chordCount} chords
    - Harmony Complexity: ${complexityPrompt}
    - Voicing Style: ${voicingPrompt}
    - Inversion Strategy: ${inversionPrompt}
    ${bpmInstruction}
    
    **Theory Requirements:**
    - ${keyInstruction}
    - If in Minor, use the **Harmonic Minor** scale (raise the 7th scale degree) for the V chord to make it Major.
    - Apply **Hyper-meter**: Ensure the chord on beat 1 (Bar 1) and beat 1 (Bar 3) feels stable/strong.
    - Ensure strictly Valid MIDI note names (e.g., C#3, Bb4).
    - **MELODY**: ${melodyPrompt} (in 'melodyNotes').
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "A creative title for this cue" },
            description: { type: Type.STRING, description: "Brief emotional description" },
            theoryAnalysis: { 
              type: Type.OBJECT,
              properties: {
                summary: { type: Type.STRING, description: "General harmonic analysis" },
                voiceLeading: { type: Type.STRING, description: "Specific details on interval movement between voices and bass line motion" },
                hyperMeter: { type: Type.STRING, description: "Analysis of adherence to strong/weak bars (1&3 vs 2&4)" }
              },
              required: ["summary", "voiceLeading", "hyperMeter"]
            },
            bpm: { type: Type.NUMBER, description: "Recommended tempo" },
            key: { type: Type.STRING, description: "Tonal center (e.g. C Minor)" },
            chords: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Chord symbol (e.g. Cm9)" },
                  roman: { type: Type.STRING, description: "Roman numeral analysis (e.g. i, V7)" },
                  notes: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING },
                    description: "Array of specific notes for the chord voicing" 
                  },
                  melodyNotes: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Array of notes for the top-line melody/motif during this chord"
                  },
                  duration: { type: Type.NUMBER, description: "Duration in beats (usually 4)" },
                  description: { type: Type.STRING, description: "Emotional function of this chord" }
                },
                required: ["name", "notes", "melodyNotes", "duration", "description", "roman"]
              }
            }
          },
          required: ["title", "description", "bpm", "key", "chords", "theoryAnalysis"]
        }
      }
    });

    if (!response.text) {
      throw new Error("No response from Gemini");
    }

    return JSON.parse(response.text) as Progression;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const generateMelodyOverlay = async (
  chords: ChordData[],
  moods: (Mood | string)[],
  style: MelodyStyle,
  context: string = ""
): Promise<string[][]> => {
  const melodyPrompt = getMelodyInstruction(style);
  const moodString = moods.join(' + ');

  // Create a simplified representation of chords for the prompt
  const chordProgressionInfo = chords.map((c, i) => 
    `Chord ${i+1}: ${c.name} (${c.duration} beats) - Notes: ${c.notes.join(', ')}`
  ).join('\n');

  const prompt = `
    I have an existing chord progression. I need you to compose a new top-line melody for it.
    
    **Context:**
    - Mood: ${moodString}
    - Scenario: ${context}
    - Melody Style: ${melodyPrompt}

    **The Progression:**
    ${chordProgressionInfo}

    **Task:**
    Generate a 'melodyNotes' array for EACH chord in the sequence.
    The melody must fit the chord tones and scale, and follow the requested style.
    Return ONLY the arrays of notes.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            melodies: {
              type: Type.ARRAY,
              items: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Array of notes (e.g. C5, D5) for this chord step"
              }
            }
          },
          required: ["melodies"]
        }
      }
    });

    if (!response.text) {
      throw new Error("No response from Gemini");
    }

    const result = JSON.parse(response.text);
    return result.melodies as string[][];

  } catch (error) {
    console.error("Melody Generation Error:", error);
    throw error;
  }
}