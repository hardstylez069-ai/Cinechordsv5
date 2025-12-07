import React, { useState, useEffect, useRef } from 'react';
import { 
  Music, Play, Square, Loader2, Sparkles, Wand2, 
  Volume2, Download, ListMusic, Plus, Trash2, GripHorizontal,
  Settings2, BookOpen, ChevronUp, ChevronDown, Repeat, Clock, Minus,
  Shuffle, Zap, Library, RefreshCw, Piano
} from 'lucide-react';
import { Mood, Progression, AudioState, ChordData, Complexity, Voicing, Inversion, MelodyStyle } from './types';
import { MOOD_PRESETS, INITIAL_PROGRESSION, PROGRESSION_TEMPLATES, AVAILABLE_INSTRUMENTS } from './constants';
import { generateProgression, generateMelodyOverlay } from './services/geminiService';
import { audioService } from './services/audioService';
import { generateMidiBlob } from './services/midiService';
import { transposeProgression } from './utils/musicTheory';
import { ChordCard } from './components/ChordCard';

// Context Helpers - Zimmer Edition
const SCENARIO_PRESETS = [
  "Interstellar Docking", "Dream Collapsing", "Desert Power",
  "Batmobile Chase", "Gladiator Arena", "Code Breaking",
  "Superhero Flight", "Sinking Ship", "Time Running Out"
];

const STYLE_MODIFIERS = [
  "Shepard Tone", "Tick-Tock Rhythm", "Wall of Sound",
  "Braaam Horns", "Minimalist Arps", "Choral", "Distorted Cello"
];

