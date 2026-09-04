// =============================================
// coding.js
// Purpose: File explorer interactions for
// Coding Projects — mirrors academic.js's
// pattern (select, open, context menu, properties).
// =============================================

const codingProjectData = {
  ahoneos: {
    name: 'AhoneOS',
    stack: 'Vanilla JS',
    status: 'In Progress',
    year: '2026',
    vibe: 'the project that ate my life',
    link: 'https://ahone13.github.io/AhoneOS/',
    description: 'A personal portfolio site built as a fictional Y2K/Windows XP-style desktop operating system, complete with draggable windows, a taskbar, hand-drawn art andpixel art throughout.',
    tech: 'HTML, CSS, JavaScript',
    proud: 'Literally all of it : every window is handmade, down to the pixel icons.',
    devNote: 'You\'re looking at it diva. Meta.',
  },
};

function initCodingExplorer(container) {
  const rows = container.querySelectorAll('.explorer-row');
  const contextMenu = container.querySelector('#codingContextMenu');
  const propertiesModal = container.querySelector('#codingPropertiesModal');
  const propertiesBody = container.querySelector('#codingPropertiesBody');
  const propertiesClose = container.querySelector('#codingPropertiesClose');

  let selectedProject = null;

  rows.forEach(function(row) {
    row.addEventListener('click', function() {
      rows.forEach(r => r.classList.remove('selected'));
      row.classList.add('selected');
      selectedProject = row.dataset.project;
    });
  });

  rows.forEach(function(row) {
    row.addEventListener('dblclick', function() {
      selectedProject = row.dataset.project;
      openCodingProject(selectedProject);
    });
  });

  rows.forEach(function(row) {
    row.addEventListener('contextmenu', function(e) {
      e.preventDefault();

      rows.forEach(r => r.classList.remove('selected'));
      row.classList.add('selected');
      selectedProject = row.dataset.project;

      contextMenu.style.top  = e.clientY + 'px';
      contextMenu.style.left = e.clientX + 'px';
      contextMenu.classList.add('visible');
    });
  });

  container.querySelector('#coding-ctx-open').addEventListener('click', function() {
    contextMenu.classList.remove('visible');
    if (selectedProject) openCodingProject(selectedProject);
  });

  container.querySelector('#coding-ctx-new-window').addEventListener('click', function() {
    contextMenu.classList.remove('visible');
    if (selectedProject) openCodingProject(selectedProject);
  });

  container.querySelector('#coding-ctx-properties').addEventListener('click', function() {
    contextMenu.classList.remove('visible');
    if (selectedProject) showCodingProperties(selectedProject);
  });

  document.addEventListener('click', function() {
    contextMenu.classList.remove('visible');
  });

  function showCodingProperties(projectId) {
    const project = codingProjectData[projectId];
    if (!project) return;

    propertiesBody.innerHTML = `
      <div class="prop-row">
        <span class="prop-label">NAME</span>
        <span class="prop-value">${project.name}</span>
      </div>
      <div class="prop-row">
        <span class="prop-label">STACK</span>
        <span class="prop-value">${project.stack}</span>
      </div>
      <div class="prop-row">
        <span class="prop-label">STATUS</span>
        <span class="prop-value">${project.status}</span>
      </div>
      <div class="prop-row">
        <span class="prop-label">YEAR</span>
        <span class="prop-value">${project.year}</span>
      </div>
      <div class="prop-row">
        <span class="prop-label">LINK</span>
        <span class="prop-value">${project.link ? 'Available' : 'Private'}</span>
      </div>
    `;

    propertiesModal.classList.add('visible');
  }

  propertiesClose.addEventListener('click', function() {
    propertiesModal.classList.remove('visible');
  });

  propertiesModal.addEventListener('click', function(e) {
    if (e.target === propertiesModal) {
      propertiesModal.classList.remove('visible');
    }
  });
}

function openCodingProject(projectId) {
  const project = codingProjectData[projectId];
  if (!project) return;

  const windowId = 'window-coding-project-' + projectId;
  let win = document.getElementById(windowId);

  if (!win) {
    win = document.createElement('div');
    win.className = 'window';
    win.id = windowId;
    win.innerHTML = `
      <div class="window-titlebar" data-window="${windowId}">
        <span class="window-title">${project.name}.readme</span>
        <div class="window-controls">
          <button class="window-btn minimize-btn" data-minimize="${windowId}">−</button>
          <button class="window-btn maximize-btn" data-maximize="${windowId}">□</button>
          <button class="window-btn close-btn" data-close="${windowId}">✕</button>
        </div>
      </div>
      <div class="window-content readme-content">
        <div class="readme-header">
          <h2 class="readme-title">${project.name}</h2>
          <span class="readme-status ${project.status === 'Complete' ? 'status-complete' : 'status-wip'}">
            ${project.status === 'Complete' ? '✅ Complete' : '🔄 WIP'}
          </span>
        </div>

        <div class="readme-section">
          <h3>// description</h3>
          <p>${project.description}</p>
        </div>

        <div class="readme-section">
          <h3>// tech stack</h3>
          <div class="tech-tags">
            ${project.tech.split(', ').map(t => `<span class="tech-tag">${t}</span>`).join('')}
          </div>
        </div>

        <div class="readme-section">
          <h3>// what I'm proud of</h3>
          <p>${project.proud}</p>
        </div>

        <div class="readme-section">
          <h3>// dev notes</h3>
          <p class="dev-note">${project.devNote}</p>
        </div>

        <div class="readme-section">
          <h3>// vibe check</h3>
          <p class="vibe-text">"${project.vibe}"</p>
        </div>

        <div class="readme-buttons">
          ${project.link
            ? `<button class="readme-btn"
                onclick="window.open('${project.link}', '_blank')">
                ↗ View on GitHub
              </button>`
            : `<button class="readme-btn" disabled>
                GitHub — coming soon
              </button>`
          }
        </div>
      </div>
    `;

    document.querySelector('.desktop').appendChild(win);

    win.querySelector('.close-btn').addEventListener('click', function() {
      closeWindow(windowId);
    });
    win.querySelector('.minimize-btn').addEventListener('click', function() {
        minimizeWindow(windowId);   // ← fixed
    });
    win.querySelector('.maximize-btn').addEventListener('click', function() {
      toggleMaximize(windowId);
    });
    win.addEventListener('mousedown', function() {
      focusWindow(win);
    });
  }

  openWindow(windowId);
}