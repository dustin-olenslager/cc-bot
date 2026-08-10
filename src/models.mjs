// Tier label -> `claude --model` argument. Use the stable ALIASES (opus/sonnet/haiku)
// rather than pinned dated ids, so a Herald pass auto-tracks the latest model of that
// tier and never ages a generation behind (the old map pinned claude-opus-4-8 /
// claude-sonnet-4-6 and silently rotted). fable has no CLI alias -> explicit current id.
export const MODEL_IDS = {
  opus:   'opus',
  sonnet: 'sonnet',
  haiku:  'haiku',
  fable:  'claude-fable-5',
};

export const MODEL_LABELS = ['auto', 'haiku', 'sonnet', 'opus', 'fable'];

// Returns label of best model for this prompt
export function autoPick(prompt) {
  const txt = prompt ?? '';
  const HEAVY = /plan|design|architect|refactor|debug|investigate|root cause|migrate|security|audit|review|spec|prd|why/i;
  const LIGHT = /status|list|show|rename|typo|bump|version|value|ls|cat|grep/i;
  if (HEAVY.test(txt) || txt.length > 1500) return 'opus';
  if (LIGHT.test(txt) && txt.length < 200) return 'haiku';
  return 'sonnet';
}

// Returns { label, id } — unknown labels fall back to sonnet
export function resolveModel(label, prompt) {
  if (label === 'auto') {
    const picked = autoPick(prompt);
    return { label: picked, id: MODEL_IDS[picked] };
  }
  const id = MODEL_IDS[label];
  if (!id) return { label: 'sonnet', id: MODEL_IDS.sonnet };
  return { label, id };
}
