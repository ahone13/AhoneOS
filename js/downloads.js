// =============================================
// downloads.js
// Purpose: Filing cabinet interactions.
// Drawer open/close, file cards, confetti,
// coming soon dialog.
// =============================================

// --- DRAWER CONTENT DATA ---
// Each drawer has a label and a list of files.
// Easy to update as you add real files.

const drawerData = {
  1: {
    label: '// Documents',
    img: 'assets/images/downloads/drawer-open-paper.png',
    files: [
      {
        icon: '📄',
        name: 'Ahone_Okah_Resume.pdf',
        meta: 'PDF • Resume • 2026',
        status: 'available',
        href: 'assets/files/Ahone_Okah_Resume.pdf'
      }
    ]
  },
  2: {
    label: '// Creative',
    img: 'assets/images/downloads/drawer-open-folder.png',
    files: [
      {
        icon: '📖',
        name: 'AhoneOS_User_Manual.pdf',
        meta: 'PDF • Portfolio Manual • TBD',
        status: 'soon'
      },
      {
        icon: '🎨',
        name: 'AhoneOS_Icon_Pack.zip',
        meta: 'ZIP • Pixel Art Icons • TBD',
        status: 'soon'
      }
    ]
  },
  3: {
    label: '// Academic',
    img: 'assets/images/downloads/drawer-open-folder.png',
    files: [
      {
        icon: '🎓',
        name: 'Academic_Transcript.pdf',
        meta: 'PDF • Academic Record • TBD',
        status: 'soon'
      },
      {
        icon: '📦',
        name: 'Certificates.zip',
        meta: 'ZIP • Certificates • Empty for now',
        status: 'soon'
      }
    ]
  }
};


function initDownloads(container) {
  const cabinetClosed  = container.querySelector('#cabinetClosed');
  const drawerOpenView = container.querySelector('#drawerOpenView');
  const drawerOpenLabel = container.querySelector('#drawerOpenLabel');
  const drawerImg      = container.querySelector('#drawerImg');
  const drawerFiles    = container.querySelector('#drawerFiles');
  const drawerCloseBtn = container.querySelector('#drawerCloseBtn');
  const soonDialog     = container.querySelector('#soonDialog');
  const soonClose      = container.querySelector('#soonClose');
  const confettiContainer = container.querySelector('#confettiContainer');

  const colors = [
    '#FF6EB4','#FF1493','#FFD700','#FF6347',
    '#7B68EE','#00CED1','#98FB98','#FFA500',
    '#FF69B4','#9370DB','#40E0D0','#FFB6C1'
  ];

  // --- CONFETTI ---
  function launchConfetti() {
    confettiContainer.innerHTML = '';
    for (let i = 0; i < 60; i++) {
      const piece    = document.createElement('div');
      piece.classList.add('confetti-piece');
      const color    = colors[Math.floor(Math.random() * colors.length)];
      const size     = Math.random() * 8 + 4;
      const shape    = Math.random() > 0.5 ? '50%' : '0%';
      piece.style.background   = color;
      piece.style.left         = Math.random() * 100 + '%';
      piece.style.bottom       = '0px';
      piece.style.width        = size + 'px';
      piece.style.height       = size + 'px';
      piece.style.borderRadius = shape;
      piece.style.setProperty('--fall-duration', (Math.random() * 0.8 + 0.6) + 's');
      piece.style.setProperty('--fall-delay',    (Math.random() * 0.4) + 's');
      confettiContainer.appendChild(piece);
    }
    setTimeout(() => confettiContainer.innerHTML = '', 2000);
  }

  // --- OPEN DRAWER ---
  const drawerZones = container.querySelectorAll('.drawer-zone');

  drawerZones.forEach(function(zone) {
    zone.addEventListener('click', function() {
      const drawerId = zone.dataset.drawer;
      const data     = drawerData[drawerId];
      if (!data) return;

      // Update label and image
      drawerOpenLabel.textContent = data.label;
      drawerImg.src = data.img;

      // Build file cards
      drawerFiles.innerHTML = '';
      data.files.forEach(function(file) {
        const card = document.createElement('div');
        card.className = 'file-card ' + (file.status === 'available' ? 'available' : 'coming-soon');

        card.innerHTML = `
          <span class="file-icon-large">${file.icon}</span>
          <div class="file-card-info">
            <span class="file-card-name">${file.name}</span>
            <span class="file-card-meta">${file.meta}</span>
            <span class="file-card-status ${file.status === 'available' ? 'ok' : 'soon'}">
              ${file.status === 'available' ? '✅ Available' : '🔒 Coming Soon'}
            </span>
          </div>
          ${file.status === 'available'
            ? `<a class="file-action-btn download" href="${file.href}" download>↓ Download</a>`
            : `<button class="file-action-btn locked">locked</button>`
          }
        `;

        // Wire up download confetti
        if (file.status === 'available') {
          card.querySelector('.download').addEventListener('click', launchConfetti);
        }

        // Wire up locked dialog
        if (file.status === 'soon') {
          card.querySelector('.locked').addEventListener('click', function() {
            soonDialog.classList.add('visible');
          });
        }

        drawerFiles.appendChild(card);
      });

      // Show drawer view, hide cabinet
      cabinetClosed.style.display = 'none';
      container.querySelectorAll('.drawer-zone').forEach(z => z.style.display = 'none');
      drawerOpenView.classList.add('visible');
    });
  });

  // --- CLOSE DRAWER ---
  drawerCloseBtn.addEventListener('click', function() {
    drawerOpenView.classList.remove('visible');
    cabinetClosed.style.display = 'block';
    container.querySelectorAll('.drawer-zone').forEach(z => z.style.display = 'flex');
  });

  // --- SOON DIALOG ---
  soonClose.addEventListener('click', function() {
    soonDialog.classList.remove('visible');
  });
}