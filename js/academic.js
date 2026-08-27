// =============================================
// academic.js
// Purpose: File explorer interactions —
// row selection, right-click context menu,
// properties modal, double-click to open.
// =============================================

// Project data — all metadata lives here.
// Easy to update without touching HTML.
const projectData = {
  mstocks: {
    name: 'M_stocks',
    language: 'Python',
    type: '.project',
    course: 'PFE — Bachelor\'s in Business Computing',
    grade: 'Mention Très Bien',
    year: '2025',
    status: 'Complete',
    description: 'A full-stack web platform for real-time enterprise stock management. Features role-based dashboards, automatic alert generation, and secure web access.',
    tech: 'Python, Django, SQLite, HTML/CSS',
    proud: 'The dashboard designs — clean and functional for a first web app.',
    devNote: 'The M stands for Monya. I built this through the hardest months of my life. The alert system crashed every .5 seconds. I crashed out a few times too, but we both made it.',
    difficulty: '4/5',
    vibe: 'soul crushing but at least it\'s over',
    githubUrl: 'https://github.com/ahone13/M_stocks'

  },
  co2_emissions_ml: {
  name: 'CO2_emissions_ml',
  language: 'Python',
  type: '.project',
  course: 'Machine Learning',
  grade: 'TBD',
  year: '2026',
  status: 'Complete',
  description: 'A multi-country comparative analysis of national CO₂ emissions from fossil fuels (1970–2022). Implements and evaluates four regressors — Ridge Regression, Random Forest, XGBoost, and a kernel-sensitive SVR framework — using temporally stratified validation. XGBoost achieved highest predictive power. Built-in visual analysis makes findings interpretable for policymakers.',
  tech: 'Python, scikit-learn, XGBoost, SVR, Pandas, Matplotlib',
  proud: 'The SVR kernel optimization : treating it as a tunable hyperparameter actually worked.',
  devNote: 'Still not sure what I did if I\'m being honest. Could I do it again? Maybe.',
  difficulty: '4/5',
  vibe: 'interesting topic',
  githubUrl: null

  },
  data_analytics: {
  name: 'the_anatomy_of_a_modern_breakup',
  language: 'Python',
  type: '.project',
  course: 'Data Analytics',
  grade: 'TBD',
  year: '2026',
  status: 'Complete',
  description: 'A sentiment and engagement analytics pipeline applied to Reddit posts from r/breakups and r/relationship_advice. Using VADER sentiment scoring, LDA topic modeling, and three supervised classifiers, we investigated what drives community engagement in online relationship support spaces. Key finding: the Sentiment Paradox — emotional content has near-zero correlation with engagement. Structure beats feelings, apparently.',
  tech: 'Python, VADER, LDA, scikit-learn, SMOTE, Pandas',
  proud: 'Improving recall for high-engagement posts from 24% to 94% using SMOTE.',
  devNote: 'relationships are so complicated.',
  difficulty: '2/5',
  vibe: 'actually took it seriously',
  githubUrl: 'https://github.com/ahone13/data-analytics-breakup-project'

  },
  data_engineering: {
  name: 'dubai_smart_parking_etl',
  language: 'Python',
  type: '.project',
  course: 'Data Engineering',
  grade: 'TBD',
  year: '2026',
  status: 'Complete',
  description: 'An automated ETL pipeline unifying Dubai RTA static parking capacity records with IoT sensor occupancy streams into a structured PostgreSQL data warehouse. Implements a Star Schema architecture for real-time occupancy analysis across Dubai parking zones. The core challenge: bridging two datasets that share no natural join key — solved with a manually engineered zone lookup table.',
  tech: 'Python, PostgreSQL, ETL, Star Schema, Pandas, Kaggle API',
  proud: 'Bridging the gap between two incompatible datasets with a lookup table that didn\'t exist anywhere : I built the missing piece.',
  devNote: 'No idea what I\'m doing fr.',
  difficulty: '3/5',
  vibe: 'meh...',
  githubUrl: 'https://github.com/ahone13/dubai_smart_parking_etl'

  },
  ds_business: {
  name: 'online_retail_cancellation_analysis',
  language: 'Python',
  type: '.project',
  course: 'Data Science & Business',
  grade: 'TBD',
  year: '2026',
  status: 'In Progress',
  description: 'An EDA-focused study of e-commerce cancellation and return patterns using the Online Retail II dataset. Analyzes return behavior across customer demographics, geographic location, seasonal trends, and product categories. Context: global return rates doubled from 8.1% to 16.9% between 2019 and 2024, costing retailers up to 65% of item value per return. This study identifies where and why those losses happen.',
  tech: 'Python, Pandas, Seaborn, Matplotlib, EDA',
  proud: 'The product analysis section; the findings are actionable and could save a retailer a lot of money.',
  devNote: 'Someone send help.',
  difficulty: '4/5',
  vibe: 'someone send help',
  githubUrl: 'https://github.com/ahone13/online-retail-cancellation-analysis'

  },
};


