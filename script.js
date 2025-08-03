class TouchSynthesizer {
    constructor() {
        this.audioContext = null;
        this.oscillators = []; // Array to hold multiple oscillators
        this.gainNodes = []; // Array to hold corresponding gain nodes
        this.isPlaying = false;
        this.currentFrequency = 0;
        
        // Note names for chromatic scale
        this.noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        // Black keys (sharps/flats) for visual distinction
        this.blackKeys = ['C#', 'D#', 'F#', 'G#', 'A#'];
        
        // Scale definitions
        this.scales = {
            major: [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25],
            minor: [261.63, 293.66, 311.13, 349.23, 392.00, 415.30, 466.16, 523.25],
            blues: [261.63, 311.13, 349.23, 369.99, 392.00, 466.16, 523.25],
            chromatic: [261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.00, 415.30, 440.00, 466.16, 493.88],
            pentatonic: [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]
        };

        // Sound presets mapping
        this.soundPresets = [
            { name: 'Warm Pad', value: 'warm-pad' },
            { name: 'Lofi Dreams', value: 'lofi-dreams' },
            { name: 'Ethereal Bells', value: 'ethereal-bells' },
            { name: 'Synth Wave', value: 'synth-wave' },
            { name: 'Ambient Choir', value: 'ambient-choir' }
        ];

        // Vibe/Scale mapping
        this.vibeOptions = [
            { name: 'Major', value: 'major' },
            { name: 'Minor', value: 'minor' },
            { name: 'Blues', value: 'blues' },
            { name: 'Chromatic', value: 'chromatic' },
            { name: 'Pentatonic', value: 'pentatonic' }
        ];

        this.currentSoundIndex = 0;
        this.currentVibeIndex = 0;
        
        // DOM elements
        this.welcomePage = document.getElementById('welcomePage');
        this.playArenaPage = document.getElementById('playArenaPage');
        this.touchArea = document.getElementById('touchArea');
        this.controllerCursor = document.getElementById('controllerCursor');
        this.letsPlayBtn = document.getElementById('letsPlayBtn');
        this.soundPresetElement = document.getElementById('soundPreset');
        this.vibeValueElement = document.getElementById('vibeValue');
        

        
        // Control elements
        this.rootKey = 'C'; // Default root key is C
        this.defaultOctave = 3; // Fixed octave value
        this.snapToScale = true; // Always snap to scale
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupNavigation();
        this.setupControls();
    }
    


    setupNavigation() {
        this.letsPlayBtn.addEventListener('click', () => {
            this.navigateToPlayArena();
        });
    }

    setupControls() {
        // Setup sound preset controls
        const soundLeftArrow = document.querySelector('.control-section:first-child .left-arrow');
        const soundRightArrow = document.querySelector('.control-section:first-child .right-arrow');
        
        soundLeftArrow.addEventListener('click', () => {
            this.currentSoundIndex = (this.currentSoundIndex - 1 + this.soundPresets.length) % this.soundPresets.length;
            this.updateSoundPreset();
        });
        
        soundRightArrow.addEventListener('click', () => {
            this.currentSoundIndex = (this.currentSoundIndex + 1) % this.soundPresets.length;
            this.updateSoundPreset();
        });

        // Setup vibe controls
        const vibeLeftArrow = document.querySelector('.control-section:last-child .left-arrow');
        const vibeRightArrow = document.querySelector('.control-section:last-child .right-arrow');
        
        vibeLeftArrow.addEventListener('click', () => {
            this.currentVibeIndex = (this.currentVibeIndex - 1 + this.vibeOptions.length) % this.vibeOptions.length;
            this.updateVibeValue();
        });
        
        vibeRightArrow.addEventListener('click', () => {
            this.currentVibeIndex = (this.currentVibeIndex + 1) % this.vibeOptions.length;
            this.updateVibeValue();
        });
    }

    updateSoundPreset() {
        const preset = this.soundPresets[this.currentSoundIndex];
        this.soundPresetElement.textContent = preset.name;
    }

    updateVibeValue() {
        const vibe = this.vibeOptions[this.currentVibeIndex];
        this.vibeValueElement.textContent = vibe.name;
    }

    navigateToPlayArena() {
        this.welcomePage.style.display = 'none';
        this.playArenaPage.style.display = 'flex';
        
        // Initialize controller cursor position at center
        this.controllerCursor.style.left = '50%';
        this.controllerCursor.style.top = '50%';
        this.controllerCursor.style.transform = 'translate(-50%, -50%)';
        
        // Initialize audio context when entering play arena
        this.initAudioContext();
    }
    
    async initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Resume audio context if it's suspended
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            
            console.log('Audio context initialized and ready');
        } catch (error) {
            console.error('Failed to initialize audio context:', error);
        }
    }

    setupEventListeners() {
        // Mouse events for click-based playing
        this.touchArea.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.touchArea.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.touchArea.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.touchArea.addEventListener('mouseleave', this.handleMouseUp.bind(this));
        
        // Touch events for mobile devices (single finger)
        this.touchArea.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.touchArea.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.touchArea.addEventListener('touchend', this.handleTouchEnd.bind(this));
        this.touchArea.addEventListener('touchcancel', this.handleTouchEnd.bind(this));
        
        // Prevent default touch behaviors
        this.touchArea.addEventListener('touchstart', e => e.preventDefault());
        this.touchArea.addEventListener('touchmove', e => e.preventDefault());
        
        // Track mouse state
        this.isMouseDown = false;
        this.isTrackpadMode = false;
    }
    
    handleMouseDown(event) {
        // Only respond to left mouse button
        if (event.button !== 0) return;
        
        this.isMouseDown = true;
        this.isTrackpadMode = false;
        
        if (!this.audioContext) {
            this.initAudioContext().then(() => {
                if (this.audioContext) {
                    this.startPlayback(event);
                }
            });
            return;
        }
        
        // Resume audio context if it's suspended
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume().then(() => {
                this.startPlayback(event);
            });
            return;
        }
        
        this.startPlayback(event);
    }
    
    handleMouseMove(event) {
        // Only play if mouse is down (left click held)
        if (!this.isMouseDown) {
            // Update cursor position without playing sound
            const position = this.getPosition(event);
            this.updatePosition(position);
            return;
        }
        
        if (!this.isPlaying) return;
        
        const position = this.getPosition(event);
        this.updatePosition(position);
        this.updateAudio(position);
    }
    
    handleMouseUp(event) {
        this.isMouseDown = false;
        this.stopPlayback();
    }
    
    startPlayback(event) {
        this.isPlaying = true;
        this.touchArea.classList.add('active');
        
        const position = this.getPosition(event);
        this.updatePosition(position);
        this.startAudio(position);
    }
    
    handleTouchStart(event) {
        // Single finger touch for both mobile and trackpad
        if (event.touches.length === 1) {
            this.isMouseDown = true;
            this.isTrackpadMode = false;
        } else {
            return; // Ignore multiple touches
        }
        
        if (!this.audioContext) {
            this.initAudioContext().then(() => {
                if (this.audioContext) {
                    this.startPlayback(event);
                }
            });
            return;
        }
        
        // Resume audio context if it's suspended
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume().then(() => {
                this.startPlayback(event);
            });
            return;
        }
        
            this.startPlayback(event);
    }
    
    handleTouchMove(event) {
        // Only play if single finger is touching and mouse is down
        const shouldPlay = event.touches.length === 1 && this.isMouseDown;
        
        if (!shouldPlay) {
            // Update cursor position without playing sound
            const position = this.getPosition(event);
            this.updatePosition(position);
            return;
        }
        
        if (!this.isPlaying) return;
        
        const position = this.getPosition(event);
        this.updatePosition(position);
        this.updateAudio(position);
    }
    
    handleTouchEnd(event) {
        // Stop playing if no touches remain
        if (event.touches.length === 0) {
            this.isMouseDown = false;
            this.isTrackpadMode = false;
            this.stopPlayback();
        }
    }
    
    stopPlayback() {
        this.isPlaying = false;
        this.touchArea.classList.remove('active');
        this.stopAllOscillators();
    }
    
    createOscillator(frequency, preset) {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filterNode = this.audioContext.createBiquadFilter();
        
        // Configure based on preset (matching Claude prototype)
        switch(preset) {
            case 'warm-pad':
                oscillator.type = 'sawtooth';
                filterNode.type = 'lowpass';
                filterNode.frequency.setValueAtTime(800, this.audioContext.currentTime);
                break;
            case 'lofi-dreams':
                oscillator.type = 'triangle';
                filterNode.type = 'lowpass';
                filterNode.frequency.setValueAtTime(400, this.audioContext.currentTime);
                break;
            case 'ethereal-bells':
                oscillator.type = 'sine';
                filterNode.type = 'highpass';
                filterNode.frequency.setValueAtTime(200, this.audioContext.currentTime);
                break;
            case 'synth-wave':
                oscillator.type = 'square';
                filterNode.type = 'bandpass';
                filterNode.frequency.setValueAtTime(1000, this.audioContext.currentTime);
                break;
            case 'ambient-choir':
                oscillator.type = 'sine';
                filterNode.type = 'lowpass';
                filterNode.frequency.setValueAtTime(600, this.audioContext.currentTime);
                break;
        }

        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        
        oscillator.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        return { oscillator, gainNode };
    }
    
    stopAllOscillators() {
        this.oscillators.forEach((osc, index) => {
            try {
                this.gainNodes[index].gain.setTargetAtTime(0, this.audioContext.currentTime, 0.1);
                setTimeout(() => osc.stop(), 200);
            } catch (e) {
                // Oscillator might already be stopped
            }
        });
        this.oscillators = [];
        this.gainNodes = [];
    }
    
    getPosition(event) {
        const rect = this.touchArea.getBoundingClientRect();
        let clientX, clientY;
        
        if (event.touches && event.touches.length > 0) {
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
        } else {
            clientX = event.clientX;
            clientY = event.clientY;
        }
        
        const x = ((clientX - rect.left) / rect.width) * 100;
        const y = ((clientY - rect.top) / rect.height) * 100;
        
        return {
            x: Math.max(0, Math.min(100, x)),
            y: Math.max(0, Math.min(100, y))
        };
    }
    
    updatePosition(position) {
        // Use left/top for more responsive movement
        this.controllerCursor.style.left = `${position.x}%`;
        this.controllerCursor.style.top = `${position.y}%`;
        this.controllerCursor.style.transform = 'translate(-50%, -50%)';
    }
    
    calculateFrequency(position) {
        // Simplified frequency calculation matching Claude prototype
        const selectedScale = this.vibeOptions[this.currentVibeIndex].value;
        const currentScale = this.scales[selectedScale];
        
        // Map X position to note index in the scale
        const noteIndex = Math.floor((position.x / 100) * currentScale.length);
        const frequency = currentScale[noteIndex] || currentScale[0];
        
        // Calculate volume based on Y position (lower = louder, like Claude prototype)
        const volume = (1 - position.y / 100) * 0.3;
        
        return {
            frequency: frequency,
            volume: volume,
            noteName: this.getNoteName(frequency)
        };
    }
    
    getNoteName(frequency) {
        const noteNames = {
            261.63: 'C4', 277.18: 'C#4', 293.66: 'D4', 311.13: 'D#4', 329.63: 'E4',
            349.23: 'F4', 369.99: 'F#4', 392.00: 'G4', 415.30: 'G#4', 440.00: 'A4',
            466.16: 'A#4', 493.88: 'B4', 523.25: 'C5'
        };
        return noteNames[frequency] || 'N/A';
    }
    
    startAudio(position) {
        if (!this.audioContext) return;
        
        // Clean up existing oscillators
        this.stopAllOscillators();
        
        const noteInfo = this.calculateFrequency(position);
        
        // Only create oscillator if volume is significant
        if (noteInfo.volume > 0.05) {
            const { oscillator, gainNode } = this.createOscillator(noteInfo.frequency, this.soundPresets[this.currentSoundIndex].value);
            oscillator.start();
            gainNode.gain.setTargetAtTime(noteInfo.volume, this.audioContext.currentTime, 0.1);
            
            this.oscillators.push(oscillator);
            this.gainNodes.push(gainNode);
        }
        
        this.currentFrequency = noteInfo.frequency;
    }
    
    updateAudio(position) {
        if (!this.audioContext) return;
        
        const noteInfo = this.calculateFrequency(position);
        
        // Clean up existing oscillators and create new one
        this.stopAllOscillators();
        
        // Only create oscillator if volume is significant
        if (noteInfo.volume > 0.05) {
            const { oscillator, gainNode } = this.createOscillator(noteInfo.frequency, this.soundPresets[this.currentSoundIndex].value);
            oscillator.start();
            gainNode.gain.setTargetAtTime(noteInfo.volume, this.audioContext.currentTime, 0.1);
            
            this.oscillators.push(oscillator);
            this.gainNodes.push(gainNode);
        }
        
        this.currentFrequency = noteInfo.frequency;
    }
    



}

// Initialize the synthesizer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TouchSynthesizer();
});

// Add some helper functions for mobile optimization
function preventZoom(e) {
    var t2 = e.timeStamp;
    var t1 = e.currentTarget.dataset.lastTouch || t2;
    var dt = t2 - t1;
    var fingers = e.touches.length;
    e.currentTarget.dataset.lastTouch = t2;

    if (!dt || dt > 500 || fingers > 1) return; // not double-tap

    e.preventDefault();
    e.target.click();
}

document.addEventListener('touchend', preventZoom);
