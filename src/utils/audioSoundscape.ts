/**
 * Hotel Manchester - Luxury Soundscape Engine
 * Real-time procedural acoustic synthesis of piano, harp, singing bowls, sitar, and ocean waves
 * Tuned to 432Hz harmonic serenity with algorithmic stereo acoustic reverb.
 */

export type SoundscapeTrack = 'palace_piano' | 'singing_bowls' | 'royal_sitar' | 'coastal_waves';

export interface TrackInfo {
  id: SoundscapeTrack;
  title: string;
  subtitle: string;
  mood: string;
}

export const SOUNDSCAPE_TRACKS: TrackInfo[] = [
  {
    id: 'palace_piano',
    title: 'Lakeside Palace Serenade',
    subtitle: 'Grand Piano, Harp & Warm Cello Swell',
    mood: 'Tranquil & Aristocratic',
  },
  {
    id: 'royal_sitar',
    title: 'Mewar Courtyard Twilight',
    subtitle: 'Heritage Plucked Sitar & Tanpura Drone',
    mood: 'Meditative & Royal',
  },
  {
    id: 'singing_bowls',
    title: 'Himalayan Singing Bowls & Rain',
    subtitle: 'Resonant Bronze Bells & Bamboo Rain',
    mood: 'Deep Calm & Renewal',
  },
  {
    id: 'coastal_waves',
    title: 'Goan Coastal Ocean & Piano',
    subtitle: 'Gentle Ocean Shoreline & Melodic Chords',
    mood: 'Breezy & Restful',
  },
];

class AmbientSoundscape {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private isMuted = false;
  private masterGain: GainNode | null = null;
  private reverbNode: ConvolverNode | null = null;
  private currentTrack: SoundscapeTrack = 'palace_piano';
  private timer: number | null = null;
  private backgroundLoopNodes: { stop: () => void }[] = [];
  private volume = 0.4;
  private listeners: (() => void)[] = [];

  // Musical scales in 432Hz base tuning
  // D Major / B Minor pentatonic notes for Palace Piano:
  // D3, F#3, A3, B3, C#4, D4, E4, F#4, A4, B4, C#5, D5
  private readonly pianoNotes = [
    144.0, 179.8, 215.8, 242.2, 271.8, 288.0, 323.3, 359.6, 431.5, 484.4, 543.6, 576.0
  ];

  // Sitar Raga Yaman notes (approx 432Hz)
  private readonly sitarNotes = [
    144.0, 161.8, 179.8, 204.3, 215.8, 242.2, 271.8, 288.0, 323.3, 359.6, 408.6, 431.5, 484.4, 543.6
  ];

  // Singing bowl fundamental frequencies
  private readonly bowlFrequencies = [144.0, 216.0, 288.0, 360.0, 432.0, 576.0];