const App: React.FC = () => {
  const [progression, setProgression] = useState<Progression>(INITIAL_PROGRESSION);
  const [selectedMoods, setSelectedMoods] = useState<Mood[]>([]);
  const [customContext, setCustomContext] = useState('');
  
  // Generation Params
  const [chordCount, setChordCount] = useState<number>(4);
  const [selectedComplexity, setSelectedComplexity] = useState<Complexity>(Complexity.EXTENDED);
  const [selectedVoicing, setSelectedVoicing] = useState<Voicing>(Voicing.CINEMATIC);
  const [selectedInversion, setSelectedInversion] = useState<Inversion>(Inversion.MIXED);
  const [selectedMelodyStyle, setSelectedMelodyStyle] = useState<MelodyStyle>(MelodyStyle.LYRICAL);
  const [targetKey, setTargetKey] = useState<string>("Auto");
  const [targetBpm, setTargetBpm] = useState<string>("Auto");
  
  const [isLoading, setIsLoading] = useState(false);
  const [isMelodyLoading, setIsMelodyLoading] = useState(false);
  const [isMainMelodyLoading, setIsMainMelodyLoading] = useState(false);

  // Audio Params
  const [selectedInstrument, setSelectedInstrument] = useState<string>(AVAILABLE_INSTRUMENTS[0].id);
  const [masterVolume, setMasterVolume] = useState<number>(-10); // Default -10 dB

  // Custom Sequencer State
  const [customSequence, setCustomSequence] = useState<ChordData[]>([]);
  
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    currentChordIndex: -1,
    isReady: false,
    playingSource: null
  });

  // Refs for playback management
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Initialize Audio
  const initAudio = async () => {
    await audioService.initialize();
    audioService.setVolume(masterVolume); // Ensure initial volume is set
    setAudioState(prev => ({ ...prev, isReady: true }));
  };

  const toggleMood = (mood: Mood) => {
    setSelectedMoods(prev => 
      prev.includes(mood) 
        ? prev.filter(m => m !== mood) 
        : [...prev, mood]
    );
  };

  const addContext = (text: string) => {
    setCustomContext(prev => {
      if (!prev) return text;
      if (prev.toLowerCase().includes(text.toLowerCase())) return prev;
      return `${prev}, ${text}`;
    });
  };

  const handleRandomContext = () => {
    const randomScenario = SCENARIO_PRESETS[Math.floor(Math.random() * SCENARIO_PRESETS.length)];
    const randomModifier = STYLE_MODIFIERS[Math.floor(Math.random() * STYLE_MODIFIERS.length)];
    setCustomContext(`${randomScenario}, ${randomModifier}`);
  };

  const loadTemplate = (indexStr: string) => {
    const index = parseInt(indexStr);
    if (!isNaN(index) && PROGRESSION_TEMPLATES[index]) {
      const template = PROGRESSION_TEMPLATES[index];
      // Deep copy to ensure we don't mutate the constant if we edit it later
      setProgression(JSON.parse(JSON.stringify(template)));
      setAudioState(prev => ({ ...prev, currentChordIndex: -1, playingSource: null }));
      stopPlayback();
    }
  };

  const handleGenerate = async () => {
    if (selectedMoods.length === 0 && !customContext) return;
    setIsLoading(true);
    stopPlayback();

    try {
      const moodsToUse = selectedMoods.length > 0 ? selectedMoods : ["Cinematic Custom"];
      const result = await generateProgression(
        moodsToUse, 
        customContext, 
        chordCount, 
        selectedComplexity, 
        selectedVoicing, 
        selectedInversion,
        selectedMelodyStyle,
        targetKey,
        targetBpm
      );
      setProgression(result);
      setAudioState(prev => ({ ...prev, currentChordIndex: -1, playingSource: null }));
    } catch (err) {
      console.error("Failed to generate", err);
      alert("Something went wrong while composing. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateMainMelody = async () => {
    if (!progression.chords || progression.chords.length === 0) return;
    setIsMainMelodyLoading(true);
    stopPlayback();

    try {
      const moodsToUse = selectedMoods.length > 0 ? selectedMoods : ["Cinematic Custom"];
      const melodies = await generateMelodyOverlay(
        progression.chords,
        moodsToUse,
        selectedMelodyStyle,
        customContext
      );

      const updatedChords = progression.chords.map((chord, i) => ({
        ...chord,
        melodyNotes: melodies[i] || []
      }));
      
      setProgression(prev => ({
        ...prev,
        chords: updatedChords
      }));

    } catch (err) {
      console.error("Failed to regen melody", err);
      alert("Failed to compose new melody.");
    } finally {
      setIsMainMelodyLoading(false);
    }
  };

  const handleGenerateSequenceMelody = async () => {
    if (customSequence.length === 0) return;
    setIsMelodyLoading(true);
    stopPlayback();

    try {
      const moodsToUse = selectedMoods.length > 0 ? selectedMoods : ["Cinematic Custom"];
      const melodies = await generateMelodyOverlay(
        customSequence,
        moodsToUse,
        selectedMelodyStyle,
        customContext
      );

      // Apply new melodies to custom sequence
      const updatedSequence = customSequence.map((chord, i) => ({
        ...chord,
        melodyNotes: melodies[i] || []
      }));
      setCustomSequence(updatedSequence);

    } catch (err) {
      console.error("Failed to generate melody", err);
      alert("Failed to compose melody for the sequence.");
    } finally {
      setIsMelodyLoading(false);
    }
  };

  const handleInstrumentChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
     const newInstrument = e.target.value;
     setSelectedInstrument(newInstrument);
     if (audioState.isReady) {
       await audioService.setInstrument(newInstrument);
     }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const vol = parseFloat(e.target.value);
     setMasterVolume(vol);
     audioService.setVolume(vol);
  };

  const playSequence = async (chords: ChordData[], source: 'main' | 'custom') => {
    if (!audioState.isReady) await initAudio();
    // Ensure the selected instrument is active before playing
    await audioService.setInstrument(selectedInstrument);

    // If currently playing, stop.
    if (audioState.isPlaying) {
      stopPlayback();
      // If we clicked the same button that was playing, just stop.
      if (audioState.playingSource === source) return; 
    }

    setAudioState(prev => ({ 
      ...prev, 
      isPlaying: true, 
      currentChordIndex: 0,
      playingSource: source 
    }));

    let accumulatedTime = 0;
    
    // Schedule visualization updates
    chords.forEach((chord, index) => {
      // Always use current progression BPM for playback
      const durationSeconds = audioService.getBpmDuration(progression.bpm, chord.duration);
      
      // Schedule the UI update
      const timeoutId = setTimeout(() => {
        setAudioState(prev => ({ ...prev, currentChordIndex: index }));
        audioService.playChord(chord, durationSeconds);
      }, accumulatedTime * 1000);
      
      timeoutsRef.current.push(timeoutId);
      accumulatedTime += durationSeconds;
    });

    // Schedule finish
    const finishId = setTimeout(() => {
      stopPlayback();
    }, accumulatedTime * 1000);
    timeoutsRef.current.push(finishId);
  };

  const playSingleChord = async (index: number, source: 'main' | 'custom') => {
    if (!audioState.isReady) await initAudio();
    await audioService.setInstrument(selectedInstrument);

    if (audioState.isPlaying) stopPlayback();

    const chord = source === 'main' ? progression.chords[index] : customSequence[index];
    
    setAudioState(prev => ({ 
      ...prev, 
      currentChordIndex: index,
      playingSource: source 
    }));
    
    audioService.playChord(chord, 2); 
    
    setTimeout(() => {
       setAudioState(prev => ({ ...prev, currentChordIndex: -1, playingSource: null }));
    }, 2000);
  };

  const stopPlayback = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    audioService.stopAll();
    setAudioState(prev => ({ 
      ...prev, 
      isPlaying: false, 
      currentChordIndex: -1,
      playingSource: null 
    }));
  };

  // --- Live Adjustments ---
  const handleTranspose = (semitones: number) => {
    const newProgression = transposeProgression(progression, semitones);
    setProgression(newProgression);
  };

  const handleBpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBpm = parseInt(e.target.value, 10);
    setProgression(prev => ({ ...prev, bpm: newBpm }));
  };

  const updateChordDuration = (index: number, newDuration: number) => {
    const updatedChords = [...progression.chords];
    updatedChords[index] = { ...updatedChords[index], duration: newDuration };
    setProgression(prev => ({ ...prev, chords: updatedChords }));
    if (audioState.isPlaying) stopPlayback();
  };

  const updateCustomChordDuration = (index: number, newDuration: number) => {
    const updatedSequence = [...customSequence];
    updatedSequence[index] = { ...updatedSequence[index], duration: newDuration };
    setCustomSequence(updatedSequence);
    if (audioState.isPlaying) stopPlayback();
  };

  // --- Drag and Drop Handlers ---
  const handleDragStart = (e: React.DragEvent, chord: ChordData) => {
    // We send the chord data as a JSON string
    e.dataTransfer.setData("application/json", JSON.stringify(chord));
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("application/json");
    if (data) {
      try {
        const chord = JSON.parse(data) as ChordData;
        setCustomSequence(prev => [...prev, chord]);
      } catch (err) {
        console.error("Failed to parse dropped chord", err);
      }
    }
  };

  const removeFromSequence = (indexToRemove: number) => {
    setCustomSequence(prev => prev.filter((_, i) => i !== indexToRemove));
    if (audioState.playingSource === 'custom' && audioState.isPlaying) {
      stopPlayback();
    }
  };

  const handleExportMidi = (chords: ChordData[], filename: string) => {
    const tempProgression: Progression = {
      ...progression,
      title: filename,
      chords: chords
    };
    
    const blob = generateMidiBlob(tempProgression);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mid`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => stopPlayback();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col font-sans selection:bg-amber-500/30">
      
      {/* Hero Header */}
      <header className="pt-10 pb-6 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-4">
             <Music className="w-8 h-8 text-amber-500" />
             <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 tracking-tight cinematic-font">
               CINECHORDS
             </h1>
          </div>
          <p className="text-slate-400 max-w-lg mx-auto text-lg">
            AI-powered cinematic chord progression generator.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 pb-20">
        
        {/* Controls Section */}
        <section className="mb-10">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              
              {/* Mood Selection (Left - 6 cols) */}
              <div className="md:col-span-6">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-amber-500" /> Choose Mood(s)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {MOOD_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => toggleMood(preset.id)}
                      className={`
                        px-2 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 border
                        ${selectedMoods.includes(preset.id) 
                          ? 'bg-amber-500 text-slate-900 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]' 
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-200'}
                      `}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Middle Column: Sonic Profile (3 cols) */}
              <div className="md:col-span-3 flex flex-col space-y-4">
                
                {/* Length & Melody Style Selector */}
                <div className="flex gap-2">
                   <div className="w-1/3">
                      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                        Length
                      </h3>
                      <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700 w-full">
                        <button onClick={() => setChordCount(4)} className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${chordCount === 4 ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>4</button>
                        <button onClick={() => setChordCount(8)} className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${chordCount === 8 ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>8</button>
                      </div>
                   </div>
                   <div className="w-2/3">
                      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 text-emerald-500">
                        Melody Style
                      </h3>
                      <select
                        value={selectedMelodyStyle}
                        onChange={(e) => setSelectedMelodyStyle(e.target.value as MelodyStyle)}
                        className="w-full bg-slate-800 border border-emerald-500/30 text-emerald-400 text-xs rounded-lg p-2 focus:border-emerald-500 outline-none"
                      >
                        {Object.values(MelodyStyle).map((val) => (
                          <option key={val} value={val}>{val.split(' (')[0]}</option>
                        ))}
                      </select>
                   </div>
                </div>

                {/* Voicing Selector */}
                <div>
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                    Voicing
                  </h3>
                  <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700 w-full">
                    {Object.values(Voicing).map((val) => {
                      const label = val.split(' ')[0];
                      const isSelected = selectedVoicing === val;
                      return (
                        <button
                          key={val}
                          onClick={() => setSelectedVoicing(val)}
                          className={`flex-1 py-1.5 rounded-md text-[10px] font-medium transition-all truncate px-1
                            ${isSelected ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}
                          `}
                          title={val}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Complexity & Inversion (Split Row) */}
                <div className="flex gap-2">
                  <div className="flex-1">
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                      Complexity
                    </h3>
                    <select
                      value={selectedComplexity}
                      onChange={(e) => setSelectedComplexity(e.target.value as Complexity)}
                      className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg p-2"
                    >
                      {Object.values(Complexity).map((val) => (
                        <option key={val} value={val}>{val.split(' ')[0]}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                      Inversion
                    </h3>
                    <select
                      value={selectedInversion}
                      onChange={(e) => setSelectedInversion(e.target.value as Inversion)}
                      className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg p-2"
                    >
                      {Object.values(Inversion).map((val) => (
                        <option key={val} value={val}>{val}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Key & BPM Targets */}
                <div className="flex gap-2">
                  <div className="flex-1">
                     <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                       Target Key
                     </h3>
                     <select
                        value={targetKey}
                        onChange={(e) => setTargetKey(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg p-2"
                     >
                       <option value="Auto">Auto</option>
                       <option value="C Minor">C Minor</option>
                       <option value="C Major">C Major</option>
                       <option value="D Minor">D Minor</option>
                       <option value="F Minor">F Minor</option>
                       <option value="G Minor">G Minor</option>
                       <option value="A Minor">A Minor</option>
                       <option value="Eb Major">Eb Major</option>
                     </select>
                  </div>
                  <div className="flex-1">
                     <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                       Target BPM
                     </h3>
                     <select
                        value={targetBpm}
                        onChange={(e) => setTargetBpm(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg p-2"
                     >
                       <option value="Auto">Auto</option>
                       <option value="60">60 (Slow)</option>
                       <option value="80">80 (Medium)</option>
                       <option value="120">120 (Fast)</option>
                       <option value="140">140 (Action)</option>
                     </select>
                  </div>
                </div>

              </div>

              {/* Right Column: Context & Templates (3 cols) */}
              <div className="md:col-span-3 flex flex-col h-full">
                
                {/* Template Selector */}
                <div className="mb-4 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                   <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block flex items-center gap-2">
                      <Library className="w-3 h-3 text-amber-500" /> Start with Template
                   </label>
                   <select 
                      onChange={(e) => loadTemplate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-xs rounded-md p-2 text-slate-300 outline-none focus:border-amber-500"
                      value=""
                   >
                      <option value="" disabled>Select a progression...</option>
                      {PROGRESSION_TEMPLATES.map((t, i) => (
                         <option key={i} value={i}>{t.title}</option>
                      ))}
                   </select>
                </div>

                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Wand2 className="w-3 h-3 text-amber-500" /> Narrative Context
                    </h3>
                    <div className="flex gap-1">
                        <button onClick={handleRandomContext} title="Random Idea" className="p-1.5 text-slate-500 hover:text-amber-500 hover:bg-slate-800 rounded-md transition-colors">
                            <Shuffle className="w-3 h-3" />
                        </button>
                        {customContext && (
                            <button onClick={() => setCustomContext('')} title="Clear" className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-md transition-colors">
                                <Trash2 className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                </div>

                <textarea
                  value={customContext}
                  onChange={(e) => setCustomContext(e.target.value)}
                  placeholder="Describe the scene..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all mb-3 min-h-[80px]"
                  rows={3}
                />

                <div className="flex-1 space-y-3 overflow-y-auto pr-1 custom-scrollbar">
                  <div>
                    <span className="text-[10px] font-bold text-slate-600 uppercase mb-2 block">Quick Scenarios</span>
                    <div className="flex flex-wrap gap-1.5">
                      {SCENARIO_PRESETS.map(s => (
                        <button 
                          key={s} 
                          onClick={() => addContext(s)}
                          className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-400 hover:bg-slate-700 hover:text-slate-200 hover:border-slate-600 transition-all"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-[10px] font-bold text-slate-600 uppercase mb-2 block">Modifiers</span>
                    <div className="flex flex-wrap gap-1.5">
                      {STYLE_MODIFIERS.map(m => (
                        <button 
                          key={m} 
                          onClick={() => addContext(m)}
                          className="px-2 py-1 rounded-full bg-slate-800/50 border border-slate-700/50 text-[10px] text-emerald-500/70 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
                        >
                          + {m}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleGenerate}
                disabled={isLoading || (selectedMoods.length === 0 && !customContext)}
                className={`
                  relative overflow-hidden group px-12 py-3 rounded-full font-bold text-sm tracking-widest transition-all duration-300
                  ${isLoading || (selectedMoods.length === 0 && !customContext) 
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg hover:shadow-amber-500/25 hover:scale-105'}
                `}
              >
                <div className="flex items-center gap-3">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      COMPOSING...
                    </>
                  ) : (
                    <>
                      GENERATE PROGRESSION
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="space-y-8">
          
          {/* Generated Chords Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                {/* Key with Transpose */}
                <div className="flex items-center bg-slate-800 border border-slate-700 rounded-md overflow-hidden">
                   <button onClick={() => handleTranspose(-1)} className="px-1.5 hover:bg-slate-700 text-slate-400">
                     <ChevronDown className="w-3 h-3" />
                   </button>
                   <span className="px-2 py-0.5 text-[10px] font-mono text-amber-500 uppercase min-w-[3rem] text-center border-l border-r border-slate-700">
                     {progression.key}
                   </span>
                   <button onClick={() => handleTranspose(1)} className="px-1.5 hover:bg-slate-700 text-slate-400">
                     <ChevronUp className="w-3 h-3" />
                   </button>
                </div>

                {/* Live BPM Slider */}
                <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-md px-2 py-0.5">
                  <span className="text-[10px] font-mono text-slate-400 w-12">{progression.bpm} BPM</span>
                  <input 
                    type="range" 
                    min="40" 
                    max="200" 
                    value={progression.bpm} 
                    onChange={handleBpmChange}
                    className="w-16 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                </div>

                {/* Instrument Selector & Volume */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-md px-2 py-0.5">
                    <Piano className="w-3 h-3 text-emerald-500" />
                    <select 
                      value={selectedInstrument}
                      onChange={handleInstrumentChange}
                      className="bg-transparent text-[10px] font-mono text-emerald-400 outline-none w-24 cursor-pointer"
                    >
                      {AVAILABLE_INSTRUMENTS.map(inst => (
                        <option key={inst.id} value={inst.id}>{inst.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Volume Slider */}
                  <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-md px-2 py-0.5">
                    <Volume2 className="w-3 h-3 text-slate-400" />
                    <input
                      type="range"
                      min="-40"
                      max="0"
                      step="1"
                      value={masterVolume}
                      onChange={handleVolumeChange}
                      className="w-16 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-slate-400 hover:accent-amber-500"
                      title={`Volume: ${masterVolume}dB`}
                    />
                  </div>
                </div>

                <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-500">
                  {selectedComplexity.split(' ')[0]}
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-emerald-500 border-emerald-500/30">
                  {selectedMelodyStyle.split(' ')[0]}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white cinematic-font mb-1">{progression.title}</h2>
              <p className="text-slate-400 text-sm max-w-2xl">{progression.description}</p>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={handleRegenerateMainMelody}
                disabled={isMainMelodyLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/20"
                title={`Regenerate melody using ${selectedMelodyStyle}`}
              >
                {isMainMelodyLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                NEW MELODY
              </button>
              <button 
                onClick={() => handleExportMidi(progression.chords, progression.title)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-slate-600"
              >
                <Download className="w-4 h-4" />
                MIDI
              </button>
              <button 
                onClick={() => playSequence(progression.chords, 'main')}
                className={`
                  flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all
                  ${audioState.isPlaying && audioState.playingSource === 'main'
                    ? 'bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500/20' 
                    : 'bg-amber-500 text-slate-900 hover:bg-amber-400 shadow-lg shadow-amber-900/20'}
                `}
              >
                {audioState.isPlaying && audioState.playingSource === 'main' ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                {audioState.isPlaying && audioState.playingSource === 'main' ? 'STOP' : 'PLAY'}
              </button>
            </div>
          </div>

          {/* Theory Insight Box */}
          {progression.theoryAnalysis && (
            <div className="bg-slate-900/40 border-l-2 border-amber-500/50 p-5 rounded-r-lg mb-6 space-y-4">
              <div className="flex items-center gap-2 text-amber-500/90 text-xs font-bold uppercase tracking-wider">
                <BookOpen className="w-3 h-3" />
                Producer's Theory Corner
              </div>
              
              <div>
                 <p className="text-slate-300 text-sm font-semibold mb-1">Harmonic Overview</p>
                 <p className="text-slate-400 text-sm leading-relaxed">{progression.theoryAnalysis.summary}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800/40 p-4 rounded-lg border border-slate-700/50">
                   <p className="text-emerald-400 text-xs font-bold uppercase mb-2">Voice Leading & Bass</p>
                   <p className="text-slate-400 text-xs leading-relaxed">{progression.theoryAnalysis.voiceLeading}</p>
                </div>
                <div className="bg-slate-800/40 p-4 rounded-lg border border-slate-700/50">
                   <p className="text-blue-400 text-xs font-bold uppercase mb-2">Hyper-Meter & Structure</p>
                   <p className="text-slate-400 text-xs leading-relaxed">{progression.theoryAnalysis.hyperMeter}</p>
                </div>
              </div>
            </div>
          )}

          {/* Draggable Chords Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {progression.chords.map((chord, index) => (
              <ChordCard
                key={`${chord.name}-${index}-generated`}
                chord={chord}
                index={index}
                isActive={audioState.currentChordIndex === index && audioState.playingSource === 'main'}
                isPlaying={audioState.isPlaying}
                onClick={() => playSingleChord(index, 'main')}
                onDragStart={handleDragStart}
                onDurationChange={(newDur) => updateChordDuration(index, newDur)}
              />
            ))}
          </div>
          
          <div className="text-center text-xs text-slate-600 flex items-center justify-center gap-2">
             <GripHorizontal className="w-4 h-4" />
             <span>Drag chords from above into the sequencer below</span>
          </div>

          {/* PATTERN SEQUENCER */}
          <div className="mt-12 pt-8 border-t border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-200 cinematic-font flex items-center gap-3">
                <ListMusic className="text-amber-500 w-5 h-5" />
                PATTERN SEQUENCER
              </h3>
              
              <div className="flex gap-2">
                {customSequence.length > 0 && (
                   <>
                    <button 
                      onClick={handleGenerateSequenceMelody}
                      disabled={isMelodyLoading}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/20 transition-all"
                    >
                      {isMelodyLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                      GEN MELODY
                    </button>
                    <div className="w-[1px] bg-slate-800 mx-1"></div>
                    <button 
                      onClick={() => setCustomSequence([])}
                      className="px-3 py-2 rounded-lg text-xs font-bold text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      CLEAR
                    </button>
                    <button 
                      onClick={() => handleExportMidi(customSequence, "My Custom Sequence")}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700"
                    >
                      <Download className="w-3 h-3" />
                      MIDI
                    </button>
                    <button 
                      onClick={() => playSequence(customSequence, 'custom')}
                      className={`
                        flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all
                        ${audioState.isPlaying && audioState.playingSource === 'custom'
                          ? 'bg-red-500/10 text-red-500 border border-red-500/50' 
                          : 'bg-emerald-500 text-slate-900 hover:bg-emerald-400 shadow-lg shadow-emerald-900/20'}
                      `}
                    >
                      {audioState.isPlaying && audioState.playingSource === 'custom' ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                      {audioState.isPlaying && audioState.playingSource === 'custom' ? 'STOP SEQ' : 'PLAY SEQ'}
                    </button>
                   </>
                )}
              </div>
            </div>

            {/* Drop Zone */}
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`
                min-h-[160px] rounded-xl border-2 border-dashed transition-all duration-300 flex items-center
                ${customSequence.length === 0 
                  ? 'border-slate-800 bg-slate-900/30 justify-center' 
                  : 'border-slate-700 bg-slate-900/50 p-4 justify-start overflow-x-auto'}
              `}
            >
              {customSequence.length === 0 ? (
                <div className="text-center text-slate-600 pointer-events-none">
                  <Plus className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-medium">Drag chords here to build your sequence</p>
                </div>
              ) : (
                <div className="flex gap-3">
                  {customSequence.map((chord, i) => {
                    const isActive = audioState.currentChordIndex === i && audioState.playingSource === 'custom';
                    return (
                      <div 
                        key={`${chord.name}-${i}-custom`}
                        onClick={() => playSingleChord(i, 'custom')}
                        className={`
                          relative flex-shrink-0 w-32 p-3 rounded-lg border cursor-pointer group transition-all duration-200
                          ${isActive 
                            ? 'bg-slate-800 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] translate-y-[-2px]' 
                            : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800 hover:border-slate-600'}
                        `}
                      >
                         {/* Remove Button */}
                         <button 
                           onClick={(e) => {
                             e.stopPropagation();
                             removeFromSequence(i);
                           }}
                           className="absolute -top-2 -right-2 bg-slate-900 text-slate-500 hover:text-red-500 rounded-full p-1 border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                         >
                           <Trash2 className="w-3 h-3" />
                         </button>

                         <div className="text-[10px] text-slate-500 mb-1 font-mono">STEP {i + 1}</div>
                         <div className={`text-lg font-bold cinematic-font ${isActive ? 'text-emerald-400' : 'text-slate-200'}`}>
                           {chord.name}
                         </div>
                         <div className="text-[10px] text-slate-500 truncate mb-1">{chord.roman}</div>
                         
                         {/* Sequencer Duration Control */}
                         <div className="flex items-center gap-1 mt-2 bg-slate-900/50 rounded p-1 border border-slate-700/50 justify-center" onClick={(e) => e.stopPropagation()}>
                           <button 
                             onClick={(e) => { e.stopPropagation(); updateCustomChordDuration(i, Math.max(1, chord.duration - 1)); }}
                             className="text-slate-400 hover:text-amber-500 disabled:opacity-30"
                             disabled={chord.duration <= 1}
                           >
                             <Minus className="w-3 h-3" />
                           </button>
                           <span className="text-[10px] font-mono w-4 text-center">{chord.duration}b</span>
                           <button 
                             onClick={(e) => { e.stopPropagation(); updateCustomChordDuration(i, chord.duration + 1); }}
                             className="text-slate-400 hover:text-amber-500"
                           >
                             <Plus className="w-3 h-3" />
                           </button>
                         </div>
                         
                         {/* Active Bar */}
                         {isActive && (
                           <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 rounded-b-lg"></div>
                         )}
                      </div>
                    )
                  })}
                  
                  {/* Drop Target Hint at the end */}
                  <div className="w-32 flex-shrink-0 border-2 border-dashed border-slate-800 rounded-lg flex items-center justify-center text-slate-700">
                     <Plus className="w-5 h-5" />
                  </div>
                </div>
              )}
            </div>
          </div>

        </section>
      </main>

      <footer className="py-8 text-center text-slate-600 text-sm border-t border-slate-900">
        <p>CineChords © {new Date().getFullYear()} • Powered by Gemini 2.5 Flash & Tone.js</p>
      </footer>
    </div>
  );
};

export default App;