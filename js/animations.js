// =============================================
// animations.js
// Purpose: Generate grass blades, flowers,
//          and wind particles dynamically.
//
// New concepts:
//   - Math.random() for organic variation
//   - createElement + appendChild
//   - Setting CSS custom properties via JS
//   - element.style.setProperty()
// =============================================


// --- HELPER: Random number in a range ---
//
// We'll use this constantly to get natural variation.
// Instead of every blade being 20px tall, they'll be
// anywhere from 15px to 35px.
//
function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
  /*
    Math.random() → 0 to 1
    Multiply by range (max - min) → 0 to range
    Add min → min to max
    
    Example: randomBetween(15, 35)
    Math.random() = 0.6
    0.6 * (35-15) = 0.6 * 20 = 12
    12 + 15 = 27  ← a random number between 15 and 35
  */
}


// --- HELPER: Random item from an array ---
//
function randomFrom(array) {
  return array[Math.floor(Math.random() * array.length)];
  /*
    Math.floor() rounds DOWN to the nearest integer.
    Math.random() * array.length → 0 to length (decimal)
    Math.floor() → 0 to length-1 (integer)
    This gives us a valid random array index.
  */
}


// ============================================
// GRASS BLADES
// ============================================

function generateGrass() {
  const container = document.getElementById('grassContainer');
  if (!container) return;

  const bladeCount = 400;
  /*
    120 blades spread across the full width.
    Enough to look dense without hurting performance.
  */

  for (let i = 0; i < bladeCount; i++) {
    /*
      for loop: runs bladeCount times.
      let i = 0    → start at 0
      i < bladeCount → keep going while i is less than 120
      i++          → add 1 each time
    */
    const topPos = randomBetween(0, 90);
    const blade = document.createElement('div');
    blade.classList.add('grass-blade');
    /*
      Create a new div and give it the grass-blade class.
      It has no styles yet — we add those next.
    */

    // Random properties for this blade
    const height   = randomBetween(15, 45);
    const leftPos  = randomBetween(0, 100);
    const swayLeft  = -randomBetween(2, 6);
    const swayRight =  randomBetween(2, 6);
    const duration  = randomBetween(2, 5);
    const delay     = randomBetween(0, 3);
    const width     = randomBetween(2, 4);
    const opacity   = randomBetween(0.7, 1);

    // Apply styles directly
    blade.style.height  = height + 'px';
    blade.style.left    = leftPos + '%';
    blade.style.width   = width + 'px';
    blade.style.opacity = opacity;
    blade.style.top = topPos + '%';

    // Set CSS custom properties on the element
    blade.style.setProperty('--sway-left',     swayLeft + 'deg');
    blade.style.setProperty('--sway-right',    swayRight + 'deg');
    blade.style.setProperty('--sway-duration', duration + 's');
    blade.style.setProperty('--sway-delay',    delay + 's');
    /*
      style.setProperty('--variable-name', value) sets a
      CSS custom property directly on this element.
      The CSS animation reads these variables, so each blade
      moves differently. This is the key to organic variation.
    */

    container.appendChild(blade);
    /*
      appendChild adds the blade to the container.
      It now appears in the DOM and the CSS animation runs.
    */
  }
}


// ============================================
// FLOWERS
// ============================================

const flowerColors = [
  '#FFB6C1',  /* soft pink */
  '#FF6EB4',  /* hot pink */
  '#FFD700',  /* yellow */
  '#FFFFFF',  /* white */
  '#DDA0DD',  /* plum/purple */
  '#FF9999',  /* coral pink */
  '#B8E4B8',  /* pale green */
];

function generateFlowers() {
  const container = document.getElementById('flowersContainer');
  if (!container) return;

  const flowerCount = 40;

  for (let i = 0; i < flowerCount; i++) {
    const flower     = document.createElement('div');
    const stem       = document.createElement('div');
    const head       = document.createElement('div');
    const topPos = randomBetween(0, 85);
    flower.style.top = topPos + '%';

    flower.classList.add('flower');
    stem.classList.add('flower-stem');
    head.classList.add('flower-head');

    // Random properties
    const stemHeight  = randomBetween(12, 30);
    const flowerSize  = randomBetween(6, 12);
    const leftPos     = randomBetween(2, 98);
    const bobDuration = randomBetween(3, 6);
    const bobDelay    = randomBetween(0, 4);
    const color       = randomFrom(flowerColors);

    // Apply to stem
    stem.style.height = stemHeight + 'px';

    // Apply to head
    head.style.setProperty('--flower-size',  flowerSize + 'px');
    head.style.setProperty('--flower-color', color);
    head.style.width  = flowerSize + 'px';
    head.style.height = flowerSize + 'px';
    head.style.background = color;

    // Apply to flower wrapper
    flower.style.left = leftPos + '%';
    flower.style.setProperty('--bob-duration', bobDuration + 's');
    flower.style.setProperty('--bob-delay',    bobDelay + 's');

    // Build the flower: head on top, stem below
    flower.appendChild(head);
    flower.appendChild(stem);
    container.appendChild(flower);
    /*
      appendChild order matters here!
      head first = head at top visually (flex column).
      stem second = stem below the head.
      Then flower goes into the container.
    */
  }
}

// ============================================
// WIND PARTICLES
// ============================================

function generateParticles() {
  const container = document.getElementById('windParticles');
  if (!container) return;

  const particleCount = 25;

  const particleColors = [
    'rgba(255, 255, 255, 0.5)',   /* white pollen */
    'rgba(255, 182, 193, 0.4)',   /* pink blossom */
    'rgba(255, 215, 0, 0.3)',     /* golden dust */
  ];

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    const size     = randomBetween(2, 5);
    const startX   = randomBetween(0, 100);
    const startY   = randomBetween(30, 90);
    const driftX   = randomBetween(80, 250);
    const driftY   = randomBetween(-120, -20);
    const duration = randomBetween(6, 14);
    const delay    = randomBetween(0, 10);
    const opacity  = randomBetween(0.2, 0.5);
    const color    = randomFrom(particleColors);

    particle.style.width   = size + 'px';
    particle.style.height  = size + 'px';
    particle.style.left    = startX + '%';
    particle.style.top     = startY + '%';
    particle.style.background = color;

    particle.style.setProperty('--drift-x',        driftX + 'px');
    particle.style.setProperty('--drift-y',         driftY + 'px');
    particle.style.setProperty('--drift-duration',  duration + 's');
    particle.style.setProperty('--drift-delay',     delay + 's');
    particle.style.setProperty('--particle-opacity', opacity);

    container.appendChild(particle);
  }
}


// ============================================
// RUN EVERYTHING
// ============================================

generateGrass();
generateFlowers();
generateParticles();
/*
  These three calls happen as soon as the script loads.
  By the time the user sees the desktop (after boot screen),
  all 120 grass blades, 18 flowers, and 25 particles
  are already generated and animating.
*/