function initExplorer(container) {
  const rows = container.querySelectorAll('.explorer-row');
  const contextMenu = container.querySelector('#contextMenu');
  const propertiesModal = container.querySelector('#propertiesModal');
  const propertiesBody = container.querySelector('#propertiesBody');
  const propertiesClose = container.querySelector('#propertiesClose');

  let selectedProject = null;
  /*
    We track which project is selected so the
    context menu and properties modal know
    which data to show.
  */

  // --- SINGLE CLICK — select row ---
  rows.forEach(function(row) {
    row.addEventListener('click', function() {
      rows.forEach(r => r.classList.remove('selected'));
      row.classList.add('selected');
      selectedProject = row.dataset.project;
    });
  });

  // --- DOUBLE CLICK — open project ---
  rows.forEach(function(row) {
    row.addEventListener('dblclick', function() {
      selectedProject = row.dataset.project;
      openProject(selectedProject);
    });
  });

  // --- RIGHT CLICK — show context menu ---
  rows.forEach(function(row) {
    row.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      /*
        e.preventDefault() stops the browser's
        default right-click menu from appearing.
        We replace it with our own.
      */

      // Select the row
      rows.forEach(r => r.classList.remove('selected'));
      row.classList.add('selected');
      selectedProject = row.dataset.project;

      // Position context menu at mouse location
      contextMenu.style.top  = e.clientY + 'px';
      contextMenu.style.left = e.clientX + 'px';
      contextMenu.classList.add('visible');
    });
  });

  // --- CONTEXT MENU ACTIONS ---
  container.querySelector('#ctx-open').addEventListener('click', function() {
    contextMenu.classList.remove('visible');
    if (selectedProject) openProject(selectedProject);
  });

  container.querySelector('#ctx-new-window').addEventListener('click', function() {
    contextMenu.classList.remove('visible');
    if (selectedProject) openProject(selectedProject);
    /*
      For now same as open — we can add
      true new-window behavior later.
    */
  });

  container.querySelector('#ctx-properties').addEventListener('click', function() {
    contextMenu.classList.remove('visible');
    if (selectedProject) showProperties(selectedProject);
  });

  // --- CLOSE CONTEXT MENU on outside click ---
  document.addEventListener('click', function() {
    contextMenu.classList.remove('visible');
  });

  // --- PROPERTIES MODAL ---
  function showProperties(projectId) {
    const project = projectData[projectId];
    if (!project) return;

    // Build the properties rows
    propertiesBody.innerHTML = `
      <div class="prop-row">
        <span class="prop-label">NAME</span>
        <span class="prop-value">${project.name}</span>
      </div>
      <div class="prop-row">
        <span class="prop-label">LANGUAGE</span>
        <span class="prop-value">${project.language}</span>
      </div>
      <div class="prop-row">
        <span class="prop-label">COURSE</span>
        <span class="prop-value">${project.course}</span>
      </div>
      <div class="prop-row">
        <span class="prop-label">GRADE</span>
        <span class="prop-value">${project.grade}</span>
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
        <span class="prop-label">DIFFICULTY</span>
        <span class="prop-value">${project.difficulty}</span>
      </div>
    `;
    /*
      Template literals (backticks) let us write
      multi-line HTML strings with variables inside ${}.
      Much cleaner than string concatenation.
    */

    propertiesModal.classList.add('visible');
  }

  // Close modal
  propertiesClose.addEventListener('click', function() {
    propertiesModal.classList.remove('visible');
  });

  propertiesModal.addEventListener('click', function(e) {
    if (e.target === propertiesModal) {
      propertiesModal.classList.remove('visible');
      /*
        Only close if clicking the dark overlay,
        not the box itself.
        e.target is what was actually clicked.
      */
    }
  });
}


// --- OPEN PROJECT WINDOW ---
function openProject(projectId) {
  const project = projectData[projectId];
  if (!project) return;

  /*
    For now we'll show a simple README view
    inside a new window. We'll build proper
    project windows next session.
  */
  const windowId = 'window-project-' + projectId;
  let win = document.getElementById(windowId);

  if (!win) {
    /*
      If the window doesn't exist yet, create it
      dynamically. This is more efficient than having
      5 pre-built project windows in the HTML.
    */
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
          ${project.githubUrl
            ? `<button class="readme-btn" 
                onclick="window.open('${project.githubUrl}', '_blank')">
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

    // Wire up the new window's buttons
    win.querySelector('.close-btn').addEventListener('click', function() {
      closeWindow(windowId);
    });
    win.querySelector('.minimize-btn').addEventListener('click', function() {
      minimizeWindow(windowId);
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