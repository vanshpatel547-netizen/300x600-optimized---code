import { PageBlock } from './pageContainer.js';
import { ThumbBlock } from './thumbContainer.js';

let loader, stage, root;
let idleTimer = null;
let page1, page2, page3, page4, page5, page6;
const ANIMATION_DELAY = 4000;

// Individual page configurations
const page1Config = {
    bgAsset: "0_bg_plain",
    headerAsset: "0_header",
    subtxtAsset: "0_subtxt",
    circle: { asset: "0_circle_txt", x: 0, y: 0 },
    headerOffset: -80,
    subtxtOffset: 80
};

const page2Config = {
    bgColor: "#1062A4",
    lineAsset: "1_line",
    numAsset: "1_num",
    headerAsset: "1_header",
    subtxtAsset: "1_subtxt",
    circle: { asset: "circle_txt", x: 105, y: 12 },
    headerOffset: -50,
    subtxtOffset: -60,
    icon: { asset: "1_icon", x: 51, y: 194, rotation: -1 },
    animateIcon: (icon, startX, startY) => {
        createjs.Tween.get(icon)
            .to({ y: startY - 5, rotation: -3 }, ANIMATION_DELAY / 3, createjs.Ease.sineInOut)
            .to({ y: startY + 3, rotation: 3 }, ANIMATION_DELAY / 3, createjs.Ease.sineInOut)
            .to({ y: startY, rotation: -1 }, ANIMATION_DELAY / 3, createjs.Ease.sineInOut);
    }
};

const page3Config = {
    bgColor: "#825084",
    lineAsset: "2_line",
    numAsset: "2_num",
    headerAsset: "2_header",
    subtxtAsset: "2_subtxt",
    circle: { asset: "circle_txt", x: 105, y: 12 },
    headerOffset: 50,
    subtxtOffset: -42,
    icon: { asset: "2_icon", x: 52, y: 201 },
    animateIcon: (icon, startX, startY) => {
        createjs.Tween.get(icon, { loop: true })
            .to({ y: startY - 12, scaleX: 1.01, scaleY: 1.01 }, ANIMATION_DELAY / 2, createjs.Ease.sineInOut)
            .to({ y: startY, scaleX: 1, scaleY: 1 }, ANIMATION_DELAY / 2, createjs.Ease.sineInOut);
    }
};

const page4Config = {
    bgColor: "#F6A027",
    lineAsset: "3_line",
    numAsset: "3_num",
    headerAsset: "3_header",
    subtxtAsset: "3_subtxt",
    circle: { asset: "circle_txt", x: 105, y: 12 },
    headerOffset: -60,
    subtxtOffset: -50,
    icon: { asset: "3_icon", x: 10, y: 139, rotation: -4 },
    animateIcon: (icon, startX, startY) => {
        createjs.Tween.get(icon)
            .to({ y: startY - 7, rotation: 4 }, ANIMATION_DELAY / 2, createjs.Ease.sineInOut)
            .to({ y: startY, rotation: -4 }, ANIMATION_DELAY / 2, createjs.Ease.sineInOut);
    }
};

const page5Config = {
    bgColor: "#6ABFA5",
    lineAsset: "4_line",
    numAsset: "4_num",
    headerAsset: "4_header",
    subtxtAsset: "4_subtxt",
    circle: { asset: "circle_txt", x: 105, y: 12 },
    headerOffset: 50,
    subtxtOffset: 50,
    icon: { asset: "4_icon", x: -67, y: 156 },
    animateIcon: (icon, startX, startY) => {
        createjs.Tween.get(icon)
            .to({ y: startY - 6, scaleX: 1.02, scaleY: 1.02 }, ANIMATION_DELAY / 2, createjs.Ease.sineInOut)
            .to({ y: startY, scaleX: 1, scaleY: 1 }, ANIMATION_DELAY / 2, createjs.Ease.sineInOut);
    }
};

const page6Config = {
    bgColor: "#1062A4",
    lineAsset: "5_line",
    numAsset: "5_num",
    headerAsset: "5_header",
    subtxtAsset: "5_subtxt",
    circle: { asset: "circle_txt", x: 105, y: 12 },
    headerOffset: -60,
    subtxtOffset: 50,
    icon: { asset: "5_icon", x: -1, y: 124 },
    animateIcon: (icon, startX, startY) => {
        createjs.Tween.get(icon)
            .to({ x: startX - 15 }, ANIMATION_DELAY / 2, createjs.Ease.sineInOut)
            .to({ x: startX }, ANIMATION_DELAY / 2, createjs.Ease.sineInOut);
    }
};

