// =============================================
// windows.js
// Purpose: Open, close, focus, drag, minimize,
//          maximize windows + taskbar + clock.
// =============================================


// --- WINDOW STATE ---
let topZIndex = 100;


// --- OPEN WINDOW ---
function openWindow(windowId) {
  const win = document.getElementById(windowId);
  if (!win) return;

  // If minimized, just restore instead
  if (win.classList.contains('minimized')) {
    restoreWindow(windowId);
    return;
  }

  win.classList.add('active');
  focusWindow(win);

  if (!win.style.top) {
    const offset = Math.random() * 60 + 40;
    win.style.top  = offset + 'px';
    win.style.left = (offset + Math.random() * 80) + 'px';
  }
}


// --- CLOSE WINDOW ---
function closeWindow(windowId) {
  const win = document.getElementById(windowId);
  if (!win) return;

  win.classList.remove('active');
  win.classList.remove('focused');
  win.classList.remove('minimized');
  win.classList.remove('maximized');

  // Remove from taskbar if it's there
  removeTaskbarItem(windowId);

  if (windowId === 'window-honeynet' && window.stopHoneyNetRain) {
    window.stopHoneyNetRain();
  }

}


// --- MINIMIZE WINDOW ---
function minimizeWindow(windowId) {
  const win = document.getElementById(windowId);
  if (!win) return;

  win.classList.remove('active');
  win.classList.remove('focused');
  win.classList.add('minimized');

  // Add a button to the taskbar
  addTaskbarItem(windowId);
}


// --- MAXIMIZE / RESTORE TOGGLE ---
function toggleMaximize(windowId) {
  const win = document.getElementById(windowId);
  if (!win) return;

  if (win.classList.contains('maximized')) {
    // Currently maximized → restore to previous size
    win.classList.remove('maximized');

    // Restore saved position and size
    win.style.top    = win.dataset.prevTop    || '60px';
    win.style.left   = win.dataset.prevLeft   || '60px';
    win.style.width  = win.dataset.prevWidth  || '480px';
    win.style.height = win.dataset.prevHeight || '520px';
    /*
      dataset.prevTop etc. are custom data attributes
      we saved on the element before maximizing.
      This is how we "remember" where the window was.
    */

    // Update button label
    const btn = win.querySelector('.maximize-btn');
    if (btn) btn.textContent = '□';

  } else {
    // Not maximized → save current state, then maximize

    // Read the window's ACTUAL rendered size (works whether the size
    // came from inline styles or an external stylesheet), instead of
    // only checking win.style — which stays blank when sizing comes
    // from CSS rules like our #window-gallery selector.
    const rect = win.getBoundingClientRect();
    win.dataset.prevTop    = win.style.top    || win.offsetTop + 'px';
    win.dataset.prevLeft   = win.style.left   || win.offsetLeft + 'px';
    win.dataset.prevWidth  = win.style.width  || rect.width + 'px';
    win.dataset.prevHeight = win.style.height || rect.height + 'px';

    win.classList.add('maximized');

    // Fill the screen (accounting for taskbar height)
    win.style.top    = '0px';
    win.style.left   = '0px';
    win.style.width  = '100vw';
    win.style.height = 'calc(100vh - 36px)';
    /*
      calc() lets us do math with mixed units.
      100vh = full screen height.
      Minus 36px = the taskbar height.
      So the window fills everything above the taskbar.
    */

    // Update button label to show it can be restored
    const btn = win.querySelector('.maximize-btn');
    if (btn) btn.textContent = '❐';
  }

  focusWindow(win);
}


// --- RESTORE WINDOW (from minimized) ---
function restoreWindow(windowId) {
  const win = document.getElementById(windowId);
  if (!win) return;

  win.classList.remove('minimized');
  win.classList.add('active');
  focusWindow(win);

  // Remove from taskbar
  removeTaskbarItem(windowId);
}


