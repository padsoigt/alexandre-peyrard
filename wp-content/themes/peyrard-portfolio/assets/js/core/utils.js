/* ============================================================
   OUTILS COMMUNS — chargé sur toutes les pages, en premier
   ============================================================ */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Image introuvable : elle s'efface et laisse voir la vignette de secours */
document.addEventListener("error", e => {
  const t = e.target;
  if(t.tagName !== "IMG") return;
  const illu = t.closest(".illu");
  if(illu){ illu.dataset.missing = "1"; t.remove(); return; }
  const frame = t.closest(".frame");
  if(frame && frame.dataset.fb){ frame.classList.remove("tall"); frame.classList.add("fallback"); frame.innerHTML = frame.dataset.fb; return; }
  t.remove();
}, true);
