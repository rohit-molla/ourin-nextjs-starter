/**
 * Sound Utilities
 * 
 * Core utilities for playing sounds in the browser.
 * Includes Web Audio API support for synthetic sounds and HTMLAudioElement for files.
 * 
 * @example
 * ```ts
 * // Play a sound file
 * playSound('/sounds/click.mp3', 0.5);
 * 
 * // Create and reuse a sound
 * const hoverSound = createSound('/sounds/hover.mp3');
 * hoverSound.play();
 * 
 * // Use SoundManager for centralized control
 * SoundManager.play('click');
 * ```
 */

// Check if we're in browser environment
const isBrowser = typeof window !== 'undefined';

/**
 * Create an HTMLAudioElement for a sound file
 * @param src - Path to the audio file
 * @param volume - Volume level (0-1)
 * @returns HTMLAudioElement or null if not in browser
 */
export function createSound(src: string, volume: number = 1): HTMLAudioElement | null {
  if (!isBrowser) return null;
  
  const audio = new Audio(src);
  audio.volume = Math.max(0, Math.min(1, volume));
  audio.preload = 'auto';
  
  return audio;
}

/**
 * Play a sound once (creates new Audio element each time)
 * Best for one-shot sounds, not recommended for rapid playback
 * @param src - Path to the audio file
 * @param volume - Volume level (0-1)
 */
export function playSound(src: string, volume: number = 1): void {
  if (!isBrowser) return;
  
  try {
    const audio = new Audio(src);
    audio.volume = Math.max(0, Math.min(1, volume));
    audio.play().catch(() => {
      // Silently fail if autoplay is blocked
    });
  } catch {
    // Silently fail
  }
}

/**
 * Preload multiple sound files for faster playback
 * @param sources - Array of audio file paths
 * @returns Map of source to HTMLAudioElement
 */
export function preloadSounds(sources: string[]): Map<string, HTMLAudioElement> {
  const sounds = new Map<string, HTMLAudioElement>();
  
  if (!isBrowser) return sounds;
  
  sources.forEach(src => {
    const audio = createSound(src);
    if (audio) {
      sounds.set(src, audio);
    }
  });
  
  return sounds;
}

/**
 * Generate a synthetic sound using Web Audio API
 * Perfect for UI feedback sounds without needing audio files
 */
export class SynthSound {
  private audioContext: AudioContext | null = null;
  
  private getContext(): AudioContext | null {
    if (!isBrowser) return null;
    
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return this.audioContext;
  }
  
  /**
   * Play a click/tap sound
   * Short, crisp sound for button clicks
   */
  playClick(volume: number = 0.3): void {
    const ctx = this.getContext();
    if (!ctx) return;
    
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);
    
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.05);
  }
  
  /**
   * Play a hover sound
   * Subtle, soft sound for hover feedback
   */
  playHover(volume: number = 0.15): void {
    const ctx = this.getContext();
    if (!ctx) return;
    
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(600, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.03);
    
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.03);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.03);
  }
  
  /**
   * Play a success sound
   * Pleasing ascending tone for success feedback
   */
  playSuccess(volume: number = 0.3): void {
    const ctx = this.getContext();
    if (!ctx) return;
    
    // Two quick ascending notes
    [0, 0.1].forEach((delay, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      const freq = i === 0 ? 523.25 : 659.25; // C5 and E5
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime + delay);
      
      gainNode.gain.setValueAtTime(volume, ctx.currentTime + delay);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.15);
      
      oscillator.start(ctx.currentTime + delay);
      oscillator.stop(ctx.currentTime + delay + 0.15);
    });
  }
  
  /**
   * Play an error sound
   * Low buzz for error feedback
   */
  playError(volume: number = 0.3): void {
    const ctx = this.getContext();
    if (!ctx) return;
    
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(150, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);
  }
}

// Singleton instance for easy access
export const synth = new SynthSound();

/**
 * SoundManager - Centralized sound management
 * 
 * @example
 * ```ts
 * // Initialize with sounds
 * SoundManager.init({
 *   click: '/sounds/click.mp3',
 *   hover: '/sounds/hover.mp3'
 * });
 * 
 * // Play a sound
 * SoundManager.play('click');
 * 
 * // Use synthetic sounds (no files needed)
 * SoundManager.synth.playClick();
 * ```
 */
class SoundManagerClass {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private enabled: boolean = true;
  private globalVolume: number = 1;
  
  /** Synthetic sound generator */
  public synth = synth;
  
  /**
   * Initialize the sound manager with sound files
   * @param soundMap - Object mapping names to file paths
   */
  init(soundMap: Record<string, string>): void {
    if (!isBrowser) return;
    
    Object.entries(soundMap).forEach(([name, src]) => {
      const audio = createSound(src, this.globalVolume);
      if (audio) {
        this.sounds.set(name, audio);
      }
    });
  }
  
  /**
   * Play a named sound
   * @param name - Name of the sound (from init)
   * @param volume - Optional volume override (0-1)
   */
  play(name: string, volume?: number): void {
    if (!this.enabled || !isBrowser) return;
    
    const audio = this.sounds.get(name);
    if (audio) {
      // Clone the audio to allow overlapping playback
      const clone = audio.cloneNode() as HTMLAudioElement;
      clone.volume = volume ?? audio.volume;
      clone.play().catch(() => {});
    }
  }
  
  /**
   * Enable or disable all sounds
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
  
  /**
   * Check if sounds are enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }
  
  /**
   * Set global volume for all sounds
   * @param volume - Volume level (0-1)
   */
  setVolume(volume: number): void {
    this.globalVolume = Math.max(0, Math.min(1, volume));
    this.sounds.forEach(audio => {
      audio.volume = this.globalVolume;
    });
  }
  
  /**
   * Get current global volume
   */
  getVolume(): number {
    return this.globalVolume;
  }
}

export const SoundManager = new SoundManagerClass();
