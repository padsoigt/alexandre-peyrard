/* ============================================================
   SECTIONS — animations des sections (accueil + widgets Elementor)
   ------------------------------------------------------------
   AP.initReg(el)       grand titre CMJN : se cale au chargement,
                        se décale selon la souris (ordinateur)
   AP.initParcours(el)  frise : chaque étape arrive décalée puis se cale
   AP.initAll(racine)   lance tout ce qui se trouve dans la racine

   Sur le site : lancé au chargement de la page.
   Dans Elementor : relancé à chaque fois qu'un widget est modifié
   (voir « Elementor » en bas du fichier).
   ============================================================ */
window.AP = window.AP || {};
(function(AP){
  const inEditor = () => document.body.classList.contains("elementor-editor-active");
  const once = (el, key) => { if(el.dataset[key]) return false; el.dataset[key] = "1"; return true; };

  /* ---------- Grand titre : calage CMJN ----------
     Intensité : les px dans assets/css/pages/sections.css (.reg .lc …) */
  AP.initReg = function(reg){
    if(!once(reg, "apReg")) return;
    const zone = reg.closest(".hero") || reg;
    let x = reduceMotion ? 0 : 1.4, y = reduceMotion ? 0 : -1, tx = 0, ty = 0, raf = null;
    function render(){
      reg.style.setProperty("--ox", x.toFixed(3));
      reg.style.setProperty("--oy", y.toFixed(3));
      reg.style.setProperty("--kop", (1 - Math.min(1, Math.hypot(x, y) / .6) * .92).toFixed(3)); // le noir s'efface
    }
    function loop(){
      x += (tx - x) * .08; y += (ty - y) * .08; render();
      if(Math.abs(tx - x) > .002 || Math.abs(ty - y) > .002) raf = requestAnimationFrame(loop);
      else { x = tx; y = ty; render(); raf = null; }
    }
    const kick = () => { if(!raf) raf = requestAnimationFrame(loop); };
    render();
    if(reduceMotion) return;
    if(window.__loaderDone || inEditor()) setTimeout(kick, 150);
    else window.addEventListener("loader:done", () => setTimeout(kick, 100), { once:true });
    zone.addEventListener("pointermove", e => {
      if(e.pointerType === "touch") return;
      const r = reg.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2))) * .9;
      ty = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height / 2))) * .9;
      kick();
    });
    zone.addEventListener("pointerleave", () => { tx = 0; ty = 0; kick(); });
    reg.addEventListener("click", () => { x = 1.2; y = -.8; tx = 0; ty = 0; kick(); }); // mobile : un tap dérègle
  };

  /* ---------- Parcours : apparition décalée ----------
     Les étapes qui apparaissent ensemble s'enchaînent (STAGGER ms). */
  AP.initParcours = function(section){
    if(!once(section, "apParcours")) return;
    if(reduceMotion || inEditor() || !("IntersectionObserver" in window)) return;
    const STAGGER = 110;
    const items = [section.querySelector("h2"), ...section.querySelectorAll("ol.tl > li")].filter(Boolean);
    section.querySelectorAll("ol.tl").forEach(list => list.classList.add("rv-line"));
    items.forEach(el => el.classList.add("rv"));
    const io = new IntersectionObserver(entries => {
      entries.filter(e => e.isIntersecting).forEach((e, n) => {
        e.target.style.setProperty("--delay", n * STAGGER + "ms");
        e.target.classList.add("in");
        io.unobserve(e.target);
      });
    }, { threshold:.15, rootMargin:"0px 0px -6% 0px" });
    [...items, ...section.querySelectorAll("ol.tl")].forEach(el => io.observe(el));
  };

  AP.initAll = function(root){
    (root || document).querySelectorAll(".reg").forEach(AP.initReg);
    (root || document).querySelectorAll("section.parcours").forEach(AP.initParcours);
  };

  /* ---------- Menu : lien actif selon l'ancre (#parcours, #contact) ---------- */
  function markNav(){
    const h = location.hash.slice(1);
    $$(".top nav a").forEach(a => {
      if(!a.hash) return;
      h && a.hash === "#" + h && a.pathname === location.pathname ? a.setAttribute("aria-current","page") : a.removeAttribute("aria-current");
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    AP.initAll(document);
    markNav();
    window.addEventListener("hashchange", markNav);
    // Arrivée depuis une autre page sur /#contact : on se place sur la section
    if(location.hash) window.addEventListener("loader:done", () => { const t = document.getElementById(location.hash.slice(1)); if(t) t.scrollIntoView(); }, { once:true });
  });

  /* ---------- Elementor ----------
     Quand un widget est (re)dessiné dans l'éditeur, on relance ses animations. */
  let hooked = false;
  function hookElementor(){
    if(hooked || !window.elementorFrontend || !elementorFrontend.hooks) return;
    hooked = true;
    elementorFrontend.hooks.addAction("frontend/element_ready/global", $scope => AP.initAll($scope[0]));
  }
  hookElementor();                                                   // Elementor déjà prêt
  if(window.jQuery) jQuery(window).on("elementor/frontend/init", hookElementor);  // ou pas encore
})(window.AP);
