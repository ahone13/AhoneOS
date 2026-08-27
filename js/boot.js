// =============================================
// boot.js
// Purpose: Control the boot screen timing.
// Concepts used: querySelector, setTimeout,
//                classList, arrays, variables
// =============================================


// --- STEP 1: Find our HTML elements ---
//
// document.querySelector() searches the page for an element
// and returns it so we can do things to it.
// It works exactly like CSS selectors — # for ID, . for class.
//
const bootScreen = document.querySelector('#bootScreen');
const bootStatus = document.querySelector('#bootStatus');
//
// We stored them in "const" variables.
// const = constant. The variable won't be reassigned.
// Think of it as giving a name to something you found.


// --- STEP 2: Status messages to cycle through ---
//
// This is an array — an ordered list of values.
// Arrays use square brackets []. Each item is separated by a comma.
//
const statusMessages = [
  'Initializing AhoneOS...',
  'Loading system files...',
  'Calibrating pixels...',
  'Watering the flowers...',   // a little personality 🌸
  'Almost ready...'
];


// --- STEP 3: Cycle through the status messages ---
//
// We'll update the status text every 500ms (half a second).
// This uses setInterval — like setTimeout but repeats.
//
let messageIndex = 0;
//
// "let" is like "const" but the value CAN change.
// We use let here because messageIndex will increase over time.

const statusInterval = setInterval(function() {
  //
  // setInterval runs this function repeatedly, every 500ms.
  //
  // .textContent changes the visible text of an element.
  bootStatus.textContent = statusMessages[messageIndex];
  //
  // statusMessages[messageIndex] reads the array at position
  // messageIndex. Arrays start at 0, so:
  // messageIndex 0 = 'Initializing AhoneOS...'
  // messageIndex 1 = 'Loading system files...'  etc.

  messageIndex++;
  // ++ means "add 1 to this variable". messageIndex goes 0,1,2,3,4...

  if (messageIndex >= statusMessages.length) {
    clearInterval(statusInterval);
    // Stop the interval when we've shown all messages.
    // .length gives us how many items are in the array (5).
  }

}, 500); // ← runs every 500 milliseconds


// --- STEP 4: Hide the boot screen after 3.5 seconds ---
//
setTimeout(function() {
  //
  // setTimeout runs this function ONCE after the delay.
  // 3500ms = 3.5 seconds — enough time for the loader to finish.
  //
  bootScreen.classList.add('hidden');
  //
  // classList.add() adds a CSS class to an element.
  // We're adding "hidden" to bootScreen.
  // Remember in our CSS: .boot-screen.hidden { opacity: 0; }
  // CSS sees the new class and triggers the fade transition.
  // JavaScript flipped the switch. CSS did the animation.
  //

}, 3500);