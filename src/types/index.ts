export type SeanSpelling = 'Sean' | 'Shaun' | 'Shawn' | 'Seán' | 'Sion' | 'Shon' | 'Seon' | 'Shane' | 'Other';

export interface FamousSean {
  id: string;
  name: string;
  spelling: SeanSpelling;
  category: 'Cinema & TV' | 'Music' | 'Sports' | 'Culture & Arts' | 'Historical & Irish';
  wikipediaTitle: string;
  tagline: string;
  quote?: string;
  imageUrl?: string;
  summary: string;
  born?: string;
}

export interface StickyNote {
  id: string;
  authorName: string;
  authorSpelling: string;
  color: 'yellow' | 'pink' | 'cyan' | 'green' | 'orange' | 'purple';
  content: string;
  createdAt: number;
  x: number;
  y: number;
  likes: number;
  rotation: number;
}

export interface VerificationResult {
  allowed: boolean;
  isSimon: boolean;
  detectedName: string;
  matchedSpelling?: SeanSpelling;
  reason: string;
}
