/* ============================================================
   DÉCALAGE AU SCROLL — sur toutes les pages
   ------------------------------------------------------------
   Mesure la vitesse de scroll et l'écrit dans deux variables CSS
   sur <html> : --sv (-1 à 1, signe = sens) et --sva (valeur absolue).
   Plus on scrolle vite, plus les encres se décalent ; à l'arrêt
   tout se recale en douceur.
   Qui s'en sert (voir le CSS) :
     • header (logo + nom) et grand titre : sur mobile/tablette (--svk)
     • parcours (titres + pastilles) : partout
   Réglages : SENSIBILITE (px de scroll par image pour un décalage
   maximal) et LISSAGE (0 à 1, plus haut = plus nerveux).
   ============================================================ */
(function(){
  if(reduceMotion) return;
  const SENSIBILITE = 45, LISSAGE = .18, root = document.documentElement.style;
  let last = window.scrollY, pending = 0, vel = 0, raf = null;

  function frame(){
    vel += (pending - vel) * LISSAGE;   // la vitesse suit le scroll, puis retombe
    pending = 0;
    const sv = Math.max(-1, Math.min(1, vel / SENSIBILITE));
    root.setProperty("--sv", sv.toFixed(3));
    root.setProperty("--sva", Math.abs(sv).toFixed(3));
    if(Math.abs(vel) > .05) raf = requestAnimationFrame(frame);
    else { root.setProperty("--sv", 0); root.setProperty("--sva", 0); vel = 0; raf = null; }
  }
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    pending += y - last; last = y;
    if(!raf) raf = requestAnimationFrame(frame);
  }, { passive:true });
})();