// Central layout and page configurations
const CONFIG = {
    width: 300,
    height: 600,

    // Dimensions and layout properties for sidebar thumbnails
    thumb: {
        width: 84,
        height: 126,
        gap: 11,
        scaleX: 0.28,
        scaleY: 0.28,
        startX: 10,
        startY: 12,
        borderRadius: 9.5,
        borderWidth: 3,
        direction: "horizontal",
        sidebarX: 0,
        sidebarY: 450
    },

    // Dynamic configuration for each of the banner's pages
    pages: [
        page1Config,
        page2Config,
        page3Config,
        page4Config,
        page5Config,
        page6Config
    ]
};

// Triggers the banner click-through redirection URL
function callClick(n) {
    let initialClickURL = '';
    const finalClickURL = 'https://russpass.ru/igrai-v-moskvu?utm_source=solta&utm_medium=cpm&utm_campaign=tur_mi_summer_26_ru(mix)_Igrai_v_Moskvu_UIDln0dp2&utm_content=banner';

    if (initialClickURL === '') {
        window.open(finalClickURL, '_blank');
    } else {
        const tracker = new Image();
        tracker.src = initialClickURL;
        window.open(finalClickURL, '_blank');
    }
}

// Adds an invisible full-screen CTA overlay to capture clicks
function addRedirectionRect() {
    addRectangleForCTA(stage, CONFIG.width / 2, CONFIG.height / 2, CONFIG.width, CONFIG.height, "#000000", 0.01, () => {
        callClick();
    });
}

// Helper to create a clickable CTA rectangle shape
function addRectangleForCTA(container, x, y, width, height, color, alpha, callback) {
    alpha = 0.01;
    const rect = new createjs.Shape();
    rect.graphics.beginFill(color).drawRect(0, 0, width, height);
    rect.alpha = alpha !== undefined ? alpha : 1;
    rect.x = x - width / 2;
    rect.y = y - height / 2;
    rect.cursor = "pointer";
    container.addChild(rect);

    if (typeof callback === "function") {
        rect.on("click", callback);
    }
    return rect;
}

// Primary entrypoint to initialize and construct the entire banner
export function buildBanner(loaderArg, stageArg) {
    loader = loaderArg;
    stage = stageArg;

    // Create stage container to hold pages
    root = new createjs.Container();
    stage.addChild(root);

    addRedirectionRect();

    // Initialize the page block (300x450 page area)
    const pageBlock = new PageBlock(loader, CONFIG);
    pageBlock.init(root);

    // Assign separate page variables
    page1 = pageBlock.pages[0];
    page2 = pageBlock.pages[1];
    page3 = pageBlock.pages[2];
    page4 = pageBlock.pages[3];
    page5 = pageBlock.pages[4];
    page6 = pageBlock.pages[5];

    // Initialize the thumbnail block (300x150 scrollable navigation area)
    const thumbBlock = new ThumbBlock(
        loader,
        stage,
        CONFIG,
        (index) => {
            switchToPage(index);
        },
        () => {
            resetIdleTimer();
        }
    );
    thumbBlock.init();

    // Add disclaimer text image
    const disclaimerTxt = new createjs.Bitmap(loader.getResult("disclaimer"));
    stage.addChild(disclaimerTxt);
    disclaimerTxt.x = 0;
    disclaimerTxt.y = 0;
    disclaimerTxt.alpha = 0;
    createjs.Tween.get(disclaimerTxt, { loop: false })
        .to({ alpha: 1 }, 1000);

    createjs.Touch.enable(stage);

    function switchToPage(index) {
        pageBlock.switchToPage(index);
        thumbBlock.updateFrameHighlights(index);
        thumbBlock.scrollThumbnailIntoView(index);
    }

    function resetIdleTimer() {
        if (idleTimer) {
            clearTimeout(idleTimer);
        }
        idleTimer = setTimeout(autoSwitchNext, 5000);
    }

    function autoSwitchNext() {
        let currentIndex = -1;
        for (let i = 0; i < pageBlock.pages.length; i++) {
            if (pageBlock.pages[i].visible) {
                currentIndex = i;
                break;
            }
        }

        const nextIndex = (currentIndex + 1) % pageBlock.pages.length;
        switchToPage(nextIndex);
        resetIdleTimer();
    }

    // Start tick updates
    createjs.Ticker.framerate = 60;
    createjs.Ticker.on("tick", stage);

    // Show page 1 initially
    switchToPage(0);

    // Start auto-rotation idle timer
    resetIdleTimer();
}