// --- FOCUS WINDOW ---
function focusWindow(win) {
  document.querySelectorAll('.window').forEach(w => {
    w.classList.remove('focused');
  });

  topZIndex++;
  win.style.zIndex = topZIndex;
  win.classList.add('focused');
}


// --- TASKBAR: ADD ITEM ---
function addTaskbarItem(windowId) {
  const taskbarItems = document.getElementById('taskbarItems');
  if (!taskbarItems) return;

  // Don't add duplicates
  if (document.getElementById('task-' + windowId)) return;

  // Get the window title
  const win = document.getElementById(windowId);
  const titleEl = win ? win.querySelector('.window-title') : null;
  const title = titleEl ? titleEl.textContent : windowId;

  // Create the taskbar button
  const item = document.createElement('button');
  /*
    document.createElement() creates a brand new HTML element
    in JavaScript. It doesn't appear on screen until we
    append it to the DOM — which we do below.
  */
  item.className   = 'taskbar-item';
  item.id          = 'task-' + windowId;
  item.textContent = title;

  item.addEventListener('click', function() {
    restoreWindow(windowId);
  });

  taskbarItems.appendChild(item);
  /*
    appendChild() adds the new element as the last child
    of taskbarItems. This is how we dynamically add
    HTML elements with JavaScript.
  */
}


// --- TASKBAR: REMOVE ITEM ---
function removeTaskbarItem(windowId) {
  const item = document.getElementById('task-' + windowId);
  if (item) item.remove();
  /*
    .remove() deletes an element from the DOM entirely.
    Clean and simple.
  */
}


// --- CLOCK ---
function updateClock() {
  const clock = document.getElementById('taskbarClock');
  if (!clock) return;

  const now = new Date();
  /*
    new Date() creates a Date object representing
    right now — current date and time.
  */

  const hours   = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  /*
    .padStart(2, '0') ensures we always get two digits.
    So 9 becomes "09". Very important for clocks!
    String() converts the number to text first.
  */

  clock.textContent = hours + ':' + minutes;
}

// Update immediately, then every 30 seconds
updateClock();
setInterval(updateClock, 30000);


// --- DRAGGING ---
let isDragging  = false;
let dragTarget  = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

document.addEventListener('mousedown', function(e) {
  if (window.innerWidth <= 600) return; // no dragging on phones

  const titlebar = e.target.closest('.window-titlebar');
  if (!titlebar) return;
  if (e.target.closest('.window-btn')) return;

  const win = titlebar.closest('.window');
  if (!win) return;

  if (win.classList.contains('maximized')) return;

  isDragging  = true;
  dragTarget  = win;

  const rect  = win.getBoundingClientRect();
  dragOffsetX = e.clientX - rect.left;
  dragOffsetY = e.clientY - rect.top;

  titlebar.style.cursor = 'grabbing';
  focusWindow(win);
  e.preventDefault();
});

document.addEventListener('mousemove', function(e) {
  if (!isDragging || !dragTarget) return;

  let newX = e.clientX - dragOffsetX;
  let newY = e.clientY - dragOffsetY;

  newX = Math.max(0, Math.min(newX, window.innerWidth  - dragTarget.offsetWidth));
  newY = Math.max(0, Math.min(newY, window.innerHeight - dragTarget.offsetHeight - 36));
  // -36 keeps window above the taskbar

  dragTarget.style.left = newX + 'px';
  dragTarget.style.top  = newY + 'px';
});

document.addEventListener('mouseup', function() {
  if (!isDragging) return;

  isDragging = false;

  if (dragTarget) {
    const titlebar = dragTarget.querySelector('.window-titlebar');
    if (titlebar) titlebar.style.cursor = 'grab';
  }

  dragTarget = null;
});

// --- TOUCH DRAGGING (mirrors mouse dragging above) ---

