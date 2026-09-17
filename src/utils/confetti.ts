import confetti from 'canvas-confetti';

/**
 * Triggers a vibrant confetti and particle explosion when completing a lesson.
 */
export function triggerLessonCompletionConfetti() {
  // Center-left and Center-right burst with vivid creator colors
  const count = 80;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
    disableForReducedMotion: true,
  };

  // First burst: vibrant purple and cyan
  confetti({
    ...defaults,
    particleCount: Math.floor(count * 0.6),
    spread: 60,
    startVelocity: 40,
    colors: ['#8B5CF6', '#3B82F6', '#22D3EE', '#A855F7', '#34D399', '#EC4899'],
    shapes: ['circle', 'square'],
    scalar: 1.1,
  });

  // Second delayed burst: stars and gold sparkles
  setTimeout(() => {
    confetti({
      ...defaults,
      particleCount: Math.floor(count * 0.4),
      spread: 90,
      startVelocity: 35,
      colors: ['#FBBF24', '#F59E0B', '#60A5FA', '#C084FC'],
      shapes: ['star', 'circle'],
      scalar: 1.2,
      gravity: 0.9,
    });
  }, 120);
}

/**
 * Triggers an epic multi-stage cannon blast when unlocking a new badge.
 */
export function triggerBadgeUnlockConfetti() {
  const duration = 1500;
  const animationEnd = Date.now() + duration;
  const defaults = {
    startVelocity: 45,
    spread: 360,
    ticks: 80,
    zIndex: 9999,
    disableForReducedMotion: true,
  };

  // Left & Right side cannons
  confetti({
    ...defaults,
    particleCount: 50,
    angle: 60,
    spread: 55,
    origin: { x: 0.1, y: 0.75 },
    colors: ['#FFD700', '#FFA500', '#8B5CF6', '#EC4899', '#38BDF8'],
    shapes: ['star', 'circle'],
    scalar: 1.2,
  });

  confetti({
    ...defaults,
    particleCount: 50,
    angle: 120,
    spread: 55,
    origin: { x: 0.9, y: 0.75 },
    colors: ['#FFD700', '#FFA500', '#8B5CF6', '#EC4899', '#38BDF8'],
    shapes: ['star', 'circle'],
    scalar: 1.2,
  });

  // Center golden star shower
  setTimeout(() => {
    confetti({
      particleCount: 60,
      spread: 100,
      origin: { x: 0.5, y: 0.4 },
      zIndex: 9999,
      colors: ['#FFD700', '#FDE047', '#A78BFA', '#F472B6', '#FFFFFF'],
      shapes: ['star'],
      scalar: 1.4,
      gravity: 0.8,
    });
  }, 250);

  // Interval rain of sparkles
  const interval: ReturnType<typeof setInterval> = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) {
      clearInterval(interval);
      return;
    }

    const particleCount = 20 * (timeLeft / duration);
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.2, 0.8), y: Math.random() - 0.2 },
      colors: ['#8B5CF6', '#3B82F6', '#F59E0B', '#10B981', '#EC4899'],
      shapes: ['circle', 'square'],
      scalar: 0.9,
    });
  }, 250);
}

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
