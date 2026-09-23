/* ============================================================
   VISIONNEUSE — agrandit les illustrations (tuiles .illu)
   data-full = grande image, data-title = légende (légende de
   l'image dans la médiathèque). Clavier : ← → pour naviguer,
   Échap pour fermer. Fonctionne sur toutes les pages, y compris
   pour les widgets ajoutés avec Elementor.
   ============================================================ */
(function(){
  let lb, stage, tiles = [], index = 0, isOpen = false, returnFocus = null;

  function build(){
    if(lb) return;
    document.body.insertAdjacentHTML("beforeend", `
    <div class="lb" id="lb" role="dialog" aria-modal="true" aria-label="Illustration agrandie" tabindex="-1">
      <div class="ctl top"><span id="lb-caption"></span><button id="lb-close">Fermer</button></div>
      <div id="lb-stage" style="display:contents"></div>
      <div class="ctl bot"><button id="lb-prev">Précédente</button><span id="lb-count"></span><button id="lb-next">Suivante</button></div>
    </div>`);
    lb = $("#lb"); stage = $("#lb-stage");
    $("#lb-close").addEventListener("click", close);
    $("#lb-prev").addEventListener("click", () => show(index - 1));
    $("#lb-next").addEventListener("click", () => show(index + 1));
    lb.addEventListener("click", e => { if(e.target === lb) close(); });
  }
  function show(i){
    index = (i + tiles.length) % tiles.length;
    const t = tiles[index];
    stage.innerHTML = "";
    if(t.dataset.missing){ stage.innerHTML = `<p class="miss">Cette image n'a pas pu être chargée.</p>`; }
    else { const img = document.createElement("img"); img.src = t.dataset.full; img.alt = t.dataset.title || `Illustration ${index + 1}`; stage.appendChild(img); }
    $("#lb-caption").textContent = t.dataset.title || "";
    $("#lb-count").textContent = `${index + 1} / ${tiles.length}`;
  }
  function open(tile){
    build();
    // On navigue parmi les tuiles du même bloc (galerie ou aperçu)
    const group = tile.closest(".gallery, .strip-illus") || document;
    tiles = [...group.querySelectorAll(".illu")];
    returnFocus = document.activeElement;
    show(tiles.indexOf(tile));
    lb.classList.add("open"); isOpen = true; document.body.style.overflow = "hidden"; lb.focus();
  }
  function close(){ lb.classList.remove("open"); isOpen = false; document.body.style.overflow = ""; if(returnFocus) returnFocus.focus(); }

  document.addEventListener("click", e => {
    const t = e.target.closest(".illu");
    if(t && t.dataset.full) open(t);
  });
  document.addEventListener("keydown", e => {
    if(!isOpen) return;
    if(e.key === "Escape") close();
    if(e.key === "ArrowRight") show(index + 1);
    if(e.key === "ArrowLeft") show(index - 1);
    if(e.key === "Tab"){ // garde le focus dans la visionneuse
      const f = $$("button", lb), first = f[0], last = f[f.length - 1];
      if(e.shiftKey && (document.activeElement === first || document.activeElement === lb)){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    }
  });
})();
