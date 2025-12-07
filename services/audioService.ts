import * as Tone from 'tone';
import { ChordData } from '../types';

export class AudioEngine {
  private instruments: Map<string, Tone.Instrument<any>> = new Map();
  private currentInstrumentId: string = 'grand-piano';
  private reverb: Tone.Reverb | null = null;
  private isInitialized = false;

  constructor() {}

  async initialize() {
    if (this.isInitialized) return;
    await Tone.start();

    // Reverb
    this.reverb = new Tone.Reverb({
      decay: 4, // Slightly longer for cinematic feel
      preDelay: 0.01,
      wet: 0.3
    }).toDestination();

    // Load Default (Grand Piano)
    await this.createInstrument('grand-piano');
    
    this.isInitialized = true;
  }

  setVolume(db: number) {
    if (!this.isInitialized) return;
    // Tone.Destination handles the master output
    Tone.Destination.volume.rampTo(db, 0.1);
  }

  async setInstrument(id: string) {
     if (!this.isInitialized) return;
     if (this.currentInstrumentId === id && this.instruments.has(id)) return;

     if (!this.instruments.has(id)) {
        await this.createInstrument(id);
     }
     this.currentInstrumentId = id;
  }

  private async createInstrument(id: string) {
     if (this.instruments.has(id)) return;

     let inst: Tone.Instrument<any> | null = null;
     const commonPoly = { maxPolyphony: 32 };

     if (id === 'grand-piano' || id === 'felt-piano') {
        const sampler = new Tone.Sampler({
          urls: {
            "A0": "A0.mp3",
            "C1": "C1.mp3",
            "D#1": "Ds1.mp3",
            "F#1": "Fs1.mp3",
            "A1": "A1.mp3",
            "C2": "C2.mp3",
            "D#2": "Ds2.mp3",
            "F#2": "Fs2.mp3",
            "A2": "A2.mp3",
            "C3": "C3.mp3",
            "D#3": "Ds3.mp3",
            "F#3": "Fs3.mp3",
            "A3": "A3.mp3",
            "C4": "C4.mp3",
            "D#4": "Ds4.mp3",
            "F#4": "Fs4.mp3",
            "A4": "A4.mp3",
            "C5": "C5.mp3",
            "D#5": "Ds5.mp3",
            "F#5": "Fs5.mp3",
            "A5": "A5.mp3",
            "C6": "C6.mp3",
            "D#6": "Ds6.mp3",
            "F#6": "Fs6.mp3",
            "A6": "A6.mp3",
            "C7": "C7.mp3",
            "D#7": "Ds7.mp3",
            "F#7": "Fs7.mp3",
            "A7": "A7.mp3",
            "C8": "C8.mp3"
          },
          release: 1,
          baseUrl: "https://tonejs.github.io/audio/salamander/"
        });
        
        await Tone.loaded();
        
        if (id === 'felt-piano') {
           // Create the felt effect chain
           // LowPass filter to remove brightness (simulate hammer on felt)
           // Compressor to even out dynamics for that "close mic" sound
           const lowPass = new Tone.Filter(600, "lowpass");
           const comp = new Tone.Compressor(-20, 3);
           
           if (this.reverb) {
               sampler.chain(lowPass, comp, this.reverb);
           } else {
               sampler.chain(lowPass, comp, Tone.Destination);
           }
           inst = sampler;
        } else {
           if (this.reverb) sampler.connect(this.reverb);
           inst = sampler;
        }
     } else {
       switch (id) {
         case 'electric-piano':
           inst = new Tone.PolySynth(Tone.FMSynth, {
              ...commonPoly,
              harmonicity: 3,
              modulationIndex: 10,
              detune: 0,
              oscillator: { type: "sine" },
              envelope: { attack: 0.01, decay: 0.1, sustain: 0.5, release: 1 },
              modulation: { type: "square" },
              modulationEnvelope: { attack: 0.5, decay: 0, sustain: 1, release: 0.5 }
           });
           break;
         case 'cinematic-pad':
           inst = new Tone.PolySynth(Tone.Synth, {
              ...commonPoly,
              oscillator: { type: "fattriangle", count: 3, spread: 30 },
              envelope: { attack: 0.5, decay: 1, sustain: 0.8, release: 2 }
           });
           // Lower volume for pads usually
           inst.volume.value = -5;
           break;
         case 'dark-synth':
           inst = new Tone.PolySynth(Tone.MonoSynth, {
              ...commonPoly,
              oscillator: { type: "sawtooth" },
              filter: { type: "lowpass", frequency: 2000, Q: 2 },
              envelope: { attack: 0.01, decay: 0.3, sustain: 0.3, release: 0.8 },
              filterEnvelope: { attack: 0.01, decay: 0.5, sustain: 0.2, baseFrequency: 200, octaves: 2, exponent: 2 }
           });
           break;
          case 'celesta':
            inst = new Tone.PolySynth(Tone.Synth, {
               ...commonPoly,
               oscillator: { type: "sine" },
               envelope: { attack: 0.01, decay: 1.5, sustain: 0, release: 1.5 }
            });
            break;
       }
     }

     if (inst && id !== 'felt-piano' && id !== 'grand-piano' && this.reverb) {
        inst.connect(this.reverb);
     }
     
     if (inst) {
        this.instruments.set(id, inst);
     }
  }

  playChord(chord: ChordData, durationInSeconds: number) {
     const inst = this.instruments.get(this.currentInstrumentId);
     if (!inst) return;

    const now = Tone.now();

    // 1. Play Background Chord (Pad/Harmony)
    const chordVelocity = 0.5 + Math.random() * 0.15;
    
    // PolySynth signatures are slightly different in typing but compatible for triggerAttackRelease
    (inst as any).triggerAttackRelease(chord.notes, durationInSeconds, now, chordVelocity);

    // 2. Play Melody Line (if exists)
    if (chord.melodyNotes && chord.melodyNotes.length > 0) {
      const melodyCount = chord.melodyNotes.length;
      const segmentDuration = durationInSeconds / melodyCount;

      chord.melodyNotes.forEach((note, index) => {
        const timeOffset = index * segmentDuration;
        const melodyVelocity = 0.75 + Math.random() * 0.1;
        
        (inst as any).triggerAttackRelease(
          note, 
          segmentDuration * 1.1, 
          now + timeOffset, 
          melodyVelocity
        );
      });
    }
  }

  stopAll() {
    this.instruments.forEach(inst => {
       if (inst instanceof Tone.Sampler || inst instanceof Tone.PolySynth) {
          inst.releaseAll();
       }
    });
  }

  getBpmDuration(bpm: number, beats: number): number {
    return (60 / bpm) * beats;
  }
}

export const audioService = new AudioEngine();