document.addEventListener('touchstart', function(e) {
  if (window.innerWidth <= 600) return; // no dragging on phones

  const titlebar = e.target.closest('.window-titlebar');
  if (!titlebar) return;
  if (e.target.closest('.window-btn')) return;

  const win = titlebar.closest('.window');
  if (!win) return;

  if (win.classList.contains('maximized')) return;

  const touch = e.touches[0];

  isDragging  = true;
  dragTarget  = win;

  const rect  = win.getBoundingClientRect();
  dragOffsetX = touch.clientX - rect.left;
  dragOffsetY = touch.clientY - rect.top;

  focusWindow(win);
}, { passive: true });

document.addEventListener('touchmove', function(e) {
  if (!isDragging || !dragTarget) return;

  const touch = e.touches[0];

  let newX = touch.clientX - dragOffsetX;
  let newY = touch.clientY - dragOffsetY;

  newX = Math.max(0, Math.min(newX, window.innerWidth  - dragTarget.offsetWidth));
  newY = Math.max(0, Math.min(newY, window.innerHeight - dragTarget.offsetHeight - 36));

  dragTarget.style.left = newX + 'px';
  dragTarget.style.top  = newY + 'px';

  e.preventDefault(); // stop the page itself from scrolling while dragging
}, { passive: false });

document.addEventListener('touchend', function() {
  if (!isDragging) return;

  isDragging = false;
  dragTarget = null;
});

// --- BUTTON EVENT LISTENERS ---
document.querySelectorAll('.close-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    closeWindow(btn.dataset.close);
  });
});

document.querySelectorAll('.minimize-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    minimizeWindow(btn.dataset.minimize);
  });
});

document.querySelectorAll('.maximize-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    toggleMaximize(btn.dataset.maximize);
  });
});

document.querySelectorAll('.window').forEach(function(win) {
  win.addEventListener('mousedown', function() {
    focusWindow(win);
  });
});


// --- PUBLIC API ---
window.openWindow = openWindow;


// --- DESKTOP ICON CLICKS ---
//
// Remove the temporary test timeout and replace with this.
//
document.querySelectorAll('.desktop-icon').forEach(function(icon) {
  icon.addEventListener('click', function() {
    const windowId = icon.dataset.window;
    /*
      dataset.window reads the data-window="window-about"
      attribute we put on each icon div.
    */
    openWindow(windowId);

    // Add selected state briefly
    document.querySelectorAll('.desktop-icon').forEach(i => {
      i.classList.remove('selected');
    });
    icon.classList.add('selected');
  });
});

