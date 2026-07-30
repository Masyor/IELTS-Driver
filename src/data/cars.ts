export interface CarModel {
  id: string;
  name: string;
  price: number;
  description: string;
  // Performance stats (0 to 1) for UI bars
  speedStat: number;
  accelStat: number;
  handlingStat: number;
  // Real Phaser values
  maxSpeed: number;
  acceleration: number;
  handling: number; // Angular velocity rate
  drag: number; // Deceleration rate
  color: number; // Hex code for Phaser vector drawings
  colorStr: string; // Tailwind hex color string
  trailColor: string; // Tailwind color name for trails
}

export const CAR_MODELS: CarModel[] = [
  {
    id: "rusty_banger",
    name: "Rusty Banger",
    price: 0,
    description: "Your trusty starter car. Clunky handling, heavy chassis, and a charming rust-orange glow. Gets the job done.",
    speedStat: 0.3,
    accelStat: 0.3,
    handlingStat: 0.4,
    maxSpeed: 180,
    acceleration: 150,
    handling: 150,
    drag: 100,
    color: 0xe07a5f, // Rust-orange hex
    colorStr: "#e07a5f",
    trailColor: "orange"
  },
  {
    id: "fleet_sedan",
    name: "Fleet Sedan",
    price: 300,
    description: "A solid, professional taxi and commercial cruiser. Good top speed, standard traction control, and a sleek neon cyan finish.",
    speedStat: 0.55,
    accelStat: 0.5,
    handlingStat: 0.6,
    maxSpeed: 300,
    acceleration: 240,
    handling: 190,
    drag: 140,
    color: 0x00f0ff, // Cyan hex
    colorStr: "#00f0ff",
    trailColor: "cyan"
  },
  {
    id: "turbo_interceptor",
    name: "Turbo Interceptor",
    price: 1000,
    description: "A retired police pursuit vehicle. Features rocket-like acceleration, solid grip, and a flashing red-and-blue neon siren system.",
    speedStat: 0.8,
    accelStat: 0.85,
    handlingStat: 0.75,
    maxSpeed: 450,
    acceleration: 420,
    handling: 240,
    drag: 200,
    color: 0xff007f, // Neon Hot Pink
    colorStr: "#ff007f",
    trailColor: "pink"
  },
  {
    id: "cyber_hypercar",
    name: "Cyber Hypercar",
    price: 2500,
    description: "The peak of futuristic luxury. Powered by a carbon-plasma reactor. Extreme top speed, hyper-responsive turning, and a rainbow cycling color stream.",
    speedStat: 1.0,
    accelStat: 1.0,
    handlingStat: 0.9,
    maxSpeed: 580,
    acceleration: 600,
    handling: 280,
    drag: 250,
    color: 0x39ff14, // Neon Lime Green
    colorStr: "#39ff14",
    trailColor: "green"
  },
  {
    id: "executive_limo",
    name: "Executive Limo",
    price: 5000,
    description: "Ultimate VIP stretch limousine. Twice as long as a sedan with majestic presence. Shoots cash floating out the side windows when driving!",
    speedStat: 0.5,
    accelStat: 0.45,
    handlingStat: 0.5,
    maxSpeed: 280,
    acceleration: 200,
    handling: 150,
    drag: 160,
    color: 0xeab308, // VIP Gold
    colorStr: "#eab308",
    trailColor: "yellow"
  }
];
