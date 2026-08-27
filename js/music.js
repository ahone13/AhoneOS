// =============================================
// music.js
// Purpose: Walkman CD player interactions.
// =============================================

const cdData = {
  mc: {
    name: 'MC syndrome',
    color: '#FF1493',
    mood: '⭐ Walking into a room like everyone already knows your name.',
    desc: 'Best enjoyed with: sunsets, sunglasses indoors and delusions of grandeur.',
    damage: 'Estimated emotional damage: main character arc / 10',
    url: 'https://open.spotify.com/playlist/6GEKfBWhMay7cw4xEEf5iH'
  },
  rainy: {
    name: 'rainy bus rides',
    color: '#6B8CAE',
    mood: '🌧 Watching the window like you\'re in a music video nobody asked for.',
    desc: 'Best enjoyed with: actual rain, public transport, and "deep thoughts".',
    damage: 'Estimated emotional damage: 6/10 (could cause unnecessary nostalgia)',
    url: 'https://open.spotify.com/playlist/2XVMjNDJ6yeFvUA86OmX2B'
  },
  dance: {
    name: 'just dance fr',
    color: '#FF6B6B',
    mood: '💃 just shake ya ass.',
    desc: 'Best enjoyed with: an empty room, zero dignity, and complete commitment.',
    damage: 'Estimated emotional damage: 0/10 (this one heals)',
    url: 'https://open.spotify.com/playlist/4gkLlUX0nGh1Z2nqFnAsSE'
  },
  cvnt: {
    name: 'cvntessential',
    color: '#1a1a2e',
    mood: '🖤 Anti-bird programming.',
    desc: 'Best enjoyed with: misandry, wlw, and the audacity to exist.',
    damage: 'Estimated emotional damage: classified.',
    url: 'https://open.spotify.com/playlist/2vfSVET2Glr3Bp0krhxIpW'
  },
  237: {
    name: '+237',
    color: '#228B22',
    mood: '🌍 Home to me.',
    desc: 'Best enjoyed with: pride and unsolicited opinions on food.',
    damage: 'Estimated emotional damage: 8/10 (homesick in a good way)',
    url: 'https://open.spotify.com/playlist/0OpxLrGBRlT9GypgbXngIy'
  },
  baguette: {
    name: 'baguette',
    color: '#FFD700',
    mood: '🥖 Francophone soul in audio form.',
    desc: 'Best enjoyed with: TAYC, Fally Ipupa, Dadju, MHD, and an opinion about Paris.',
    damage: 'Estimated emotional damage: 7/10 (will make you want to call someone)',
    url: 'https://open.spotify.com/playlist/7uLeTegFSyTqX19Htfmk5F'
  },
  afro: {
    name: 'afrobeats',
    color: '#E67E22',
    mood: '🌅 The primary language. Everything else is a dialect.',
    desc: 'Best enjoyed with: volume at 100%, no explanations, and your whole chest.',
    damage: 'Estimated emotional damage: 9/10 (will make you dance even if you said you wouldn\'t)',
    url: 'https://open.spotify.com/playlist/462qWUqRdLy6yaUz9JMO9i'
  },
  anime: {
    name: 'anime 🌸',
    color: '#9B59B6',
    mood: '⚔️ No judgment. We don\'t talk about this outside these walls .',
    desc: 'Best enjoyed with: the specific emotional damage only anime openings can cause.',
    damage: 'Estimated emotional damage: unpredictable. Could cry. Could run. No in between.',
    url: 'https://open.spotify.com/playlist/4vqYqssaU2bl910eMci0oC'
  }
};

function initMusic(container) {
  const screenText  = container.querySelector('#screenText');
  const screenSub   = container.querySelector('#screenSub');
  const cdSlot      = container.querySelector('#cdSlot');
  const btnPlay     = container.querySelector('#btnPlay');
  const btnEject    = container.querySelector('#btnEject');
  const cdCard      = container.querySelector('#cdCard');
  const cdCardHeader = container.querySelector('#cdCardHeader');
  const cdMood      = container.querySelector('#cdMood');
  const cdDesc      = container.querySelector('#cdDesc');
  const cdDamage    = container.querySelector('#cdDamage');
  const cdNope      = container.querySelector('#cdNope');
  const cdInsert    = container.querySelector('#cdInsert');
  const ejectMsg    = container.querySelector('#ejectMsg');

  let loadedCD = null;
  /*
    Tracks which CD is currently in the Walkman.
    null = no CD inserted.
  */

  // --- CD CLICK → show info card ---
  const cdItems = container.querySelectorAll('.cd-item');

  cdItems.forEach(function(item) {
    item.addEventListener('click', function() {
      const id   = item.dataset.id;
      const data = cdData[id];
      if (!data) return;

      // Populate card
      cdCardHeader.textContent       = data.name;
      cdCardHeader.style.background  = data.color;
      cdMood.textContent             = data.mood;
      cdDesc.textContent             = data.desc;
      cdDamage.textContent           = data.damage;

      // Store which CD was clicked for insert
      cdCard.dataset.pendingId = id;

      // Show card
      cdCard.classList.add('visible');
    });
  });

  // --- NOPE ---
  cdNope.addEventListener('click', function() {
    cdCard.classList.remove('visible');
  });

  // --- INSERT CD ---
  cdInsert.addEventListener('click', function() {
    const id   = cdCard.dataset.pendingId;
    const data = cdData[id];
    if (!data) return;

    loadedCD = data;

    // Update Walkman screen
    screenText.textContent = 'Now Loaded';
    screenSub.textContent  = data.name.toUpperCase();

    // Show spinning CD in slot
    cdSlot.style.background = data.color;
    cdSlot.innerHTML = '<div class="cd-slot-hole"></div>';
    cdSlot.classList.add('active');

    // Hide card
    cdCard.classList.remove('visible');
  });

  // --- PLAY ---
  btnPlay.addEventListener('click', function() {
    if (!loadedCD) {
      // Error — no CD inserted
      screenText.textContent = 'Error';
      screenSub.textContent  = 'No CD inserted.';
      setTimeout(function() {
        screenText.textContent = '♪ No CD inserted';
        screenSub.textContent  = 'INSERT MEDIA TO PLAY';
      }, 2000);
      return;
    }
    // Instead of opening a new tab, show embedded player
    const embedDiv = container.querySelector('#spotifyEmbed');
    embedDiv.innerHTML = `
    <iframe 
        src="https://open.spotify.com/embed/playlist/${getPlaylistId(loadedCD.url)}"
        width="100%" 
        height="80" 
        frameborder="0" 
        allowtransparency="true" 
        allow="encrypted-media">
    </iframe>
    `;
  });

  // --- EJECT ---
  btnEject.addEventListener('click', function() {
  if (!loadedCD) return;

  loadedCD = null;
  cdSlot.classList.remove('active');
  cdSlot.innerHTML = '';
  screenText.textContent = '♪ No CD inserted';
  screenSub.textContent  = 'INSERT MEDIA TO PLAY';

  // Clear the embed player
  const embedDiv = container.querySelector('#spotifyEmbed');
  if (embedDiv) embedDiv.innerHTML = '';

  // Easter egg
  ejectMsg.classList.add('visible');
  setTimeout(function() {
    ejectMsg.classList.remove('visible');
  }, 3000);
});
}

function getPlaylistId(url) {
  return url.split('/playlist/')[1].split('?')[0];
}
