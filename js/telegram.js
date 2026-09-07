export function initTelegram() {
  const tg = window.Telegram?.WebApp;
  if (!tg) return null;
  try {
    tg.ready();
    tg.expand();
    tg.setHeaderColor("#160b29");
    tg.setBackgroundColor("#10091f");
    if (tg.disableVerticalSwipes) tg.disableVerticalSwipes();
  } catch (_) {}
  return tg;
}

export function haptic(tg, type="light") {
  try { tg?.HapticFeedback?.impactOccurred(type); } catch (_) {}
}