// --- LOAD SECTION CONTENT ---
//
// fetch() loads a file from the server asynchronously.
// "Asynchronously" means it doesn't freeze the page —
// it fetches in the background and runs a function
// when done (.then).
//
  fetch('sections/about.html')
    .then(function(response) {
      return response.text();
      /*
        response.text() reads the file content as a string.
      */
    })
    .then(function(html) {
      const content = document.querySelector('#window-about .window-content');
      if (content) content.innerHTML = html;
      /*
        innerHTML replaces the content inside the element
        with our loaded HTML string.
        This is how the about.html content appears
        inside the window.
      */
    fetch('sections/about.html')
    .then(response => response.text())
    .then(function(html) {
      const content = document.querySelector('#window-about .window-content');
      if (!content) return;
      content.innerHTML = html;

      // --- TAB LOGIC ---
      // Runs AFTER the HTML is injected, so the tabs exist.
      //
      const tabs = content.querySelectorAll('.facts-tab');
      const panels = content.querySelectorAll('.facts-panel');

      tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
          // Remove active from all tabs and panels
          tabs.forEach(t => t.classList.remove('active'));
          panels.forEach(p => p.classList.remove('active'));

          // Add active to clicked tab
          tab.classList.add('active');

          // Show the matching panel
          const targetId = 'tab-' + tab.dataset.tab;
          const targetPanel = content.querySelector('#' + targetId);
          if (targetPanel) targetPanel.classList.add('active');
          /*
            tab.dataset.tab reads data-tab="personality"
            We build the panel ID: "tab-" + "personality" = "tab-personality"
            Then find and show that panel.
          */
        });
      });
    });
    });

  fetch('sections/academic.html')
    .then(response => response.text())
    .then(function(html) {
      const content = document.querySelector('#window-academic .window-content');
      if (!content) return;
      content.innerHTML = html;

      // Wire up explorer after content loads
      initExplorer(content);
    });

  fetch('sections/contact.html')
    .then(response => response.text())
    .then(function(html) {
      const content = document.querySelector('#window-contact .window-content');
      if (!content) return;
      content.innerHTML = html;

      // Paper airplane on email click
      const emailCard = content.querySelector('#emailCard');
      const paperPlane = content.querySelector('#paperPlane');

      if (emailCard && paperPlane) {
        emailCard.addEventListener('click', function() {
          paperPlane.classList.remove('flying');
          /*
            Remove first so re-clicking resets the animation.
            Without this, clicking twice does nothing.
          */
          void paperPlane.offsetWidth;
          /*
            This line forces the browser to reflow —
            it "forgets" the animation state so it
            can restart cleanly. A classic CSS trick.
          */
          paperPlane.classList.add('flying');
        });
      }
    });

  fetch('sections/downloads.html')
    .then(response => response.text())
    .then(function(html) {
      const content = document.querySelector('#window-downloads .window-content');
      if (!content) return;
      content.innerHTML = html;
      initDownloads(content);
    });

  fetch('sections/music.html')
    .then(response => response.text())
    .then(function(html) {
      const content = document.querySelector('#window-music .window-content');
      if (!content) return;
      content.innerHTML = html;
      initMusic(content);
    });

  fetch('sections/favorites.html')
    .then(response => response.text())
    .then(function(html) {
      const content = document.querySelector('#window-favorites .window-content');
      if (!content) return;
      content.innerHTML = html;
      initFavorites(content);
    });

  fetch('sections/gallery.html')
    .then(response => response.text())
    .then(function(html) {
      const content = document.querySelector('#window-gallery .window-content');
      if (!content) return;
      content.innerHTML = html;
      initGallery(content);
    });

  fetch('sections/coding.html')
    .then(response => response.text())
    .then(function(html) {
      const content = document.querySelector('#window-coding .window-content');
      if (!content) return;
      content.innerHTML = html;
      initCodingExplorer(content);
    });

  fetch('sections/writing.html')
    .then(response => response.text())
    .then(function(html) {
      const content = document.querySelector('#window-writing .window-content');
      if (!content) return;
      content.innerHTML = html;
      initWriting(content);
    });

  fetch('sections/honeynet.html')
    .then(response => response.text())
    .then(function(html) {
      const content = document.querySelector('#window-honeynet .window-content');
      if (!content) return;
      content.innerHTML = html;
      initHoneyNet(content);
    });
  
  fetch('sections/games.html')
    .then(response => response.text())
    .then(function(html) {
      const content = document.querySelector('#window-games .window-content');
      if (!content) return;
      content.innerHTML = html;
      initGamesWindow(content);
    });

  // --- DESELECT ICONS ON EMPTY CLICK ---
document.querySelector('.desktop').addEventListener('click', function(e) {
  if (!e.target.closest('.desktop-icon')) {
    document.querySelectorAll('.desktop-icon').forEach(i => {
      i.classList.remove('selected');
    });
  }
  /*
    e.target.closest('.desktop-icon') checks if the click
    happened inside an icon. If not — empty space was clicked
    — we remove selected from everything.
  */
});

document.querySelectorAll('.desktop-icon').forEach(function(icon) {
  icon.addEventListener('click', function() {
    const windowId = icon.dataset.window;
    openWindow(windowId);

    if (windowId === 'window-honeynet' && window.startHoneyNetRain) {
      window.startHoneyNetRain();
    }

    // Add selected state briefly
    document.querySelectorAll('.desktop-icon').forEach(i => {
      i.classList.remove('selected');
    });
    icon.classList.add('selected');
  });
});