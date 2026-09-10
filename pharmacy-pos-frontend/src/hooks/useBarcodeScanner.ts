import { useEffect, useRef, useCallback } from 'react';

export interface UseBarcodeScannerOptions {
  onScan: (barcode: string) => void;
  onError?: (error: string) => void;
  enabled?: boolean;
  minBarcodeLength?: number;
  maxKeyIntervalMs?: number; // Maximum ms between keystrokes from a scanner (default: 60ms)
  enableAudioBeep?: boolean;
}

// Web Audio API Beep Generator
function playScannerBeep(type: 'success' | 'error' = 'success') {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === 'success') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.09);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } else {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(280, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    }
  } catch {
    // Ignore audio context errors if browser blocks autoplay
  }
}

export function useBarcodeScanner({
  onScan,
  onError,
  enabled = true,
  minBarcodeLength = 3,
  maxKeyIntervalMs = 65,
  enableAudioBeep = true,
}: UseBarcodeScannerOptions) {
  const bufferRef = useRef<string>('');
  const lastKeyTimeRef = useRef<number>(0);
  const onScanRef = useRef(onScan);
  const onErrorRef = useRef(onError);

  onScanRef.current = onScan;
  onErrorRef.current = onError;

  const triggerBeep = useCallback((type: 'success' | 'error') => {
    if (enableAudioBeep) {
      playScannerBeep(type);
    }
  }, [enableAudioBeep]);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInputFocused =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      const now = performance.now();
      const timeSinceLastKey = now - lastKeyTimeRef.current;
      lastKeyTimeRef.current = now;

      // Handle barcode scanner termination keys (Enter or Tab)
      if (e.key === 'Enter' || e.key === 'Tab') {
        if (bufferRef.current.length >= minBarcodeLength) {
          const barcode = bufferRef.current.trim();
          bufferRef.current = '';

          // If focused on a text input, prevent default submission if it was a rapid hardware scan
          if (timeSinceLastKey < maxKeyIntervalMs * 3 || !isInputFocused) {
            e.preventDefault();
            e.stopPropagation();
          }

          triggerBeep('success');
          onScanRef.current(barcode);
          return;
        }

        // Reset if too short
        bufferRef.current = '';
        return;
      }

      // Ignore single modifier or control keys
      if (e.key.length > 1) {
        return;
      }

      // If typing speed is human (> maxKeyIntervalMs) and in an active input, reset buffer
      if (timeSinceLastKey > maxKeyIntervalMs && isInputFocused) {
        bufferRef.current = e.key;
        return;
      }

      // Append to buffer
      if (timeSinceLastKey <= maxKeyIntervalMs || bufferRef.current.length === 0) {
        bufferRef.current += e.key;
      } else {
        bufferRef.current = e.key;
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [enabled, minBarcodeLength, maxKeyIntervalMs, triggerBeep]);

  return {
    triggerBeep,
  };
}
