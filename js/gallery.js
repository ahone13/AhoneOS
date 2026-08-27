// ============================================
// GALLERY WINDOW — View-Master intro + viewer
// ============================================

function initGallery(content) {

  // ---------- Data ----------
  const galleryItems = [
    { type: "photo", src: "assets/images/gallery/photo-1.jpeg", caption: "" },
    { type: "photo", src: "assets/images/gallery/photo-2.jpeg", caption: "" },
    { type: "photo", src: "assets/images/gallery/photo-3.jpeg", caption: "" },
    { type: "photo", src: "assets/images/gallery/photo-4.jpeg", caption: "" },
    { type: "photo", src: "assets/images/gallery/photo-5.jpeg", caption: "" },
    { type: "photo", src: "assets/images/gallery/photo-6.jpeg", caption: "" },
    { type: "photo", src: "assets/images/gallery/photo-7.jpeg", caption: "" },
    { type: "photo", src: "assets/images/gallery/photo-8.jpeg", caption: "" },
    { type: "video", src: "assets/images/gallery/video-1.mp4", caption: "" },
    { type: "video", src: "assets/images/gallery/video-2.mp4", caption: "" },
  ];

  let currentIndex = 0;

  // ---------- Elements (scoped to this window's content only) ----------
  const introLayer = content.querySelector('#introLayer');
  const introClickTarget = content.querySelector('#introClickTarget');
  const viewerLayer = content.querySelector('#viewerLayer');
  const backBtn = content.querySelector('#backBtn');

  const mediaStage = content.querySelector('#mediaStage');
  const leverBtn = content.querySelector('#leverBtn');
  const leverImg = content.querySelector('#leverImg');
  const reelCounter = content.querySelector('#reelCounter');
  const viewmasterCaption = content.querySelector('#viewmasterCaption');

  if (!introLayer || !introClickTarget || !leverBtn) return; // safety guard

  // ---------- Intro <-> Viewer transitions ----------
  function openViewer() {
    introLayer.classList.add('is-zooming');
    viewerLayer.classList.add('is-visible');
  }

  function resetToIntro() {
    introLayer.classList.remove('is-zooming');
    viewerLayer.classList.remove('is-visible');
  }

  if (introClickTarget) introClickTarget.addEventListener('click', openViewer);
  if (backBtn) backBtn.addEventListener('click', resetToIntro);

  // Reset whenever the Gallery window itself is closed
  const galleryWindow = content.closest('.window');
  const closeBtn = galleryWindow ? galleryWindow.querySelector('.close-btn') : null;
  if (closeBtn) closeBtn.addEventListener('click', resetToIntro);

  // ---------- Render current item ----------
  function renderCurrentItem() {
    const item = galleryItems[currentIndex];
    mediaStage.innerHTML = '';

    let mediaElement;
    if (item.type === 'photo') {
      mediaElement = document.createElement('img');
      mediaElement.src = item.src;
      mediaElement.alt = item.caption || 'Gallery photo';
    } else {
      mediaElement = document.createElement('video');
      mediaElement.src = item.src;
      mediaElement.autoplay = true;
      mediaElement.muted = true;
      mediaElement.loop = true;
      mediaElement.playsInline = true;
    }
    mediaStage.appendChild(mediaElement);

    const position = String(currentIndex + 1).padStart(2, '0');
    const total = String(galleryItems.length).padStart(2, '0');
    reelCounter.textContent = `${position} / ${total}`;
    viewmasterCaption.textContent = item.caption || '';
  }

  // ---------- Lever click -> flip to next item ----------
  function goToNextItem() {
    leverImg.src = 'assets/images/gallery-ui/lever-down.png';
    mediaStage.classList.add('is-flipping');

    setTimeout(() => {
      currentIndex = (currentIndex + 1) % galleryItems.length;
      renderCurrentItem();
    }, 250);

    setTimeout(() => {
      mediaStage.classList.remove('is-flipping');
      leverImg.src = 'assets/images/gallery-ui/lever-up.png';
    }, 500);
  }
  leverBtn.addEventListener('click', goToNextItem);

  // ---------- Initial paint ----------
  renderCurrentItem();
}