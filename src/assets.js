/**
 * assets.js - Load banner assets based on build mode
 */

export function getManifest(mode) {
    const files = [
        "0_bg_plain.jpg",
        "0_header.png",
        "0_subtxt.png",
        "1_header.png",
        "1_icon.png",
        "1_line.png",
        "1_num.png",
        "1_subtxt.png",
        "2_header.png",
        "2_icon.png",
        "2_line.png",
        "2_num.png",
        "2_subtxt.png",
        "3_header.png",
        "3_icon.png",
        "3_line.png",
        "3_num.png",
        "3_subtxt.png",
        "4_header.png",
        "4_icon.png",
        "4_line.png",
        "4_num.png",
        "4_subtxt.png",
        "5_header.png",
        "5_icon.png",
        "5_line.png",
        "5_num.png",
        "5_subtxt.png",
        "0_circle_txt.png",
        "circle_txt.png",
        "disclaimer.png",
    ];

    const idFromName = (name) => name.replace(/\.[^.]+$/, '');

    if (mode === 'inline') {
        return files.map((name) => ({ id: idFromName(name), src: `BASE64_${idFromName(name)}`, type: 'image' }));
    } else if (mode === 'external') {
        const base = 'https://static.kimberlite.io/upload/pigeon/300x600/variant_1';
        return files.map((name) => ({ id: idFromName(name), src: `${base}/${name}` }));
    } else if (mode === 'external_relative') {
        return files.map((name) => ({ id: idFromName(name), src: `./${name}`, type: 'image' }));
    } else {
        // Default: assets in assets/ subdirectory
        return files.map((name) => ({ id: idFromName(name), src: `./assets/${name}`, type: 'image' }));
    }
}

export function setupAssets(stage, loader, mode) {
    const manifest = getManifest(mode);
    loader.loadManifest(manifest);
}
