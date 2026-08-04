import React, { useEffect, useRef, useState } from "react";
import { 
  Car, 
  BookOpen, 
  DollarSign, 
  Trophy, 
  Zap, 
  Gauge, 
  Compass, 
  Volume2,
  VolumeX,
  RefreshCw,
  HelpCircle,
  Play,
  Gamepad2,
  LifeBuoy,
  Keyboard,
  X,
  Navigation
} from "lucide-react";
import { IELTS_WORDS, IELTSWord } from "./data/words";
import { CAR_MODELS, CarModel } from "./data/cars";

// Declare Phaser as global constant from CDN script
declare const Phaser: any;

// Live Web Audio synthesizer for classic GTA 1 arcade feel
const playAudioSynth = (type: "pickup" | "crash" | "success" | "loss" | "honk") => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    if (type === "pickup") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } else if (type === "crash") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(120, audioCtx.currentTime);
      osc.frequency.linearRampToValueAtTime(40, audioCtx.currentTime + 0.35);
      gainNode.gain.setValueAtTime(0.25, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } else if (type === "success") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2); // G5
      osc.frequency.setValueAtTime(1046.50, audioCtx.currentTime + 0.3); // C6
      gainNode.gain.setValueAtTime(0.18, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } else if (type === "loss") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(320, audioCtx.currentTime);
      osc.frequency.linearRampToValueAtTime(160, audioCtx.currentTime + 0.45);
      gainNode.gain.setValueAtTime(0.18, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.45);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.45);
    } else if (type === "honk") {
      const osc2 = audioCtx.createOscillator();
      osc.type = "sawtooth";
      osc2.type = "sawtooth";
      
      osc.frequency.setValueAtTime(415, audioCtx.currentTime);
      osc2.frequency.setValueAtTime(475, audioCtx.currentTime);
      
      osc.connect(gainNode);
      osc2.connect(gainNode);
      
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 0.01);
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime + 0.25);
      gainNode.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      
      osc.start();
      osc2.start();
      osc.stop(audioCtx.currentTime + 0.3);
      osc2.stop(audioCtx.currentTime + 0.3);
    }
  } catch (e) {
    // Audio context blocked
  }
};

const COLOR_SWATCHES = [
  "#e07a5f", // Rust Orange
  "#00f0ff", // Electric Cyan
  "#ff007f", // Neon Pink
  "#39ff14", // Cyber Green
  "#eab308", // VIP Gold
  "#ef4444", // Crimson Red
  "#3b82f6", // Royal Blue
  "#8b5cf6", // Imperial Purple
  "#ec4899", // Magenta
  "#f97316", // Flame Orange
  "#f8fafc", // Pearl White
  "#334155"  // Stealth Gray
];

const NPC_COLORS = [
  0xef4444, 0x3b82f6, 0x22c55e, 0xeab308, 0xa855f7, 0xf97316, 0xec4899,
  0x06b6d4, 0x94a3b8, 0x10b981, 0x8b5cf6, 0xd97706, 0x38bdf8, 0xf43f5e
];

export const CarPreviewSvg = ({ carId, color, className = "w-24 h-40" }: { carId: string; color: string; className?: string }) => {
  if (carId === "rusty_banger") {
    return (
      <svg viewBox="0 0 40 80" className={className}>
        <rect x="2" y="12" width="5" height="12" rx="2" fill="#1e293b" />
        <rect x="33" y="12" width="5" height="12" rx="2" fill="#1e293b" />
        <rect x="2" y="52" width="5" height="12" rx="2" fill="#1e293b" />
        <rect x="33" y="52" width="5" height="12" rx="2" fill="#1e293b" />
        <rect x="6" y="8" width="28" height="62" rx="6" fill={color} stroke="#334155" strokeWidth="2" />
        <circle cx="12" cy="18" r="3" fill="#b45309" opacity="0.8" />
        <circle cx="28" cy="58" r="4" fill="#92400e" opacity="0.8" />
        <path d="M 10 38 L 16 42 M 22 20 L 26 24" stroke="#78350f" strokeWidth="1.5" />
        <rect x="9" y="24" width="22" height="24" rx="3" fill="#0f172a" stroke="#475569" strokeWidth="1" />
        <circle cx="11" cy="10" r="3" fill="#fbbf24" />
        <circle cx="29" cy="10" r="3" fill="#fbbf24" />
        <rect x="10" y="68" width="5" height="2" fill="#ef4444" />
        <rect x="25" y="68" width="5" height="2" fill="#ef4444" />
      </svg>
    );
  }
  if (carId === "fleet_sedan") {
    return (
      <svg viewBox="0 0 40 80" className={className}>
        <rect x="2" y="10" width="5" height="14" rx="2" fill="#0f172a" />
        <rect x="33" y="10" width="5" height="14" rx="2" fill="#0f172a" />
        <rect x="2" y="54" width="5" height="14" rx="2" fill="#0f172a" />
        <rect x="33" y="54" width="5" height="14" rx="2" fill="#0f172a" />
        <rect x="6" y="6" width="28" height="68" rx="8" fill={color} stroke="#64748b" strokeWidth="2" />
        <line x1="7" y1="40" x2="33" y2="40" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="9" y="22" width="22" height="30" rx="4" fill="#1e293b" stroke="#94a3b8" strokeWidth="1" />
        <rect x="14" y="35" width="12" height="4" rx="1" fill="#f59e0b" stroke="#ffffff" strokeWidth="0.5" />
        <circle cx="11" cy="8" r="3" fill="#fef08a" />
        <circle cx="29" cy="8" r="3" fill="#fef08a" />
        <rect x="10" y="72" width="6" height="2" fill="#dc2626" />
        <rect x="24" y="72" width="6" height="2" fill="#dc2626" />
      </svg>
    );
  }
  if (carId === "turbo_interceptor") {
    return (
      <svg viewBox="0 0 44 84" className={className}>
        <rect x="1" y="12" width="6" height="15" rx="2" fill="#020617" />
        <rect x="37" y="12" width="6" height="15" rx="2" fill="#020617" />
        <rect x="1" y="54" width="6" height="15" rx="2" fill="#020617" />
        <rect x="37" y="54" width="6" height="15" rx="2" fill="#020617" />
        <path d="M 12 6 C 18 4, 26 4, 32 6 C 39 12, 42 22, 42 40 C 42 60, 40 74, 34 78 C 26 80, 18 80, 10 78 C 4 74, 2 60, 2 40 C 2 22, 5 12, 12 6 Z" fill={color} stroke="#ffffff" strokeWidth="2" />
        <rect x="18" y="6" width="3" height="72" fill="#0f172a" />
        <rect x="23" y="6" width="3" height="72" fill="#0f172a" />
        <rect x="13" y="16" width="4" height="8" rx="1" fill="#0f172a" />
        <rect x="27" y="16" width="4" height="8" rx="1" fill="#0f172a" />
        <path d="M 12 28 C 16 26, 28 26, 32 28 L 34 48 C 28 50, 16 50, 10 48 Z" fill="#020617" stroke="#38bdf8" strokeWidth="1" />
        <rect x="6" y="74" width="32" height="5" rx="2" fill="#020617" stroke="#ffffff" strokeWidth="1" />
        <polygon points="10,8 15,8 13,12 8,12" fill="#38bdf8" />
        <polygon points="29,8 34,8 36,12 31,12" fill="#38bdf8" />
      </svg>
    );
  }
  if (carId === "cyber_hypercar") {
    return (
      <svg viewBox="0 0 44 84" className={className}>
        <rect x="1" y="12" width="5" height="14" rx="2" fill="#000" />
        <rect x="38" y="12" width="5" height="14" rx="2" fill="#000" />
        <rect x="1" y="54" width="5" height="14" rx="2" fill="#000" />
        <rect x="38" y="54" width="5" height="14" rx="2" fill="#000" />
        <polygon points="22,4 40,20 42,66 36,80 8,80 2,66 4,20" fill={color} stroke="#ffffff" strokeWidth="2" />
        <polygon points="22,20 34,32 32,52 12,52 10,32" fill="#050b14" stroke="#39ff14" strokeWidth="1" />
        <line x1="6" y1="26" x2="6" y2="60" stroke="#39ff14" strokeWidth="2" />
        <line x1="38" y1="26" x2="38" y2="60" stroke="#39ff14" strokeWidth="2" />
        <polygon points="6,70 12,70 10,82 4,82" fill="#000" />
        <polygon points="32,70 38,70 40,82 34,82" fill="#000" />
        <line x1="12" y1="7" x2="20" y2="5" stroke="#00f0ff" strokeWidth="2" />
        <line x1="32" y1="7" x2="24" y2="5" stroke="#00f0ff" strokeWidth="2" />
      </svg>
    );
  }
  if (carId === "executive_limo") {
    return (
      <svg viewBox="0 0 44 130" className={className}>
        <rect x="1" y="16" width="5" height="15" rx="2" fill="#0f172a" />
        <rect x="38" y="16" width="5" height="15" rx="2" fill="#0f172a" />
        <rect x="1" y="98" width="5" height="15" rx="2" fill="#0f172a" />
        <rect x="38" y="98" width="5" height="15" rx="2" fill="#0f172a" />
        <rect x="6" y="6" width="32" height="118" rx="8" fill={color} stroke="#fef08a" strokeWidth="2" />
        <line x1="8" y1="12" x2="8" y2="118" stroke="#ffffff" strokeWidth="1.5" />
        <line x1="36" y1="12" x2="36" y2="118" stroke="#ffffff" strokeWidth="1.5" />
        <rect x="9" y="22" width="26" height="16" rx="3" fill="#020617" stroke="#cbd5e1" strokeWidth="1" />
        <rect x="9" y="44" width="26" height="20" rx="2" fill="#020617" stroke="#334155" strokeWidth="1" />
        <rect x="9" y="68" width="26" height="20" rx="2" fill="#020617" stroke="#334155" strokeWidth="1" />
        <rect x="9" y="92" width="26" height="14" rx="3" fill="#020617" stroke="#cbd5e1" strokeWidth="1" />
        <circle cx="22" cy="54" r="2" fill="#f59e0b" />
        <circle cx="22" cy="78" r="2" fill="#f59e0b" />
        <rect x="12" y="7" width="20" height="3" rx="1" fill="#e2e8f0" />
        <circle cx="10" cy="9" r="3" fill="#fef08a" />
        <circle cx="34" cy="9" r="3" fill="#fef08a" />
        <rect x="10" y="121" width="6" height="2" fill="#dc2626" />
        <rect x="28" y="121" width="6" height="2" fill="#dc2626" />
      </svg>
    );
  }
  return null;
};

