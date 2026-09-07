const KEY = "hexa_stack_v1";

export function loadState() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || { best: 0, sound: true };
  } catch (_) {
    return { best: 0, sound: true };
  }
}

export function saveState(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) {}
}
