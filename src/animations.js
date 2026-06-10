/**
 * animations.js - Build banner with animations and interactive elements
 */

let loader, stage, root;
let page1, page2, page3, page4, page5, page6;
let animationTimer = null;
let activePage = null;
const ANIMATION_DELAY = 4000;

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
        {
            bgAsset: "0_bg_plain",
            headerAsset: "0_header",
            subtxtAsset: "0_subtxt",
            circle: { asset: "0_circle_txt", x: 0, y: 0 },
            headerOffset: -80,
            subtxtOffset: 80
        },
        {
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
        },
        {
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
        },
        {
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
        },
        {
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
        },
        {
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
        }
    ]
};

// Draws a solid background rectangle for a page
function addPageBackground(parent, color) {
    const bg = new createjs.Shape();
    bg.graphics
        .beginFill(color)
        .drawRect(0, 0, CONFIG.width, CONFIG.height);
    parent.addChild(bg);
    return bg;
}

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

// Handles transitions by fading out the white overlay and fading in the page elements
function pageFadeTween(page) {
    const duration = 800;

    // Remove all previous tweens to prevent overlapping animations
    let isFirstPage = page.icon ? false : true;

    if (isFirstPage === true) {
        createjs.Tween.removeTweens(page);
        createjs.Tween.removeTweens(page.headerTxt);
        createjs.Tween.removeTweens(page.subTxt);
    } else {
        createjs.Tween.removeTweens(page);
        createjs.Tween.removeTweens(page.headerTxt);
        createjs.Tween.removeTweens(page.subTxt);
        createjs.Tween.removeTweens(page.icon);
    }

    root.bgFront.alpha = 1;
    createjs.Tween.get(root.bgFront)
        .to({ alpha: 0 }, duration + 200, createjs.Ease.quadOut);

    page.alpha = 0;
    createjs.Tween.get(page)
        .to({ alpha: 1 }, duration, createjs.Ease.quadOut);

    if (page.line) {
        page.line.alpha = 0;
        createjs.Tween.get(page.line)
            .to({ alpha: 1 }, duration, createjs.Ease.quadOut);
    }

    if (page.icon) {
        page.icon.alpha = 0;
        createjs.Tween.get(page.icon)
            .to({ alpha: 1 }, duration, createjs.Ease.quadOut);
    }

    if (page.num) {
        createjs.Tween.get(page.num)
            .to({ alpha: 1 }, duration, createjs.Ease.quadOut);
    }
}

// Dynamically creates a page container according to its CONFIG details
function createPage(parent, index) {
    const config = CONFIG.pages[index];
    const page = new createjs.Container();

    // Set up Background
    if (config.bgAsset) {
        const bg = new createjs.Bitmap(loader.getResult(config.bgAsset));
        page.addChild(bg);
    } else if (config.bgColor) {
        addPageBackground(page, config.bgColor);
    }

    // Set up optional Line asset
    if (config.lineAsset) {
        const line = new createjs.Bitmap(loader.getResult(config.lineAsset));
        page.addChild(line);
        page.line = line;
    }

    // Set up optional floating Icon
    if (config.icon) {
        const icon = new createjs.Bitmap(loader.getResult(config.icon.asset));
        icon.x = config.icon.x;
        icon.y = config.icon.y;
        if (config.icon.rotation !== undefined) {
            icon.rotation = config.icon.rotation;
        }
        page.addChild(icon);
        page.icon = icon;
    }

    // Set up Header text image
    const headerTxt = new createjs.Bitmap(loader.getResult(config.headerAsset));
    page.addChild(headerTxt);
    page.headerTxt = headerTxt;
    const headerFinalX = headerTxt.x;

    // Set up optional Page Number asset
    if (config.numAsset) {
        const num = new createjs.Bitmap(loader.getResult(config.numAsset));
        page.addChild(num);
        page.num = num;
    }

    // Set up Subtext image
    const subTxt = new createjs.Bitmap(loader.getResult(config.subtxtAsset));
    page.addChild(subTxt);
    page.subTxt = subTxt;
    const subTextFinalX = subTxt.x;

    // Set up decorative Circle Text
    let circle = null;
    if (config.circle) {
        circle = addCircle(page, config.circle.x, config.circle.y, index === 0);
    }

    // Encapsulate page entrance animation sequence
    page.runAnimation = () => {
        pageFadeTween(page);

        const elementShowDelay = 500;
        if (circle) {
            circle.alpha = 0;
            setTimeout(() => {
                circle.runAnimation();
            }, elementShowDelay);
        }

        // Starting animation positions
        headerTxt.alpha = 0;
        headerTxt.x = headerFinalX + config.headerOffset;

        subTxt.alpha = 0;
        subTxt.x = subTextFinalX + config.subtxtOffset;

        if (page.icon) {
            page.icon.alpha = 0;
            page.icon.startX = page.icon.x;
            page.icon.startY = page.icon.y;
            if (config.animateIcon) {
                config.animateIcon(page.icon, page.icon.startX, page.icon.startY);
            }
        }

        // Header slide-in tween
        createjs.Tween.get(headerTxt)
            .wait(elementShowDelay)
            .to({ x: headerFinalX, alpha: 1 }, 500, createjs.Ease.quadOut);

        // Subtext slide-in tween
        createjs.Tween.get(subTxt)
            .wait(elementShowDelay + (index === 0 ? 0 : 100))
            .to({ x: subTextFinalX, alpha: 1 }, 500, createjs.Ease.quadOut);
    };

    parent.addChild(page);
    page.visible = (index === 0);

    return page;
}

