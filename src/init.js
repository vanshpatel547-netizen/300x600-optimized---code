/**
 * init.js - Wait for CreateJS library to load
 */

export function waitForCreateJS(callback) {
    if (window.createjs && window.createjs.Stage) {
        callback();
    } else {
        setTimeout(() => waitForCreateJS(callback), 30);
    }
}
