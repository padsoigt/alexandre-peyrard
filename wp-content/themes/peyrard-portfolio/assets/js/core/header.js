/* ============================================================
   HEADER — petit décalage d'encres du logo + nom à l'arrivée
   sur une page (sauf à la 1re visite : le loader s'en charge).
   Le header lui-même est dans header.php.
   ============================================================ */
window.addEventListener("loader:done", () => {
  if(reduceMotion || window.__loaderShown) return;
  const brand = document.getElementById("brand");
  if(!brand) return;
  setTimeout(() => brand.classList.add("kick"), 60);
  setTimeout(() => brand.classList.remove("kick"), 440);
}, { once:true });
