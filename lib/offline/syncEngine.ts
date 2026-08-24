import { getOfflineQueue, clearOfflineQueue } from './indexedDb';
import { db } from '../db';

export async function flushOfflineQueue(): Promise<{ syncedCount: number; errors: any[] }> {
  const queue = await getOfflineQueue();
  if (queue.length === 0) return { syncedCount: 0, errors: [] };

  let syncedCount = 0;
  const errors = [];

  for (const item of queue) {
    try {
      if (item.type === 'OBSERVATION') {
        db.addObservation({
          ...item.payload,
          synced: true
        });
      } else if (item.type === 'ATTENDANCE') {
        db.markAttendance(
          item.payload.studentId,
          item.payload.status,
          item.payload.tenantId
        );
      }
      syncedCount++;
    } catch (err) {
      errors.push(err);
    }
  }

  if (syncedCount > 0) {
    await clearOfflineQueue();
  }

  return { syncedCount, errors };
}

// Voice-to-Text Speech Recognition helper for teachers
export function startVoiceRecognition(
  onResult: (text: string) => void,
  onError: (err: string) => void
): { stop: () => void } | null {
  if (typeof window === 'undefined') return null;

  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    onError('Speech recognition not supported in this browser. Simulated voice prompt enabled.');
    // Simulated speech result after 2 seconds
    const timer = setTimeout(() => {
      onResult('Lucas engaged with Golden Bead multiplication exercise for 25 minutes with intense concentration and self-corrected exchange.');
    }, 1500);
    return { stop: () => clearTimeout(timer) };
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  recognition.onerror = (event: any) => {
    onError(event.error || 'Voice recording failed');
  };

  recognition.start();

  return {
    stop: () => {
      try {
        recognition.stop();
      } catch (e) {}
    }
  };
}
