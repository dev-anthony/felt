export type GenerationStep = 
  | "IDLE" 
  | "UPLOAD" 
  | "PROCESSING" 
  | "FEELING_EXPANDER" // Specific to Flow 3 (Beats)
  | "FILTER_SELECTION" 
  | "GENERATING_ART" 
  | "RESULTS" 
  | "STEERING";

export type TrackType = "vocal" | "instrumental";

export interface AudioProfile {
  bpm: number;
  key: string;
  energy: string;
  valence: string;
  mood: string;
}

export interface TrackMetadata {
  title: string;
  type: TrackType;
  sentencePrompt: string;
  expandedBrief?: string;
  audioFeatures?: AudioProfile;
  selectedFilterId?: string;
  generatedVariants?: string[];
  chosenImage?: string;
}