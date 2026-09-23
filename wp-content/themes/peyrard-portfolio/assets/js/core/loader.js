/* ============================================================
   LOADER — gère l'apparition / la disparition
   ------------------------------------------------------------
   • Affiché UNE fois par visite (onglet) : le petit script imprimé
     dans le <head> (inc/setup.php, bloc « Script du <head> ») ajoute la classe
     "loading" seulement la 1re fois.
     Pour l'afficher à CHAQUE page : voir ce même bloc dans inc/setup.php.
   • MIN : durée minimale (le temps de l'animation)
   • MAX : filet de sécurité, il part quoi qu'il arrive
   • Émet l'événement "loader:done" quand il est parti
     (le grand titre de l'accueil l'attend pour se caler).
   ============================================================ */
(function(){
  let MIN = 1650, MAX = 8000;
  const root = document.documentElement, el = document.getElementById("loader");
  const done = () => { window.__loaderDone = true; window.dispatchEvent(new Event("loader:done")); };

  if(!root.classList.contains("loading")){   // pas de loader sur cette page
    if(el) el.remove();
    document.addEventListener("DOMContentLoaded", done);
    return;
  }
  window.__loaderShown = true;
  if(reduceMotion) MIN = 300;
  const t0 = Date.now();
  let finished = false;
  function finish(){
    if(finished) return; finished = true;
    el.classList.remove("waiting"); el.classList.add("done");
    root.classList.remove("loading");
    setTimeout(() => { el.remove(); done(); }, reduceMotion ? 320 : 780);
  }
  const whenLoaded = () => setTimeout(finish, Math.max(0, MIN - (Date.now() - t0)));
  setTimeout(() => { if(!finished) el.classList.add("waiting"); }, MIN); // la page tarde : les encres oscillent
  if(document.readyState === "complete") whenLoaded(); else window.addEventListener("load", whenLoaded);
  setTimeout(finish, MAX);
})();
