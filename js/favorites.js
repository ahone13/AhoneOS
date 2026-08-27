// =============================================
// favorites.js
// Purpose: Corkboard interactions —
// clicking items opens popup cards.
// =============================================

function initFavorites(container) {
  const popup       = container.querySelector('#favPopup');
  const popupHeader = container.querySelector('#favPopupHeader');
  const popupText   = container.querySelector('#favPopupText');
  const popupClose  = container.querySelector('#favPopupClose');

  // --- CLICK BOARD ITEMS ---
  const items = container.querySelectorAll('.board-item[data-title]');

  items.forEach(function(item) {
    item.addEventListener('click', function() {
      popupHeader.textContent = item.dataset.title;
      popupText.textContent   = item.dataset.content;
      popup.classList.add('visible');
    });
  });

  // --- CLOSE POPUP ---
  popupClose.addEventListener('click', function() {
    popup.classList.remove('visible');
  });

  // Close on outside click
  popup.addEventListener('click', function(e) {
    if (e.target === popup) {
      popup.classList.remove('visible');
    }
  });
}