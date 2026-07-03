export const MODEL_IDS = {
  opus:   'claude-opus-4-8',
  sonnet: 'claude-sonnet-4-6',
  haiku:  'claude-haiku-4-5-20251001',
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