// Responsive Virtual Joystick Component for Touch/Mobile play
const TouchJoystickControls = ({ onHonk }: { onHonk: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stickPos, setStickPos] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const [gasPressed, setGasPressed] = useState(false);
  const [brakePressed, setBrakePressed] = useState(false);

  const updateTouchControls = (steer: number, throttle: number) => {
    (window as any).__touchControls = {
      up: throttle > 0.2,
      down: throttle < -0.2,
      left: steer < -0.2,
      right: steer > 0.2,
      steer,
      throttle
    };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setActive(true);
    updateStick(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!active) return;
    updateStick(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setActive(false);
    setStickPos({ x: 0, y: 0 });
    updateTouchControls(0, gasPressed ? 1 : brakePressed ? -1 : 0);
  };

  const updateStick = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const maxR = rect.width / 2 - 12;

    let dx = clientX - centerX;
    let dy = clientY - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > maxR) {
      dx = (dx / dist) * maxR;
      dy = (dy / dist) * maxR;
    }

    setStickPos({ x: dx, y: dy });

    const steer = dx / maxR;
    let throttle = -dy / maxR;
    if (gasPressed) throttle = 1;
    if (brakePressed) throttle = -1;

    updateTouchControls(steer, throttle);
  };

  const handleGasDown = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setGasPressed(true);
    const currSteer = (window as any).__touchControls?.steer || 0;
    updateTouchControls(currSteer, 1);
  };

  const handleGasUp = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setGasPressed(false);
    const currSteer = (window as any).__touchControls?.steer || 0;
    const currStickThrottle = stickPos.y !== 0 ? -stickPos.y / 40 : 0;
    updateTouchControls(currSteer, brakePressed ? -1 : currStickThrottle);
  };

  const handleBrakeDown = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setBrakePressed(true);
    const currSteer = (window as any).__touchControls?.steer || 0;
    updateTouchControls(currSteer, -1);
  };

  const handleBrakeUp = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setBrakePressed(false);
    const currSteer = (window as any).__touchControls?.steer || 0;
    const currStickThrottle = stickPos.y !== 0 ? -stickPos.y / 40 : 0;
    updateTouchControls(currSteer, gasPressed ? 1 : currStickThrottle);
  };

  return (
    <div className="absolute inset-x-0 bottom-4 z-30 pointer-events-none px-4 flex justify-between items-end touch-none select-none">
      
      {/* JOYSTICK ON BOTTOM LEFT */}
      <div className="pointer-events-auto flex flex-col items-center gap-1">
        <span className="text-[9px] font-cyber font-bold text-amber-400 uppercase tracking-widest bg-slate-950/80 px-2 py-0.5 rounded border border-amber-500/30">
          ANALOG JOYSTICK
        </span>
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-slate-950/85 border-2 border-amber-500/60 backdrop-blur-md flex items-center justify-center relative shadow-[0_0_25px_rgba(245,158,11,0.25)]"
        >
          <div className="absolute inset-2 rounded-full border border-dashed border-amber-500/30" />
          <div className="absolute top-1.5 text-[10px] font-cyber text-amber-500/80 font-black">▲</div>
          <div className="absolute bottom-1.5 text-[10px] font-cyber text-amber-500/80 font-black">▼</div>
          <div className="absolute left-1.5 text-[10px] font-cyber text-amber-500/80 font-black">◄</div>
          <div className="absolute right-1.5 text-[10px] font-cyber text-amber-500/80 font-black">►</div>

          <div
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-yellow-400 via-amber-500 to-amber-600 border-2 border-white shadow-[0_0_15px_rgba(251,191,36,0.6)] flex items-center justify-center transition-transform duration-75 ${
              active ? "scale-105" : ""
            }`}
            style={{
              transform: `translate(${stickPos.x}px, ${stickPos.y}px)`,
            }}
          >
            <div className="w-5 h-5 rounded-full bg-slate-950/50 border border-amber-200" />
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS ON BOTTOM RIGHT */}
      <div className="pointer-events-auto flex items-end gap-2.5">
        
        <button
          onClick={onHonk}
          className="w-12 h-12 rounded-full bg-amber-950/80 border-2 border-amber-400 text-amber-300 font-cyber font-black text-[10px] uppercase shadow-lg flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
        >
          HONK
        </button>

        <button
          onPointerDown={handleBrakeDown}
          onPointerUp={handleBrakeUp}
          onPointerCancel={handleBrakeUp}
          className={`w-16 h-16 sm:w-18 sm:h-18 rounded-2xl border-2 font-cyber font-black text-xs uppercase flex flex-col items-center justify-center shadow-xl transition-all active:scale-95 ${
            brakePressed 
              ? "bg-rose-600 border-white text-white shadow-rose-500/50 scale-95" 
              : "bg-rose-950/80 border-rose-500 text-rose-300"
          }`}
        >
          <span>BRAKE</span>
          <span className="text-[8px] opacity-75">REV</span>
        </button>

        <button
          onPointerDown={handleGasDown}
          onPointerUp={handleGasUp}
          onPointerCancel={handleGasUp}
          className={`w-20 h-20 sm:w-22 sm:h-22 rounded-2xl border-2 font-cyber font-black text-sm uppercase flex flex-col items-center justify-center shadow-2xl transition-all active:scale-95 ${
            gasPressed 
              ? "bg-emerald-500 border-white text-slate-950 shadow-emerald-400/50 scale-95" 
              : "bg-emerald-950/80 border-emerald-400 text-emerald-300"
          }`}
        >
          <Zap className="w-5 h-5 mb-0.5" />
          <span>GAS</span>
        </button>

      </div>

    </div>
  );
};

export default function App() {
  // Navigation tabs: 'streets' | 'garage' | 'dictionary'
  const [activeTab, setActiveTab] = useState<"streets" | "garage" | "dictionary">("streets");
  
  // Game state (synchronized with localStorage)
  const [cash, setCash] = useState<number>(0);
  const [ownedCars, setOwnedCars] = useState<string[]>(["rusty_banger"]);
  const [activeCarId, setActiveCarId] = useState<string>("rusty_banger");
  const [carCustomColors, setCarCustomColors] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem("ielts_driver_car_colors");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      rusty_banger: "#e07a5f",
      fleet_sedan: "#00f0ff",
      turbo_interceptor: "#ff007f",
      cyber_hypercar: "#39ff14",
      executive_limo: "#eab308"
    };
  });
  const [activeWordIndex, setActiveWordIndex] = useState<number>(0);
  const [spelledText, setSpelledText] = useState<string>("");
  const [wordsSolvedCount, setWordsSolvedCount] = useState<number>(0);

  // Unscrambling mini-game state (GTA 1 loop adaptation)
  const [collectedLetters, setCollectedLetters] = useState<{ index: number; char: string }[]>([]);
  const [isUnscrambling, setIsUnscrambling] = useState<boolean>(false);
  const [unscrambleWordInfo, setUnscrambleWordInfo] = useState<{ word: string; definition: string; collected: { index: number; char: string }[] } | null>(null);
  const [unscramblePool, setUnscramblePool] = useState<{ index: number; char: string }[]>([]);
  const [unscrambleSlots, setUnscrambleSlots] = useState<{ index: number; char: string }[]>([]);
  const [unscrambleTime, setUnscrambleTime] = useState<number>(0);
  const [gaveUp, setGaveUp] = useState<boolean>(false);
  const [isWrongSpelling, setIsWrongSpelling] = useState<boolean>(false);
  
  // HUD variables
  const [carSpeed, setCarSpeed] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [toast, setToast] = useState<{ text: string; type: "success" | "info" | "error" | "bonus" } | null>(null);
  
  // Mobile touch joystick controls state (ON by default)
  const [showTouchControls, setShowTouchControls] = useState<boolean>(true);
  
  // Welcome pop-up modal state (ON by default on game launch)
  const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(true);
  
  // Refs
  const phaserContainerRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<any>(null);
  const engineAudioRef = useRef<{
    audioCtx: AudioContext;
    osc: OscillatorNode;
    gain: GainNode;
    filter: BiquadFilterNode;
  } | null>(null);
  const activeCarSpec = CAR_MODELS.find(c => c.id === activeCarId) || CAR_MODELS[0];

  // Load local storage on startup
  useEffect(() => {
    try {
      const savedCash = localStorage.getItem("ielts_driver_cash");
      if (savedCash !== null) setCash(parseInt(savedCash, 10));

      const savedOwned = localStorage.getItem("ielts_driver_owned_cars");
      if (savedOwned !== null) setOwnedCars(JSON.parse(savedOwned));

      const savedActive = localStorage.getItem("ielts_driver_active_car");
      if (savedActive !== null) setActiveCarId(savedActive);

      const savedWordsCount = localStorage.getItem("ielts_driver_completed_count");
      if (savedWordsCount !== null) setWordsSolvedCount(parseInt(savedWordsCount, 10));

      const savedWordIdx = localStorage.getItem("ielts_driver_word_idx");
      if (savedWordIdx !== null) {
        setActiveWordIndex(parseInt(savedWordIdx, 10) % IELTS_WORDS.length);
      } else {
        setActiveWordIndex(Math.floor(Math.random() * IELTS_WORDS.length));
      }
    } catch (err) {
      console.error("Failed to load local storage save:", err);
    }
  }, []);

  // Write local storage when state changes
  useEffect(() => {
    if (cash === 0 && ownedCars.length === 1 && activeCarId === "rusty_banger") return; // Skip initial empty ticks
    try {
      localStorage.setItem("ielts_driver_cash", cash.toString());
      localStorage.setItem("ielts_driver_owned_cars", JSON.stringify(ownedCars));
      localStorage.setItem("ielts_driver_active_car", activeCarId);
      localStorage.setItem("ielts_driver_completed_count", wordsSolvedCount.toString());
      localStorage.setItem("ielts_driver_word_idx", activeWordIndex.toString());
    } catch (err) {
      console.error("Failed to write to local storage:", err);
    }
  }, [cash, ownedCars, activeCarId, activeWordIndex, wordsSolvedCount]);

  // Show customized toasts
  const triggerToast = (text: string, type: "success" | "info" | "error" | "bonus" = "info") => {
    setToast({ text, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Unscramble Timer tracker
  useEffect(() => {
    let interval: any;
    if (isUnscrambling && !gaveUp) {
      interval = setInterval(() => {
        setUnscrambleTime(t => t + 1);
      }, 1000);
    } else {
      setUnscrambleTime(0);
    }
    return () => clearInterval(interval);
  }, [isUnscrambling, gaveUp]);

  // Listen to custom browser events emitted by the Phaser Game Scene
  useEffect(() => {
    const handlePhaserCash = (e: Event & { detail?: number }) => {
      if (typeof e.detail === "number") {
        setCash(e.detail);
      }
    };

    const handlePhaserProgress = (e: Event & { detail?: { spelledText: string; wordIndex: number; wordsSolvedCount: number; toastText?: string; toastType?: "success" | "info" | "error" | "bonus" } }) => {
      if (e.detail) {
        setSpelledText(e.detail.spelledText);
        setActiveWordIndex(e.detail.wordIndex);
        setWordsSolvedCount(e.detail.wordsSolvedCount);
        if (e.detail.toastText) {
          triggerToast(e.detail.toastText, e.detail.toastType || "info");
        }
      }
    };

    const handlePhaserSpeed = (e: Event & { detail?: number }) => {
      if (typeof e.detail === "number") {
        setCarSpeed(e.detail);
      }
    };

    const handlePhaserLettersUpdate = (e: Event & { detail?: { collected: { index: number; char: string }[]; total: number; toastText?: string; toastType?: "success" | "info" | "error" | "bonus" } }) => {
      if (e.detail) {
        setCollectedLetters(e.detail.collected);
        if (e.detail.toastText) {
          triggerToast(e.detail.toastText, e.detail.toastType || "info");
        }
      }
    };

    const handlePhaserUnscrambleTrigger = (e: Event & { detail?: { wordIndex: number; collected: { index: number; char: string }[] } }) => {
      if (e.detail) {
        const wordObj = IELTS_WORDS[e.detail.wordIndex];
        setUnscrambleWordInfo({
          word: wordObj.word,
          definition: wordObj.definition,
          collected: e.detail.collected
        });
        
        // Shuffle the collected letters for the initial pool
        const shuffled = [...e.detail.collected].sort(() => Math.random() - 0.5);
        setUnscramblePool(shuffled);
        setUnscrambleSlots([]);
        setIsUnscrambling(true);
      }
    };

    const handleGlobalError = (e: Event & { detail?: { message: string; filename: string; lineno: number; error?: string } }) => {
      if (e.detail) {
        if (e.detail.message === "Script error." || !e.detail.filename || e.detail.filename === "unknown") {
          return;
        }
        console.error("React captured script error detail:", e.detail);
        triggerToast(`<strong>Runtime Error:</strong> ${e.detail.message} in ${e.detail.filename.split('/').pop()}:${e.detail.lineno}`, "error");
      }
    };

    window.addEventListener("phaser-cash-update", handlePhaserCash as any);
    window.addEventListener("phaser-word-progress", handlePhaserProgress as any);
    window.addEventListener("phaser-car-speed", handlePhaserSpeed as any);
    window.addEventListener("phaser-letters-update", handlePhaserLettersUpdate as any);
    window.addEventListener("phaser-unscramble-trigger", handlePhaserUnscrambleTrigger as any);
    window.addEventListener("global-script-error", handleGlobalError as any);

    return () => {
      window.removeEventListener("phaser-cash-update", handlePhaserCash as any);
      window.removeEventListener("phaser-word-progress", handlePhaserProgress as any);
      window.removeEventListener("phaser-car-speed", handlePhaserSpeed as any);
      window.removeEventListener("phaser-letters-update", handlePhaserLettersUpdate as any);
      window.removeEventListener("phaser-unscramble-trigger", handlePhaserUnscrambleTrigger as any);
      window.removeEventListener("global-script-error", handleGlobalError as any);
    };
  }, []);

  // Vehicle color customization handler
  const handleColorChange = (carId: string, colorHex: string) => {
    const updated = { ...carCustomColors, [carId]: colorHex };
    setCarCustomColors(updated);
    try {
      localStorage.setItem("ielts_driver_car_colors", JSON.stringify(updated));
    } catch (e) {}

    window.dispatchEvent(new CustomEvent("react-car-color-changed", {
      detail: { carId, color: colorHex }
    }));
  };

  // Sync state FROM React TO Phaser when active car or dictionary changes
  useEffect(() => {
    if (phaserGameRef.current) {
      // Broadcast vehicle specs change
      window.dispatchEvent(new CustomEvent("react-vehicle-changed", { detail: activeCarId }));
    }
  }, [activeCarId]);

  useEffect(() => {
    if (phaserGameRef.current) {
      // Broadcast target word index change
      window.dispatchEvent(new CustomEvent("react-word-changed", { detail: activeWordIndex }));
    }
  }, [activeWordIndex]);

  useEffect(() => {
    if (phaserGameRef.current) {
      // Broadcast target cash change
      window.dispatchEvent(new CustomEvent("react-cash-changed", { detail: cash }));
    }
  }, [cash]);

  useEffect(() => {
    if (phaserGameRef.current) {
      // Broadcast unscrambling state change
      window.dispatchEvent(new CustomEvent("react-unscramble-changed", { detail: isUnscrambling }));
    }
  }, [isUnscrambling]);

  // Engine sound synthesiser
  const startEngineSound = () => {
    if (isMuted || activeTab !== "streets" || isUnscrambling) {
      stopEngineSound();
      return;
    }
    try {
      if (!engineAudioRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;
        const audioCtx = new AudioContextClass();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(55, audioCtx.currentTime); // Low engine idle purr

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(110, audioCtx.currentTime);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);

        // Low volume so it is pleasant background hum
        gain.gain.setValueAtTime(0.06, audioCtx.currentTime);

        osc.start();
        engineAudioRef.current = { audioCtx, osc, gain, filter };
      } else {
        if (engineAudioRef.current.audioCtx.state === "suspended") {
          engineAudioRef.current.audioCtx.resume();
        }
      }
    } catch (err) {
      console.warn("Failed to initialize engine sound:", err);
    }
  };

  const stopEngineSound = () => {
    if (engineAudioRef.current) {
      try {
        engineAudioRef.current.osc.stop();
        engineAudioRef.current.audioCtx.close();
      } catch (e) {}
      engineAudioRef.current = null;
    }
  };

  // Adjust engine pitch & volume dynamically based on carSpeed, activeTab and isMuted
  useEffect(() => {
    if (isMuted || activeTab !== "streets" || isUnscrambling) {
      stopEngineSound();
    } else {
      if (!engineAudioRef.current) {
        startEngineSound();
      }
      if (engineAudioRef.current) {
        const { osc, filter, audioCtx } = engineAudioRef.current;
        // Base freq is 55Hz (low A). Let's scale frequency up to 210Hz based on current speed
        const targetFreq = 55 + (carSpeed * 2.2);
        // Brighten low-pass filter frequency as speed increases to sound like acceleration revs
        const targetFilterFreq = 110 + (carSpeed * 4.5);
        
        osc.frequency.setTargetAtTime(targetFreq, audioCtx.currentTime, 0.1);
        filter.frequency.setTargetAtTime(targetFilterFreq, audioCtx.currentTime, 0.1);
      }
    }
  }, [carSpeed, isMuted, activeTab, isUnscrambling]);

  // Clean up engine audio on unmount
  useEffect(() => {
    return () => {
      stopEngineSound();
    };
  }, []);

  // Resume or start audio on any user gesture to safely bypass browser autoplay restriction
  useEffect(() => {
    const handleGesture = () => {
      if (activeTab === "streets" && !isMuted && !isUnscrambling) {
        startEngineSound();
      }
    };
    window.addEventListener("click", handleGesture);
    window.addEventListener("keydown", handleGesture);
    return () => {
      window.removeEventListener("click", handleGesture);
      window.removeEventListener("keydown", handleGesture);
    };
  }, [activeTab, isMuted, isUnscrambling]);

  // Handle keyboard inputs locking when other tabs are active
  useEffect(() => {
    if (phaserGameRef.current) {
      if (activeTab === "streets") {
        phaserGameRef.current.input.keyboard.enabled = true;
      } else {
        phaserGameRef.current.input.keyboard.enabled = false;
      }
    }
  }, [activeTab]);

  // Initialize Phaser 3 Canvas Frame
  useEffect(() => {
    if (!phaserContainerRef.current) return;
    if (typeof Phaser === "undefined") {
      console.warn("Phaser 3 is not loaded in window context yet.");
      return;
    }

    // ----------------------------------------------------
    // PHASER SCENE IMPLEMENTATION
    // ----------------------------------------------------
    class DrivingScene extends Phaser.Scene {
      cursors: any;
      wasd: any;
      player: any;
      buildings: any;
      buildingBorders: any;
      npcGroup: any;
      letterContainers: any[] = [];
      collectedLettersList: { index: number; char: string }[] = [];
      exhaustParticles: any;
      goldParticles: any;
      gpsPointer: any;
      
      // Word synchronization
      currentWordIndex: number = 0;
      currentCash: number = 0;
      currentIsUnscrambling: boolean = false;

      // Car local stats
      carAngle: number = -90;
      velocity: number = 0;
      isStunned: boolean = false;
      stunTimer: number = 0;
      lastLetterDropTime: number = 0;

      // Active car specifications
      maxSpeed: number = 180;
      acceleration: number = 150;
      handling: number = 150;
      drag: number = 100;
      carColor: number = 0xdc2626;

      // Coordinate target for navigational pointer
      targetCoord: { x: number; y: number; character?: string } | null = null;

      constructor() {
        super({ key: "DrivingScene" });
      }

      create() {
        // Expose scene to window context for hot synchronization from React
        (window as any).activePhaserScene = this;

        // Sync initial state values
        this.currentWordIndex = activeWordIndex;
        this.currentCash = cash;

        // Establish world bounds
        this.physics.world.setBounds(0, 0, 2000, 2000);
        this.cameras.main.setBounds(0, 0, 2000, 2000);

        // Generate retro 2D graphics locally (zero assets, zero loading lag)
        this.generateVectorTextures();

        // GTA 1 Style: Asphalt roadways with yellow dashed lines and concrete sidewalk curbs
        this.cameras.main.setBackgroundColor("#111314");

        const roadGraphics = this.add.graphics();
        roadGraphics.fillStyle(0x222426, 1.0); // Asphalt Dark Grey

        const roadWidth = 120;
        const corridors = [400, 800, 1200, 1600];

        // Draw roadways background
        corridors.forEach(y => {
          roadGraphics.fillRect(0, y - roadWidth / 2, 2000, roadWidth);
        });
        corridors.forEach(x => {
          roadGraphics.fillRect(x - roadWidth / 2, 0, roadWidth, 2000);
        });

        // Draw grey curb lines
        roadGraphics.lineStyle(2, 0x475569, 1.0);
        corridors.forEach(y => {
          roadGraphics.strokeLineShape(new Phaser.Geom.Line(0, y - roadWidth / 2, 2000, y - roadWidth / 2));
          roadGraphics.strokeLineShape(new Phaser.Geom.Line(0, y + roadWidth / 2, 2000, y + roadWidth / 2));
        });
        corridors.forEach(x => {
          roadGraphics.strokeLineShape(new Phaser.Geom.Line(x - roadWidth / 2, 0, x - roadWidth / 2, 2000));
          roadGraphics.strokeLineShape(new Phaser.Geom.Line(x + roadWidth / 2, 0, x + roadWidth / 2, 2000));
        });

        // Draw classic yellow center lines (dashed)
        roadGraphics.lineStyle(3, 0xfacc15, 0.75);
        corridors.forEach(y => {
          for (let x = 0; x < 2000; x += 40) {
            roadGraphics.strokeLineShape(new Phaser.Geom.Line(x, y, x + 20, y));
          }
        });
        corridors.forEach(x => {
          for (let y = 0; y < 2000; y += 40) {
            roadGraphics.strokeLineShape(new Phaser.Geom.Line(x, y, x, y + 20));
          }
        });

        // Group solid buildings (grimy concrete block buildings)
        this.buildings = this.physics.add.staticGroup();
        this.buildingBorders = this.add.graphics();
        this.buildingBorders.lineStyle(4, 0x5a5d61, 1.0); // Concrete walkway highlight

        for (let x = 200; x < 2000; x += 400) {
          for (let y = 200; y < 2000; y += 400) {
            const bWall = this.add.rectangle(x, y, 280, 280, 0x3e4147, 1.0); // Grimy concrete grey
            bWall.setStrokeStyle(4, 0x1f2022, 1.0); // Deep dark borders
            this.buildings.add(bWall);
            
            // Draw walkway boundaries
            this.buildingBorders.strokeRect(x - 140, y - 140, 280, 280);

            // Roof detail: outer gravel/parapet rim
            this.add.rectangle(x, y, 240, 240, 0x2e3034, 1.0).setStrokeStyle(2, 0x111214, 1.0);
            
            // Roof details: metallic vents/AC units
            // Air unit A
            this.add.rectangle(x - 50, y - 50, 36, 36, 0x4d5157, 1.0).setStrokeStyle(2, 0x111214, 1.0);
            this.add.rectangle(x - 50, y - 50, 24, 24, 0x181a1d, 1.0);
            
            // Cooling unit B
            this.add.rectangle(x + 50, y + 45, 48, 28, 0x3a3c40, 1.0).setStrokeStyle(2, 0x111214, 1.0);
            this.add.rectangle(x + 50, y + 45, 36, 16, 0x111214, 1.0);

            // Helipad on some concrete buildings
            if ((x + y) % 800 === 0) {
              const helipadMarking = this.add.text(x, y, "H", {
                fontFamily: "monospace",
                fontSize: "36px",
                fontWeight: "bold",
                color: "#525861"
              }).setOrigin(0.5, 0.5);
              helipadMarking.setAlpha(0.25);
            }
          }
        }

        // Setup Particle emitters
        this.exhaustParticles = this.add.particles(0, 0, "smoke_puff", {
          speed: { min: 20, max: 70 },
          scale: { start: 0.6, end: 0 },
          alpha: { start: 0.5, end: 0 },
          lifespan: 350,
          blendMode: "ADD",
          emitting: false
        });

        this.goldParticles = this.add.particles(0, 0, "neon_spark", {
          speed: { min: 40, max: 180 },
          scale: { start: 0.8, end: 0 },
          alpha: { start: 1, end: 0 },
          lifespan: 600,
          blendMode: "ADD",
          emitting: false
        });

        // Spawn GPS compass pointer graphics
        this.gpsPointer = this.add.graphics();
        this.gpsPointer.setScrollFactor(0); // Anchored to camera view

        // Spawn Player Car (Starts on safe road intersection)
        const initialCarKey = this.textures.exists("car_" + activeCarId) ? ("car_" + activeCarId) : "car_rusty_banger";
        this.player = this.physics.add.sprite(400, 400, this.textures.exists(initialCarKey) ? initialCarKey : "car_chassis");
        this.player.setCollideWorldBounds(true);
        this.player.setOrigin(0.5, 0.5);
        this.player.setDepth(20);
        this.player.setCircle(18, 2, 22);

        // Sync initial car configuration stats from React state
        this.syncCarStats(activeCarId);

        // Camera Lock Setup
        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

        // Spawn NPC commuter cars (including pre-pattern loop drivers)
        this.spawnTrafficObstacles();

        // Spawn all active letters of the current practice word
        this.loadAllLetters();

        // Bind keyboards
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
          up: Phaser.Input.Keyboard.KeyCodes.W,
          down: Phaser.Input.Keyboard.KeyCodes.S,
          left: Phaser.Input.Keyboard.KeyCodes.A,
          right: Phaser.Input.Keyboard.KeyCodes.D
        });

        // Colliders
        this.physics.add.collider(this.player, this.buildings, this.onWallHit, undefined, this);
        this.physics.add.collider(this.player, this.npcGroup, this.onNPCHit, undefined, this);

        // Attach listeners for incoming changes from React
        const cleanUpEventListeners = () => {
          window.removeEventListener("react-vehicle-changed", this.onReactCarChange as any);
          window.removeEventListener("react-car-color-changed", this.onReactColorChange as any);
          window.removeEventListener("react-word-changed", this.onReactWordChange as any);
          window.removeEventListener("react-cash-changed", this.onReactCashChange as any);
          window.removeEventListener("react-unscramble-changed", this.onReactUnscrambleChange as any);
          window.removeEventListener("react-teleport-start", this.onReactTeleportStart as any);
        };

        window.addEventListener("react-vehicle-changed", this.onReactCarChange as any);
        window.addEventListener("react-car-color-changed", this.onReactColorChange as any);
        window.addEventListener("react-word-changed", this.onReactWordChange as any);
        window.addEventListener("react-cash-changed", this.onReactCashChange as any);
        window.addEventListener("react-unscramble-changed", this.onReactUnscrambleChange as any);
        window.addEventListener("react-teleport-start", this.onReactTeleportStart as any);

        // Cleanup listeners on scene shutdown or destroy
        this.events.once("shutdown", cleanUpEventListeners);
        this.events.once("destroy", cleanUpEventListeners);
      }

      onReactUnscrambleChange = (e: CustomEvent<boolean>) => {
        if (!this.sys || !this.sys.isActive() || !this.physics) return;
        if (e && typeof e.detail === "boolean") {
          this.currentIsUnscrambling = e.detail;
          if (!this.physics.world) return;
          if (e.detail) {
            this.physics.world.pause();
            this.velocity = 0;
            if (this.player) {
              this.player.setVelocity(0, 0);
              if (this.player.body) {
                this.player.body.setVelocity(0, 0);
              }
            }
            if (this.npcGroup) {
              this.npcGroup.getChildren().forEach((npc: any) => {
                if (npc.body) {
                  npc.body.setVelocity(0, 0);
                }
              });
            }
          } else {
            this.physics.world.resume();
          }
        }
      };

      onReactCarChange = (e: CustomEvent<string>) => {
        if (!this.sys || !this.sys.isActive()) return;
        if (e && e.detail) {
          this.syncCarStats(e.detail);
        }
      };

      onReactColorChange = (e: CustomEvent<{ carId: string; color: string }>) => {
        if (!this.sys || !this.sys.isActive()) return;
        if (e && e.detail && e.detail.carId === this.currentCarId) {
          this.syncCarStats(this.currentCarId, e.detail.color);
        }
      };

      onReactWordChange = (e: CustomEvent<number>) => {
        if (!this.sys || !this.sys.isActive()) return;
        if (e && typeof e.detail === "number") {
          this.currentWordIndex = e.detail;
        }
        this.loadAllLetters();
      };

      onReactCashChange = (e: CustomEvent<number>) => {
        if (!this.sys || !this.sys.isActive()) return;
        if (e && typeof e.detail === "number") {
          this.currentCash = e.detail;
        }
      };

      onReactTeleportStart = () => {
        if (!this.sys || !this.sys.isActive() || !this.player) return;
        this.player.setPosition(400, 400);
        this.player.setRotation(0);
        this.velocity = 0;
        if (this.player.body && 'setVelocity' in this.player.body) {
          (this.player.body as any).setVelocity(0, 0);
        }
      };

      syncCarStats(carId: string, customColorHex?: string) {
        if (!this.sys || !this.sys.isActive() || !this.textures) return;
        const spec = CAR_MODELS.find(c => c.id === carId) || CAR_MODELS[0];
        this.currentCarId = spec.id;
        this.maxSpeed = spec.maxSpeed;
        this.acceleration = spec.acceleration;
        this.handling = spec.handling;
        this.drag = spec.drag;

        let activeHexStr = customColorHex;
        if (!activeHexStr) {
          try {
            const savedColors = JSON.parse(localStorage.getItem("ielts_driver_car_colors") || "{}");
            activeHexStr = savedColors[carId] || spec.colorStr;
          } catch (e) {
            activeHexStr = spec.colorStr;
          }
        }

        const numColor = parseInt((activeHexStr || spec.colorStr).replace("#", ""), 16);
        this.carColor = isNaN(numColor) ? spec.color : numColor;

        if (this.player) {
          const texName = "car_" + spec.id;
          if (this.textures.exists(texName)) {
            this.player.setTexture(texName);
          } else if (this.textures.exists("car_rusty_banger")) {
            this.player.setTexture("car_rusty_banger");
          } else {
            this.player.setTexture("car_chassis");
          }

          this.player.setTint(this.carColor);
          this.player.setAlpha(1.0);
          this.player.setVisible(true);
          this.player.setDepth(20);

          // Precision top-down circular collision body setup matching texture dimensions
          if (spec.id === "rusty_banger") {
            // Canvas: 36x70
            this.player.setCircle(17, 1, 18);
          } else if (spec.id === "fleet_sedan") {
            // Canvas: 40x78
            this.player.setCircle(18, 2, 21);
          } else if (spec.id === "turbo_interceptor") {
            // Canvas: 42x82
            this.player.setCircle(19, 2, 22);
          } else if (spec.id === "cyber_hypercar") {
            // Canvas: 42x84
            this.player.setCircle(19, 2, 23);
          } else if (spec.id === "executive_limo") {
            // Canvas: 42x130
            this.player.setCircle(20, 1, 45);
          } else {
            this.player.setCircle(18, 2, 22);
          }
        }

        if (this.exhaustParticles) {
          this.exhaustParticles.setParticleTint(this.carColor);
        }
      }

      generateVectorTextures() {
        if (!this.textures) return;
        if (
          this.textures.exists("car_rusty_banger") &&
          this.textures.exists("car_chassis") &&
          this.textures.exists("npc_chassis") &&
          this.textures.exists("smoke_puff")
        ) {
          return;
        }

        // Safe helper for Canvas roundRect fallback across all browsers
        const drawRoundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
          if (typeof ctx.roundRect === "function") {
            ctx.roundRect(x, y, w, h, r);
          } else {
            ctx.beginPath();
            ctx.moveTo(x + r, y);
            ctx.lineTo(x + w - r, y);
            ctx.quadraticCurveTo(x + w, y, x + w, y + r);
            ctx.lineTo(x + w, y + h - r);
            ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            ctx.lineTo(x + r, y + h);
            ctx.quadraticCurveTo(x, y + h, x, y + h - r);
            ctx.lineTo(x, y + r);
            ctx.quadraticCurveTo(x, y, x + r, y);
            ctx.closePath();
          }
        };

        // Exhaust particle drawing
        const smoke = this.textures.createCanvas("smoke_puff", 8, 8);
        const smokeCtx = smoke.context;
        const sGrad = smokeCtx.createRadialGradient(4, 4, 1, 4, 4, 4);
        sGrad.addColorStop(0, "rgba(240, 240, 245, 0.45)");
        sGrad.addColorStop(1, "rgba(0,0,0,0)");
        smokeCtx.fillStyle = sGrad;
        smokeCtx.fillRect(0, 0, 8, 8);
        smoke.refresh();

        // Gold neon pickup sparks
        const spark = this.textures.createCanvas("neon_spark", 10, 10);
        const sparkCtx = spark.context;
        const spGrad = sparkCtx.createRadialGradient(5, 5, 1, 5, 5, 5);
        spGrad.addColorStop(0, "rgba(250, 204, 21, 1)");
        spGrad.addColorStop(1, "rgba(0,0,0,0)");
        sparkCtx.fillStyle = spGrad;
        sparkCtx.fillRect(0, 0, 10, 10);
        spark.refresh();

        // 1. Rusty Banger (Toyota Hatchback style)
        const banger = this.textures.createCanvas("car_rusty_banger", 36, 70);
        const bCtx = banger.context;
        bCtx.fillStyle = "#1e293b";
        bCtx.fillRect(1, 10, 5, 12);
        bCtx.fillRect(30, 10, 5, 12);
        bCtx.fillRect(1, 48, 5, 12);
        bCtx.fillRect(30, 48, 5, 12);
        bCtx.lineWidth = 2;
        bCtx.strokeStyle = "#475569";
        bCtx.fillStyle = "#ffffff";
        bCtx.beginPath();
        drawRoundRect(bCtx, 5, 6, 26, 58, 6);
        bCtx.fill();
        bCtx.stroke();
        bCtx.fillStyle = "#92400e";
        bCtx.beginPath();
        bCtx.arc(10, 16, 2.5, 0, Math.PI * 2);
        bCtx.arc(24, 50, 3, 0, Math.PI * 2);
        bCtx.fill();
        bCtx.fillStyle = "#0f172a";
        bCtx.fillRect(8, 22, 20, 20);
        bCtx.fillStyle = "#fef08a";
        bCtx.fillRect(8, 7, 4, 3);
        bCtx.fillRect(24, 7, 4, 3);
        bCtx.fillStyle = "#dc2626";
        bCtx.fillRect(8, 62, 5, 2);
        bCtx.fillRect(23, 62, 5, 2);
        banger.refresh();

        // 2. Fleet Sedan
        const sedan = this.textures.createCanvas("car_fleet_sedan", 40, 78);
        const sCtx = sedan.context;
        sCtx.fillStyle = "#121212";
        sCtx.fillRect(2, 10, 5, 14);
        sCtx.fillRect(33, 10, 5, 14);
        sCtx.fillRect(2, 52, 5, 14);
        sCtx.fillRect(33, 52, 5, 14);
        sCtx.lineWidth = 2;
        sCtx.strokeStyle = "#ffffff";
        sCtx.fillStyle = "#ffffff";
        sCtx.beginPath();
        drawRoundRect(sCtx, 6, 6, 28, 66, 7);
        sCtx.fill();
        sCtx.stroke();
        sCtx.strokeStyle = "#cbd5e1";
        sCtx.lineWidth = 1.5;
        sCtx.beginPath();
        sCtx.moveTo(7, 39);
        sCtx.lineTo(33, 39);
        sCtx.stroke();
        sCtx.fillStyle = "#1e293b";
        sCtx.beginPath();
        drawRoundRect(sCtx, 9, 22, 22, 28, 4);
        sCtx.fill();
        sCtx.fillStyle = "#f59e0b";
        sCtx.fillRect(13, 34, 14, 4);
        sCtx.fillStyle = "#fef08a";
        sCtx.beginPath();
        sCtx.arc(11, 8, 3, 0, Math.PI * 2);
        sCtx.arc(29, 8, 3, 0, Math.PI * 2);
        sCtx.fill();
        sCtx.fillStyle = "#ef4444";
        sCtx.fillRect(10, 70, 6, 2);
        sCtx.fillRect(24, 70, 6, 2);
        sedan.refresh();

        // 3. Turbo Interceptor (Dodge Viper styling)
        const interceptor = this.textures.createCanvas("car_turbo_interceptor", 42, 82);
        const iCtx = interceptor.context;
        iCtx.fillStyle = "#020617";
        iCtx.fillRect(1, 12, 6, 15);
        iCtx.fillRect(35, 12, 6, 15);
        iCtx.fillRect(1, 53, 6, 15);
        iCtx.fillRect(35, 53, 6, 15);
        iCtx.lineWidth = 2;
        iCtx.strokeStyle = "#ffffff";
        iCtx.fillStyle = "#ffffff";
        iCtx.beginPath();
        drawRoundRect(iCtx, 6, 6, 30, 70, 10);
        iCtx.fill();
        iCtx.stroke();
        iCtx.fillStyle = "#0f172a";
        iCtx.fillRect(17, 6, 3, 70);
        iCtx.fillRect(22, 6, 3, 70);
        iCtx.fillRect(12, 16, 4, 8);
        iCtx.fillRect(26, 16, 4, 8);
        iCtx.fillStyle = "#020617";
        iCtx.beginPath();
        drawRoundRect(iCtx, 10, 28, 22, 22, 5);
        iCtx.fill();
        iCtx.fillStyle = "#020617";
        iCtx.strokeStyle = "#ffffff";
        iCtx.lineWidth = 1;
        iCtx.fillRect(5, 73, 32, 5);
        iCtx.strokeRect(5, 73, 32, 5);
        iCtx.fillStyle = "#38bdf8";
        iCtx.fillRect(10, 8, 5, 3);
        iCtx.fillRect(27, 8, 5, 3);
        iCtx.fillStyle = "#f43f5e";
        iCtx.fillRect(9, 74, 6, 2);
        iCtx.fillRect(27, 74, 6, 2);
        interceptor.refresh();

        // 4. Cyber Hypercar
        const hypercar = this.textures.createCanvas("car_cyber_hypercar", 42, 84);
        const hCtx = hypercar.context;
        hCtx.fillStyle = "#000000";
        hCtx.fillRect(1, 12, 5, 14);
        hCtx.fillRect(36, 12, 5, 14);
        hCtx.fillRect(1, 54, 5, 14);
        hCtx.fillRect(36, 54, 5, 14);
        hCtx.lineWidth = 2;
        hCtx.strokeStyle = "#ffffff";
        hCtx.fillStyle = "#ffffff";
        hCtx.beginPath();
        hCtx.moveTo(21, 4);
        hCtx.lineTo(39, 20);
        hCtx.lineTo(41, 66);
        hCtx.lineTo(35, 80);
        hCtx.lineTo(7, 80);
        hCtx.lineTo(1, 66);
        hCtx.lineTo(3, 20);
        hCtx.closePath();
        hCtx.fill();
        hCtx.stroke();
        hCtx.fillStyle = "#050b14";
        hCtx.beginPath();
        hCtx.moveTo(21, 20);
        hCtx.lineTo(33, 32);
        hCtx.lineTo(31, 52);
        hCtx.lineTo(11, 52);
        hCtx.lineTo(9, 32);
        hCtx.closePath();
        hCtx.fill();
        hCtx.strokeStyle = "#39ff14";
        hCtx.lineWidth = 2;
        hCtx.strokeRect(5, 26, 2, 34);
        hCtx.strokeRect(35, 26, 2, 34);
        hCtx.strokeStyle = "#00f0ff";
        hCtx.lineWidth = 2;
        hCtx.beginPath();
        hCtx.moveTo(10, 8);
        hCtx.lineTo(18, 6);
        hCtx.moveTo(32, 8);
        hCtx.lineTo(24, 6);
        hCtx.stroke();
        hypercar.refresh();

        // 5. Executive Limo
        const limo = this.textures.createCanvas("car_executive_limo", 42, 130);
        const lCtx = limo.context;
        lCtx.fillStyle = "#0f172a";
        lCtx.fillRect(1, 16, 5, 15);
        lCtx.fillRect(36, 16, 5, 15);
        lCtx.fillRect(1, 98, 5, 15);
        lCtx.fillRect(36, 98, 5, 15);
        lCtx.lineWidth = 2;
        lCtx.strokeStyle = "#fef08a";
        lCtx.fillStyle = "#ffffff";
        lCtx.beginPath();
        drawRoundRect(lCtx, 6, 6, 30, 118, 8);
        lCtx.fill();
        lCtx.stroke();
        lCtx.strokeStyle = "#cbd5e1";
        lCtx.lineWidth = 1.5;
        lCtx.beginPath();
        lCtx.moveTo(8, 12);
        lCtx.lineTo(8, 118);
        lCtx.moveTo(34, 12);
        lCtx.lineTo(34, 118);
        lCtx.stroke();
        lCtx.fillStyle = "#020617";
        lCtx.fillRect(9, 22, 24, 16);
        lCtx.fillRect(9, 44, 24, 20);
        lCtx.fillRect(9, 68, 24, 20);
        lCtx.fillRect(9, 92, 24, 14);
        lCtx.fillStyle = "#f59e0b";
        lCtx.beginPath();
        lCtx.arc(21, 54, 2.5, 0, Math.PI * 2);
        lCtx.arc(21, 78, 2.5, 0, Math.PI * 2);
        lCtx.fill();
        lCtx.fillStyle = "#cbd5e1";
        lCtx.fillRect(12, 7, 18, 3);
        lCtx.fillStyle = "#fef08a";
        lCtx.fillRect(9, 9, 4, 3);
        lCtx.fillRect(29, 9, 4, 3);
        limo.refresh();

        // Default / Fallback Chassis Texture (Fully drawn white body, 40x80)
        const chassis = this.textures.createCanvas("car_chassis", 40, 80);
        const cCtx = chassis.context;
        cCtx.fillStyle = "#1e293b";
        cCtx.fillRect(2, 10, 5, 14);
        cCtx.fillRect(33, 10, 5, 14);
        cCtx.fillRect(2, 54, 5, 14);
        cCtx.fillRect(33, 54, 5, 14);
        cCtx.lineWidth = 2;
        cCtx.strokeStyle = "#ffffff";
        cCtx.fillStyle = "#ffffff";
        cCtx.beginPath();
        drawRoundRect(cCtx, 6, 6, 28, 68, 6);
        cCtx.fill();
        cCtx.stroke();
        cCtx.fillStyle = "#0f172a";
        cCtx.fillRect(9, 22, 22, 22);
        cCtx.fillStyle = "#fef08a";
        cCtx.fillRect(9, 7, 4, 3);
        cCtx.fillRect(27, 7, 4, 3);
        chassis.refresh();

        // NPC Commuter Sedan
        const npc = this.textures.createCanvas("npc_chassis", 40, 75);
        const npcCtx = npc.context;
        npcCtx.fillStyle = "#121212";
        npcCtx.fillRect(2, 10, 5, 12);
        npcCtx.fillRect(33, 10, 5, 12);
        npcCtx.fillRect(2, 50, 5, 12);
        npcCtx.fillRect(33, 50, 5, 12);
        npcCtx.lineWidth = 2;
        npcCtx.strokeStyle = "#ffffff";
        npcCtx.fillStyle = "#ffffff"; // White canvas body so tinting applies clean colors!
        npcCtx.beginPath();
        drawRoundRect(npcCtx, 5, 5, 30, 65, 5);
        npcCtx.fill();
        npcCtx.stroke();
        npcCtx.fillStyle = "#0f172a";
        npcCtx.beginPath();
        drawRoundRect(npcCtx, 9, 20, 22, 24, 3);
        npcCtx.fill();
        npcCtx.fillStyle = "#cbd5e1";
        npcCtx.fillRect(8, 3, 24, 3);
        npcCtx.fillRect(8, 69, 24, 3);
        npc.refresh();
      }

      spawnTrafficObstacles() {
        this.npcGroup = this.physics.add.group();
        
        // Straight line commuters (Infinity recycling)
        const straightTraffic = [
          { x: 820, y: 150, vx: 0, vy: 120, vertical: true },
          { x: 1180, y: 1850, vx: 0, vy: -130, vertical: true },
          { x: 1980, y: 820, vx: -140, vy: 0, vertical: false },
          { x: 100, y: 1220, vx: 130, vy: 0, vertical: false }
        ];

        straightTraffic.forEach(drive => {
          const npcObj = this.physics.add.sprite(drive.x, drive.y, "npc_chassis");
          npcObj.setCollideWorldBounds(false);
          npcObj.body.setImmovable(true);
          npcObj.setCircle(17, 3, 20);
          npcObj.setTint(Phaser.Math.RND.pick(NPC_COLORS));

          if (drive.vertical) {
            npcObj.setAngle(drive.vy > 0 ? 0 : 180);
          } else {
            npcObj.setAngle(drive.vx > 0 ? 90 : -90);
          }

          npcObj.setVelocity(drive.vx, drive.vy);
          (npcObj as any).routeConfig = drive;
          (npcObj as any).originalVx = drive.vx;
          (npcObj as any).originalVy = drive.vy;
          (npcObj as any).isStopped = false;
          (npcObj as any).stopUntil = 0;
          this.npcGroup.add(npcObj);
        });

        // Waypoint pattern drivers
        const waypointRoutes = [
          {
            waypoints: [
              { x: 400, y: 1600 },
              { x: 1600, y: 1600 },
              { x: 1600, y: 400 },
              { x: 400, y: 400 }
            ],
            speed: 100
          },
          {
            waypoints: [
              { x: 1200, y: 400 },
              { x: 1600, y: 400 },
              { x: 1600, y: 1200 },
              { x: 1200, y: 1200 }
            ],
            speed: 115
          },
          {
            waypoints: [
              { x: 800, y: 800 },
              { x: 800, y: 1600 },
              { x: 1600, y: 1600 },
              { x: 1600, y: 800 }
            ],
            speed: 105
          },
          {
            waypoints: [
              { x: 400, y: 1200 },
              { x: 1200, y: 1200 },
              { x: 1200, y: 1600 },
              { x: 400, y: 1600 }
            ],
            speed: 125
          }
        ];

        waypointRoutes.forEach(route => {
          const startPt = route.waypoints[0];
          const npcObj = this.physics.add.sprite(startPt.x, startPt.y, "npc_chassis");
          npcObj.setCollideWorldBounds(true);
          npcObj.body.setImmovable(true);
          npcObj.setCircle(17, 3, 20);
          npcObj.setTint(Phaser.Math.RND.pick(NPC_COLORS));

          (npcObj as any).isWaypointRoute = true;
          (npcObj as any).waypoints = route.waypoints;
          (npcObj as any).currentWaypointIndex = 1;
          (npcObj as any).speed = route.speed;
          (npcObj as any).originalVx = 0;
          (npcObj as any).originalVy = 0;
          (npcObj as any).isStopped = false;
          (npcObj as any).stopUntil = 0;

          this.npcGroup.add(npcObj);
        });
      }

      loadAllLetters() {
        // Clear any prior letter containers
        if (this.letterContainers) {
          this.letterContainers.forEach((container: any) => {
            if (container) container.destroy();
          });
        }
        this.letterContainers = [];
        this.collectedLettersList = [];
        this.targetCoord = null;

        const activeWordObj = IELTS_WORDS[this.currentWordIndex];
        if (!activeWordObj) return;

        // Spawn all characters of the target word simultaneously
        const wordStr = activeWordObj.word;
        for (let i = 0; i < wordStr.length; i++) {
          const char = wordStr[i];
          this.spawnLetterNodeAtRandom(char, i);
        }

        // Notify React of the refreshed letters state
        window.dispatchEvent(new CustomEvent("phaser-letters-update", {
          detail: {
            collected: [],
            total: wordStr.length
          }
        }));
      }

      spawnLetterNodeAtRandom(character: string, index: number) {
        let spawnX = 400;
        let spawnY = 400;
        let found = false;

        // Math guaranteed spawn roads to avoid overlapping buildings
        const roads = [400, 800, 1200, 1600];
        for (let i = 0; i < 50; i++) {
          const isVert = Math.random() > 0.5;

          if (isVert) {
            spawnX = roads[Math.floor(Math.random() * roads.length)];
            spawnY = Math.floor(Math.random() * 1600) + 200;
          } else {
            spawnX = Math.floor(Math.random() * 1600) + 200;
            spawnY = roads[Math.floor(Math.random() * roads.length)];
          }

          // Check margin against player car and other spawned letters
          const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, spawnX, spawnY);
          const tooCloseToOther = this.letterContainers.some((c: any) => {
            return c && Phaser.Math.Distance.Between(c.x, c.y, spawnX, spawnY) < 150;
          });

          if (d > 350 && !tooCloseToOther) {
            found = true;
            break;
          }
        }

        // Setup Letter Container
        const container = this.add.container(spawnX, spawnY);
        container.setSize(48, 48);
        this.physics.world.enable(container);

        (container as any).character = character;
        (container as any).letterId = index;

        const circle = this.add.graphics();
        // GTA 1 Style: Bold yellow/orange circular badge with thick solid stroke
        circle.lineStyle(3, 0xfacc15, 1.0);
        circle.fillStyle(0x1c1917, 0.95);
        circle.strokeCircle(0, 0, 22);
        circle.fillCircle(0, 0, 22);

        // Gloss ring
        circle.lineStyle(1, 0xffffff, 0.4);
        circle.strokeCircle(0, 0, 25);

        const textObj = this.add.text(0, 0, character, {
          fontFamily: "Impact, Arial Black, sans-serif",
          fontSize: "24px",
          fontWeight: "900",
          color: "#facc15"
        }).setOrigin(0.5, 0.5);

        container.add([circle, textObj]);

        // Y-axis hover tween
        this.tweens.add({
          targets: container,
          y: spawnY - 12,
          duration: 1000 + Math.random() * 400,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut"
        });

        // Overlay pickup overlapping logic
        this.physics.add.overlap(this.player, container, this.onLetterPicked, undefined, this);

        this.letterContainers.push(container);

        // Update target arrow coordinate to closest
        this.updateGPSPointerTarget();
      }

      updateGPSPointerTarget() {
        if (!this.letterContainers || this.letterContainers.length === 0) {
          this.targetCoord = null;
          return;
        }

        let nearestDistance = Infinity;
        let nearestContainer: any = null;

        this.letterContainers.forEach((container: any) => {
          if (container && container.active) {
            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, container.x, container.y);
            if (dist < nearestDistance) {
              nearestDistance = dist;
              nearestContainer = container;
            }
          }
        });

        if (nearestContainer) {
          this.targetCoord = { 
            x: nearestContainer.x, 
            y: nearestContainer.y, 
            character: nearestContainer.character 
          };
        } else {
          this.targetCoord = null;
        }
      }

      onLetterPicked(playerObj: any, containerObj: any) {
        // Disable overlap logic immediately
        this.physics.world.disable(containerObj);

        // Play Live synthesizer pickup beep
        playAudioSynth("pickup");

        // Golden sparks fireworks
        this.goldParticles.emitParticleAt(containerObj.x, containerObj.y, 25);
        this.cameras.main.shake(150, 0.006);

        const char = containerObj.character;
        const letterId = containerObj.letterId;

        // Register in collection
        this.collectedLettersList.push({ index: letterId, char: char });

        // Remove from phaser arrays
        this.letterContainers = this.letterContainers.filter((c: any) => c !== containerObj);
        containerObj.destroy();

        // Standard instant letter bounty reward
        const reward = 15;
        this.currentCash += reward;
        setCash(this.currentCash);

        window.dispatchEvent(new CustomEvent("phaser-cash-update", { detail: this.currentCash }));
        window.dispatchEvent(new CustomEvent("phaser-letters-update", {
          detail: {
            collected: this.collectedLettersList,
            total: IELTS_WORDS[this.currentWordIndex].word.length,
            toastText: `Letter '<strong>${char}</strong>' loaded! <span class="text-yellow-400">+$15</span>`,
            toastType: "success"
          }
        }));

        // Check completion criteria
        if (this.letterContainers.length === 0) {
          // Trigger the unscramble overlay panel in React
          window.dispatchEvent(new CustomEvent("phaser-unscramble-trigger", {
            detail: {
              wordIndex: this.currentWordIndex,
              collected: this.collectedLettersList
            }
          }));
        } else {
          this.updateGPSPointerTarget();
        }
      }

      dropLetterOnCrash() {
        if (this.currentIsUnscrambling) return;
        if (this.collectedLettersList.length === 0) return;

        // 10 second cooldown (10000 ms)
        if (this.time.now - this.lastLetterDropTime < 10000) {
          return;
        }

        // 30% chance to drop cargo letter on crash
        if (Math.random() < 0.3) {
          // Play loss synth sound
          playAudioSynth("loss");

          const dropIndex = Math.floor(Math.random() * this.collectedLettersList.length);
          const droppedLetter = this.collectedLettersList[dropIndex];

          // Evict from inventory
          this.collectedLettersList.splice(dropIndex, 1);

          // Spawn back into the city
          this.spawnLetterNodeAtRandom(droppedLetter.char, droppedLetter.index);

          this.updateGPSPointerTarget();

          // Update last drop timestamp
          this.lastLetterDropTime = this.time.now;

          // Dispatch event to warn user
          window.dispatchEvent(new CustomEvent("phaser-letters-update", {
            detail: {
              collected: this.collectedLettersList,
              total: IELTS_WORDS[this.currentWordIndex].word.length,
              toastText: `💥 CARGO DAMAGE! Letter '<strong>${droppedLetter.char}</strong>' knocked loose and respawned in the city!`,
              toastType: "error"
            }
          }));
        }
      }

      onWallHit() {
        if (this.currentIsUnscrambling) return;
        if (!this.isStunned) {
          this.velocity = -this.velocity * 0.35;
          this.cameras.main.shake(200, 0.012);
          
          this.player.setTint(0xffffff); // Flash white impact
          this.isStunned = true;
          this.stunTimer = this.time.now + 400;

          playAudioSynth("crash");

          // Chance to spill letters
          this.dropLetterOnCrash();
        }
      }

      onNPCHit(playerObj: any, npcObj: any) {
        if (this.currentIsUnscrambling) {
          return; // Ignore completely during unscramble part of the game
        }

        if (npcObj) {
          npcObj.isStopped = true;
          npcObj.stopUntil = this.time.now + 2500; // Stop for 2.5 seconds
          npcObj.setVelocity(0, 0);
        }

        if (!this.isStunned) {
          this.velocity = -this.velocity * 0.25;
          this.cameras.main.shake(250, 0.018);

          playAudioSynth("crash");

          // Financial penalty for causing accidents
          window.dispatchEvent(new CustomEvent("phaser-letters-update", {
            detail: {
              collected: this.collectedLettersList,
              total: IELTS_WORDS[this.currentWordIndex].word.length,
              toastText: `💥 COLLISION! Watch out for commuter cars!`,
              toastType: "error"
            }
          }));

          // Chance to spill letters
          this.dropLetterOnCrash();

          this.player.setTint(0xff0050); // Flash red
          this.isStunned = true;
          this.stunTimer = this.time.now + 500;
        }
      }

      update(time: number, delta: number) {
        // Clear flashes
        if (this.isStunned && time > this.stunTimer) {
          this.isStunned = false;
          this.player.setTint(this.carColor);
        }

        // Run obstacle detection for all NPCs before handling movement
        this.handleNPCObstacleDetection(time, delta);

        // Handle NPC stop-and-resume logic
        this.npcGroup.getChildren().forEach((npc: any) => {
          if (npc.isStopped) {
            if (time > npc.stopUntil) {
              npc.isStopped = false;
              if (!npc.isWaypointRoute) {
                npc.setVelocity(npc.originalVx, npc.originalVy);
              }
            } else {
              npc.setVelocity(0, 0);
            }
          }
        });

        // Steer player physics model
        this.driveSteerControls(time, delta);

        // Render off-screen HUD navigational pointer
        this.renderOffScreenGPS();

        // Update waypointed NPC commuters
        this.updateWaypointNPCs(delta);

        // Recycle straight-lane boundary traffic
        this.recycleNPCPositions();
      }

      driveSteerControls(time: number, delta: number) {
        // Read touch/joystick input
        const touchInput = (window as any).__touchControls || { up: false, down: false, left: false, right: false, steer: 0, throttle: 0 };

        // Read key binds
        const up = this.cursors.up.isDown || this.wasd.up.isDown || touchInput.up;
        const down = this.cursors.down.isDown || this.wasd.down.isDown || touchInput.down;
        const left = this.cursors.left.isDown || this.wasd.left.isDown || touchInput.left;
        const right = this.cursors.right.isDown || this.wasd.right.isDown || touchInput.right;

        // Freeze steering and acceleration when unscrambling
        if (this.currentIsUnscrambling) {
          this.player.setVelocity(0, 0);
          return;
        }

        // Steering rotation (handling physics)
        if (Math.abs(this.velocity) > 10) {
          const steerRate = (this.handling * (delta / 1000)) * (this.velocity > 0 ? 1 : -0.65);
          if (Math.abs(touchInput.steer) > 0.05) {
            this.carAngle += steerRate * touchInput.steer;
          } else {
            if (left) this.carAngle -= steerRate;
            if (right) this.carAngle += steerRate;
          }
        }

        // Forward/reverse throttle
        if (!this.isStunned) {
          if (Math.abs(touchInput.throttle) > 0.05) {
            if (touchInput.throttle > 0) {
              this.velocity += this.acceleration * touchInput.throttle * (delta / 1000);
              if (this.velocity > this.maxSpeed) this.velocity = this.maxSpeed;
              this.sparkBoosterExhaust();
            } else {
              this.velocity += this.acceleration * 1.3 * touchInput.throttle * (delta / 1000); // throttle is negative
              if (this.velocity < -this.maxSpeed * 0.45) this.velocity = -this.maxSpeed * 0.45;
            }
          } else if (up) {
            this.velocity += this.acceleration * (delta / 1000);
            if (this.velocity > this.maxSpeed) this.velocity = this.maxSpeed;
            this.sparkBoosterExhaust();
          } else if (down) {
            this.velocity -= this.acceleration * 1.3 * (delta / 1000);
            if (this.velocity < -this.maxSpeed * 0.45) this.velocity = -this.maxSpeed * 0.45;
          } else {
            // Drag deceleration friction
            if (this.velocity > 0) {
              this.velocity -= this.drag * (delta / 1000);
              if (this.velocity < 0) this.velocity = 0;
            } else if (this.velocity < 0) {
              this.velocity += this.drag * (delta / 1000);
              if (this.velocity > 0) this.velocity = 0;
            }
          }
        } else {
          // Braking stun
          this.velocity *= 0.94;
        }

        // Update physics sprite velocities
        this.player.setAngle(this.carAngle + 90);
        const rad = Phaser.Math.DegToRad(this.carAngle);
        this.player.setVelocity(
          Math.cos(rad) * this.velocity,
          Math.sin(rad) * this.velocity
        );

        // Executive Limo VIP money flying effect when driving
        if (this.currentCarId === "executive_limo" && Math.abs(this.velocity) > 25) {
          if (!this.lastMoneyParticleTime) this.lastMoneyParticleTime = 0;
          if (time - this.lastMoneyParticleTime > 140) {
            this.spawnLimoMoneyParticle(time);
            this.lastMoneyParticleTime = time;
          }
        }

        // Fire speedometer telemetry events to React
        const calculatedMph = Math.round(Math.abs(this.velocity) / 3);
        window.dispatchEvent(new CustomEvent("phaser-car-speed", { detail: calculatedMph }));
      }

      spawnLimoMoneyParticle(time: number) {
        if (!this.player) return;
        const rad = Phaser.Math.DegToRad(this.carAngle);
        const side = Math.random() > 0.5 ? 1 : -1;
        const sideOffset = 22 * side;
        const backOffset = Phaser.Math.Between(-35, 20);

        const spawnX = this.player.x + Math.cos(rad + Math.PI / 2) * sideOffset - Math.cos(rad) * backOffset;
        const spawnY = this.player.y + Math.sin(rad + Math.PI / 2) * sideOffset - Math.sin(rad) * backOffset;

        const cashText = this.add.text(spawnX, spawnY, "$", {
          fontFamily: "Impact, Arial Black, sans-serif",
          fontSize: "15px",
          fontWeight: "900",
          color: "#4ade80"
        }).setOrigin(0.5, 0.5);

        const floatAngle = rad + (side * Math.PI / 2) + Phaser.Math.FloatBetween(-0.4, 0.4);
        const floatDist = Phaser.Math.Between(30, 50);

        this.tweens.add({
          targets: cashText,
          x: spawnX + Math.cos(floatAngle) * floatDist,
          y: spawnY + Math.sin(floatAngle) * floatDist,
          alpha: 0,
          scale: 1.4,
          duration: 600,
          ease: "Power1",
          onComplete: () => {
            cashText.destroy();
          }
        });
      }

      sparkBoosterExhaust() {
        const rad = Phaser.Math.DegToRad(this.carAngle);
        const tailX = this.player.x - Math.cos(rad) * 28;
        const tailY = this.player.y - Math.sin(rad) * 28;

        this.exhaustParticles.emitParticleAt(tailX, tailY, 1);
      }

      renderOffScreenGPS() {
        this.gpsPointer.clear();

        if (!this.targetCoord) return;

        // Is target letter visible in viewport?
        const cam = this.cameras.main;
        const viewX = this.targetCoord.x - cam.scrollX;
        const viewY = this.targetCoord.y - cam.scrollY;

        const isVisible = (viewX >= 0 && viewX <= cam.width && viewY >= 0 && viewY <= cam.height);
        if (isVisible) return; // Hide arrow if letter is visible on-screen

        // Find bearing vector
        const dX = this.targetCoord.x - this.player.x;
        const dY = this.targetCoord.y - this.player.y;
        const bearingAngle = Math.atan2(dY, dX);

        // Calculate location on viewport edges
        const centerX = cam.width / 2;
        const centerY = cam.height / 2;
        const padding = 55;
        const boundX = centerX - padding;
        const boundY = centerY - padding;

        const ratio = Math.min(
          Math.abs(boundX / Math.cos(bearingAngle)),
          Math.abs(boundY / Math.sin(bearingAngle))
        );

        const borderX = centerX + Math.cos(bearingAngle) * ratio;
        const borderY = centerY + Math.sin(bearingAngle) * ratio;

        // Render sleek vector triangle arrow
        this.gpsPointer.lineStyle(2, 0xfacc15, 0.9);
        this.gpsPointer.fillStyle(0xfacc15, 0.7);

        // Generate triangle rotated in bearing direction
        this.gpsPointer.beginPath();
        const arrowLength = 16;
        const arrowWidth = 10;

        const tipX = borderX;
        const tipY = borderY;
        const baseLeftX = borderX - Math.cos(bearingAngle) * arrowLength + Math.cos(bearingAngle + Math.PI/2) * arrowWidth;
        const baseLeftY = borderY - Math.sin(bearingAngle) * arrowLength + Math.sin(bearingAngle + Math.PI/2) * arrowWidth;
        const baseRightX = borderX - Math.cos(bearingAngle) * arrowLength - Math.cos(bearingAngle + Math.PI/2) * arrowWidth;
        const baseRightY = borderY - Math.sin(bearingAngle) * arrowLength - Math.sin(bearingAngle + Math.PI/2) * arrowWidth;

        this.gpsPointer.moveTo(tipX, tipY);
        this.gpsPointer.lineTo(baseLeftX, baseLeftY);
        this.gpsPointer.lineTo(baseRightX, baseRightY);
        this.gpsPointer.closePath();
        this.gpsPointer.fillPath();
        this.gpsPointer.strokePath();

        // Draw HUD letter guide beside arrow
        const letter = this.targetCoord.character || "";
        if (letter) {
          this.gpsPointer.lineStyle(1.5, 0xfacc15, 0.45);
          this.gpsPointer.strokeCircle(borderX - Math.cos(bearingAngle) * 35, borderY - Math.sin(bearingAngle) * 35, 12);
        }
      }

      updateWaypointNPCs(delta: number) {
        this.npcGroup.getChildren().forEach((npc: any) => {
          if (!npc.isWaypointRoute) return;
          if (npc.isStopped) return;

          const target = npc.waypoints[npc.currentWaypointIndex];
          const dist = Phaser.Math.Distance.Between(npc.x, npc.y, target.x, target.y);

          // If close enough, switch to next waypoint
          if (dist < 18) {
            npc.currentWaypointIndex = (npc.currentWaypointIndex + 1) % npc.waypoints.length;
          }

          const currentTarget = npc.waypoints[npc.currentWaypointIndex];
          const angle = Phaser.Math.Angle.Between(npc.x, npc.y, currentTarget.x, currentTarget.y);

          // Rotate NPC to face the target waypoint
          npc.setAngle(Phaser.Math.RadToDeg(angle) + 90);

          // Set continuous speed velocity
          npc.setVelocity(Math.cos(angle) * npc.speed, Math.sin(angle) * npc.speed);
        });
      }

      recycleNPCPositions() {
        this.npcGroup.getChildren().forEach((npc: any) => {
          if (npc.isWaypointRoute) return; // Ignore waypoint loopers
          const spec = npc.routeConfig;
          if (spec.vertical) {
            if (spec.vy > 0 && npc.y > 2100) {
              npc.y = -100;
            } else if (spec.vy < 0 && npc.y < -100) {
              npc.y = 2100;
            }
          } else {
            if (spec.vx > 0 && npc.x > 2100) {
              npc.x = -100;
            } else if (spec.vx < 0 && npc.x < -100) {
              npc.x = 2100;
            }
          }
        });
      }

      handleNPCObstacleDetection(time: number, delta: number) {
        this.npcGroup.getChildren().forEach((npc: any) => {
          // 1. Determine NPC forward heading vector
          let dx = 0;
          let dy = 0;
          if (npc.isWaypointRoute) {
            const target = npc.waypoints[npc.currentWaypointIndex];
            const angle = Phaser.Math.Angle.Between(npc.x, npc.y, target.x, target.y);
            dx = Math.cos(angle);
            dy = Math.sin(angle);
          } else {
            const len = Math.sqrt(npc.originalVx * npc.originalVx + npc.originalVy * npc.originalVy);
            if (len > 0) {
              dx = npc.originalVx / len;
              dy = npc.originalVy / len;
            }
          }

          let blocked = false;
          let faceToFacePartner: any = null;

          // 2. Check player in front
          const distToPlayer = Phaser.Math.Distance.Between(npc.x, npc.y, this.player.x, this.player.y);
          if (distToPlayer < 95) {
            const tx = this.player.x - npc.x;
            const ty = this.player.y - npc.y;
            const dot = (tx * dx + ty * dy) / distToPlayer;
            if (dot > 0.8) {
              blocked = true;
            }
          }

          // 3. Check other NPCs in front
          this.npcGroup.getChildren().forEach((other: any) => {
            if (other === npc) return;
            const distToOther = Phaser.Math.Distance.Between(npc.x, npc.y, other.x, other.y);
            if (distToOther < 95) {
              const tx = other.x - npc.x;
              const ty = other.y - npc.y;
              const dot = (tx * dx + ty * dy) / distToOther;
              if (dot > 0.8) {
                blocked = true;

                // Check face-to-face
                let odx = 0;
                let ody = 0;
                if (other.isWaypointRoute) {
                  const otarget = other.waypoints[other.currentWaypointIndex];
                  const oangle = Phaser.Math.Angle.Between(other.x, other.y, otarget.x, otarget.y);
                  odx = Math.cos(oangle);
                  ody = Math.sin(oangle);
                } else {
                  const olen = Math.sqrt(other.originalVx * other.originalVx + other.originalVy * other.originalVy);
                  if (olen > 0) {
                    odx = other.originalVx / olen;
                    ody = other.originalVy / olen;
                  }
                }

                const headingDot = dx * odx + dy * ody;
                const otx = npc.x - other.x;
                const oty = npc.y - other.y;
                const odot = (otx * odx + oty * ody) / distToOther;

                // Opposite directions and facing each other
                if (headingDot < -0.7 && odot > 0.8) {
                  faceToFacePartner = other;
                }
              }
            }
          });

          // 4. Act on Blocked State
          if (blocked) {
            npc.isStopped = true;
            npc.stopUntil = time + 1000; // Keep stopped
            npc.setVelocity(0, 0);

            // Honk occasionally if on screen
            if (!npc.lastHonkTime) npc.lastHonkTime = 0;
            if (!npc.honkCooldown) npc.honkCooldown = Phaser.Math.Between(1500, 3500);

            if (time - npc.lastHonkTime > npc.honkCooldown) {
              const cam = this.cameras.main;
              const onScreen = cam.worldView.contains(npc.x, npc.y);
              if (onScreen && !this.currentIsMuted) {
                playAudioSynth("honk");
              }
              npc.lastHonkTime = time;
              npc.honkCooldown = Phaser.Math.Between(2500, 5000);
            }

            // Face-to-face random timer setup
            if (faceToFacePartner) {
              if (!npc.isFaceToFace) {
                npc.isFaceToFace = true;
                const duration = Phaser.Math.Between(4000, 10000);
                npc.faceToFaceTimer = time + duration;
              }

              // If timer expired, turn around and reverse path
              if (time >= npc.faceToFaceTimer) {
                if (npc.isWaypointRoute) {
                  npc.waypoints = [...npc.waypoints].reverse();
                  const N = npc.waypoints.length;
                  const prevIdx = (npc.currentWaypointIndex - 1 + N) % N;
                  npc.currentWaypointIndex = (N - 1 - prevIdx) % N;
                } else {
                  npc.originalVx = -npc.originalVx;
                  npc.originalVy = -npc.originalVy;
                  if (npc.routeConfig) {
                    npc.routeConfig.vx = -npc.routeConfig.vx;
                    npc.routeConfig.vy = -npc.routeConfig.vy;
                  }
                }
                npc.setAngle(npc.angle + 180);

                // Reset states
                npc.isFaceToFace = false;
                npc.faceToFaceTimer = 0;
                npc.isStopped = false;
                npc.stopUntil = 0;

                // Trigger a nice little info visual toast
                const cam = this.cameras.main;
                if (cam.worldView.contains(npc.x, npc.y)) {
                  window.dispatchEvent(new CustomEvent("phaser-letters-update", {
                    detail: {
                      collected: this.collectedLettersList,
                      total: IELTS_WORDS[this.currentWordIndex].word.length,
                      toastText: `🚗 Gridlock resolved: Driver did a U-turn!`,
                      toastType: "info"
                    }
                  }));
                }
              }
            } else {
              npc.isFaceToFace = false;
              npc.faceToFaceTimer = 0;
            }
          } else {
            // Not blocked, clear face to face
            npc.isFaceToFace = false;
            npc.faceToFaceTimer = 0;
          }
        });
      }
    }

    // Configure Phaser 3 parameters
    const w = phaserContainerRef.current.clientWidth || 800;
    const h = phaserContainerRef.current.clientHeight || 600;

    const gameConfig = {
      type: Phaser.AUTO,
      parent: phaserContainerRef.current,
      width: w,
      height: h,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      },
      scene: [DrivingScene]
    };

    const phaserInstance = new Phaser.Game(gameConfig);
    phaserGameRef.current = phaserInstance;

    // Handle resizing window to re-fit canvas dynamically
    const handleResize = () => {
      if (
        phaserContainerRef.current &&
        phaserGameRef.current &&
        phaserGameRef.current.scale
      ) {
        const width = phaserContainerRef.current.clientWidth;
        const height = phaserContainerRef.current.clientHeight;
        if (width > 0 && height > 0) {
          try {
            phaserGameRef.current.scale.resize(width, height);
          } catch (e) {
            // Ignore resize errors during teardown
          }
        }
      }
    };

    window.addEventListener("resize", handleResize);

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize);
      if (phaserGameRef.current) {
        try {
          phaserGameRef.current.destroy(true);
        } catch (e) {
          // Ignore destroy errors during unmount
        }
        phaserGameRef.current = null;
      }
    };
  }, []);

  // Purchase vehicle action
  const handleBuyCar = (car: CarModel) => {
    if (cash >= car.price && !ownedCars.includes(car.id)) {
      const updatedCash = cash - car.price;
      const updatedOwned = [...ownedCars, car.id];
      
      setCash(updatedCash);
      setOwnedCars(updatedOwned);
      setActiveCarId(car.id);
      
      triggerToast(`🏎️ Purchased and equipped ${car.name}! Ready to drive!`, "success");
    } else {
      triggerToast(`❌ Insufficient funds. Complete more vocabulary spelling runs!`, "error");
    }
  };

  // Select target word from term bank
  const handlePracticeWord = (index: number) => {
    setActiveWordIndex(index);
    setSpelledText(""); // Reset current letters spelt
    triggerToast(`📖 Practice word programmed: "${IELTS_WORDS[index].word}"`, "info");
    setActiveTab("streets");
  };

  // Unscramble mechanics
  const handleLetterFromPoolToSlot = (letter: { index: number; char: string }) => {
    if (unscrambleSlots.some(s => s.index === letter.index)) return;
    setUnscrambleSlots([...unscrambleSlots, letter]);
    setUnscramblePool(unscramblePool.filter(p => p.index !== letter.index));
    setIsWrongSpelling(false);
  };

  const handleLetterFromSlotToPool = (letter: { index: number; char: string }) => {
    setUnscrambleSlots(unscrambleSlots.filter(s => s.index !== letter.index));
    setUnscramblePool([...unscramblePool, letter]);
    setIsWrongSpelling(false);
  };

  const handlePayForHelp = () => {
    if (!unscrambleWordInfo) return;
    const word = unscrambleWordInfo.word;
    const hintCost = Math.round(word.length * 20 * 0.1); // 10% of final reward
    
    if (cash < hintCost) {
      triggerToast(`❌ Insufficient funds for hint. Needs $${hintCost}!`, "error");
      return;
    }

    // Determine correct prefix of slots
    let prefixLength = 0;
    while (
      prefixLength < unscrambleSlots.length &&
      prefixLength < word.length &&
      unscrambleSlots[prefixLength].char.toUpperCase() === word[prefixLength].toUpperCase()
    ) {
      prefixLength++;
    }

    if (prefixLength >= word.length) {
      triggerToast(`✨ Word is already fully solved! Click SUBMIT SPELLING.`, "info");
      return;
    }

    // Deduct cash
    const nextCash = cash - hintCost;
    setCash(nextCash);
    playAudioSynth("pickup");

    // All letters from prefixLength onwards in unscrambleSlots are incorrect, return them to the pool
    const incorrectSlots = unscrambleSlots.slice(prefixLength);
    const newSlots = unscrambleSlots.slice(0, prefixLength);
    const newPool = [...unscramblePool, ...incorrectSlots];

    // Find the correct character for index prefixLength in the pool
    const targetChar = word[prefixLength].toUpperCase();
    const foundIdx = newPool.findIndex(p => p.char.toUpperCase() === targetChar);

    if (foundIdx !== -1) {
      const correctLetter = newPool[foundIdx];
      newPool.splice(foundIdx, 1);
      newSlots.push(correctLetter);
      
      setUnscrambleSlots(newSlots);
      setUnscramblePool(newPool);
      setIsWrongSpelling(false);
      triggerToast(`💡 Revealed letter '${targetChar}'! Deducted -$${hintCost}`, "success");
    } else {
      // Refund if something went wrong
      setUnscrambleSlots(newSlots);
      setUnscramblePool(newPool);
      triggerToast(`💡 Refunded: Could not locate letter '${targetChar}' in pool.`, "info");
      setCash(cash);
    }
  };

  const handleClearUnscramble = () => {
    if (unscrambleWordInfo) {
      setUnscrambleSlots([]);
      setUnscramblePool([...unscrambleWordInfo.collected]);
      setIsWrongSpelling(false);
    }
  };

  const handleSubmitUnscramble = () => {
    if (!unscrambleWordInfo) return;
    const currentSpelled = unscrambleSlots.map(s => s.char).join("");
    if (currentSpelled.toUpperCase() === unscrambleWordInfo.word.toUpperCase()) {
      playAudioSynth("success");
      const wordBonus = unscrambleWordInfo.word.length * 20;
      const finalBudget = cash + wordBonus;
      const nextIdx = (activeWordIndex + 1) % IELTS_WORDS.length;
      const nextSolvedCount = wordsSolvedCount + 1;

      setCash(finalBudget);
      setActiveWordIndex(nextIdx);
      setWordsSolvedCount(nextSolvedCount);
      setCollectedLetters([]);
      setIsUnscrambling(false);
      setGaveUp(false);
      setIsWrongSpelling(false);

      triggerToast(`🏆 Solved <strong>${unscrambleWordInfo.word}</strong>! Completed bonus <span class="text-yellow-400 font-bold">+$${wordBonus}</span>`, "bonus");

      if (phaserGameRef.current) {
        window.dispatchEvent(new CustomEvent("react-word-changed", { detail: nextIdx }));
      }
    } else {
      playAudioSynth("loss");
      setIsWrongSpelling(true);
      triggerToast(`❌ Incorrect spelling! Check your letter order and try again.`, "error");
    }
  };

  const handleGiveUpUnscramble = () => {
    if (unscrambleTime < 10) return;
    if (!unscrambleWordInfo) return;

    playAudioSynth("loss");
    const pityReward = 10;
    const finalBudget = cash + pityReward;
    const nextIdx = (activeWordIndex + 1) % IELTS_WORDS.length;
    const nextSolvedCount = wordsSolvedCount + 1;

    setCash(finalBudget);
    setActiveWordIndex(nextIdx);
    setWordsSolvedCount(nextSolvedCount);
    setCollectedLetters([]);
    setGaveUp(true);

    triggerToast(`📖 Revealed: <strong>${unscrambleWordInfo.word}</strong>. Solved pity payout <span class="text-amber-500">+$10</span>`, "info");

    setTimeout(() => {
      setIsUnscrambling(false);
      setGaveUp(false);
      setIsWrongSpelling(false);

      if (phaserGameRef.current) {
        window.dispatchEvent(new CustomEvent("react-word-changed", { detail: nextIdx }));
      }
    }, 4500);
  };

  // Trigger window resize when activeTab changes so Phaser recalculates canvas dimensions
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 100);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const handleTeleportToStart = () => {
    window.dispatchEvent(new Event("react-teleport-start"));
    playAudioSynth("pickup");
    triggerToast("⚡ Teleported car back to start location!", "info");
  };

  const activeWordObj = IELTS_WORDS[activeWordIndex];

  return (
    <div className="w-screen h-screen flex flex-col md:flex-row bg-[#0c0d0f] font-sans overflow-hidden">
      
      {/* MOBILE COMPACT TOP HEADER (< md) */}
      <header className="flex md:hidden items-center justify-between px-3 py-2 bg-[#111215] border-b border-slate-800 z-30 shrink-0 font-cyber">
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">
            IELTS <span className="text-white">DRIVER</span>
          </h1>
          <span className="text-[10px] font-bold text-amber-400 bg-amber-950/50 border border-amber-500/30 px-1.5 py-0.5 rounded">
            ${cash}
          </span>
        </div>

        {/* Mobile Navigation Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab("streets")}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
              activeTab === "streets" 
                ? "bg-amber-500 text-slate-950 shadow-[0_0_10px_rgba(245,158,11,0.3)]" 
                : "bg-slate-900 text-slate-400 border border-slate-800"
            }`}
          >
            <Compass className="w-3 h-3" />
            <span>STREETS</span>
          </button>

          <button
            onClick={() => setActiveTab("garage")}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
              activeTab === "garage" 
                ? "bg-amber-500 text-slate-950 shadow-[0_0_10px_rgba(245,158,11,0.3)]" 
                : "bg-slate-900 text-slate-400 border border-slate-800"
            }`}
          >
            <Car className="w-3 h-3" />
            <span>GARAGE</span>
          </button>

          <button
            onClick={() => setActiveTab("dictionary")}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
              activeTab === "dictionary" 
                ? "bg-amber-500 text-slate-950 shadow-[0_0_10px_rgba(245,158,11,0.3)]" 
                : "bg-slate-900 text-slate-400 border border-slate-800"
            }`}
          >
            <BookOpen className="w-3 h-3" />
            <span>VOCAB</span>
          </button>
        </div>
      </header>

      {/* DESKTOP LEFT SIDEBAR (Hidden on mobile) */}
      <aside className="hidden md:flex md:w-80 lg:w-96 shrink-0 bg-[#141619] border-r border-slate-800 flex-col justify-between z-20 shadow-2xl overflow-y-auto h-full">
        <div className="flex flex-col">
          
          {/* Brand Decal */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#111215]">
            <div className="flex flex-col">
              <span className="text-[10px] tracking-widest text-amber-500 font-bold uppercase font-cyber">Career Vocational Driving</span>
              <h1 className="text-xl font-cyber font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500 tracking-tight leading-none mt-0.5">
                IELTS <span className="text-white">DRIVER</span>
              </h1>
            </div>
            <div className="px-2 py-1 bg-amber-950/40 border border-amber-500/30 rounded text-amber-400 text-[10px] font-cyber font-bold animate-pulse">
              V8 ENGINE
            </div>
          </div>

          {/* Nav Links */}
          <nav className="p-3 flex flex-col gap-2 border-b border-slate-800/80">
            
            <button
              onClick={() => setActiveTab("streets")}
              className={`w-full p-2.5 rounded-xl flex items-center justify-start gap-2.5 font-cyber font-bold text-xs tracking-wider transition-all cursor-pointer ${
                activeTab === "streets" 
                  ? "bg-gradient-to-r from-amber-500/20 to-yellow-600/10 border border-amber-500 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.15)]" 
                  : "bg-slate-900/30 border border-transparent hover:border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              <Compass className="w-4 h-4 shrink-0 text-amber-400" />
              <span>STREETS</span>
            </button>

            <button
              onClick={() => setActiveTab("garage")}
              className={`w-full p-2.5 rounded-xl flex items-center justify-start gap-2.5 font-cyber font-bold text-xs tracking-wider transition-all cursor-pointer ${
                activeTab === "garage" 
                  ? "bg-gradient-to-r from-amber-500/20 to-yellow-600/10 border border-amber-500 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.15)]" 
                  : "bg-slate-900/30 border border-transparent hover:border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              <Car className="w-4 h-4 shrink-0 text-amber-400" />
              <span>GARAGE</span>
            </button>

            <button
              onClick={() => setActiveTab("dictionary")}
              className={`w-full p-2.5 rounded-xl flex items-center justify-start gap-2.5 font-cyber font-bold text-xs tracking-wider transition-all cursor-pointer ${
                activeTab === "dictionary" 
                  ? "bg-gradient-to-r from-amber-500/20 to-yellow-600/10 border border-amber-500 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.15)]" 
                  : "bg-slate-900/30 border border-transparent hover:border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0 text-amber-400" />
              <span>VOCAB BANK</span>
            </button>

          </nav>

          {/* ACTIVE VOCAB OBJECTIVE CARD */}
          <div className="p-3.5 border-b border-slate-800/80 bg-[#0f1420] flex flex-col gap-2">
            <div className="flex items-center gap-2 justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-cyber flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-amber-400" /> ACTIVE OBJECTIVE
              </span>
              <span className={`text-[9px] px-2 py-0.5 rounded font-cyber font-bold uppercase border ${
                activeWordObj?.difficulty === "Easy" ? "border-emerald-500/30 bg-emerald-950/20 text-emerald-400" :
                activeWordObj?.difficulty === "Medium" ? "border-amber-500/30 bg-amber-950/20 text-amber-400" :
                "border-rose-500/30 bg-rose-950/20 text-rose-400"
              }`}>
                {activeWordObj?.difficulty || "Medium"}
              </span>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed font-sans font-medium bg-slate-950/60 p-2.5 rounded-lg border border-slate-900">
              {activeWordObj?.definition || "Select a word to practice"}
            </p>

            {/* Spell Tracker Letters */}
            <div className="flex flex-col gap-1.5 mt-1">
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-cyber">
                <span>LETTERS ({collectedLetters.length} / {activeWordObj?.word.length || 0})</span>
                <span className="text-amber-400 font-bold">Collect on map!</span>
              </div>
              <div className="flex gap-1.5 font-cyber font-bold text-base flex-wrap">
                {Array.from({ length: activeWordObj?.word.length || 0 }).map((_, idx) => {
                  const hasLetter = idx < collectedLetters.length;
                  const letterObj = collectedLetters[idx];

                  return (
                    <span 
                      key={idx} 
                      className={`w-7 h-7 rounded border flex items-center justify-center transition-all ${
                        hasLetter 
                          ? "border-emerald-500 bg-emerald-950/40 text-emerald-400 font-black shadow-[0_0_8px_rgba(16,185,129,0.2)]" 
                          : "border-amber-500/60 bg-amber-500/10 text-amber-400 border animate-pulse"
                      }`}
                    >
                      {hasLetter ? letterObj.char : "?"}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* TELEMETRY & CONTROLS INFO CARD */}
          <div className="p-3.5 border-b border-slate-800/80 bg-[#0c0e12] flex flex-col gap-2.5 font-cyber">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">LIVE TELEMETRY</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black text-white">{carSpeed}</span>
                <span className="text-[9px] text-slate-400">MPH</span>
              </div>
            </div>

            {/* Mobile Controls Toggle Button */}
            <button
              onClick={() => setShowTouchControls(!showTouchControls)}
              className={`w-full py-2 px-3 rounded-lg border text-xs font-cyber font-bold flex items-center justify-between transition-all cursor-pointer ${
                showTouchControls 
                  ? "bg-amber-950/30 border-amber-500/60 text-amber-300" 
                  : "bg-slate-900/50 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              <span className="flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 text-amber-400" />
                <span>MOBILE JOYSTICK</span>
              </span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-black ${showTouchControls ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-500"}`}>
                {showTouchControls ? "ON" : "OFF"}
              </span>
            </button>

            {/* Help & Guide Buttons */}
            <div className="grid grid-cols-2 gap-2 mt-0.5">
              <button
                onClick={handleTeleportToStart}
                className="py-1.5 px-2 rounded-lg bg-rose-950/20 hover:bg-rose-900/40 border border-amber-500/40 hover:border-rose-500/80 text-amber-300 hover:text-rose-300 text-[10px] font-cyber font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                title="Teleport car back to start location"
              >
                <LifeBuoy className="w-3.5 h-3.5 text-amber-400" />
                <span>HELP STUCK</span>
              </button>

              <button
                onClick={() => setShowWelcomeModal(true)}
                className="py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-slate-300 hover:text-amber-300 text-[10px] font-cyber font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                title="View game loop and controls guide"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>GAME GUIDE</span>
              </button>
            </div>
          </div>

        </div>

        {/* Career Stats Dashboard */}
        <div className="p-4 border-t border-slate-800/80 bg-[#0e1013] flex flex-col gap-2.5 font-cyber">
          <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold block">Career Metrics</span>
          
          <div className="grid grid-cols-2 gap-2">
            
            <div className="bg-slate-950/50 rounded-lg p-2 border border-slate-900">
              <span className="text-[8px] text-slate-500 block">CASH</span>
              <span className="text-sm font-bold text-amber-400">${cash}</span>
            </div>

            <div className="bg-slate-950/50 rounded-lg p-2 border border-slate-900">
              <span className="text-[8px] text-slate-500 block">COMPLETED</span>
              <span className="text-sm font-bold text-amber-500">{wordsSolvedCount} words</span>
            </div>

          </div>

          <div className="bg-slate-950/70 rounded-lg p-2.5 border border-slate-900 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-slate-900 flex items-center justify-center shrink-0 border border-slate-800">
              <Car className="w-3.5 h-3.5" style={{ color: activeCarSpec.colorStr }} />
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] text-slate-400 block">CURRENT VEHICLE</span>
              <span className="text-xs font-bold text-white leading-tight truncate max-w-[140px]">{activeCarSpec.name}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* RIGHT MAIN AREA CONTAINING PHASER VIEW & OVERLAYS */}
      <div className="flex-1 h-full relative overflow-hidden flex flex-col">
        
        {/* MOBILE COMPACT FLOATING OBJECTIVE CARD ON MAP */}
        {activeTab === "streets" && (
          <div className="md:hidden absolute top-2 left-2 right-2 z-20 bg-[#0f172a]/95 border border-amber-500/40 rounded-xl p-2.5 backdrop-blur-md shadow-2xl flex flex-col gap-1.5 pointer-events-auto">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-cyber flex items-center gap-1">
                <Trophy className="w-3 h-3 text-amber-400" /> ACTIVE OBJECTIVE
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleTeleportToStart}
                  className="text-[9px] font-cyber font-bold px-2 py-0.5 rounded bg-rose-950/40 border border-amber-500/50 text-amber-300 flex items-center gap-1 cursor-pointer"
                  title="Teleport car back to start intersection"
                >
                  <LifeBuoy className="w-3 h-3 text-amber-400" />
                  <span>STUCK?</span>
                </button>
                <button
                  onClick={() => setShowTouchControls(!showTouchControls)}
                  className="text-[9px] font-cyber font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-400 flex items-center gap-1 cursor-pointer"
                >
                  <Gamepad2 className="w-3 h-3" />
                  <span>{showTouchControls ? "JOYSTICK ON" : "JOYSTICK OFF"}</span>
                </button>
                <span className="text-[9px] font-cyber font-bold text-cyan-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">{carSpeed} MPH</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-200 line-clamp-2 leading-tight font-sans">
              {activeWordObj?.definition || "Select a word to practice"}
            </p>

            {/* Spell Tracker Letters */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
              <span className="text-[9px] text-slate-400 font-cyber">
                LETTERS ({collectedLetters.length}/{activeWordObj?.word.length || 0})
              </span>
              <div className="flex gap-1 font-cyber font-bold text-xs">
                {Array.from({ length: activeWordObj?.word.length || 0 }).map((_, idx) => {
                  const hasLetter = idx < collectedLetters.length;
                  const letterObj = collectedLetters[idx];

                  return (
                    <span 
                      key={idx} 
                      className={`w-5 h-5 rounded border flex items-center justify-center ${
                        hasLetter 
                          ? "border-emerald-500 bg-emerald-950/50 text-emerald-400 font-black" 
                          : "border-amber-500/60 bg-amber-500/10 text-amber-400 border animate-pulse"
                      }`}
                    >
                      {hasLetter ? letterObj.char : "?"}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* DESKTOP FLOATING MAP TOOLBAR */}
        {activeTab === "streets" && (
          <div className="hidden md:flex absolute top-3 right-3 z-20 items-center gap-2 pointer-events-auto">
            <button
              onClick={handleTeleportToStart}
              title="Teleport car back to start intersection"
              className="px-3 py-1.5 rounded-xl bg-[#0f172a]/90 hover:bg-rose-950/80 border border-amber-500/50 hover:border-rose-500 text-amber-300 hover:text-rose-300 text-xs font-cyber font-bold backdrop-blur-md shadow-2xl flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <LifeBuoy className="w-4 h-4 text-amber-400" />
              <span>HELP I'M STUCK</span>
            </button>

            <button
              onClick={() => setShowWelcomeModal(true)}
              title="View game instructions & controls guide"
              className="px-3 py-1.5 rounded-xl bg-[#0f172a]/90 hover:bg-slate-800 border border-slate-700 hover:border-amber-400 text-slate-300 hover:text-amber-300 text-xs font-cyber font-bold backdrop-blur-md shadow-2xl flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>GUIDE</span>
            </button>
          </div>
        )}
        
        {/* ACTIVE TOAST NOTIFICATION POPUP */}
        {toast && (
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
            <div className={`px-4 py-2 rounded-lg border text-xs font-cyber font-bold tracking-wide shadow-2xl flex items-center gap-2 animate-bounce bg-[#0a0f1d]/95 ${
              toast.type === "success" ? "border-emerald-500/30 text-emerald-400" :
              toast.type === "error" ? "border-rose-500/30 text-rose-400" :
              toast.type === "bonus" ? "border-amber-500/40 text-amber-400" :
              "border-amber-500/30 text-amber-400"
            }`}>
              {toast.type === "bonus" ? <Trophy className="w-4 h-4 text-amber-400" /> : <Zap className="w-3.5 h-3.5" />}
              <span dangerouslySetInnerHTML={{ __html: toast.text }} />
            </div>
          </div>
        )}

        {/* PHASER 3 GAME CONTAINER CANVASES */}
        <div 
          ref={phaserContainerRef}
          className={`w-full h-full absolute inset-0 bg-[#06080d] ${
            activeTab === "streets" ? "z-0 block" : "z-0 blur-md pointer-events-none filter brightness-50"
          }`}
          id="game-canvas-container"
        />

        {/* RESPONSIVE MOBILE TOUCH JOYSTICK & ACTION BUTTONS */}
        {activeTab === "streets" && showTouchControls && (
          <TouchJoystickControls onHonk={() => playAudioSynth("honk")} />
        )}

        {/* INTERACTIVE UNSCRAMBLE MINI-GAME OVERLAY */}
        {isUnscrambling && unscrambleWordInfo && (
          <div className="absolute inset-0 z-40 bg-black/90 backdrop-blur-md flex items-center justify-center p-6">
            <div className={`bg-[#0c1221] border-2 ${isWrongSpelling ? 'border-red-500 animate-pulse' : 'border-amber-500'} rounded-2xl max-w-2xl w-full flex flex-col shadow-[0_0_30px_rgba(245,158,11,0.25)] overflow-hidden`}>
              
              <div className="p-5 border-b border-slate-800 bg-[#0e1628] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-amber-500 animate-ping"></div>
                  <h2 className="text-lg font-cyber font-black text-amber-500 tracking-wider uppercase">Unscramble the IELTS Term</h2>
                </div>
                <div className="px-3 py-1 bg-slate-900 border border-slate-800 rounded text-[11px] font-cyber font-bold text-slate-400">
                  TIMER: {unscrambleTime}s
                </div>
              </div>

              <div className="p-6 flex flex-col gap-6">
                
                {/* Definition Prompt */}
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                  <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold block mb-1">Academic Definition</span>
                  <p className="text-slate-200 text-sm leading-relaxed">{unscrambleWordInfo.definition}</p>
                </div>

                {/* Answer Slots */}
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Your Arrangement</span>
                  <div className="flex gap-2 justify-center flex-wrap py-2 min-h-[50px] bg-slate-950/40 rounded-xl border border-slate-900 p-2.5">
                    {Array.from({ length: unscrambleWordInfo.word.length }).map((_, slotIdx) => {
                      const filledLetter = unscrambleSlots[slotIdx];
                      return (
                        <button
                          key={slotIdx}
                          disabled={gaveUp}
                          onClick={() => filledLetter && handleLetterFromSlotToPool(filledLetter)}
                          className={`w-12 h-12 rounded-xl font-cyber font-black text-xl border-2 flex items-center justify-center transition-all ${
                            filledLetter 
                              ? "border-emerald-500 bg-emerald-950/40 text-emerald-400 hover:bg-emerald-950/60 hover:scale-105 cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.15)]" 
                              : "border-slate-800 bg-slate-900/25 text-slate-600 border-dashed"
                          }`}
                        >
                          {filledLetter ? filledLetter.char : ""}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Letter Pool */}
                {!gaveUp && (
                  <div className="flex flex-col gap-2">
                    <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Collected Letters Pool (Click to place)</span>
                    <div className="flex gap-2 justify-center flex-wrap py-2 min-h-[50px]">
                      {unscrambleWordInfo.collected.map((letter) => {
                        const isPlaced = unscrambleSlots.some(s => s.index === letter.index);
                        return (
                          <button
                            key={letter.index}
                            disabled={isPlaced}
                            onClick={() => handleLetterFromPoolToSlot(letter)}
                            className={`w-12 h-12 rounded-xl font-cyber font-black text-xl border-2 flex items-center justify-center transition-all ${
                              isPlaced 
                                ? "border-slate-900 bg-slate-950/20 text-slate-800 opacity-20 scale-95" 
                                : "border-amber-500 bg-amber-500/10 text-amber-400 hover:bg-amber-500/25 hover:scale-110 cursor-pointer shadow-[0_0_12px_rgba(245,158,11,0.15)]"
                            }`}
                          >
                            {letter.char}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* GAVE UP SHOW ANSWER SCREEN */}
                {gaveUp && (
                  <div className="p-4 bg-rose-950/20 border border-rose-500/30 rounded-xl text-center">
                    <span className="text-xs text-rose-400 block mb-1">WORD REVEALED</span>
                    <span className="text-2xl font-black font-cyber text-white tracking-widest uppercase">{unscrambleWordInfo.word}</span>
                    <p className="text-[11px] text-slate-400 mt-2">Loading next objective in 4 seconds...</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 justify-between items-center mt-2 border-t border-slate-800/60 pt-4">
                  
                  {/* Give up button */}
                  <div>
                    <button
                      disabled={unscrambleTime < 10 || gaveUp}
                      onClick={handleGiveUpUnscramble}
                      className={`px-4 py-2 rounded-xl text-xs font-cyber font-bold transition-all border ${
                        unscrambleTime >= 10 && !gaveUp
                          ? "bg-rose-950/40 border-rose-500/50 hover:bg-rose-900/30 text-rose-400 cursor-pointer"
                          : "bg-slate-900/50 border-slate-800/80 text-slate-600 cursor-not-allowed"
                      }`}
                    >
                      {unscrambleTime < 10 ? `Give Up in ${10 - unscrambleTime}s` : "Give Up (pity reward)"}
                    </button>
                  </div>

                  {!gaveUp && (
                    <div className="flex gap-2">
                      <button
                        onClick={handlePayForHelp}
                        className="px-4 py-2 bg-amber-950/40 hover:bg-amber-900/30 border border-amber-500/40 hover:border-amber-500/80 text-amber-400 rounded-xl text-xs font-cyber font-bold cursor-pointer transition-all"
                      >
                        Buy Hint (${Math.round(unscrambleWordInfo.word.length * 20 * 0.1)})
                      </button>
                      <button
                        onClick={handleClearUnscramble}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-xl text-xs font-cyber font-bold text-slate-300 cursor-pointer"
                      >
                        Reset
                      </button>
                      <button
                        disabled={unscrambleSlots.length < unscrambleWordInfo.word.length}
                        onClick={handleSubmitUnscramble}
                        className={`px-5 py-2 rounded-xl text-xs font-cyber font-bold tracking-wider uppercase transition-all ${
                          unscrambleSlots.length === unscrambleWordInfo.word.length
                            ? "bg-amber-500 hover:bg-amber-400 text-slate-950 font-black cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.35)]"
                            : "bg-slate-900 text-slate-600 border border-slate-800/80 cursor-not-allowed"
                        }`}
                      >
                        SUBMIT SPELLING
                      </button>
                    </div>
                  )}

                </div>

              </div>

            </div>
          </div>
        )}

        {/* GARAGE VIEW OVERLAY */}
        {activeTab === "garage" && (
          <div className="absolute inset-0 z-10 bg-black/75 backdrop-blur-md flex items-center justify-center p-6 overflow-y-auto">
            <div className="bg-[#131517] border border-amber-500/30 rounded-2xl max-w-4xl w-full flex flex-col shadow-2xl overflow-hidden max-h-[90vh]">
              
              <div className="p-5 border-b border-slate-800/80 flex items-center justify-between bg-[#181a1d]">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></div>
                  <h2 className="text-base font-cyber font-bold text-amber-400 tracking-wider">GARAGE BAY CENTER</h2>
                </div>
                <button 
                  onClick={() => setActiveTab("streets")} 
                  className="px-3 py-1 bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:border-slate-600 rounded-lg text-xs font-cyber cursor-pointer text-slate-300 hover:text-white"
                >
                  Return to Streets Run
                </button>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto">
                
                {/* Car Catalog list */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-[10px] font-cyber font-bold uppercase text-slate-400 tracking-widest mb-1">Vehicle Selection</h3>
                  <div className="flex flex-col gap-2.5">
                    {CAR_MODELS.map(car => {
                      const isOwned = ownedCars.includes(car.id);
                      const isActive = activeCarId === car.id;
                      const activeColor = carCustomColors[car.id] || car.colorStr;

                      return (
                        <div
                          key={car.id}
                          onClick={() => setActiveCarId(car.id)}
                          className={`p-3 rounded-xl border flex justify-between items-center cursor-pointer transition-all ${
                            isActive 
                              ? "bg-amber-950/20 border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.15)]" 
                              : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-16 shrink-0 bg-slate-950/80 rounded-lg p-1 border border-slate-800/80 flex items-center justify-center">
                              <CarPreviewSvg carId={car.id} color={activeColor} className="w-8 h-14" />
                            </div>
                            <div className="flex flex-col">
                              <span className={`text-sm font-bold ${isActive ? "text-amber-400" : "text-slate-100"}`}>{car.name}</span>
                              <span className="text-[9px] text-slate-500 font-cyber mt-0.5">{isOwned ? "OWNED & DEPLOYED" : `$${car.price}`}</span>
                            </div>
                          </div>
                          
                          {isActive && (
                            <span className="px-2 py-0.5 rounded border border-amber-500 bg-amber-950/40 text-amber-400 font-cyber font-bold text-[8px] tracking-wider uppercase">ACTIVE</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Specs detail sheet */}
                <div className="bg-[#181a1d]/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-inner">
                  <div className="flex flex-col gap-4">
                    
                    {/* Interactive Turntable Stage */}
                    <div className="w-full bg-slate-950/80 rounded-xl border border-slate-800/80 p-4 flex flex-col items-center justify-center relative overflow-hidden shadow-inner group">
                      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-amber-500/5 pointer-events-none"></div>
                      <CarPreviewSvg
                        carId={activeCarSpec.id}
                        color={carCustomColors[activeCarSpec.id] || activeCarSpec.colorStr}
                        className="w-16 h-32 drop-shadow-[0_0_15px_rgba(250,204,21,0.25)] transition-transform duration-300 group-hover:scale-105"
                      />
                      <span className="text-[9px] font-cyber font-bold text-slate-500 tracking-widest uppercase mt-2">GARAGE TURNTABLE STAGE</span>
                    </div>

                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xl font-bold font-cyber" style={{ color: carCustomColors[activeCarSpec.id] || activeCarSpec.colorStr }}>{activeCarSpec.name}</h4>
                        <span className="text-[9px] font-cyber text-slate-400 mt-1 uppercase tracking-wider block font-bold">
                          {ownedCars.includes(activeCarSpec.id) ? "READY FOR SERVICE RUN" : "AWAITING VEHICLE PURCHASE"}
                        </span>
                      </div>
                      <span className="text-xl font-cyber font-bold text-amber-400">${activeCarSpec.price === 0 ? "FREE" : activeCarSpec.price}</span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-900">
                      {activeCarSpec.description}
                    </p>

                    {/* Color Swatch & Custom Picker */}
                    <div className="flex flex-col gap-2 font-cyber">
                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase">
                        <span>Custom Paint Finish</span>
                        <span className="text-xs font-mono font-bold" style={{ color: carCustomColors[activeCarSpec.id] || activeCarSpec.colorStr }}>
                          {carCustomColors[activeCarSpec.id] || activeCarSpec.colorStr}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-wrap">
                        {COLOR_SWATCHES.map(swatch => {
                          const currentColor = (carCustomColors[activeCarSpec.id] || activeCarSpec.colorStr).toLowerCase();
                          const isSelected = currentColor === swatch.toLowerCase();
                          return (
                            <button
                              key={swatch}
                              onClick={() => handleColorChange(activeCarSpec.id, swatch)}
                              className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${
                                isSelected ? "scale-125 border-white shadow-[0_0_10px_rgba(255,255,255,0.7)]" : "border-slate-800 hover:scale-110"
                              }`}
                              style={{ backgroundColor: swatch }}
                              title={`Paint ${swatch}`}
                            />
                          );
                        })}

                        <label className="relative w-6 h-6 rounded-full border-2 border-slate-700 bg-slate-900 flex items-center justify-center cursor-pointer hover:scale-110 transition-all overflow-hidden" title="Custom Color Picker">
                          <span className="text-[10px] font-bold text-slate-400">+</span>
                          <input
                            type="color"
                            value={carCustomColors[activeCarSpec.id] || activeCarSpec.colorStr}
                            onChange={(e) => handleColorChange(activeCarSpec.id, e.target.value)}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 mt-1 font-cyber">
                      
                      {/* Speed */}
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-[9px] text-slate-400 font-bold uppercase">
                          <span>Max Velocity</span>
                          <span className="text-slate-200">{Math.round(activeCarSpec.speedStat * 100)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${activeCarSpec.speedStat * 100}%`, backgroundColor: carCustomColors[activeCarSpec.id] || activeCarSpec.colorStr }}></div>
                        </div>
                      </div>

                      {/* Accel */}
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-[9px] text-slate-400 font-bold uppercase">
                          <span>Engine Acceleration</span>
                          <span className="text-slate-200">{Math.round(activeCarSpec.accelStat * 100)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${activeCarSpec.accelStat * 100}%`, backgroundColor: carCustomColors[activeCarSpec.id] || activeCarSpec.colorStr }}></div>
                        </div>
                      </div>

                      {/* Handling */}
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-[9px] text-slate-400 font-bold uppercase">
                          <span>Steering Traction</span>
                          <span className="text-slate-200">{Math.round(activeCarSpec.handlingStat * 100)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${activeCarSpec.handlingStat * 100}%`, backgroundColor: carCustomColors[activeCarSpec.id] || activeCarSpec.colorStr }}></div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="mt-6 pt-4 border-t border-slate-800">
                    {activeCarId === activeCarSpec.id && ownedCars.includes(activeCarSpec.id) ? (
                      <button className="w-full py-2.5 bg-slate-850 border border-slate-800 text-slate-500 rounded-xl text-xs font-cyber font-bold tracking-wider uppercase cursor-not-allowed">
                        CURRENT VEHICLE DEPLOYED
                      </button>
                    ) : ownedCars.includes(activeCarSpec.id) ? (
                      <button 
                        onClick={() => {
                          setActiveCarId(activeCarSpec.id);
                          triggerToast(`🏎️ Mounted ${activeCarSpec.name} transmission!`, "success");
                        }} 
                        className="w-full py-2.5 bg-amber-950/20 hover:bg-amber-900/40 border border-amber-500 text-amber-400 rounded-xl text-xs font-cyber font-bold tracking-wider transition-all hover:scale-[1.01] cursor-pointer"
                      >
                        EQUIP VEHICLE FOR STREETS
                      </button>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {cash >= activeCarSpec.price ? (
                          <button 
                            onClick={() => handleBuyCar(activeCarSpec)} 
                            className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-cyber font-black tracking-wider transition-all hover:scale-[1.01] cursor-pointer shadow-lg shadow-amber-500/15"
                          >
                            PURCHASE VEHICLE
                          </button>
                        ) : (
                          <div className="flex flex-col gap-2">
                            <button className="w-full py-2.5 bg-slate-900 border border-slate-800 text-slate-600 rounded-xl text-xs font-cyber font-bold tracking-wider uppercase cursor-not-allowed">
                              INSUFFICIENT FUNDS
                            </button>
                            <span className="text-[10px] text-center text-rose-400/80 font-cyber">
                              Deductible cash shortfall: ${activeCarSpec.price - cash}. Keep spelling IELTS terms to afford!
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                </div>

              </div>

            </div>
          </div>
        )}

        {/* DICTIONARY / ACADEMIC WORDS OVERLAY */}
        {activeTab === "dictionary" && (
          <div className="absolute inset-0 z-10 bg-black/75 backdrop-blur-md flex items-center justify-center p-6 overflow-y-auto">
            <div className="bg-[#131517] border border-amber-500/30 rounded-2xl max-w-4xl w-full flex flex-col shadow-2xl overflow-hidden max-h-[90vh]">
              
              <div className="p-5 border-b border-slate-800/80 flex items-center justify-between bg-[#181a1d]">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></div>
                  <h2 className="text-base font-cyber font-bold text-amber-400 tracking-wider">ACADEMIC VOCABULARY BANK</h2>
                </div>
                <button 
                  onClick={() => setActiveTab("streets")} 
                  className="px-3 py-1 bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:border-slate-600 rounded-lg text-xs font-cyber cursor-pointer text-slate-300 hover:text-white"
                >
                  Return to Streets Run
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-grow flex flex-col md:flex-row gap-6">
                
                {/* Left controls column */}
                <div className="md:w-1/3 flex flex-col gap-4 border-r border-slate-800 pr-4">
                  <span className="text-[10px] font-cyber font-bold uppercase tracking-widest text-amber-500">Mission Objectives</span>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Below is the curated selection of core IELTS academic vocabulary. Complete the spelling runs in the city streets to acquire linguistic intelligence, increase your career funds, and purchase high-performance cars.
                  </p>

                  <div className="p-3.5 bg-amber-950/10 border border-amber-500/20 rounded-xl flex flex-col gap-2 text-xs">
                    <span className="font-cyber font-bold text-amber-400 uppercase tracking-wide text-[10px]">Compass Instructions</span>
                    <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                      <li>The target letter node is spawned randomly along the road network.</li>
                      <li>Use the golden compass navigation arrow on your viewport HUD to trace its coordinate.</li>
                      <li>Acquiring letters adds cash instantly.</li>
                    </ul>
                  </div>
                </div>

                {/* Right dictionary column */}
                <div className="md:w-2/3 flex flex-col gap-3">
                  <span className="text-[10px] font-cyber font-bold uppercase tracking-widest text-slate-400">Academic Word List ({IELTS_WORDS.length} terms)</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-2">
                    {IELTS_WORDS.map((term, index) => {
                      const isActive = activeWordIndex === index;

                      return (
                        <div
                          key={term.word}
                          onClick={() => handlePracticeWord(index)}
                          className={`p-3.5 rounded-xl border flex flex-col gap-1 cursor-pointer transition-all ${
                            isActive 
                              ? "bg-amber-950/15 border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.1)]" 
                              : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className={`text-xs font-cyber font-bold tracking-wider ${isActive ? "text-amber-400" : "text-white"}`}>{term.word}</span>
                            <span className={`text-[8px] font-cyber font-bold uppercase px-1.5 py-0.5 rounded border ${
                              term.difficulty === "Easy" ? "border-emerald-500/20 text-emerald-400 bg-emerald-950/10" :
                              term.difficulty === "Medium" ? "border-amber-500/20 text-amber-400 bg-amber-950/10" :
                              "border-rose-500/20 text-rose-400 bg-rose-950/10"
                            }`}>{term.difficulty}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 leading-normal line-clamp-2 mt-0.5">{term.definition}</span>
                          <span className="text-[9px] text-slate-500 italic mt-1 font-sans truncate">"{term.example}"</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* WELCOME GAME LOOP & CONTROLS POP-UP MODAL */}
        {showWelcomeModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#0b101d] border-2 border-amber-500/80 rounded-2xl max-w-xl w-full shadow-[0_0_40px_rgba(245,158,11,0.3)] overflow-hidden my-auto flex flex-col font-sans">
              
              {/* Header */}
              <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-[#111827] to-[#1a233a] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center shrink-0">
                    <Car className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-cyber font-black tracking-widest uppercase text-amber-400 block">
                      RETRO CYBERPUNK VOCAB RUN
                    </span>
                    <h2 className="text-lg sm:text-xl font-cyber font-black text-white tracking-wider">
                      WELCOME TO IELTS DRIVER
                    </h2>
                  </div>
                </div>

                <button
                  onClick={() => {
                    playAudioSynth("pickup");
                    setShowWelcomeModal(false);
                  }}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Close Guide"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6 flex flex-col gap-4 text-slate-200 text-xs sm:text-sm max-h-[75vh] overflow-y-auto">
                
                {/* Game Loop Explanation */}
                <div className="bg-[#070b14] p-4 rounded-xl border border-amber-500/30 flex flex-col gap-2.5">
                  <div className="flex items-center gap-2 text-amber-400 font-cyber font-bold text-xs uppercase tracking-wider">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>HOW TO PLAY (GAME LOOP)</span>
                  </div>

                  <ol className="list-decimal list-inside space-y-1.5 text-slate-300 font-sans leading-relaxed text-xs">
                    <li><strong className="text-white">Drive the Streets</strong>: Cruise through the top-down retro city grid in your car.</li>
                    <li><strong className="text-amber-300">Collect Letter Pickups</strong>: Run over the glowing orange letter markers on the roads to collect spelling letters for your active IELTS term.</li>
                    <li><strong className="text-emerald-400">Unscramble & Earn Cash</strong>: Once all letters are collected, solve the spelling mini-game to earn cash rewards & unlock dictionary badges!</li>
                    <li><strong className="text-cyan-300">Garage Upgrades</strong>: Spend cash to unlock high-performance supercars, limos, and custom paint finishes.</li>
                  </ol>
                </div>

                {/* Controls Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Joystick Controls */}
                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-amber-400 font-cyber font-bold text-xs">
                      <Gamepad2 className="w-4 h-4 text-amber-400" />
                      <span>ON-SCREEN JOYSTICK</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-normal">
                      Drag the <strong>virtual joystick</strong> on the bottom-left to steer in 360°. Tap <strong>GAS</strong> or <strong>BRAKE</strong> on the bottom-right to accelerate or reverse.
                    </p>
                  </div>

                  {/* Keyboard Controls */}
                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-cyan-400 font-cyber font-bold text-xs">
                      <Keyboard className="w-4 h-4 text-cyan-400" />
                      <span>KEYBOARD CONTROLS</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-normal">
                      Use <strong>WASD</strong> or <strong>Arrow Keys</strong> to steer, accelerate, and reverse. Press <strong>Spacebar</strong> or tap <strong>HONK</strong> for horn.
                    </p>
                  </div>

                </div>

                {/* Teleport / Stuck Tip */}
                <div className="bg-amber-950/20 p-3 rounded-xl border border-amber-500/30 flex items-center gap-3">
                  <LifeBuoy className="w-5 h-5 text-amber-400 shrink-0" />
                  <p className="text-[11px] text-amber-200/90 leading-tight">
                    <strong>Trapped or stuck?</strong> Click the <strong>"Help I'm Stuck"</strong> button at any time to instantly teleport your car back to the starting road intersection!
                  </p>
                </div>

              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-800/80 bg-[#070b14] flex justify-end">
                <button
                  onClick={() => {
                    playAudioSynth("pickup");
                    setShowWelcomeModal(false);
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-500 to-amber-600 hover:from-yellow-300 hover:to-amber-500 text-slate-950 font-cyber font-black text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] transition-all transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>START DRIVING NOW</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
}
