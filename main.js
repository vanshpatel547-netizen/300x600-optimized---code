/**
 * main.js - Banner initialization orchestrator
 * Imports modular components for CreateJS loading, asset management, and animations.
 */

import { waitForCreateJS } from './src/init.js';
import { setupAssets } from './src/assets.js';
import { buildBanner } from './src/animations.js';

// Mode will be replaced by build script
let MODE = null;

waitForCreateJS(() => {
    const stage = new createjs.Stage("bannerCanvas");
    const loader = new createjs.LoadQueue();

    setupAssets(stage, loader, MODE);
    loader.on("complete", () => buildBanner(loader, stage));
});