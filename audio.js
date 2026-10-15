// Audio Engine for Vivest Fighters using Web Audio API & Web Speech API
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.muted = false;
        this.musicEnabled = true;
        this.musicPlaying = false;
        this.musicTimer = null;
        this.musicStep = 0;
        this.tempo = 132;
        this.synthVoice = null;
        this.initSpeech();
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    initSpeech() {
        if ('speechSynthesis' in window) {
            const loadVoices = () => {
                const voices = window.speechSynthesis.getVoices();
                // Find Brazilian Portuguese voice
                this.synthVoice = voices.find(v => v.lang === 'pt-BR' || v.lang === 'pt_BR') || voices[0];
            };
            loadVoices();
            if (window.speechSynthesis.onvoiceschanged !== undefined) {
                window.speechSynthesis.onvoiceschanged = loadVoices;
            }
        }
    }

    announce(text, pitch = 1.0, rate = 1.1) {
        if (this.muted || !('speechSynthesis' in window)) return;
        try {
            window.speechSynthesis.cancel();
            const utt = new SpeechSynthesisUtterance(text);
            if (this.synthVoice) utt.voice = this.synthVoice;
            utt.lang = 'pt-BR';
            utt.pitch = pitch;
            utt.rate = rate;
            utt.volume = 0.9;
            window.speechSynthesis.speak(utt);
        } catch (e) {
            // Speech fallback
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        if (this.muted) {
            this.stopMusic();
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        } else {
            this.init();
            if (this.musicEnabled) this.startMusic();
        }
        return this.muted;
    }

    // Sound Effects
    playSelect() {
        if (this.muted) return;
        this.init();
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(440, t);
        osc.frequency.exponentialRampToValueAtTime(880, t + 0.08);
        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.09);
    }

    playConfirm() {
        if (this.muted) return;
        this.init();
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, t);
        osc.frequency.setValueAtTime(659.25, t + 0.08);
        osc.frequency.setValueAtTime(783.99, t + 0.16);
        osc.frequency.setValueAtTime(1046.50, t + 0.24);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.4);
    }

    playCoin() {
        if (this.muted) return;
        this.init();
        const t = this.ctx.currentTime;
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(987.77, t);
        osc1.frequency.setValueAtTime(1318.51, t + 0.08);
        osc2.frequency.setValueAtTime(1318.51, t);
        osc2.frequency.setValueAtTime(1760.00, t + 0.08);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.45);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);
        osc1.start(t);
        osc2.start(t);
        osc1.stop(t + 0.45);
        osc2.stop(t + 0.45);
    }

    playPunch(isHeavy = false) {
        if (this.muted) return;
        this.init();
        const t = this.ctx.currentTime;
        // White noise burst
        const bufferSize = this.ctx.sampleRate * (isHeavy ? 0.18 : 0.1);
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(isHeavy ? 600 : 900, t);
        filter.Q.setValueAtTime(3, t);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(isHeavy ? 0.4 : 0.25, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, t + (isHeavy ? 0.18 : 0.1));

        // Sub bass thump
        const sub = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        sub.type = 'sine';
        sub.frequency.setValueAtTime(isHeavy ? 180 : 140, t);
        sub.frequency.exponentialRampToValueAtTime(40, t + (isHeavy ? 0.2 : 0.12));
        subGain.gain.setValueAtTime(isHeavy ? 0.5 : 0.3, t);
        subGain.gain.exponentialRampToValueAtTime(0.01, t + (isHeavy ? 0.2 : 0.12));

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);

        sub.connect(subGain);
        subGain.connect(this.ctx.destination);

        noise.start(t);
        sub.start(t);
        sub.stop(t + 0.22);
    }

    playKick(isHeavy = false) {
        if (this.muted) return;
        this.init();
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(isHeavy ? 260 : 200, t);
        osc.frequency.exponentialRampToValueAtTime(30, t + (isHeavy ? 0.25 : 0.16));
        gain.gain.setValueAtTime(isHeavy ? 0.6 : 0.4, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + (isHeavy ? 0.25 : 0.16));
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + (isHeavy ? 0.26 : 0.17));
    }

    playWhoosh() {
        if (this.muted) return;
        this.init();
        const t = this.ctx.currentTime;
        const dur = 0.12;
        const bufferSize = this.ctx.sampleRate * dur;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, t);
        filter.frequency.exponentialRampToValueAtTime(100, t + dur);
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.15, t);
        gain.gain.linearRampToValueAtTime(0.01, t + dur);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start(t);
    }

    playBlock() {
        if (this.muted) return;
        this.init();
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, t);
        osc.frequency.exponentialRampToValueAtTime(200, t + 0.08);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.09);
    }

    playProjectile() {
        if (this.muted) return;
        this.init();
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, t);
        osc.frequency.exponentialRampToValueAtTime(1400, t + 0.18);
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.22);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.23);
    }

    playSuperFreeze() {
        if (this.muted) return;
        this.init();
        const t = this.ctx.currentTime;
        // Dramatic low boom + rising chord
        const notes = [130.81, 164.81, 196.00, 261.63, 523.25];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, t);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.5, t + 0.6);
            gain.gain.setValueAtTime(0.12 / notes.length, t);
            gain.gain.linearRampToValueAtTime(0.25 / notes.length, t + 0.4);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t + idx * 0.04);
            osc.stop(t + 0.85);
        });
    }

    playExplosion() {
        if (this.muted) return;
        this.init();
        const t = this.ctx.currentTime;
        const dur = 0.5;
        const bufferSize = this.ctx.sampleRate * dur;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.15));
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, t);
        filter.frequency.exponentialRampToValueAtTime(80, t + dur);
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.5, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + dur);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start(t);
    }

    playKO() {
        if (this.muted) return;
        this.init();
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.exponentialRampToValueAtTime(30, t + 0.8);
        gain.gain.setValueAtTime(0.5, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.8);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.85);
    }

    // 16-bit Retro Chiptune Music Generator
    startMusic() {
        if (this.muted || !this.musicEnabled || this.musicPlaying) return;
        this.init();
        this.musicPlaying = true;
        this.musicStep = 0;
        
        // High-energy 16-bit fighting groove chords & arpeggios (in D minor)
        const bassline = [
            73.42, 73.42, 87.31, 73.42, 98.00, 73.42, 110.00, 98.00,
            65.41, 65.41, 77.78, 65.41, 87.31, 65.41, 98.00, 87.31,
            55.00, 55.00, 65.41, 55.00, 73.42, 55.00, 82.41, 73.42,
            73.42, 87.31, 98.00, 110.00, 130.81, 146.83, 164.81, 174.61
        ];

        const leadArp = [
            293.66, 349.23, 440.00, 587.33, 440.00, 349.23, 293.66, 349.23,
            261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 261.63, 329.63,
            220.00, 261.63, 329.63, 440.00, 329.63, 261.63, 220.00, 261.63,
            293.66, 349.23, 440.00, 587.33, 698.46, 587.33, 440.00, 349.23
        ];

        const stepTime = (60 / this.tempo) / 4; // 16th note

        const tick = () => {
            if (!this.musicPlaying || this.muted) return;
            const t = this.ctx.currentTime;
            const idx = this.musicStep % 32;

            // Bass note on 8th notes (every 2 steps)
            if (idx % 2 === 0) {
                const bassFreq = bassline[idx];
                const bOsc = this.ctx.createOscillator();
                const bGain = this.ctx.createGain();
                bOsc.type = 'sawtooth';
                bOsc.frequency.setValueAtTime(bassFreq, t);
                bGain.gain.setValueAtTime(0.08, t);
                bGain.gain.exponentialRampToValueAtTime(0.005, t + stepTime * 1.8);
                bOsc.connect(bGain);
                bGain.connect(this.ctx.destination);
                bOsc.start(t);
                bOsc.stop(t + stepTime * 1.9);
            }

            // Lead Arp on 16th notes
            if (idx % 2 === 1 || idx % 4 === 0) {
                const leadFreq = leadArp[idx];
                const lOsc = this.ctx.createOscillator();
                const lGain = this.ctx.createGain();
                lOsc.type = 'square';
                lOsc.frequency.setValueAtTime(leadFreq, t);
                lGain.gain.setValueAtTime(0.035, t);
                lGain.gain.exponentialRampToValueAtTime(0.002, t + stepTime * 0.9);
                lOsc.connect(lGain);
                lGain.connect(this.ctx.destination);
                lOsc.start(t);
                lOsc.stop(t + stepTime);
            }

            // Drum beat: Kick on 1, 5, 9, 13, 17, 21, 25, 29; Snare on 5, 13, 21, 29; Hi-hat on every 2
            if (idx % 8 === 0) {
                // Kick
                const kOsc = this.ctx.createOscillator();
                const kGain = this.ctx.createGain();
                kOsc.frequency.setValueAtTime(140, t);
                kOsc.frequency.exponentialRampToValueAtTime(35, t + 0.1);
                kGain.gain.setValueAtTime(0.12, t);
                kGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
                kOsc.connect(kGain);
                kGain.connect(this.ctx.destination);
                kOsc.start(t);
                kOsc.stop(t + 0.12);
            } else if (idx % 8 === 4) {
                // Snare
                const bufferSize = this.ctx.sampleRate * 0.08;
                const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
                const d = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) d[i] = Math.random() * 2 - 1;
                const sNoise = this.ctx.createBufferSource();
                sNoise.buffer = buffer;
                const sFilter = this.ctx.createBiquadFilter();
                sFilter.type = 'bandpass';
                sFilter.frequency.setValueAtTime(1200, t);
                const sGain = this.ctx.createGain();
                sGain.gain.setValueAtTime(0.06, t);
                sGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
                sNoise.connect(sFilter);
                sFilter.connect(sGain);
                sGain.connect(this.ctx.destination);
                sNoise.start(t);
            }

            this.musicStep++;
            this.musicTimer = setTimeout(tick, stepTime * 1000);
        };

        tick();
    }

    stopMusic() {
        this.musicPlaying = false;
        if (this.musicTimer) {
            clearTimeout(this.musicTimer);
            this.musicTimer = null;
        }
    }
}

window.soundEngine = new SoundEngine();
