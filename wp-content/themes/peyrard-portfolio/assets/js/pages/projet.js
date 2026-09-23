/* ============================================================
   PAGE D'UN PROJET (single-projet.php)
   Flèches du clavier ← → : projet précédent / suivant
   ============================================================ */
(function(){
  const [prev, next] = $$(".pj-next a");
  if(!prev || !next) return;
  document.addEventListener("keydown", e => {
    if(e.target.closest("input, textarea, [contenteditable]") || e.altKey || e.ctrlKey || e.metaKey) return;
    if(document.getElementById("lb")?.classList.contains("open")) return;
    if(e.key === "ArrowLeft") location.href = prev.href;
    if(e.key === "ArrowRight") location.href = next.href;
  });
})();
