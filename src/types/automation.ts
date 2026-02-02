export interface Automation {
  id: string;
  parameter: string; // 'volume', 'pan', 'effects.0.params.wet', etc
  points: AutomationPoint[];
}

export interface AutomationPoint {
  time: number; // beats
  value: number; // 0-1 normalized
  curve: 'linear' | 'exponential' | 'logarithmic';
}
