import { SeanSpelling, VerificationResult } from '../types';

export function normalizeName(input: string): string {
  if (!input) return '';
  return input
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // strip accents for matching, e.g., seán -> sean
}

/**
 * Checks if an input name belongs to a Simon, a Sean (and all valid spellings), or someone else.
 */
export function verifySeanAccess(rawInput: string): VerificationResult {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return {
      allowed: false,
      isSimon: false,
      detectedName: '',
      reason: 'Please enter your name.',
    };
  }

  const normalized = normalizeName(trimmed);

  // Check for Simon variants first (Nedry trap!)
  const simonPatterns = [
    /\bsimon\b/i,
    /\bsymon\b/i,
    /\bsimone\b/i,
    /\bsymone\b/i,
    /\bsimond\b/i,
  ];

  const isSimon = simonPatterns.some((pattern) => pattern.test(normalized));
  if (isSimon) {
    return {
      allowed: false,
      isSimon: true,
      detectedName: trimmed,
      reason: "AH AH AH! YOU DIDN'T SAY THE MAGIC WORD! Simon detected!",
    };
  }

  // Check for Sean spellings
  // Sean, Shaun, Shawn, Seán (handled by normalization), Sion, Shon, Seon, Shane, Shaughn
  const words = normalized.split(/[\s,.-]+/);

  const seanSpellingsMap: Record<string, SeanSpelling> = {
    sean: 'Sean',
    shaun: 'Shaun',
    shawn: 'Shawn',
    sion: 'Sion',
    shon: 'Shon',
    seon: 'Seon',
    shane: 'Shane',
    shaughn: 'Shaun',
    seane: 'Sean',
    shawne: 'Shawn',
  };

  // Check if raw string contains accented Seán
  const rawLower = trimmed.toLowerCase();
  const hasFada = rawLower.includes('seán') || rawLower.includes('séan');

  for (const word of words) {
    if (seanSpellingsMap[word]) {
      const matched = hasFada ? 'Seán' : seanSpellingsMap[word];
      return {
        allowed: true,
        isSimon: false,
        detectedName: trimmed,
        matchedSpelling: matched,
        reason: `Welcome, fellow ${matched}! Verification complete.`,
      };
    }
  }

  // Also check if any word starts with sean/shaun/shawn (e.g. Seannie, Shaunie, Shawny)
  for (const word of words) {
    if (/^(sean|shaun|shawn)/.test(word)) {
      return {
        allowed: true,
        isSimon: false,
        detectedName: trimmed,
        matchedSpelling: hasFada ? 'Seán' : (word.startsWith('shaun') ? 'Shaun' : word.startsWith('shawn') ? 'Shawn' : 'Sean'),
        reason: 'Honorary Sean derivative accepted!',
      };
    }
  }

  return {
    allowed: false,
    isSimon: false,
    detectedName: trimmed,
    reason: `Sorry, "${trimmed}". This sanctuary is exclusively reserved for individuals legally, spiritually, or phonetically named Sean, Shaun, Shawn, or Seán.`,
  };
}