// Creates the decorative rotating/animating text circle on a page
function addCircle(parent, x = 105, y = 12, isFirstPage = false) {
    const circleTxt = new createjs.Bitmap(loader.getResult(isFirstPage ? "0_circle_txt" : "circle_txt"));
    parent.addChild(circleTxt);

    circleTxt.x = x;
    circleTxt.y = y;
    circleTxt.alpha = 0;

    circleTxt.runAnimation = () => {
        createjs.Tween.removeTweens(circleTxt);
        circleTxt.y = y - 80;
        createjs.Tween.get(circleTxt)
            .to({ alpha: 1, y: y }, 500, createjs.Ease.cubicOut);
    };

    return circleTxt;
}

// Creates a rounded mask shape to crop elements inside thumbnails
function addMask(x, y, width, height, parent, elementToMask) {
    const maskShape = new createjs.Shape();
    maskShape.graphics
        .beginFill("#00000000")
        .drawRoundRect(0, 0, width, height, CONFIG.thumb.borderRadius);

    maskShape.x = x;
    maskShape.y = y;

    parent.addChild(maskShape);
    elementToMask.mask = maskShape;
}

// Starts a looping timer that repeats the current page's animations
function startAnimationTimer(page) {
    stopAnimationTimer();
    activePage = page;
    activePage.runAnimation();

    animationTimer = setInterval(() => {
        if (!activePage) return;
        activePage.runAnimation();
    }, ANIMATION_DELAY);
}

// Stops the looping animation timer
function stopAnimationTimer() {
    if (animationTimer) {
        clearInterval(animationTimer);
        animationTimer = null;
    }
    activePage = null;
}

// Stops all animations and fully shows a container's children (used for static thumbnails)
function resetThumbToFinalState(page) {
    page.children.forEach(child => {
        child.alpha = 1;
        createjs.Tween.removeTweens(child);
    });
}

// Clamps the horizontal scroll position of the thumbnail container within bounds
function containInRange(thumbContainerX, thumbContainer) {
    const contentWidth = thumbContainer.children.length * (CONFIG.thumb.width + CONFIG.thumb.gap);
    const minX = Math.min(CONFIG.thumb.startX, (CONFIG.width + 12) - contentWidth - CONFIG.thumb.startX);

    if (thumbContainerX > CONFIG.thumb.startX) {
        thumbContainerX = CONFIG.thumb.startX;
    }
    if (thumbContainerX < minX) {
        thumbContainerX = minX;
    }
    return thumbContainerX;
}

// Clamps the vertical scroll position of the thumbnail container within bounds
function containInRangeVertical(thumbContainerY, thumbContainer) {
    const contentHeight = thumbContainer.children.length * (CONFIG.thumb.height + CONFIG.thumb.gap);
    const minY = Math.min(CONFIG.thumb.startY, (CONFIG.height + 40) - contentHeight - CONFIG.thumb.startY);

    if (thumbContainerY > CONFIG.thumb.startY) {
        thumbContainerY = CONFIG.thumb.startY;
    }
    if (thumbContainerY < minY) {
        thumbContainerY = minY;
    }
    return thumbContainerY;
}

