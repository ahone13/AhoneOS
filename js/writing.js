// =============================================
// writing.js
// Purpose: Ahone Writer — sidebar nav, greeting,
// piece list, locked drafts, same-window document
// view. Piece TEXT lives in .txt files, fetched
// on demand — writingData only holds metadata.
// =============================================

// TODO: replace with your real Substack URL
const SUBSTACK_URL = 'https://substack.com/@cvntessential';

const writingData = {
  article_1: {                                  
    title: 'The Paradox of Chilling While Having No Future',  
    subtitle: 'A Gen Z story',            
    date: 'Jul 2026',                                   
    file: 'assets/writing/article-1.txt',            
    substackUrl: 'https://cvntessential.substack.com/p/the-paradox-of-chilling-while-having?r=8s690g&utm_campaign=post&utm_medium=web',  
  },

  article_2: {
  title: 'The Geography of our Minds',
  subtitle: 'An African reflection on western obsession and continental neglect',
  date: 'Aug 2026',
  file: 'assets/writing/article-2.txt',
  substackUrl: 'https://cvntessential.substack.com/p/the-geography-of-our-minds?r=8s690g&utm_campaign=post&utm_medium=web',
},
};

// --- Greeting, based on the time of day ---
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "you're up early... suspicious";
  if (hour < 18) return "back again?";
  return "you love it here huh?";
}

function initWriting(container) {
  const listLayer = container.querySelector('#writerListLayer');
  const pageLayer = container.querySelector('#writerPageLayer');
  const backBtn = container.querySelector('#writerBackBtn');
  const pageWrapper = container.querySelector('#pageWrapper');
  const greetingEl = container.querySelector('#writerGreeting');
  const filesContainer = container.querySelector('#writerFiles');
  const toast = container.querySelector('#writerToast');

  const navHome = container.querySelector('#navHome');
  const navNew = container.querySelector('#navNew');
  const navSubstack = container.querySelector('#navSubstack');
  const navDrafts = container.querySelector('#navDrafts');

  const passwordModal = container.querySelector('#passwordModal');
  const passwordClose = container.querySelector('#passwordClose');
  const passwordInput = container.querySelector('#passwordInput');
  const passwordSubmit = container.querySelector('#passwordSubmit');
  const passwordResult = container.querySelector('#passwordResult');

  // --- Greeting ---
  greetingEl.textContent = getGreeting();

  // --- Build the piece list from writingData ---
  const entries = Object.entries(writingData);

  entries.forEach(function([id, piece]) {
    const row = document.createElement('div');
    row.className = 'writer-row';
    row.innerHTML = `
      <span class="doc-icon"></span>
      <span class="writer-row-text">
        <span class="writer-row-title">${piece.title}</span>
        <span class="writer-row-date">${piece.date}</span>
      </span>
    `;
    row.addEventListener('click', function() {
      openPiece(id);
    });
    filesContainer.appendChild(row);
  });

  // --- Open a piece: fetch its .txt file, show it in the page layer ---
  function openPiece(pieceId) {
        const piece = writingData[pieceId];
        if (!piece) return;

        fetch(piece.file)
            .then(response => response.text())
            .then(function(rawText) {
            let blocks = rawText
                .split(/\n\s*\n/)
                .map(b => b.trim())
                .filter(b => b.length > 0);

            // If a %%more%% marker exists, cut everything after it —
            // this is how you control where the "excerpt" ends per piece.
            const cutIndex = blocks.findIndex(b => b === '%%more%%');
            let wasCut = false;
            if (cutIndex !== -1) {
                blocks = blocks.slice(0, cutIndex);
                wasCut = true;
            }

            // body building part 
            const bodyHtml = blocks.map(function(block) {
                if (block.startsWith('## ')) {
                    return `<h2 class="page-subtitle">${block.slice(3)}</h2>`;
                }
                // Turn single line breaks within a block into visible <br> breaks,
                // instead of letting the browser silently swallow them.
                const withBreaks = block.replace(/\n/g, '<br>');
                return `<p>${withBreaks}</p>`;
            }).join('');

            pageWrapper.innerHTML = `
                <div class="page">
                <h1 class="page-title">${piece.title}</h1>
                ${piece.subtitle ? `<p class="page-subtitle-line">${piece.subtitle}</p>` : ''}
                <div class="page-body">${bodyHtml}</div>
                ${piece.substackUrl
                    ? `<button class="substack-btn" onclick="window.open('${piece.substackUrl}', '_blank')">
                        ${wasCut ? 'Continue reading on Substack ↗' : 'Read more on Substack ↗'}
                    </button>`
                    : ''
                }
                <div class="page-footer">
                    <span>${piece.date}</span>
                    <span>${blocks.length} paragraph${blocks.length === 1 ? '' : 's'}</span>
                </div>
                </div>
            `;

            listLayer.classList.add('hidden');
            pageLayer.classList.remove('hidden');
            })
            .catch(function() {
            pageWrapper.innerHTML = `<div class="page"><p>Couldn't load this piece — check the file path in writingData.</p></div>`;
            listLayer.classList.add('hidden');
            pageLayer.classList.remove('hidden');
            });
    }

  // --- Back button + sidebar Home both return to the list ---
  function showList() {
    pageLayer.classList.add('hidden');
    listLayer.classList.remove('hidden');
  }
  backBtn.addEventListener('click', showList);
  navHome.addEventListener('click', showList);

  // --- Toast helper, reusable for any dead-end click ---
  let toastTimeout;
  function showToast(message) {
    clearTimeout(toastTimeout);
    toast.textContent = message;
    toast.classList.add('visible');
    toastTimeout = setTimeout(function() {
      toast.classList.remove('visible');
    }, 2200);
  }

  // --- "New" — a joke dead-end ---
  navNew.addEventListener('click', function() {
    showToast('coming... eventually 🫠');
  });

  // --- Substack — real external link ---
  navSubstack.addEventListener('click', function() {
    window.open(SUBSTACK_URL, '_blank');
  });

  // --- Drafts — locked, fake password ---
  navDrafts.addEventListener('click', function() {
    passwordResult.textContent = '';
    passwordInput.value = '';
    passwordModal.classList.add('visible');
  });

  passwordClose.addEventListener('click', function() {
    passwordModal.classList.remove('visible');
  });

  passwordModal.addEventListener('click', function(e) {
    if (e.target === passwordModal) {
      passwordModal.classList.remove('visible');
    }
  });

  passwordSubmit.addEventListener('click', function() {
    passwordResult.textContent = 'sike... not opening 💅';
  });

  passwordInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') passwordSubmit.click();
  });
}