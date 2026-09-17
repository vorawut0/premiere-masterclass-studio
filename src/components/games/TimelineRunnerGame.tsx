import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Trophy, 
  Zap, 
  Scissors, 
  ArrowUp, 
  ArrowDown, 
  Heart, 
  Sparkles,
  Shield,
  Clock,
  HelpCircle,
  Users,
  Layers,
  Palette,
  Plus,
  Trash2,
  Edit3,
  Dices,
  CheckCircle2,
  MapPin,
  Flame,
  Award,
  Film
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import { gameAudio } from '../../utils/gameAudio';
import { 
  RUNNER_CHARACTERS, 
  RunnerCharacter, 
  CharacterAvatarSvg,
  RunnerStage,
  PRESET_STAGES,
  STAGE_BIOMES,
  loadCustomHeroes,
  loadCustomStages,
  deleteCustomHero,
  deleteCustomStage
} from './timelineRunnerData';
import { CharacterCreatorModal } from './CharacterCreatorModal';
import { StageMakerModal } from './StageMakerModal';
import { FilmstripLevelTransition } from './FilmstripLevelTransition';

interface TimelineRunnerGameProps {
  onComplete: (score: number) => void;
  onScoreUpdate: (score: number) => void;
}

interface Obstacle {
  x: number;
  y: number;
  w: number;
  h: number;
  type: 'red_bar' | 'media_offline' | 'high_bar';
  slashed?: boolean;
}

interface Collectible {
  x: number;
  y: number;
  w: number;
  h: number;
  type: 'keyframe' | 'lut' | 'green_bar' | 'audio_wave';
  collected?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

export const TimelineRunnerGame: React.FC<TimelineRunnerGameProps> = ({
  onComplete,
  onScoreUpdate
}) => {
  // Game states: 'menu' | 'playing' | 'gameover' | 'victory'
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover' | 'victory'>('menu');
  
  // Characters & Custom Roster
  const [characters, setCharacters] = useState<RunnerCharacter[]>(() => {
    return [...RUNNER_CHARACTERS, ...loadCustomHeroes()];
  });
  const [selectedChar, setSelectedChar] = useState<RunnerCharacter>(RUNNER_CHARACTERS[0]);

  // Stages & Custom Sequences
  const [stages, setStages] = useState<RunnerStage[]>(() => {
    return [...PRESET_STAGES, ...loadCustomStages()];
  });
  const [selectedStage, setSelectedStage] = useState<RunnerStage>(PRESET_STAGES[0]);

  // Studio Modals
  const [isCharCreatorOpen, setIsCharCreatorOpen] = useState(false);
  const [editingHero, setEditingHero] = useState<RunnerCharacter | null>(null);

  const [isStageMakerOpen, setIsStageMakerOpen] = useState(false);
  const [editingStage, setEditingStage] = useState<RunnerStage | null>(null);

  // Level Filmstrip Transition State
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionTargetStage, setTransitionTargetStage] = useState<RunnerStage | null>(null);
  const [transitionTargetChar, setTransitionTargetChar] = useState<RunnerCharacter | null>(null);

  // Active Menu Tab: 'stages' | 'characters'
  const [menuTab, setMenuTab] = useState<'stages' | 'characters'>('stages');