// Primary entrypoint to initialize and construct the entire banner
export function buildBanner(loaderArg, stageArg) {
    loader = loaderArg;
    stage = stageArg;

    // Create stage container to hold pages
    root = new createjs.Container();
    stage.addChild(root);

    addRedirectionRect();

    // White rectangle to hide overflowing elements behind the thumbnail bar
    const pageMask = new createjs.Shape();
    pageMask.graphics
        .beginFill("#ffffff")
        .drawRect(
            CONFIG.thumb.direction === "horizontal" ? 0 : CONFIG.thumb.sidebarX,
            CONFIG.thumb.direction === "horizontal" ? CONFIG.thumb.sidebarY : 0,
            CONFIG.thumb.direction === "horizontal" ? CONFIG.width : CONFIG.width - CONFIG.thumb.sidebarX,
            CONFIG.thumb.direction === "horizontal" ? CONFIG.height - CONFIG.thumb.sidebarY : CONFIG.height
        );
    stage.addChild(pageMask);

    const bgWhite = new createjs.Shape();
    bgWhite.graphics
        .beginFill("#ffffff")
        .drawRect(0, 0, CONFIG.width, CONFIG.height);
    root.addChild(bgWhite);

    // Initialize all pages from CONFIG
    const pages = CONFIG.pages.map((_, i) => createPage(root, i));
    page1 = pages[0];
    page2 = pages[1];
    page3 = pages[2];
    page4 = pages[3];
    page5 = pages[4];
    page6 = pages[5];

    // White foreground fade overlay used for transitions
    const bgFront = new createjs.Shape();
    bgFront.graphics
        .beginFill("#ffffff")
        .drawRect(0, 0, CONFIG.width, CONFIG.height);
    root.addChild(bgFront);
    root.bgFront = bgFront;

    startAnimationTimer(page1);

    // Add disclaimer text image
    const disclaimerTxt = new createjs.Bitmap(loader.getResult("disclaimer"));
    stage.addChild(disclaimerTxt);
    disclaimerTxt.x = 0;
    disclaimerTxt.y = 0;
    disclaimerTxt.alpha = 0;
    createjs.Tween.get(disclaimerTxt, { loop: false })
        .to({ alpha: 1 }, 1000);

    // Set up scrolling thumbnail bar container
    const sidebar = new createjs.Container();
    sidebar.x = CONFIG.thumb.sidebarX;
    sidebar.y = CONFIG.thumb.sidebarY;
    stage.addChild(sidebar);

    const thumbContainer = new createjs.Container();
    thumbContainer.x = CONFIG.thumb.startX;
    sidebar.addChild(thumbContainer);

    createjs.Touch.enable(stage);

    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let containerStartX = 0;
    let containerStartY = 0;

    let idleTimer = null;

    function scrollThumbnailIntoView(index) {
        if (CONFIG.thumb.direction === "horizontal") {
            const wrapperX = index * (CONFIG.thumb.width + CONFIG.thumb.gap);
            const viewportWidth = CONFIG.width;
            let targetX = -wrapperX + (viewportWidth - CONFIG.thumb.width) / 2;
            targetX = containInRange(targetX, thumbContainer);
            createjs.Tween.get(thumbContainer, { override: true })
                .to({ x: targetX }, 300, createjs.Ease.quadOut);
        } else {
            const wrapperY = index * (CONFIG.thumb.height + CONFIG.thumb.gap);
            const viewportHeight = CONFIG.height - CONFIG.thumb.sidebarY;
            let targetY = -wrapperY + (viewportHeight - CONFIG.thumb.height) / 2;
            targetY = containInRangeVertical(targetY, thumbContainer);
            createjs.Tween.get(thumbContainer, { override: true })
                .to({ y: targetY }, 300, createjs.Ease.quadOut);
        }
    }

    function switchToPage(index) {
        if (pages[index].visible) return;

        pages.forEach(page => {
            page.visible = false;
        });

        pages[index].visible = true;
        startAnimationTimer(pages[index]);

        thumbContainer.children.forEach((item, idx) => {
            const itemFrame = item.getChildByName("frame");
            if (itemFrame) {
                if (idx === index) {
                    item.alpha = 1;
                    itemFrame.visible = true;
                    itemFrame.alpha = 0;
                    createjs.Tween.get(itemFrame)
                        .to({ alpha: 0.8 }, 300);
                } else {
                    itemFrame.visible = false;
                    itemFrame.alpha = 0;
                }
            }
        });

        scrollThumbnailIntoView(index);
        stage.update();
    }

    function resetIdleTimer() {
        if (idleTimer) {
            clearTimeout(idleTimer);
        }
        idleTimer = setTimeout(autoSwitchNext, 5000);
    }

    function autoSwitchNext() {
        let currentIndex = -1;
        for (let i = 0; i < pages.length; i++) {
            if (pages[i].visible) {
                currentIndex = i;
                break;
            }
        }

        const nextIndex = (currentIndex + 1) % pages.length;
        switchToPage(nextIndex);
        resetIdleTimer();
    }

    // Touch and drag scroll listeners
    thumbContainer.on("mousedown", (evt) => {
        resetIdleTimer();
        isDragging = false;
        dragStartX = evt.stageX;
        dragStartY = evt.stageY;
        containerStartX = thumbContainer.x;
        containerStartY = thumbContainer.y;
    });

    thumbContainer.on("pressmove", (evt) => {
        resetIdleTimer();
        if (CONFIG.thumb.direction === "horizontal") {
            const deltaX = evt.stageX - dragStartX;
            if (Math.abs(deltaX) > 5) {
                isDragging = true;
            }
            thumbContainer.x = containInRange(containerStartX + deltaX, thumbContainer);
        } else {
            const deltaY = evt.stageY - dragStartY;
            if (Math.abs(deltaY) > 5) {
                isDragging = true;
            }
            thumbContainer.y = containInRangeVertical(containerStartY + deltaY, thumbContainer);
        }
    });

    thumbContainer.on("pressup", () => {
        setTimeout(() => {
            isDragging = false;
        }, 50);
    });

    // Populate thumbnail container using page structures
    for (let i = 0; i < CONFIG.pages.length; i++) {
        const thumbWrapper = new createjs.Container();
        const thumb = createPage(thumbWrapper, i);
        thumb.visible = true;

        resetThumbToFinalState(thumb);

        const thumbDisclaimer = new createjs.Bitmap(loader.getResult("disclaimer"));
        thumbDisclaimer.x = 0;
        thumbDisclaimer.y = 0;
        thumbDisclaimer.alpha = 1;
        thumb.addChild(thumbDisclaimer);

        thumb.scaleX = CONFIG.thumb.scaleX;
        thumb.scaleY = CONFIG.thumb.scaleY;

        addMask(0, 0, CONFIG.thumb.width, CONFIG.thumb.height, thumbWrapper, thumb);

        // Thumbnail black border frame
        const frame = new createjs.Shape();
        frame.graphics
            .setStrokeStyle(CONFIG.thumb.borderWidth)
            .beginStroke("#000000")
            .drawRoundRect(0, 0, CONFIG.thumb.width, CONFIG.thumb.height, CONFIG.thumb.borderRadius);

        frame.visible = (i === 0);
        frame.name = "frame";

        if (CONFIG.thumb.direction === "horizontal") {
            thumbWrapper.x = i * (CONFIG.thumb.width + CONFIG.thumb.gap);
            thumbWrapper.y = CONFIG.thumb.startY;
        } else {
            thumbWrapper.x = CONFIG.thumb.startX;
            thumbWrapper.y = CONFIG.thumb.startY + i * (CONFIG.thumb.height + CONFIG.thumb.gap);
        }

        thumbWrapper.cursor = "pointer";
        thumbWrapper.addChild(frame);

        // Thumbnail click transitions to respective page
        thumbWrapper.on("click", () => {
            resetIdleTimer();
            if (isDragging) return;
            switchToPage(i);
        });

        thumbContainer.addChild(thumbWrapper);
    }

    // Mouse wheel scroll listener
    stage.canvas.addEventListener("wheel", (e) => {
        e.preventDefault();
        resetIdleTimer();
        if (CONFIG.thumb.direction === "horizontal") {
            thumbContainer.x -= e.deltaY * 0.5;
            thumbContainer.x = containInRange(thumbContainer.x, thumbContainer);
        } else {
            thumbContainer.y -= e.deltaY * 0.5;
            thumbContainer.y = containInRangeVertical(thumbContainer.y, thumbContainer);
        }
    });

    // Default to Page 1
    pages.forEach(page => page.visible = false);
    page1.visible = true;

    // Start tick updates
    createjs.Ticker.framerate = 60;
    createjs.Ticker.on("tick", stage);

    // Start auto-rotation idle timer
    resetIdleTimer();
}
