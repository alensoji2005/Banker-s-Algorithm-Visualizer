// js/main.js updated

// Import the UI and Algorithm modules
import { createTables, getInputs } from './ui.js';
import { BankersAlgorithm } from './bankers.js';
import { Animation } from './animation.js';

// --- DOM Element References ---
const numProcessesInput = document.getElementById('num-processes');
const numResourcesInput = document.getElementById('num-resources');
const runBtn = document.getElementById('btn-run');
const canvas = document.getElementById('animation-canvas');
const logEl = document.getElementById('log');
const safeSeqEl = document.getElementById('safe-sequence');
const safeSeqOutputEl = document.getElementById('safe-sequence-output'); // Get the parent box

// --- Control Buttons ---
const playPauseBtn = document.getElementById('btn-play-pause');
const stepBackBtn = document.getElementById('btn-step-backward');
const stepFwdBtn = document.getElementById('btn-step-forward');
const speedSlider = document.getElementById('speed-slider');
const exportBtn = document.getElementById('btn-export-png');

// --- State ---
let numProcesses = 0;
let numResources = 0;
let algorithmInstance = null;
let animationInstance = null;

// --- Event Listeners ---

// 1. Create Tables (Automatically)
function handleTableCreation() {
    numProcesses = parseInt(numProcessesInput.value);
    numResources = parseInt(numResourcesInput.value);
    if (isNaN(numProcesses) || isNaN(numResources) || numProcesses <= 0 || numResources <= 0) {
        log("Please enter valid, positive numbers for processes and resources.");
        return;
    }
    createTables(numProcesses, numResources);
    log('Tables created. Please fill in the values.');
}

// Add listeners to the number inputs to auto-generate tables
numProcessesInput.addEventListener('change', handleTableCreation);
numResourcesInput.addEventListener('change', handleTableCreation);

// 2. Run Algorithm
runBtn.addEventListener('click', () => {
    // Clear previous results
    safeSeqOutputEl.classList.remove('flash-green', 'flash-red');
    safeSeqEl.textContent = '';
    animationInstance = null;
    
    try {
        const inputs = getInputs(numProcesses, numResources);
        
        // Initialize the algorithm
        algorithmInstance = new BankersAlgorithm(inputs);
        
        // Get the steps from the algorithm
        const steps = algorithmInstance.run();
        const safeSequence = algorithmInstance.safeSequence;
        
        if (safeSequence.length === numProcesses) {
            safeSeqEl.textContent = safeSequence.map(p => `P${p}`).join(' -> ');
            log('System is in a SAFE state.');
            void safeSeqOutputEl.offsetWidth; // Trigger reflow
            safeSeqOutputEl.classList.add('flash-green');
        } else {
            safeSeqEl.textContent = 'None. System is in an UNSAFE state.';
            log('System is in an UNSAFE state.');
            void safeSeqOutputEl.offsetWidth; // Trigger reflow
            safeSeqOutputEl.classList.add('flash-red');
        }

        // Initialize the animation
        const ctx = canvas.getContext('2d');
        animationInstance = new Animation(ctx, inputs, steps);
        animationInstance.draw(); // Draw initial state

        log('Algorithm finished. Ready to animate.');

    } catch (error) {
        // This catch block is now more important
        // It will catch the error from ui.js
        log(`Error: ${error.message}`);
        console.error(error);
        safeSeqOutputEl.classList.add('flash-red');
    }
});

// 3. Animation Controls
playPauseBtn.addEventListener('click', () => {
    if (animationInstance) {
        animationInstance.togglePlay();
        // Update button text with emojis
        playPauseBtn.textContent = animationInstance.isPlaying ? '⏸️ Pause' : '▶️ Play/Pause';
    }
});
stepFwdBtn.addEventListener('click', () => animationInstance?.stepForward());
stepBackBtn.addEventListener('click', () => animationInstance?.stepBackward());
speedSlider.addEventListener('input', (e) => animationInstance?.setSpeed(e.target.value));
exportBtn.addEventListener('click', () => animationInstance?.exportPNG());


// --- Utility ---
function log(message) {
    logEl.innerHTML += `[${new Date().toLocaleTimeString()}] ${message}\n`;
    // --- THIS IS THE FIX ---
    logEl.scrollTop = logEl.scrollHeight; // Was 'logLog.scrollHeight'
}

// --- Initial Setup ---
// Trigger table creation on load
handleTableCreation();