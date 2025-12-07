# Glidr 101 - Web based touch synthesizer

Turn your touchpad into a musical instrument! Glidr 101 is an interactive web-based synthesizer that lets you create music by simply dragging your finger across the screen.

![Glidr 101](assets/title.svg)

## 🎵 Features

### Interactive Music Creation
- **Touch-based Interface**: Create music by dragging your finger across the interactive pad
- **Real-time Audio**: Instant sound generation using Web Audio API
- **Audio Feedback**: See your finger movements translated into musical notes

### Sound Customization
- **5 Sound Presets**:
  - 🎹 **Warm Pad** - Rich sawtooth waves with warm filtering
  - 🌙 **Lofi Dreams** - Soft triangle waves perfect for ambient music
  - 🔔 **Ethereal Bells** - Pure sine waves with high-pass filtering
  - 🌊 **Synth Wave** - Retro square waves with band-pass filtering
  - 🎤 **Ambient Choir** - Smooth sine waves for atmospheric sounds

### Musical Scales & Vibes
- **5 Musical Scales**:
  - **Major** - Bright, happy melodies
  - **Minor** - Melancholic, emotional tones
  - **Blues** - Soulful, expressive notes
  - **Chromatic** - Full 12-note scale for complex compositions
  - **Pentatonic** - Harmonious 5-note scale

### Cross-Platform Compatibility
- **Desktop Mouse**: Click and drag for precise control
- **Laptop Trackpad**: Touch and drag (no clicking required) - just like mobile!
- **Mobile**: Touch-optimized for smartphones and tablets
- **Responsive Design**: Works on all screen sizes with proper UI scaling

## 🚀 Getting Started

### Prerequisites
- A modern web browser with Web Audio API support
- No additional software installation required

### Installation
1. Clone or download this repository
2. Open `index.html` in your web browser
3. Click "Let's Play!" to start creating music

### Quick Start
1. **Choose Your Sound**: Use the left/right arrows to cycle through sound presets
2. **Select Your Vibe**: Choose from different musical scales using the vibe controls
3. **Start Playing**: Drag your finger across the interactive pad to create music
4. **Experiment**: Try different combinations of sounds and scales

## 🎛️ How to Use

### Basic Controls
- **Horizontal Movement**: Controls the pitch/note selection
- **Vertical Movement**: Controls the volume (lower = louder)
- **Sound Preset**: Click arrows to change the synthesizer sound
- **Vibe/Scale**: Click arrows to change the musical scale

### Tips for Best Experience
- **Desktop Mouse**: Click and drag for precise control
- **Laptop Trackpad**: Simply touch and drag - no clicking needed!
- **Mobile**: Use single-finger touch for optimal performance
- **Volume**: Move your finger lower on the pad for louder sounds
- **Melody**: Move horizontally to create melodic sequences

## 🛠️ Technical Details

### Built With
- **HTML5**: Structure and semantic markup
- **CSS3**: Responsive design and animations
- **JavaScript (ES6+)**: Interactive functionality and audio processing
- **Web Audio API**: Real-time audio synthesis

### Audio Architecture
- **Oscillators**: Generate different waveform types (sine, sawtooth, triangle, square)
- **Filters**: Apply frequency filtering for sound shaping
- **Gain Control**: Dynamic volume control based on touch position
- **Scale Mapping**: Automatic note quantization to musical scales

## 🔧 Development

### Local Development
1. Clone the repository
2. Open `index.html` in your browser
3. Use browser developer tools for debugging
4. Test on different devices and screen sizes

### Audio Context Notes
- Modern browsers require user interaction to start audio
- The synthesizer automatically initializes audio context on first interaction
- Audio may be suspended until user interaction (browser security feature)

## 🙏 Acknowledgments

- Inspired by classic hardware synthesizers
- Built with modern web technologies
- Designed for music creators of all skill levels

**Happy Music Making! 🎵**

*Glidr 101 - Where touch meets sound* 