  // Gameplay Run Stats
  const [score, setScore] = useState(0);
  const [distance, setDistance] = useState(0);
  const [combo, setCombo] = useState(1);
  const [lives, setLives] = useState(3);
  const [hasShield, setHasShield] = useState(false);
  const [slashedCount, setSlashedCount] = useState(0);
  const [isSlashing, setIsSlashing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number>(0);

  // Mutable Game Loop State
  const gameLoopState = useRef({
    score: 0,
    distance: 0,
    targetDistance: 1000,
    combo: 1,
    lives: 3,
    hasShield: false,
    slashedCount: 0,
    speed: 5.5,
    isJumping: false,
    isSliding: false,
    isSlashing: false,
    slashCooldown: 0,
    jumpCount: 0,
    playerY: 0,
    playerVy: 0,
    groundY: 220,
    obstacles: [] as Obstacle[],
    collectibles: [] as Collectible[],
    particles: [] as Particle[],
    bgOffset: 0,
    timecodeFrames: 0,
    spawnTimer: 0,
    itemSpawnTimer: 0,
    slashAnimProgress: 0,
    char: RUNNER_CHARACTERS[0],
    stage: PRESET_STAGES[0]
  });

  // Reload custom creations from local storage
  const refreshVault = () => {
    const customH = loadCustomHeroes();
    setCharacters([...RUNNER_CHARACTERS, ...customH]);
    const customS = loadCustomStages();
    setStages([...PRESET_STAGES, ...customS]);
  };

  // Start the Game with Selected Character & Stage
  const startGame = (char: RunnerCharacter, stage: RunnerStage = selectedStage) => {
    setSelectedChar(char);
    setSelectedStage(stage);

    const gl = gameLoopState.current;
    gl.char = char;
    gl.stage = stage;
    gl.score = 0;
    gl.distance = 0;
    gl.targetDistance = stage.distance || 1000;
    gl.combo = 1;
    gl.lives = 3;
    // Perks check: Kru Phutsa, Byte or Green Cache Shield starts with 1 free shield
    const startsWithShield = char.id === 'kru_phutsa' || char.id === 'byte' || char.perkId === 'green_shield';
    gl.hasShield = startsWithShield;
    gl.slashedCount = 0;

    // Speed calculation from character & stage
    const baseSpeed = 5.5 * (char.speed / 85) * (stage.speedMultiplier || 1.0);
    gl.speed = baseSpeed;

    gl.isJumping = false;
    gl.isSliding = false;
    gl.isSlashing = false;
    gl.slashCooldown = 0;
    gl.jumpCount = 0;
    gl.playerY = 0;
    gl.playerVy = 0;
    gl.obstacles = [];
    gl.collectibles = [];
    gl.particles = [];
    gl.bgOffset = 0;
    gl.timecodeFrames = 0;
    gl.spawnTimer = 40;
    gl.itemSpawnTimer = 20;

    setScore(0);
    setDistance(0);
    setCombo(1);
    setLives(3);
    setHasShield(startsWithShield);
    setSlashedCount(0);
    setGameState('playing');

    gameAudio.playClick();
  };

  // Cinematic Filmstrip Level Transition Trigger
  const triggerLevelTransition = (targetStage: RunnerStage, targetChar: RunnerCharacter = selectedChar) => {
    setSelectedStage(targetStage);
    setSelectedChar(targetChar);
    setTransitionTargetStage(targetStage);
    setTransitionTargetChar(targetChar);
    setIsTransitioning(true);
  };

  const handleTransitionComplete = () => {
    setIsTransitioning(false);
    if (transitionTargetStage && transitionTargetChar) {
      startGame(transitionTargetChar, transitionTargetStage);
    } else {
      startGame(selectedChar, selectedStage);
    }
  };

  // Jump Action (Supports Double Jump)
  const triggerJump = useCallback(() => {
    const gl = gameLoopState.current;
    if (gl.jumpCount < 2) {
      const jumpImpulse = (gl.char.jumpPower / 88) * 11.5;
      gl.playerVy = -jumpImpulse;
      gl.isJumping = true;
      gl.isSliding = false;
      gl.jumpCount++;
      gameAudio.playJump();

      // Jump dust particles
      for (let i = 0; i < 6; i++) {
        gl.particles.push({
          x: 90,
          y: gl.groundY - gl.playerY + 20,
          vx: (Math.random() - 0.5) * 3 - 2,
          vy: Math.random() * 2,
          color: gl.char.themeColor || '#8B5CF6',
          size: 3 + Math.random() * 3,
          life: 1,
          maxLife: 20
        });
      }
    }
  }, []);

  // Slide Action
  const triggerSlide = useCallback((active: boolean) => {
    const gl = gameLoopState.current;
    if (active) {
      if (!gl.isJumping) {
        gl.isSliding = true;
        gameAudio.playSlide();
      }
    } else {
      gl.isSliding = false;
    }
  }, []);

  // Razor / Tool Slash Action
  const triggerSlash = useCallback(() => {
    const gl = gameLoopState.current;
    if (gl.slashCooldown <= 0) {
      gl.isSlashing = true;
      gl.slashAnimProgress = 16;
      // Faster slash if Kai or Razor Rush perk
      const isFastSlash = gl.char.id === 'kai' || gl.char.perkId === 'razor_rush';
      gl.slashCooldown = isFastSlash ? 14 : 22;
      setIsSlashing(true);
      gameAudio.playSlash();

      // Slash sweep particles
      for (let i = 0; i < 14; i++) {
        gl.particles.push({
          x: 100 + Math.random() * 40,
          y: gl.groundY - gl.playerY - 20 + (Math.random() - 0.5) * 40,
          vx: 4 + Math.random() * 5,
          vy: (Math.random() - 0.5) * 4,
          color: gl.char.accentColor || '#38BDF8',
          size: 3 + Math.random() * 3,
          life: 1,
          maxLife: 16
        });
      }

      // Check collision with obstacles in range
      const playerX = 80;
      const slashReach = 115;
      gl.obstacles.forEach(obs => {
        if (!obs.slashed && obs.x > playerX && obs.x < playerX + slashReach) {
          if (obs.type === 'red_bar' || obs.type === 'media_offline') {
            obs.slashed = true;
            gl.slashedCount++;
            setSlashedCount(gl.slashedCount);

            // Points bonus
            const basePts = (gl.char.id === 'kai' || gl.char.perkId === 'razor_rush') ? 220 : 130;
            const bonus = basePts * gl.combo;
            gl.score += bonus;
            setScore(gl.score);
            onScoreUpdate(gl.score);

            // Confetti explosion at obstacle
            for (let i = 0; i < 16; i++) {
              gl.particles.push({
                x: obs.x + obs.w / 2,
                y: obs.y + obs.h / 2,
                vx: (Math.random() - 0.5) * 7,
                vy: (Math.random() - 0.5) * 7,
                color: '#EF4444',
                size: 4 + Math.random() * 4,
                life: 1,
                maxLife: 25
              });
            }
          }
        }
      });

      setTimeout(() => setIsSlashing(false), 200);
    }
  }, [onScoreUpdate]);

  // Keyboard controls listener
  useEffect(() => {
    if (gameState !== 'playing') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        triggerJump();
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        e.preventDefault();
        triggerSlide(true);
      } else if (e.code === 'KeyC' || e.code === 'KeyF' || e.code === 'KeyE') {
        e.preventDefault();
        triggerSlash();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        triggerSlide(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, triggerJump, triggerSlide, triggerSlash]);

  // Main 60 FPS Game Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;
    const gl = gameLoopState.current;
    const currentBiome = STAGE_BIOMES[gl.stage.biomeId] || STAGE_BIOMES.cyber_dark;

    const loop = () => {
      if (!isRunning) return;

      // -------------------------------------------------------------
      // 1. UPDATE GAME PHYSICS & LOGIC
      // -------------------------------------------------------------
      gl.timecodeFrames++;
      gl.bgOffset = (gl.bgOffset + gl.speed) % 240;

      // Update distance
      gl.distance += gl.speed * 0.08;
      const roundedDist = Math.floor(gl.distance);
      setDistance(roundedDist);

      // Check Victory Condition
      if (roundedDist >= gl.targetDistance) {
        setGameState('victory');
        gameAudio.playVictory();
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
        onComplete(gl.score + 1000);
        return;
      }

      // Player Gravity Physics
      if (gl.isJumping) {
        gl.playerY += gl.playerVy;
        gl.playerVy += 0.58; // Gravity

        // Land on ground
        if (gl.playerY <= 0) {
          gl.playerY = 0;
          gl.playerVy = 0;
          gl.isJumping = false;
          gl.jumpCount = 0;
        }
      }

      // Slash Cooldown & Animation
      if (gl.slashCooldown > 0) gl.slashCooldown--;
      if (gl.slashAnimProgress > 0) gl.slashAnimProgress--;

      // -------------------------------------------------------------
      // 2. SPAWN OBSTACLES & COLLECTIBLES (Adaptive to Stage Settings)
      // -------------------------------------------------------------
      gl.spawnTimer--;
      if (gl.spawnTimer <= 0) {
        // Spawn rates from stage settings
        const rateMultiplier = gl.stage.obstacleRate === 'low' ? 1.4 : gl.stage.obstacleRate === 'high' ? 0.8 : gl.stage.obstacleRate === 'dense' ? 0.65 : 1.0;
        gl.spawnTimer = Math.floor((45 + Math.random() * 40) * rateMultiplier);

        const types: ('red_bar' | 'media_offline' | 'high_bar')[] = ['red_bar', 'media_offline', 'high_bar'];
        const type = types[Math.floor(Math.random() * types.length)];

        if (type === 'high_bar') {
          // Overhead bar (must slide under)
          gl.obstacles.push({
            x: canvas.width + 20,
            y: gl.groundY - 56,
            w: 48,
            h: 18,
            type: 'high_bar'
          });
        } else if (type === 'media_offline') {
          // Tall box (must jump over or slash)
          gl.obstacles.push({
            x: canvas.width + 20,
            y: gl.groundY - 36,
            w: 32,
            h: 36,
            type: 'media_offline'
          });
        } else {
          // Red ground render spike
          gl.obstacles.push({
            x: canvas.width + 20,
            y: gl.groundY - 30,
            w: 28,
            h: 30,
            type: 'red_bar'
          });
        }
      }

      gl.itemSpawnTimer--;
      if (gl.itemSpawnTimer <= 0) {
        const itemDensity = gl.stage.itemRate === 'abundant' ? 0.7 : gl.stage.itemRate === 'rare' ? 1.5 : 1.0;
        gl.itemSpawnTimer = Math.floor((30 + Math.random() * 45) * itemDensity);

        const itemTypes: ('keyframe' | 'lut' | 'green_bar' | 'audio_wave')[] = ['keyframe', 'lut', 'green_bar', 'audio_wave'];
        const itype = itemTypes[Math.floor(Math.random() * itemTypes.length)];
        const spawnHigh = Math.random() > 0.45;

        gl.collectibles.push({
          x: canvas.width + 20,
          y: spawnHigh ? gl.groundY - 60 - Math.random() * 25 : gl.groundY - 24,
          w: 18,
          h: 18,
          type: itype
        });
      }

      // Move Obstacles
      gl.obstacles.forEach(obs => {
        obs.x -= gl.speed;
      });
      gl.obstacles = gl.obstacles.filter(obs => obs.x > -60);

      // Move Collectibles
      const playerX = 80;
      const playerEffectiveY = gl.groundY - gl.playerY - (gl.isSliding ? 14 : 32);

      gl.collectibles.forEach(item => {
        item.x -= gl.speed;

        // Perk: Keyframe Magnet attracts items towards player
        if (gl.char.perkId === 'magnet_keyframe') {
          const dx = playerX - item.x;
          const dy = playerEffectiveY - item.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            item.x += (dx / dist) * 4;
            item.y += (dy / dist) * 3;
          }
        }
      });
      gl.collectibles = gl.collectibles.filter(item => item.x > -40);

      // -------------------------------------------------------------
      // 3. COLLISION DETECTION (Player Box vs Obstacles)
      // -------------------------------------------------------------
      const playerH = gl.isSliding ? 16 : 38;
      const playerW = gl.isSliding ? 42 : 24;
      const playerTop = gl.groundY - gl.playerY - playerH;
      const playerBottom = gl.groundY - gl.playerY;

      // Obstacle Collisions
      gl.obstacles.forEach(obs => {
        if (obs.slashed) return;

        const obsRight = obs.x + obs.w;
        const obsBottom = obs.y + obs.h;

        // AABB Collision Box check
        const overlapX = playerX + playerW > obs.x && playerX < obsRight;
        const overlapY = playerBottom > obs.y && playerTop < obsBottom;

        if (overlapX && overlapY) {
          // If player has a shield active, consume shield!
          if (gl.hasShield) {
            gl.hasShield = false;
            setHasShield(false);
            obs.slashed = true;
            gameAudio.playShieldBreak();

            // Shield break particle burst
            for (let i = 0; i < 20; i++) {
              gl.particles.push({
                x: playerX + 16,
                y: playerTop + 16,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                color: '#34D399',
                size: 3 + Math.random() * 3,
                life: 1,
                maxLife: 20
              });
            }
            return;
          }

          // Otherwise lose life
          gl.lives -= 1;
          setLives(gl.lives);
          gl.combo = 1; // Reset combo
          setCombo(1);
          obs.slashed = true;
          gameAudio.playHurt();

          // Camera shake effect
          ctx.translate((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6);

          if (gl.lives <= 0) {
            setGameState('gameover');
            gameAudio.playGameOver();
            onScoreUpdate(gl.score);
          }
        }
      });

      // Collectible Collisions
      gl.collectibles.forEach(item => {
        if (item.collected) return;

        const overlapX = playerX + playerW > item.x && playerX < item.x + item.w;
        const overlapY = playerBottom > item.y && playerTop < item.y + item.h;

        if (overlapX && overlapY) {
          item.collected = true;
          gameAudio.playPickup();

          let pts = 50;
          if (item.type === 'lut') {
            pts = (gl.char.id === 'lumi' || gl.char.perkId === 'lut_multiplier') ? 200 : 100;
          } else if (item.type === 'green_bar') {
            pts = 80;
            // Free shield or life restoration
            if (gl.lives < 3) {
              gl.lives++;
              setLives(gl.lives);
            } else {
              gl.hasShield = true;
              setHasShield(true);
            }
          } else if (item.type === 'audio_wave') {
            pts = 75;
            // DJ Rex or Sonic Pulse perk: sweep away obstacles ahead!
            if (gl.char.id === 'rex' || gl.char.perkId === 'sonic_pulse') {
              gameAudio.playPowerup();
              gl.obstacles.forEach(o => {
                if (o.x > playerX && o.x < playerX + 350) {
                  o.slashed = true;
                }
              });
            }
          }

          // Combo increment
          gl.combo = Math.min(5, gl.combo + 1);
          setCombo(gl.combo);

          const finalPts = pts * gl.combo;
          gl.score += finalPts;
          setScore(gl.score);
          onScoreUpdate(gl.score);

          // Sparkle particles
          const color = item.type === 'lut' ? '#EC4899' : item.type === 'green_bar' ? '#10B981' : item.type === 'audio_wave' ? '#F59E0B' : '#38BDF8';
          for (let i = 0; i < 10; i++) {
            gl.particles.push({
              x: item.x + item.w / 2,
              y: item.y + item.h / 2,
              vx: (Math.random() - 0.5) * 5,
              vy: (Math.random() - 0.5) * 5,
              color,
              size: 3 + Math.random() * 2.5,
              life: 1,
              maxLife: 18
            });
          }
        }
      });

      // Update Particles
      gl.particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
      });
      gl.particles = gl.particles.filter(p => p.life < p.maxLife);

      // -------------------------------------------------------------
      // 4. RENDER CANVAS SCENE (60 FPS) WITH DYNAMIC BIOMES
      // -------------------------------------------------------------
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Atmosphere Gradient based on active Stage Biome
      const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGrad.addColorStop(0, currentBiome.bgTop);
      bgGrad.addColorStop(0.55, currentBiome.bgMid);
      bgGrad.addColorStop(1, currentBiome.bgBottom);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Biome Special VFX Backdrops
      if (gl.stage.biomeId === 'kru_phutsa_lab') {
        // Kru Phutsa Media Lab Background (Circuit lines, Idea Bulbs, Code symbols, and Channel Motto)
        ctx.save();
        // Slogan banner watermark in the background
        ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('ครูพุทรา สร้างสื่อแบบง่ายๆ • ทำง่าย ใช้ได้จริง ครูทำได้ นักเรียนชอบ', canvas.width / 2, 70);

        // Tech Circuit PCB lines
        ctx.strokeStyle = 'rgba(14, 165, 233, 0.25)';
        ctx.lineWidth = 1.5;
        const circOffset = (gl.bgOffset * 0.4) % 120;
        for (let cx = -circOffset; cx < canvas.width; cx += 120) {
          ctx.beginPath();
          ctx.moveTo(cx, 45);
          ctx.lineTo(cx + 40, 45);
          ctx.lineTo(cx + 60, 80);
          ctx.lineTo(cx + 100, 80);
          ctx.stroke();
          // Circuit nodes
          ctx.fillStyle = '#FBBF24';
          ctx.beginPath();
          ctx.arc(cx + 40, 45, 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#38BDF8';
          ctx.beginPath();
          ctx.arc(cx + 100, 80, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Floating glowing Code & Idea symbols
        ctx.fillStyle = 'rgba(251, 191, 36, 0.22)';
        ctx.font = 'bold 16px monospace';
        ctx.fillText('💡', canvas.width * 0.2, 115);
        ctx.fillText('💡', canvas.width * 0.8, 110);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.fillText('</>', canvas.width * 0.35, 118);
        ctx.fillText('</>', canvas.width * 0.65, 122);
        ctx.restore();
      } else if (gl.stage.biomeId === 'retrowave_sunset') {
        // Retrowave Neon Horizon Sun
        ctx.save();
        const sunY = 90;
        const sunRadius = 45;
        const sunGrad = ctx.createLinearGradient(0, sunY - sunRadius, 0, sunY + sunRadius);
        sunGrad.addColorStop(0, '#F59E0B');
        sunGrad.addColorStop(0.5, '#EC4899');
        sunGrad.addColorStop(1, '#8B5CF6');
        ctx.fillStyle = sunGrad;
        ctx.beginPath();
        ctx.arc(canvas.width / 2, sunY, sunRadius, Math.PI, 0, false);
        ctx.fill();

        // Horizontal sun stripes
        ctx.fillStyle = currentBiome.bgMid;
        for (let sy = sunY - 20; sy < sunY; sy += 7) {
          ctx.fillRect(canvas.width / 2 - sunRadius, sy, sunRadius * 2, 2.5);
        }
        ctx.restore();
      } else if (gl.stage.biomeId === 'lumetri_neon') {
        // Floating lumetri chromatic rings
        ctx.save();
        ctx.strokeStyle = 'rgba(236, 72, 153, 0.15)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(canvas.width * 0.75, 75, 48, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
        ctx.beginPath();
        ctx.arc(canvas.width * 0.25, 80, 36, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      } else if (gl.stage.biomeId === 'render_core') {
        // GPU matrix processor grid
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.08)';
        ctx.lineWidth = 1;
        for (let gx = 0; gx < canvas.width; gx += 40) {
          ctx.beginPath();
          ctx.moveTo(gx, 32);
          ctx.lineTo(gx, gl.groundY);
          ctx.stroke();
        }
      }

      // 3. Timeline Ruler Header (Timecode & Ticks)
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.fillRect(0, 0, canvas.width, 32);
      ctx.strokeStyle = currentBiome.trackBorder;
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, canvas.width, 32);

      // Moving ruler ticks
      ctx.strokeStyle = '#64748B';
      for (let x = -gl.bgOffset; x < canvas.width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 24);
        ctx.lineTo(x, 32);
        ctx.stroke();
      }

      // Ruler Timecode text & Stage Name
      const totalSec = Math.floor(gl.distance / 10);
      const frames = gl.timecodeFrames % 30;
      const tcText = `${gl.stage.title} • 00:00:${String(totalSec).padStart(2, '0')}:${String(frames).padStart(2, '0')} • ${gl.stage.bpm} BPM`;
      ctx.fillStyle = currentBiome.ambientParticleColor;
      ctx.font = 'bold 10px monospace';
      ctx.fillText(tcText, 14, 20);

      // 4. Multi-Tracks (V2, V1, A1)
      const tracks = [
        { label: 'V2 Overlay', y: 40, h: 50, bg: 'rgba(56, 189, 248, 0.03)', border: currentBiome.trackBorder },
        { label: 'V1 Main Video', y: 95, h: 70, bg: 'rgba(139, 92, 246, 0.05)', border: currentBiome.trackBorder },
        { label: 'A1 Master Audio', y: 170, h: 55, bg: 'rgba(16, 185, 129, 0.04)', border: currentBiome.trackBorder }
      ];

      tracks.forEach(tr => {
        ctx.fillStyle = tr.bg;
        ctx.fillRect(0, tr.y, canvas.width, tr.h);
        ctx.strokeStyle = tr.border;
        ctx.strokeRect(0, tr.y, canvas.width, tr.h);

        // Track header badge on left
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.fillRect(0, tr.y, 75, tr.h);
        ctx.fillStyle = '#94A3B8';
        ctx.font = '9px monospace';
        ctx.fillText(tr.label, 8, tr.y + tr.h / 2 + 3);
      });

      // Audio waveform simulation in A1 track
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x += 8) {
        const waveH = Math.sin((x + gl.timecodeFrames * 6) * 0.05) * 12;
        ctx.moveTo(x, 197 - waveH);
        ctx.lineTo(x, 197 + waveH);
      }
      ctx.stroke();

      // Ground Line (Timeline playhead baseline in Biome glow color)
      ctx.strokeStyle = currentBiome.groundColor;
      ctx.lineWidth = 3;
      ctx.shadowColor = currentBiome.glowColor;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(0, gl.groundY);
      ctx.lineTo(canvas.width, gl.groundY);
      ctx.stroke();
      ctx.shadowBlur = 0; // reset blur

      // Playhead vertical needle indicator
      ctx.strokeStyle = currentBiome.needleColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(96, 32);
      ctx.lineTo(96, gl.groundY);
      ctx.stroke();

      // Playhead top marker
      ctx.fillStyle = currentBiome.needleColor;
      ctx.beginPath();
      ctx.moveTo(90, 32);
      ctx.lineTo(102, 32);
      ctx.lineTo(96, 42);
      ctx.closePath();
      ctx.fill();

      // 5. Render Collectibles
      gl.collectibles.forEach(item => {
        if (item.collected) return;

        if (item.type === 'keyframe') {
          // Diamond Keyframe
          ctx.save();
          ctx.translate(item.x + item.w / 2, item.y + item.h / 2);
          ctx.rotate(Math.PI / 4);
          ctx.fillStyle = '#38BDF8';
          ctx.shadowColor = '#38BDF8';
          ctx.shadowBlur = 10;
          ctx.fillRect(-8, -8, 16, 16);
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(-3, -3, 6, 6);
          ctx.restore();
        } else if (item.type === 'lut') {
          // 3D LUT Cube
          ctx.save();
          ctx.translate(item.x + item.w / 2, item.y + item.h / 2);
          ctx.fillStyle = '#EC4899';
          ctx.shadowColor = '#EC4899';
          ctx.shadowBlur = 12;
          ctx.fillRect(-9, -9, 18, 18);
          // Color bands
          ctx.fillStyle = '#8B5CF6';
          ctx.fillRect(-9, -9, 6, 18);
          ctx.fillStyle = '#F59E0B';
          ctx.fillRect(3, -9, 6, 18);
          ctx.restore();
        } else if (item.type === 'green_bar') {
          // Golden/Green Render Bar
          ctx.save();
          ctx.fillStyle = '#10B981';
          ctx.shadowColor = '#10B981';
          ctx.shadowBlur = 12;
          ctx.fillRect(item.x, item.y, item.w, item.h);
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 9px monospace';
          ctx.fillText('REN', item.x + 2, item.y + 16);
          ctx.restore();
        } else if (item.type === 'audio_wave') {
          // Audio Master Wave
          ctx.save();
          ctx.fillStyle = '#F59E0B';
          ctx.shadowColor = '#F59E0B';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(item.x + item.w / 2, item.y + item.h / 2, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 10px monospace';
          ctx.fillText('♫', item.x + 6, item.y + 16);
          ctx.restore();
        }
      });

      // 6. Render Obstacles
      gl.obstacles.forEach(obs => {
        if (obs.slashed) {
          // Faded slashed obstacle
          ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
          ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
          return;
        }

        if (obs.type === 'media_offline') {
          // Famous Red-and-White Media Offline icon
          ctx.fillStyle = '#DC2626';
          ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(obs.x + 4, obs.y + 4, obs.w - 8, obs.h - 8);
          ctx.fillStyle = '#DC2626';
          ctx.font = 'bold 9px sans-serif';
          ctx.fillText('OFF', obs.x + 7, obs.y + 22);
        } else if (obs.type === 'high_bar') {
          // Red overhead render unrendered bar
          ctx.fillStyle = '#EF4444';
          ctx.shadowColor = '#EF4444';
          ctx.shadowBlur = 8;
          ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
          ctx.fillStyle = '#FFFFFF';
          ctx.font = '8px monospace';
          ctx.fillText('UNRENDERED', obs.x + 2, obs.y + 14);
        } else {
          // Red ground render spike
          ctx.fillStyle = '#EF4444';
          ctx.shadowColor = '#EF4444';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.moveTo(obs.x, obs.y + obs.h);
          ctx.lineTo(obs.x + obs.w / 2, obs.y);
          ctx.lineTo(obs.x + obs.w, obs.y + obs.h);
          ctx.closePath();
          ctx.fill();
        }
      });

      // 7. Render Particles
      gl.particles.forEach(p => {
        const alpha = 1 - p.life / p.maxLife;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // 8. Render Character Sprite
      ctx.save();
      const charX = playerX;
      const charY = gl.groundY - gl.playerY;

      // Character Shield Glow if active
      if (gl.hasShield) {
        ctx.strokeStyle = '#34D399';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#34D399';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.ellipse(charX + 16, charY - 22, 26, 32, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw Character based on custom attributes or default heroes
      const charSkin = gl.char.skinTone || '#FDE047';
      const charTheme = gl.char.themeColor || '#8B5CF6';
      const charAccent = gl.char.accentColor || '#38BDF8';

      if (gl.char.id === 'kru_phutsa') {
        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.ellipse(charX + 16, gl.groundY + 2, 16, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        if (gl.isSliding) {
          // Sliding pose in civil servant uniform
          ctx.fillStyle = '#C2A675'; // Khaki shirt
          ctx.fillRect(charX, charY - 20, 48, 16);
          // Gold epaulettes
          ctx.fillStyle = '#FBBF24';
          ctx.fillRect(charX + 20, charY - 20, 8, 4);
          // Head
          ctx.fillStyle = '#FDE68A';
          ctx.beginPath();
          ctx.arc(charX + 42, charY - 12, 8, 0, Math.PI * 2);
          ctx.fill();
          // Hair
          ctx.fillStyle = '#18181B';
          ctx.beginPath();
          ctx.arc(charX + 42, charY - 16, 7, Math.PI, Math.PI * 2);
          ctx.fill();
        } else {
          // Running / Jumping pose
          const legPhase = Math.sin(gl.timecodeFrames * 0.3);
          // Khaki trousers legs
          ctx.strokeStyle = '#785E34';
          ctx.lineWidth = 4.5;
          ctx.beginPath();
          ctx.moveTo(charX + 10, charY - 14);
          ctx.lineTo(charX + 6 + legPhase * 8, charY);
          ctx.moveTo(charX + 22, charY - 14);
          ctx.lineTo(charX + 26 - legPhase * 8, charY);
          ctx.stroke();

          // Khaki Uniform Shirt Torso
          ctx.fillStyle = '#C2A675';
          ctx.fillRect(charX + 5, charY - 34, 22, 20);

          // Golden Shoulder Epaulettes (อินทรธนูทอง)
          ctx.fillStyle = '#FBBF24';
          ctx.fillRect(charX + 3, charY - 34, 6, 3);
          ctx.fillRect(charX + 23, charY - 34, 6, 3);

          // Royal decoration ribbon bar (แถบแพร) on chest
          ctx.fillStyle = '#EF4444';
          ctx.fillRect(charX + 8, charY - 27, 3, 2.5);
          ctx.fillStyle = '#3B82F6';
          ctx.fillRect(charX + 11, charY - 27, 3, 2.5);
          ctx.fillStyle = '#EAB308';
          ctx.fillRect(charX + 14, charY - 27, 3, 2.5);

          // Head & Face
          ctx.fillStyle = '#FDE68A';
          ctx.beginPath();
          ctx.arc(charX + 16, charY - 41, 9, 0, Math.PI * 2);
          ctx.fill();

          // Black Neat Styled Hair (matching cartoon banner)
          ctx.fillStyle = '#18181B';
          ctx.beginPath();
          ctx.arc(charX + 16, charY - 45, 9, Math.PI * 0.9, Math.PI * 2.1);
          ctx.fill();
          // Side fringe
          ctx.fillRect(charX + 9, charY - 45, 4, 6);

          // Friendly Face (Eyes & Smile)
          ctx.fillStyle = '#18181B';
          ctx.beginPath();
          ctx.arc(charX + 19, charY - 41, 1.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#92400E';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(charX + 18, charY - 38, 2.5, 0, Math.PI);
          ctx.stroke();

          // Floating Idea Lightbulb 💡 / Code icon bobbing behind his shoulder
          const bobY = Math.sin(gl.timecodeFrames * 0.25) * 3;
          ctx.save();
          ctx.fillStyle = 'rgba(251, 191, 36, 0.25)';
          ctx.beginPath();
          ctx.arc(charX - 4, charY - 46 + bobY, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.font = '11px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('💡', charX - 4, charY - 42 + bobY);
          ctx.restore();
        }
      } else if (gl.char.id === 'byte') {
        // Robot Body
        ctx.fillStyle = charTheme;
        ctx.shadowColor = charTheme;
        ctx.shadowBlur = 10;
        ctx.fillRect(charX, charY - (gl.isSliding ? 22 : 42), 34, gl.isSliding ? 20 : 36);
        // CRT Screen
        ctx.fillStyle = '#064E3B';
        ctx.fillRect(charX + 4, charY - (gl.isSliding ? 18 : 38), 26, gl.isSliding ? 12 : 22);
        // Green Eye
        ctx.fillStyle = '#34D399';
        ctx.fillRect(charX + 12, charY - (gl.isSliding ? 14 : 30), 10, 6);
        // Thruster flame
        ctx.fillStyle = '#F59E0B';
        ctx.fillRect(charX + 10, charY - 6, 14, 8);
      } else {
        // Humanoid / Cyber Hero Body
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.ellipse(charX + 16, gl.groundY + 2, 16, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        if (gl.isSliding) {
          // Sliding pose
          ctx.fillStyle = charTheme;
          ctx.fillRect(charX, charY - 20, 48, 16);
          // Head
          ctx.fillStyle = charSkin;
          ctx.beginPath();
          ctx.arc(charX + 42, charY - 12, 8, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Running / Jumping pose
          const legPhase = Math.sin(gl.timecodeFrames * 0.3);
          // Legs
          ctx.strokeStyle = '#1E1B4B';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(charX + 10, charY - 14);
          ctx.lineTo(charX + 6 + legPhase * 8, charY);
          ctx.moveTo(charX + 22, charY - 14);
          ctx.lineTo(charX + 26 - legPhase * 8, charY);
          ctx.stroke();

          // Body Jacket
          ctx.fillStyle = charTheme;
          ctx.fillRect(charX + 6, charY - 34, 20, 20);

          // Head
          ctx.fillStyle = charSkin;
          ctx.beginPath();
          ctx.arc(charX + 16, charY - 40, 9, 0, Math.PI * 2);
          ctx.fill();

          // Glowing Visor
          ctx.fillStyle = gl.char.visorColor || charAccent;
          ctx.fillRect(charX + 15, charY - 42, 10, 4);

          // Headphones
          ctx.fillStyle = '#1E1B4B';
          ctx.beginPath();
          ctx.arc(charX + 8, charY - 40, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Weapon Slash Animation based on weapon type
      if (gl.slashAnimProgress > 0) {
        ctx.strokeStyle = charAccent;
        ctx.lineWidth = 4;
        ctx.shadowColor = charAccent;
        ctx.shadowBlur = 16;
        ctx.beginPath();
        const slashAngle = (16 - gl.slashAnimProgress) * 0.2;

        if (gl.char.id === 'kru_phutsa') {
          // Kru Phutsa's Golden-Cyan Easy Media Code & Lightbulb Slash Wave
          ctx.strokeStyle = '#F59E0B';
          ctx.lineWidth = 5;
          ctx.shadowColor = '#38BDF8';
          ctx.shadowBlur = 18;
          ctx.arc(charX + 32, charY - 20, 46, -0.7 + slashAngle, 0.9 + slashAngle);
          ctx.stroke();
          // Draw sparkling code brackets </>
          ctx.fillStyle = '#38BDF8';
          ctx.font = 'bold 12px monospace';
          ctx.fillText('</>', charX + 44, charY - 22);
        } else if (gl.char.weapon === 'scythe') {
          // Audio Scythe waveform swing
          ctx.arc(charX + 32, charY - 20, 48, -0.8 + slashAngle, 1.0 + slashAngle);
        } else if (gl.char.weapon === 'orb') {
          // Lumetri Prism Orb shockwave ring
          ctx.arc(charX + 28, charY - 24, 38, -1.0 + slashAngle, 1.2 + slashAngle);
        } else {
          // Razor Blade / Katana sharp arc
          ctx.arc(charX + 30, charY - 22, 42, -0.6 + slashAngle, 0.8 + slashAngle);
        }
        ctx.stroke();
      }

      ctx.restore();

      // Loop Next Frame
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [gameState, onComplete, onScoreUpdate]);

  return (
    <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-2xl bg-[#090B10] border border-white/15 shadow-2xl">
      
      {/* ----------------------------------------------------------- */}
      {/* SCREEN 1: TITLE & ARCADE STUDIO SUITE (SELECT / BUILD)      */}
      {/* ----------------------------------------------------------- */}
      {gameState === 'menu' && (
        <div className="p-4 sm:p-7 space-y-6 text-center animate-in fade-in duration-300">
          
          {/* Top Branding & Game Logo */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-purple-500/15 via-sky-500/15 to-emerald-500/15 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold tracking-widest uppercase">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>PREMIERE TIMELINE RUNNER STUDIO</span>
            </div>

            <div className="relative py-1">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-200 to-cyan-400 drop-shadow-[0_0_25px_rgba(139,92,246,0.6)]">
                TIMELINE RUNNER
              </h1>
              <div className="font-mono text-xs sm:text-sm tracking-widest text-[#38BDF8] uppercase font-bold flex items-center justify-center gap-2 mt-1">
                <span>◀◀</span>
                <span>RETRO ARCADE & LEVEL CREATOR STUDIO</span>
                <span>▶▶</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
              วิ่งบนแทร็กไทม์ไลน์ สับบาร์แดงด้วย <span className="text-sky-400 font-bold">Razor Tool (C)</span> ออกแบบด่านและสร้างตัวละครของคุณเองได้ใน Game Studio!
            </p>
          </div>

          {/* Studio Navigation Tabs (Stage Selection vs Character Selection) */}
          <div className="flex items-center justify-center gap-2 max-w-md mx-auto p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => { setMenuTab('stages'); gameAudio.playClick(); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                menuTab === 'stages'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>1. เลือกด่าน ({stages.length})</span>
            </button>
            <button
              onClick={() => { setMenuTab('characters'); gameAudio.playClick(); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                menuTab === 'characters'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>2. เลือกตัวละคร ({characters.length})</span>
            </button>
          </div>

          {/* TAB 1: STAGE SELECTION & STAGE MAKER */}
          {menuTab === 'stages' && (
            <div className="space-y-3 text-left animate-in fade-in duration-200">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400 px-1">
                <span className="flex items-center gap-1.5 text-white font-bold">
                  <Film className="w-4 h-4 text-emerald-400" />
                  <span>ด่านแผ่นฟิล์มไทม์ไลน์ (FILMSTRIP SEQUENCES):</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      triggerLevelTransition(selectedStage, selectedChar);
                    }}
                    id="test-film-transition-btn"
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 text-xs font-bold transition-colors cursor-pointer"
                    title="ทดสอบแอนิเมชันเลื่อนแผ่นฟิล์มตัดต่อ"
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>🎬 พรีวิวสครับฟิล์ม</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditingStage(null);
                      setIsStageMakerOpen(true);
                      gameAudio.playClick();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ สร้างด่านใหม่ (Stage Maker)</span>
                  </button>
                </div>
              </div>

              {/* Grid of Stages formatted like 35mm Film Cells */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {stages.map((stage, sIdx) => {
                  const isSelected = selectedStage.id === stage.id;
                  const biome = STAGE_BIOMES[stage.biomeId] || STAGE_BIOMES.cyber_dark;

                  return (
                    <div
                      key={stage.id}
                      onClick={() => {
                        setSelectedStage(stage);
                        gameAudio.playFilmStrip();
                      }}
                      className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all duration-200 flex flex-col justify-between group relative overflow-hidden ${
                        isSelected
                          ? 'border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.4)] scale-[1.02]'
                          : 'border-white/10 hover:border-white/30 hover:scale-[1.01]'
                      }`}
                      style={{
                        background: `linear-gradient(135deg, ${biome.bgTop}CC 0%, ${biome.bgBottom}EE 100%)`
                      }}
                    >
                      {/* Film Perforations Bar Top */}
                      <div className="flex items-center justify-between px-1 pb-2 mb-1 border-b border-white/10 opacity-70">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-3 rounded-[2px] bg-black border border-white/20 shadow-inner" />
                          <span className="w-2 h-3 rounded-[2px] bg-black border border-white/20 shadow-inner" />
                          <span className="w-2 h-3 rounded-[2px] bg-black border border-white/20 shadow-inner" />
                        </div>
                        <span className="font-mono text-[9px] text-amber-300/80 tracking-widest">
                          SEQ_{String(sIdx + 1).padStart(2, '0')} • 24FPS
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-3 rounded-[2px] bg-black border border-white/20 shadow-inner" />
                          <span className="w-2 h-3 rounded-[2px] bg-black border border-white/20 shadow-inner" />
                        </div>
                      </div>

                      {/* Film Playhead Guide Indicator (If Selected) */}
                      {isSelected && (
                        <div className="absolute top-0 bottom-0 left-1/3 w-0.5 bg-cyan-400/80 shadow-[0_0_8px_#38BDF8] pointer-events-none z-10 flex flex-col justify-between">
                          <div className="w-2 h-2 -ml-[3px] bg-cyan-400 rotate-45" />
                          <div className="w-2 h-2 -ml-[3px] bg-cyan-400 rotate-45" />
                        </div>
                      )}

                      <div>
                        {/* Biome Tag & Distance */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span 
                            className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase border"
                            style={{ 
                              borderColor: biome.glowColor, 
                              color: biome.ambientParticleColor, 
                              backgroundColor: 'rgba(0,0,0,0.5)' 
                            }}
                          >
                            {biome.nameTh}
                          </span>
                          <span className="text-[11px] font-mono text-cyan-300 font-bold flex items-center gap-1">
                            <span>{stage.distance}m</span>
                          </span>
                        </div>

                        {/* Title & Thai Subtitle */}
                        <div className="font-extrabold text-sm text-white group-hover:text-emerald-300 transition-colors">
                          {stage.title}
                        </div>
                        <div className="text-[11px] text-slate-200 mt-0.5 font-medium line-clamp-1">
                          {stage.titleTh}
                        </div>

                        {/* Description */}
                        <p className="text-[10px] text-slate-300 mt-1.5 leading-relaxed line-clamp-2">
                          {stage.desc}
                        </p>
                      </div>

                      {/* Film Perforations Bar Bottom & Footer Info */}
                      <div>
                        <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
                          <span className="text-amber-400 font-bold">{stage.bpm} BPM</span>
                          <span className="text-slate-300 uppercase">อัตราอุปสรรค: {stage.obstacleRate}</span>

                          {stage?.isUserCreated && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteCustomStage(stage.id);
                                refreshVault();
                                gameAudio.playHurt();
                              }}
                              className="p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded transition-colors"
                              title="ลบด่านนี้"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Film Sprockets Bottom Row */}
                        <div className="flex items-center justify-between px-1 pt-1.5 mt-1 border-t border-white/5 opacity-50">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2.5 rounded-[1px] bg-black border border-white/20" />
                            <span className="w-2 h-2.5 rounded-[1px] bg-black border border-white/20" />
                          </div>
                          <span className="font-mono text-[8px] text-slate-400 tracking-tighter">
                            PRORES 422 • TC 00:00:00:00
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2.5 rounded-[1px] bg-black border border-white/20" />
                            <span className="w-2 h-2.5 rounded-[1px] bg-black border border-white/20" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: CHARACTER SELECTION & HERO CREATOR */}
          {menuTab === 'characters' && (
            <div className="space-y-3 text-left animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
                <span className="flex items-center gap-1.5 text-white font-bold">
                  <Users className="w-4 h-4 text-purple-400" />
                  เลือกตัวละครของคุณ (CHARACTER ROSTER):
                </span>
                <button
                  onClick={() => {
                    setEditingHero(null);
                    setIsCharCreatorOpen(true);
                    gameAudio.playClick();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ สร้างตัวละครใหม่ (Hero Creator)</span>
                </button>
              </div>

              {/* Grid of Characters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {characters.map(char => {
                  const isSelected = selectedChar.id === char.id;
                  return (
                    <div
                      key={char.id}
                      onClick={() => {
                        setSelectedChar(char);
                        gameAudio.playClick();
                      }}
                      className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all duration-200 flex flex-col justify-between group ${
                        isSelected
                          ? 'bg-gradient-to-b from-purple-900/40 to-indigo-950/60 border-purple-400 shadow-[0_0_20px_rgba(139,92,246,0.35)] scale-[1.02]'
                          : 'bg-white/[0.02] hover:bg-white/[0.05] border-white/10 hover:border-white/25'
                      }`}
                    >
                      <div>
                        {/* Avatar & Badge */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="w-14 h-14 flex items-center justify-center">
                            <CharacterAvatarSvg char={char} size={54} isSelected={isSelected} />
                          </div>
                          <span 
                            className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase border"
                            style={{ 
                              borderColor: char.themeColor || '#8B5CF6', 
                              color: char.accentColor || '#38BDF8', 
                              backgroundColor: `${char.themeColor || '#8B5CF6'}15` 
                            }}
                          >
                            {char.badge}
                          </span>
                        </div>

                        {/* Name & Role */}
                        <div className="font-extrabold text-sm text-white group-hover:text-purple-300 transition-colors">
                          {char.name}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mb-2">
                          {char.role}
                        </div>

                        {/* Perk description */}
                        <div className="p-2 rounded-lg bg-black/40 border border-white/5 text-[11px] text-slate-300 space-y-0.5">
                          <div className="font-bold text-[10px] text-amber-300">
                            ⚡ {char.perkName}
                          </div>
                          <div className="text-[10px] leading-tight text-slate-400 line-clamp-2">
                            {char.perkDesc}
                          </div>
                        </div>
                      </div>

                      {/* Stats & Actions */}
                      <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                        <div className="grid grid-cols-3 gap-1 text-center flex-1">
                          <div>
                            <span className="text-slate-400 block text-[9px]">SPD</span>
                            <span className="font-bold text-white">{char.speed}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[9px]">JMP</span>
                            <span className="font-bold text-white">{char.jumpPower}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[9px]">POW</span>
                            <span className="font-bold text-white">{char.slashPower}</span>
                          </div>
                        </div>

                        {char?.isCustom && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteCustomHero(char.id);
                              refreshVault();
                              gameAudio.playHurt();
                            }}
                            className="p-1 ml-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded transition-colors"
                            title="ลบตัวละครนี้"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Cheatsheet & Control Keys */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex flex-wrap items-center justify-around gap-3 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-1.5">
              <kbd className="px-2 py-1 rounded bg-white/10 border border-white/20 text-white text-[11px]">Space</kbd> / <kbd className="px-2 py-1 rounded bg-white/10 border border-white/20 text-white text-[11px]">⬆</kbd>
              <span>กระโดด (Double Jump ได้)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="px-2 py-1 rounded bg-white/10 border border-white/20 text-white text-[11px]">⬇</kbd> / <kbd className="px-2 py-1 rounded bg-white/10 border border-white/20 text-white text-[11px]">S</kbd>
              <span>สไลด์ลอดคาน</span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="px-2 py-1 rounded bg-purple-500/20 border border-purple-400 text-purple-300 font-bold text-[11px]">C</kbd>
              <span>สับ Razor Blade ฟันบาร์แดง</span>
            </div>
          </div>

          {/* Start Play Button with Selected Stage & Hero Synopsis */}
          <div className="space-y-2">
            <button
              onClick={() => triggerLevelTransition(selectedStage, selectedChar)}
              id="start-runner-btn"
              className="px-9 py-3.5 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-extrabold text-base tracking-wide shadow-[0_0_30px_rgba(139,92,246,0.6)] cursor-pointer transition-transform hover:scale-105 flex items-center justify-center gap-3 mx-auto"
            >
              <Film className="w-5 h-5 text-amber-300" />
              <span>เริ่มสตาร์ทไทม์ไลน์: {selectedStage.title}</span>
            </button>
            <p className="text-[11px] font-mono text-slate-400">
              ตัวละคร: <span className="text-purple-300 font-bold">{selectedChar.name}</span> • ด่าน: <span className="text-emerald-300 font-bold">{selectedStage.titleTh}</span> ({selectedStage.distance}m)
            </p>
          </div>

        </div>
      )}

      {/* ----------------------------------------------------------- */}
      {/* SCREEN 2: ACTIVE GAMEPLAY CANVAS                            */}
      {/* ----------------------------------------------------------- */}
      {gameState === 'playing' && (
        <div className="relative">
          {/* Top HUD Overlay */}
          <div className="p-3 bg-black/75 backdrop-blur-md border-b border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            {/* Lives and Shield indicator */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(3)].map((_, i) => (
                  <Heart
                    key={i}
                    className={`w-4 h-4 ${
                      i < lives ? 'text-rose-500 fill-rose-500 drop-shadow-[0_0_6px_rgba(244,63,94,0.6)]' : 'text-slate-600'
                    }`}
                  />
                ))}
              </div>

              {hasShield && (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 font-bold text-[11px]">
                  <Shield className="w-3 h-3" />
                  <span>SHIELD ACTIVE</span>
                </div>
              )}

              <div className="hidden sm:flex items-center gap-1.5 text-slate-300">
                <span className="text-purple-400 font-bold">{selectedChar.name}</span>
                <span className="text-slate-500">•</span>
                <span className="text-emerald-400 font-bold">{selectedStage.titleTh}</span>
              </div>
            </div>

            {/* Score, Distance & Combo */}
            <div className="flex items-center gap-4">
              {combo > 1 && (
                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-black font-black text-xs animate-bounce">
                  {combo}x COMBO!
                </span>
              )}

              <div>
                <span className="text-slate-400 text-[10px] block">คะแนน</span>
                <span className="text-base font-extrabold text-[#34D399]">{score} pts</span>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] block">ระยะทางไทม์ไลน์</span>
                <span className="text-base font-extrabold text-[#38BDF8]">{distance}m / {selectedStage.distance}m</span>
              </div>

              <button
                onClick={() => setGameState('menu')}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] cursor-pointer"
              >
                ออก
              </button>
            </div>
          </div>

          {/* 60 FPS Canvas Element */}
          <canvas
            ref={canvasRef}
            width={850}
            height={260}
            className="w-full block bg-[#090B10]"
          />

          {/* Touch / On-Screen Gamepad Controls */}
          <div className="p-3 bg-black/80 backdrop-blur-md border-t border-white/10 flex items-center justify-between gap-2 select-none">
            <div className="flex items-center gap-2">
              <button
                onTouchStart={() => triggerSlide(true)}
                onTouchEnd={() => triggerSlide(false)}
                onMouseDown={() => triggerSlide(true)}
                onMouseUp={() => triggerSlide(false)}
                id="touch-slide-btn"
                className="w-14 h-12 sm:w-20 sm:h-12 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-white/20 text-white font-mono font-bold text-xs flex flex-col items-center justify-center cursor-pointer shadow-md"
              >
                <ArrowDown className="w-4 h-4 text-[#38BDF8]" />
                <span className="text-[10px]">SLIDE</span>
              </button>

              <button
                onClick={triggerJump}
                id="touch-jump-btn"
                className="w-16 h-12 sm:w-24 sm:h-12 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-400 text-white font-mono font-bold text-xs flex flex-col items-center justify-center cursor-pointer shadow-md shadow-indigo-500/20"
              >
                <ArrowUp className="w-4 h-4 text-white" />
                <span className="text-[10px]">JUMP ⬆</span>
              </button>
            </div>

            <div className="text-center font-mono text-[10px] text-slate-400 hidden sm:block">
              กด [Space] กระโดด • [C] สับใบมีด • [S] สไลด์
            </div>

            <button
              onClick={triggerSlash}
              id="touch-slash-btn"
              className="px-5 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 active:scale-95 text-white font-mono font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-purple-500/30"
            >
              <Scissors className="w-4 h-4 text-white" />
              <span>RAZOR SLICE (C)</span>
            </button>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------- */}
      {/* SCREEN 3: GAME OVER (RENDER CRASH)                          */}
      {/* ----------------------------------------------------------- */}
      {gameState === 'gameover' && (
        <div className="p-8 text-center space-y-5 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/20">
            <span className="font-mono text-2xl font-black">!</span>
          </div>

          <div className="space-y-1">
            <h2 className="text-3xl font-extrabold text-white">RENDER CRASH: ไทม์ไลน์หลุดเฟรม</h2>
            <p className="text-sm text-slate-400">
              ชนอุปสรรคจนหัวใจหมดในด่าน {selectedStage.title}! ลองปรับสเตตัสหรือเปลี่ยนตัวละครใหม่
            </p>
          </div>

          {/* Stats recap */}
          <div className="max-w-md mx-auto grid grid-cols-3 gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/10 font-mono text-center">
            <div>
              <span className="text-[11px] text-slate-400 block">คะแนนที่ได้</span>
              <span className="text-lg font-bold text-[#34D399]">{score} pts</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">ระยะทาง</span>
              <span className="text-lg font-bold text-[#38BDF8]">{distance}m</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">ฟันบาร์แดง</span>
              <span className="text-lg font-bold text-[#F59E0B]">{slashedCount} ช็อต</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => startGame(selectedChar, selectedStage)}
              id="runner-retry-btn"
              className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm cursor-pointer transition-all flex items-center gap-2 shadow-lg"
            >
              <RotateCcw className="w-4 h-4" />
              <span>เล่นอีกครั้ง</span>
            </button>
            <button
              onClick={() => setGameState('menu')}
              id="runner-change-char-btn"
              className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm cursor-pointer transition-all"
            >
              กลับเมนูหลัก
            </button>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------- */}
      {/* SCREEN 4: VICTORY (SEQUENCE COMPLETED)                      */}
      {/* ----------------------------------------------------------- */}
      {gameState === 'victory' && (
        <div className="p-8 text-center space-y-5 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <Trophy className="w-8 h-8 text-amber-400" />
          </div>

          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-[#34D399] text-xs font-mono font-bold uppercase">
              ★ SEQUENCE CLEAR: {selectedStage.title} ★
            </span>
            <h2 className="text-3xl font-extrabold text-white">4K MASTER EXPORT SUCCESSFUL!</h2>
            <p className="text-sm text-slate-300">
              ยินดีด้วย! คุณพา {selectedChar.name} วิ่งตัดต่อจนผ่านด่าน {selectedStage.titleTh} ครบระยะ {selectedStage.distance}m สำเร็จ!
            </p>
          </div>

          {/* Stats recap */}
          <div className="max-w-md mx-auto grid grid-cols-3 gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/10 font-mono text-center">
            <div>
              <span className="text-[11px] text-slate-400 block">คะแนนสุดท้าย</span>
              <span className="text-xl font-black text-[#34D399]">{score + 1000} pts</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">ระยะทาง</span>
              <span className="text-lg font-bold text-[#38BDF8]">{selectedStage.distance}m (MAX)</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">ฟันบาร์แดง</span>
              <span className="text-lg font-bold text-[#F59E0B]">{slashedCount} ช็อต</span>
            </div>
          </div>

          {/* Victory Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {(() => {
              const curIdx = stages.findIndex(s => s.id === selectedStage.id);
              const nextStage = (curIdx >= 0 && curIdx < stages.length - 1) ? stages[curIdx + 1] : null;
              if (!nextStage) return null;
              return (
                <button
                  onClick={() => triggerLevelTransition(nextStage, selectedChar)}
                  id="runner-victory-next-stage-btn"
                  className="px-7 py-2.5 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm tracking-wide cursor-pointer transition-all flex items-center gap-2 shadow-[0_0_25px_rgba(168,85,247,0.5)] hover:scale-105"
                >
                  <Film className="w-4 h-4 text-amber-300" />
                  <span>ด่านถัดไป: {nextStage.title} 🎬</span>
                </button>
              );
            })()}
            <button
              onClick={() => triggerLevelTransition(selectedStage, selectedChar)}
              id="runner-victory-replay-btn"
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm cursor-pointer transition-all flex items-center gap-2 shadow-lg"
            >
              <RotateCcw className="w-4 h-4" />
              <span>เล่นซ้ำอีกรอบ</span>
            </button>
            <button
              onClick={() => setGameState('menu')}
              id="runner-victory-menu-btn"
              className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm cursor-pointer transition-all"
            >
              เลือกด่าน & ตัวละคร
            </button>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------- */}
      {/* MODAL 1: HERO CREATOR STUDIO                                */}
      {/* ----------------------------------------------------------- */}
      <CharacterCreatorModal
        isOpen={isCharCreatorOpen}
        onClose={() => {
          setIsCharCreatorOpen(false);
          refreshVault();
        }}
        onSaveAndPlay={(newHero) => {
          setIsCharCreatorOpen(false);
          refreshVault();
          triggerLevelTransition(selectedStage, newHero);
        }}
        existingHero={editingHero}
      />

      {/* ----------------------------------------------------------- */}
      {/* MODAL 2: STAGE MAKER STUDIO                                 */}
      {/* ----------------------------------------------------------- */}
      <StageMakerModal
        isOpen={isStageMakerOpen}
        onClose={() => {
          setIsStageMakerOpen(false);
          refreshVault();
        }}
        onSaveAndPlay={(newStage) => {
          setIsStageMakerOpen(false);
          refreshVault();
          triggerLevelTransition(newStage, selectedChar);
        }}
        existingStage={editingStage}
      />

      {/* ----------------------------------------------------------- */}
      {/* CINEMATIC FRAMER MOTION FILMSTRIP LEVEL TRANSITION          */}
      {/* ----------------------------------------------------------- */}
      <FilmstripLevelTransition
        isActive={isTransitioning}
        targetStage={transitionTargetStage}
        stageIndex={transitionTargetStage ? Math.max(0, stages.findIndex(s => s.id === transitionTargetStage.id)) : 0}
        totalStages={stages.length}
        onComplete={handleTransitionComplete}
      />

    </div>
  );
};