  private initContext() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);

      // Algorithmic Reverb Impulse Response (Creating a majestic marble hotel lobby acoustic decay)
      this.createMarbleHallReverb();

      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Generates a 3-second lush acoustic impulse response for cathedral/palace marble hall reverberation
   */
  private createMarbleHallReverb() {
    if (!this.ctx) return;
    const sampleRate = this.ctx.sampleRate;
    const length = sampleRate * 3.2; // 3.2 seconds decay
    const impulse = this.ctx.createBuffer(2, length, sampleRate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      const decay = Math.exp(-i / (sampleRate * 0.9));
      left[i] = (Math.random() * 2 - 1) * decay;
      right[i] = (Math.random() * 2 - 1) * decay;
    }

    this.reverbNode = this.ctx.createConvolver();
    this.reverbNode.buffer = impulse;
    this.reverbNode.connect(this.masterGain!);
  }

  public subscribe(fn: () => void) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  public getIsPlaying() {
    return this.isPlaying;
  }

  public getIsMuted() {
    return this.isMuted;
  }

  public getCurrentTrack(): SoundscapeTrack {
    return this.currentTrack;
  }

  public getTrackInfo(): TrackInfo {
    return SOUNDSCAPE_TRACKS.find((t) => t.id === this.currentTrack) || SOUNDSCAPE_TRACKS[0];
  }

  public setTrack(track: SoundscapeTrack) {
    if (this.currentTrack === track && this.isPlaying) return;
    this.currentTrack = track;
    if (this.isPlaying) {
      this.stopCurrentLoops();
      this.playSelectedTrack();
    }
    this.notify();
  }

  public start() {
    if (this.isPlaying) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      this.isPlaying = true;
      this.notify();
      this.playSelectedTrack();
    } catch {
      // Audio context needs gesture
    }
  }

  private stopCurrentLoops() {
    if (this.timer) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
    this.backgroundLoopNodes.forEach((node) => {
      try {
        node.stop();
      } catch {}
    });
    this.backgroundLoopNodes = [];
  }

  private playSelectedTrack() {
    this.stopCurrentLoops();
    if (!this.isPlaying || !this.ctx) return;

    switch (this.currentTrack) {
      case 'palace_piano':
        this.startPalacePianoTrack();
        break;
      case 'royal_sitar':
        this.startRoyalSitarTrack();
        break;
      case 'singing_bowls':
        this.startSingingBowlsTrack();
        break;
      case 'coastal_waves':
        this.startCoastalWavesTrack();
        break;
    }
  }

  // --- TRACK 1: LAKESIDE PALACE PIANO & HARP ---
  private startPalacePianoTrack() {
    if (!this.ctx || !this.masterGain) return;

    // 1. Warm Cello Bass Drone
    const bassFreqs = [72.0, 108.0, 144.0]; // D2, A2, D3
    bassFreqs.forEach((freq) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.035, this.ctx.currentTime + 3);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      this.backgroundLoopNodes.push({
        stop: () => {
          try {
            gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx!.currentTime + 0.6);
            osc.stop(this.ctx!.currentTime + 0.7);
          } catch {}
        },
      });
    });

    // 2. Piano Arpeggio Sequences
    const chordSequences = [
      [144.0, 215.8, 288.0, 359.6, 431.5], // Dmaj9
      [121.2, 179.8, 242.2, 288.0, 359.6], // Bm7
      [96.0, 144.0, 215.8, 271.8, 323.3],  // Gmaj7
      [108.0, 161.8, 215.8, 288.0, 323.3], // A7sus4
    ];

    let chordIdx = 0;
    const playNextArpeggio = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;

      const chord = chordSequences[chordIdx % chordSequences.length];
      chordIdx++;

      // Play 3 to 4 notes in the chord as a gentle cascading harp/piano arpeggio
      chord.forEach((freq, noteIdx) => {
        const delay = noteIdx * 450 + (Math.random() * 80 - 40);
        setTimeout(() => {
          if (!this.isPlaying || !this.ctx) return;
          this.triggerAcousticPianoNote(freq, 0.04);
        }, delay);
      });

      // Occasional high sparkle bell
      if (Math.random() > 0.4) {
        setTimeout(() => {
          if (!this.isPlaying || !this.ctx) return;
          const highBell = this.pianoNotes[Math.floor(Math.random() * 4) + 8];
          this.triggerGlassChime(highBell, 0.02);
        }, 1800);
      }

      this.timer = window.setTimeout(playNextArpeggio, 3800 + Math.random() * 800);
    };

    playNextArpeggio();
  }

  // --- TRACK 2: ROYAL SITAR & TANPURA ---
  private startRoyalSitarTrack() {
    if (!this.ctx || !this.masterGain) return;

    // Tanpura Drone (Sa - Pa - Sa)
    const tanpuraPitches = [72.0, 108.0, 144.0, 215.8];
    tanpuraPitches.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(freq * 1.5, this.ctx.currentTime);
      filter.Q.setValueAtTime(6, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.015, this.ctx.currentTime + 3);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      this.backgroundLoopNodes.push({
        stop: () => {
          try {
            gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx!.currentTime + 0.6);
            osc.stop(this.ctx!.currentTime + 0.7);
          } catch {}
        },
      });
    });

    // Sitar Plucks with sympathetic resonance
    const playSitarPhrase = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;

      const count = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        const note = this.sitarNotes[Math.floor(Math.random() * this.sitarNotes.length)];
        setTimeout(() => {
          if (!this.isPlaying || !this.ctx) return;
          this.triggerPluckedSitar(note);
        }, i * 550);
      }

      this.timer = window.setTimeout(playSitarPhrase, 3600 + Math.random() * 2000);
    };

    playSitarPhrase();
  }

  // --- TRACK 3: SINGING BOWLS & BAMBOO RAIN ---
  private startSingingBowlsTrack() {
    if (!this.ctx || !this.masterGain) return;

    // Soft rain noise generator
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const rainFilter = this.ctx.createBiquadFilter();
    rainFilter.type = 'lowpass';
    rainFilter.frequency.setValueAtTime(750, this.ctx.currentTime);

    const rainGain = this.ctx.createGain();
    rainGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    rainGain.gain.exponentialRampToValueAtTime(0.02, this.ctx.currentTime + 3);

    whiteNoise.connect(rainFilter);
    rainFilter.connect(rainGain);
    rainGain.connect(this.masterGain);
    whiteNoise.start();

    this.backgroundLoopNodes.push({
      stop: () => {
        try {
          rainGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx!.currentTime + 0.6);
          whiteNoise.stop(this.ctx!.currentTime + 0.7);
        } catch {}
      },
    });

    // Resonant Singing Bowl Strikes
    const playBowl = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;

      const fundamental = this.bowlFrequencies[Math.floor(Math.random() * this.bowlFrequencies.length)];
      this.triggerSingingBowl(fundamental);

      this.timer = window.setTimeout(playBowl, 4500 + Math.random() * 3500);
    };

    playBowl();
  }

  // --- TRACK 4: COASTAL WAVES & PIANO ---
  private startCoastalWavesTrack() {
    if (!this.ctx || !this.masterGain) return;

    // Periodic Ocean Waves swell
    const triggerWaveSwell = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;

      const bufferSize = this.ctx.sampleRate * 4;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const waveFilter = this.ctx.createBiquadFilter();
      waveFilter.type = 'bandpass';
      waveFilter.frequency.setValueAtTime(250, this.ctx.currentTime);
      waveFilter.frequency.exponentialRampToValueAtTime(650, this.ctx.currentTime + 2.5);
      waveFilter.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 5.5);

      const waveGain = this.ctx.createGain();
      waveGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      waveGain.gain.linearRampToValueAtTime(0.045, this.ctx.currentTime + 2.5);
      waveGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 6.0);

      noise.connect(waveFilter);
      waveFilter.connect(waveGain);
      waveGain.connect(this.masterGain);

      noise.start();
      noise.stop(this.ctx.currentTime + 6.2);

      // Gentle piano tone along with the crest of the wave
      setTimeout(() => {
        if (!this.isPlaying || !this.ctx) return;
        const note = this.pianoNotes[Math.floor(Math.random() * 6) + 2];
        this.triggerAcousticPianoNote(note, 0.035);
      }, 2000);

      this.timer = window.setTimeout(triggerWaveSwell, 6200 + Math.random() * 2000);
    };

    triggerWaveSwell();
  }

  // --- INSTRUMENT SYNTHESIS ENGINES ---

  private triggerAcousticPianoNote(freq: number, amplitude: number) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Dual oscillator for rich piano hammer & string acoustic thickness
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2.002, now); // Second harmonic with subtle chorus

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 3.5, now);
    filter.frequency.exponentialRampToValueAtTime(freq * 1.2, now + 2.5);

    // Natural Piano Envelope (instant attack, gentle acoustic decay)
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(amplitude, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.2);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);

    gain.connect(this.masterGain);
    if (this.reverbNode) {
      gain.connect(this.reverbNode);
    }

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 4.3);
    osc2.stop(now + 4.3);
  }

  private triggerGlassChime(freq: number, amplitude: number) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq, now);
    filter.Q.setValueAtTime(8, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(amplitude, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    if (this.reverbNode) gain.connect(this.reverbNode);

    osc.start(now);
    osc.stop(now + 3.6);
  }

  private triggerPluckedSitar(freq: number) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    // Subtle jawari microtonal pitch bend characteristic of Indian sitar
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.linearRampToValueAtTime(freq * 1.02, now + 0.12);
    osc.frequency.linearRampToValueAtTime(freq, now + 0.35);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq * 2.2, now);
    filter.Q.setValueAtTime(5, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.038, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    if (this.reverbNode) gain.connect(this.reverbNode);

    osc.start(now);
    osc.stop(now + 2.9);
  }

  private triggerSingingBowl(freq: number) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Bowls create dual beating frequencies
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq + 1.2, now); // 1.2Hz binaural pulsation

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.04, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 6.5);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);
    if (this.reverbNode) gain.connect(this.reverbNode);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 6.6);
    osc2.stop(now + 6.6);
  }

  public stop() {
    this.isPlaying = false;
    this.stopCurrentLoops();
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.ctx.close().catch(() => {});
      this.ctx = null;
      this.masterGain = null;
      this.reverbNode = null;
    }
    this.notify();
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    this.notify();
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }
}

export const soundscape = new AmbientSoundscape();
