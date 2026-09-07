let ctx = null;
export function beep(enabled=true, frequency=520, duration=.06, type="sine") {
  if (!enabled) return;
  try {
    ctx ||= new (window.AudioContext || window.webkitAudioContext)();
    const o=ctx.createOscillator(), g=ctx.createGain();
    o.type=type; o.frequency.value=frequency;
    g.gain.setValueAtTime(.0001,ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(.08,ctx.currentTime+.01);
    g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+duration);
    o.connect(g).connect(ctx.destination); o.start(); o.stop(ctx.currentTime+duration+.01);
  } catch (_) {}
}
