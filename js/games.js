function initGamesWindow(content) {
  const gateQuestion = content.querySelector('#gate-question');
  const gateButtons = content.querySelector('#gate-buttons');
  const gateResponse = content.querySelector('#gate-response');
  const gateScreen = content.querySelector('#gate-screen');
  const menuScreen = content.querySelector('#menu-screen');

  const responses = {
    tired: "ok diva. knock yourself out.",
    mistake: "period. get your money up not your funny up."
  };

  const buttons = content.querySelectorAll('.gate-btn');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const choice = btn.dataset.choice;

        gateQuestion.classList.add('hidden');
        gateButtons.classList.add('hidden');
        gateResponse.textContent = responses[choice];
        gateResponse.classList.remove('hidden');

        if (choice === 'mistake') {
          // Serious person — close the window instead of continuing to the menu
          setTimeout(() => {
            const gamesWindow = content.closest('.window');
            if (gamesWindow) closeWindow(gamesWindow.id);
          }, 1400);
          return;
        }

        setTimeout(() => {
          gateScreen.classList.add('fade-out');

          setTimeout(() => {
            gateScreen.classList.add('hidden');
            menuScreen.classList.remove('hidden');
          }, 400);

        }, 1200);
      });
    });

    // ----- Tic Tac Toe -----
    const tttScreen = content.querySelector('#tictactoe-screen');
    const tttCells = content.querySelectorAll('.ttt-cell');
    const tttResult = content.querySelector('#ttt-result');
    const tttResultText = content.querySelector('#ttt-result-text');
    const tttBoard = content.querySelector('#ttt-board');

    let board = Array(9).fill(null);
    let gameOver = false;

    const winPatterns = [
      [0,1,2], [3,4,5], [6,7,8], // rows
      [0,3,6], [1,4,7], [2,5,8], // columns
      [0,4,8], [2,4,6]           // diagonals
    ];

    function getWinningPattern(b, player) {
      return winPatterns.find(pattern =>
        pattern.every(index => b[index] === player)
      );
    }

    function checkWinner(b, player) {
      return !!getWinningPattern(b, player);
    }

    function getComputerMove() {
      // 1. Can computer win this turn?
      for (let i = 0; i < 9; i++) {
        if (!board[i]) {
          const testBoard = [...board];
          testBoard[i] = 'O';
          if (checkWinner(testBoard, 'O')) return i;
        }
      }

      // 2. Does computer need to block the player?
      for (let i = 0; i < 9; i++) {
        if (!board[i]) {
          const testBoard = [...board];
          testBoard[i] = 'X';
          if (checkWinner(testBoard, 'X')) return i;
        }
      }

      // 3. Prefer center, then corners, then edges
      const preferredOrder = [4, 0, 2, 6, 8, 1, 3, 5, 7];
      return preferredOrder.find(i => !board[i]);
    }

    const lineClasses = {
      '0,1,2': 'ttt-line-row0',
      '3,4,5': 'ttt-line-row1',
      '6,7,8': 'ttt-line-row2',
      '0,3,6': 'ttt-line-col0',
      '1,4,7': 'ttt-line-col1',
      '2,5,8': 'ttt-line-col2',
      '0,4,8': 'ttt-line-diag',
      '2,4,6': 'ttt-line-anti'
    };

    const tttLine = content.querySelector('#ttt-line');

    function endGame(message, winningPattern) {
      gameOver = true;
      tttResultText.textContent = message;
      tttResult.classList.remove('hidden');
      tttCells.forEach(cell => cell.disabled = true);

      if (winningPattern) {
        const className = lineClasses[winningPattern.join(',')];
        tttLine.className = className; // reset + apply new class
        tttLine.classList.remove('hidden');
      }
    }

    function playerMove(index) {
      if (gameOver || board[index]) return;

      board[index] = 'X';
      tttCells[index].textContent = 'X';

      if (checkWinner(board, 'X')) {
        endGame("you win. shocking, truly.", getWinningPattern(board, 'X'));
        launchConfetti();
        return;
      }
      if (board.every(cell => cell)) {
        endGame("draw. how anticlimactic.");
        return;
      }

      setTimeout(() => {
        const compIndex = getComputerMove();
        board[compIndex] = 'O';
        tttCells[compIndex].textContent = 'O';

        if (checkWinner(board, 'O')) {
          endGame("i win. get better.", getWinningPattern(board, 'O'));
          return;
        }
        if (board.every(cell => cell)) {
          endGame("draw. how anticlimactic.");
        }
      }, 500);
    }

    tttCells.forEach(cell => {
      cell.addEventListener('click', () => {
        playerMove(parseInt(cell.dataset.index));
      });
    });

    function resetTicTacToe() {
      board = Array(9).fill(null);
      gameOver = false;
      tttCells.forEach(cell => {
        cell.textContent = '';
        cell.disabled = false;
      });
      tttResult.classList.add('hidden');
      tttLine.classList.add('hidden');
    }

    const confettiContainer = content.querySelector('#ttt-confetti');
    const colors = ['#ff8fc7', '#ffd9ec', '#ffffff', '#ff5fa8'];

    function launchConfetti() {
      confettiContainer.innerHTML = '';
      for (let i = 0; i < 150; i++) {
        const piece    = document.createElement('div');
        piece.classList.add('confetti-piece');
        const color    = colors[Math.floor(Math.random() * colors.length)];
        const size     = Math.random() * 10 + 6;
        const shape    = Math.random() > 0.5 ? '50%' : '0%';
        piece.style.background   = color;
        piece.style.left         = Math.random() * 100 + '%';
        piece.style.bottom       = '0px';
        piece.style.width        = size + 'px';
        piece.style.height       = size + 'px';
        piece.style.borderRadius = shape;
        piece.style.setProperty('--fall-duration', (Math.random() * 1.2 + 1) + 's');
        piece.style.setProperty('--fall-delay',    (Math.random() * 0.6) + 's');
        confettiContainer.appendChild(piece);
      }
      setTimeout(() => confettiContainer.innerHTML = '', 3000);
    }

    content.querySelector('#ttt-play-again').addEventListener('click', resetTicTacToe);

    content.querySelector('#ttt-back-to-menu').addEventListener('click', () => {
      resetTicTacToe();
      tttScreen.classList.add('hidden');
      menuScreen.classList.remove('hidden');
    });

  // Menu screen -> game selection
  const menuButtons = content.querySelectorAll('.menu-card');

  menuButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const game = btn.dataset.game;
      if (game === 'tictactoe') {
        menuScreen.classList.add('hidden');
        tttScreen.classList.remove('hidden');
      } else if (game === 'whackashroom') {
        menuScreen.classList.add('hidden');
        wasScreen.classList.remove('hidden');
        wasStartGame();
      }
    });
  });

    // ----- Whack-a-Shroom -----
  const wasScreen = content.querySelector('#whackashroom-screen');
  const wasHoles = content.querySelectorAll('.was-hole');
  const wasScoreDisplay = content.querySelector('#was-score');
  const wasTimerDisplay = content.querySelector('#was-timer');
  const wasResult = content.querySelector('#was-result');
  const wasResultText = content.querySelector('#was-result-text');
  const wasHighscoreText = content.querySelector('#was-highscore-text');

  let wasScore = 0;
  let wasTimeLeft = 30;
  let wasSpawnTimeout = null;
  let wasCountdownInterval = null;
  let wasActiveHoles = new Set();

  function wasGetSpawnDelay() {
    const delay = 1100 - (wasScore * 20);
    return Math.max(delay, 400); 
  }

  function wasRemoveMushroom(hole) {
    hole.innerHTML = '';
    wasActiveHoles.delete(hole);
    clearTimeout(hole._despawnTimeout);
  }

  function wasSpawnMushroom() {
    const emptyHoles = [...wasHoles].filter(hole => !wasActiveHoles.has(hole));
    if (emptyHoles.length === 0) return;

    const hole = emptyHoles[Math.floor(Math.random() * emptyHoles.length)];
    const isBad = Math.random() < 0.1; // 10% chance red

    const img = document.createElement('img');
    img.src = isBad
      ? 'assets/images/games/mushroom-bad.png'
      : 'assets/images/games/mushroom-good.png';
    img.dataset.type = isBad ? 'bad' : 'good';

    hole.appendChild(img);
    wasActiveHoles.add(hole);

    hole._despawnTimeout = setTimeout(() => {
      wasRemoveMushroom(hole);
    }, 1000);
  }

  function wasHandleClick(hole) {
    const img = hole.querySelector('img');
    if (!img) return;

    wasScore += img.dataset.type === 'good' ? 1 : -1;
    wasScoreDisplay.textContent = `score: ${wasScore}`;
    wasRemoveMushroom(hole);
  }

  wasHoles.forEach(hole => {
    hole.addEventListener('click', () => wasHandleClick(hole));
  });

  function wasStartSpawning() {
    function loop() {
      wasSpawnMushroom();
      wasSpawnTimeout = setTimeout(loop, wasGetSpawnDelay());
    }
    loop();
  }

  function wasStartGame() {
    wasScore = 0;
    wasTimeLeft = 30;
    wasScoreDisplay.textContent = `score: ${wasScore}`;
    wasTimerDisplay.textContent = `time: ${wasTimeLeft}`;
    wasResult.classList.add('hidden');

    wasStartSpawning();

    wasCountdownInterval = setInterval(() => {
      wasTimeLeft--;
      wasTimerDisplay.textContent = `time: ${wasTimeLeft}`;
      if (wasTimeLeft <= 0) {
        wasEndGame();
      }
    }, 1000);
  }

  function wasEndGame() {
    clearTimeout(wasSpawnTimeout);
    clearInterval(wasCountdownInterval);
    wasHoles.forEach(hole => wasRemoveMushroom(hole));

    wasResultText.textContent = wasScore < 0
      ? "pathetic."
      : `you whacked your way to ${wasScore}.`;

    const storedHigh = parseInt(localStorage.getItem('whackHighScore') || '0');
    if (wasScore > storedHigh) {
      localStorage.setItem('whackHighScore', wasScore);
      wasHighscoreText.textContent = `new high score: ${wasScore}!`;
    } else {
      wasHighscoreText.textContent = `high score: ${storedHigh}`;
    }

    wasResult.classList.remove('hidden');
  }

  function wasReset() {
    clearTimeout(wasSpawnTimeout);
    clearInterval(wasCountdownInterval);
    wasHoles.forEach(hole => wasRemoveMushroom(hole));
    wasResult.classList.add('hidden');
  }

  content.querySelector('#was-play-again').addEventListener('click', () => {
    wasReset();
    wasStartGame();
  });

  content.querySelector('#was-back-to-menu').addEventListener('click', () => {
    wasReset();
    wasScreen.classList.add('hidden');
    menuScreen.classList.remove('hidden');
  });


  // Reset gate back to its starting state
  function resetToGate() {
    gateScreen.classList.remove('hidden', 'fade-out');
    gateQuestion.classList.remove('hidden');
    gateButtons.classList.remove('hidden');
    gateResponse.classList.add('hidden');
    gateResponse.textContent = '';

    menuScreen.classList.add('hidden');

    tttScreen.classList.add('hidden');
    resetTicTacToe();

    wasScreen.classList.add('hidden');
    wasReset();
  }

  const gamesWindow = content.closest('.window');
  const closeBtn = gamesWindow ? gamesWindow.querySelector('.close-btn') : null;
  if (closeBtn) closeBtn.addEventListener('click', resetToGate);
}