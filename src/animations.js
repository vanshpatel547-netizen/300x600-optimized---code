/**
 * animations.js - Build banner with animations and interactive elements
 */
let loader, stage, root;
let page1, page2, page3, page4, page5, page6;
let animationTimer = null;
let activePage = null;
const ANIMATION_DELAY = 4000;
const CONFIG = {
    width: 300,
    height: 600,

    colors: {
        page2: "#1062A4",
        page3: "#825084",
        page4: "#F6A027",
        page5: "#6ABFA5",
        page6: "#1062A4"
    }
};

function addPageBackground(parent, color) {
    const bg = new createjs.Shape();

    bg.graphics
        .beginFill(color)
        .drawRect(0, 0, CONFIG.width, CONFIG.height);

    parent.addChild(bg);

    return bg;
}

function callClick(n) {
    let initialClickURL = '';
    const finalClickURL = 'https://russpass.ru/igrai-v-moskvu?utm_source=solta&utm_medium=cpm&utm_campaign=tur_mi_summer_26_ru(mix)_Igrai_v_Moskvu_UIDln0dp2&utm_content=banner';

    if (initialClickURL === '') {
        window.open(finalClickURL, '_blank');
    }
    else {
        // window.open(initialClickURL + "&pf=" + encodeURIComponent(finalClickURL), '_blank');
        const tracker = new Image();
        tracker.src = initialClickURL;

        window.open(finalClickURL, '_blank');
    }
}

function addRedirectionRect() {
    addRectangleForCTA(stage, 300 / 2, 600 / 2, 300, 600, "#000000", 0.01, () => {
        callClick();
    });
}

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

function pageFadeTween(page) {
    // fade in background animation
    const duration = 800;

   // remove all previous tweens at one place   
    let isFirstPage = page.icon ? false : true ;

    if(isFirstPage === true){
        createjs.Tween.removeTweens(page);
        createjs.Tween.removeTweens(page.headerTxt);
        createjs.Tween.removeTweens(page.subTxt);
    }else{
         createjs.Tween.removeTweens(page);
        createjs.Tween.removeTweens(page.headerTxt);
        createjs.Tween.removeTweens(page.subTxt);
        createjs.Tween.removeTweens(page.icon);
    }

    root.bgFront.alpha = 1;
    createjs.Tween.get(root.bgFront)
        .to({ alpha: 0 }, duration + 200, createjs.Ease.quadOut)

    page.alpha = 0;
    createjs.Tween.get(page)
        .to({ alpha: 1 }, duration, createjs.Ease.quadOut)

    if (page.line) {
        page.line.alpha = 0;
        createjs.Tween.get(page.line)
            .to({ alpha: 1 }, duration, createjs.Ease.quadOut)
    }

    if (page.icon) {
        createjs.Tween.get(page.icon)
            .to({ alpha: 1 }, duration, createjs.Ease.quadOut)
    }

    if (page.num) {
        createjs.Tween.get(page.num)
            .to({ alpha: 1 }, duration, createjs.Ease.quadOut)
    }
}

function createPage1(parent) {

    const page = new createjs.Container();

    const bg = new createjs.Bitmap(loader.getResult("0_bg_plain"));
    page.addChild(bg);

    const headerTxt = new createjs.Bitmap(loader.getResult("0_header"));
    page.addChild(headerTxt);

    const subTxt = new createjs.Bitmap(loader.getResult("0_subtxt"));
    page.addChild(subTxt);

    const headerFinalX = headerTxt.x;
    const subTextFinalX = subTxt.x;

    const circle = addCircle(page, 0, 0, true);

    page.headerTxt = headerTxt;
    page.subTxt = subTxt;

    page.runAnimation = () => {

        pageFadeTween(page);

        const elementShowDelay = 500;
        circle.alpha = 0;
        setTimeout(() => {
            circle.runAnimation();
        }, elementShowDelay);

        // Starting positions
        headerTxt.x = headerFinalX - 80;
        subTxt.x = subTextFinalX + 80;

        // Header left to right
        headerTxt.alpha = 0;
        createjs.Tween.get(headerTxt)
            .wait(elementShowDelay)
            .to({ x: headerFinalX, alpha: 1 }, 500, createjs.Ease.quadOut) // enter from left

        // Subtext right to left
        subTxt.alpha = 0;
        createjs.Tween.get(subTxt)
            .wait(elementShowDelay)
            .to({ x: subTextFinalX, alpha: 1 }, 500, createjs.Ease.quadOut) // enter from right
    }

    parent.addChild(page);
    page.visible = true;

    return page;
}

function createPage2(parent) {
    const page = new createjs.Container();

 addPageBackground(page, CONFIG.colors.page2);

    const line2 = new createjs.Bitmap(loader.getResult("1_line"));
    page.addChild(line2);

    const icon2 = new createjs.Bitmap(loader.getResult("1_icon"));
    icon2.y = 194;
    icon2.x = 51;
    icon2.angle = -1;
    page.addChild(icon2);

    const headerTxt2 = new createjs.Bitmap(loader.getResult("1_header"));
    headerTxt2.y = 0;
    headerTxt2.x = 0;
    page.addChild(headerTxt2);

    const headerX = headerTxt2.x;
    headerTxt2.alpha = 0;

    const num2 = new createjs.Bitmap(loader.getResult("1_num"));
    num2.y = 0;
    num2.x = 0;
    page.addChild(num2);

    const subTxt2 = new createjs.Bitmap(loader.getResult("1_subtxt"));
    subTxt2.y = 0;
    subTxt2.x = 0;
    page.addChild(subTxt2);

    const subX = subTxt2.x;
    subTxt2.alpha = 0;

    page.line = line2;
    page.icon = icon2;
    page.num = num2;
    page.headerTxt = headerTxt2;
    page.subTxt = subTxt2;

    const circle = addCircle(page);

    page.runAnimation = () => {
      
        pageFadeTween(page);

        const elementShowDelay = 500;
        circle.alpha = 0;
        setTimeout(() => {
            circle.runAnimation();
        }, elementShowDelay);

        // Starting positions
        headerTxt2.alpha = 0;
        headerTxt2.x = headerX - 50;
        subTxt2.alpha = 0;
        subTxt2.x = subX - 60;
        icon2.alpha = 0;
        icon2.startX = icon2.x;
        icon2.startY = icon2.y;

        // icon animation
        createjs.Tween.get(icon2)
            .to({
                y: icon2.startY - 5,
                rotation: -3
            }, ANIMATION_DELAY / 3, createjs.Ease.sineInOut)
            .to({
                y: icon2.startY + 3,
                rotation: 3
            }, ANIMATION_DELAY / 3, createjs.Ease.sineInOut)
            .to({
                y: icon2.startY,
                rotation: -1
            }, ANIMATION_DELAY / 3, createjs.Ease.sineInOut);

        // header bottom to top tween
        createjs.Tween.get(headerTxt2)
            .wait(elementShowDelay)
            .to({ alpha: 1, x: headerX }, 500, createjs.Ease.quadOut)

        // subtext bottom to top tween
        createjs.Tween.get(subTxt2)
            .wait(elementShowDelay + 100)
            .to({ alpha: 1, x: subX }, 500, createjs.Ease.quadOut)
    }

    parent.addChild(page);
    page.visible = false;

    return page;
}

function createPage3(parent) {
    const page = new createjs.Container();

    const block3 = new createjs.Shape();

  addPageBackground(page, CONFIG.colors.page3);

    const line3 = new createjs.Bitmap(loader.getResult("2_line"));
    page.addChild(line3);

    const icon3 = new createjs.Bitmap(loader.getResult("2_icon"));
    icon3.x = 52;
    icon3.y = 201;
    page.addChild(icon3);

    const icon3Y = icon3.y;

    const headerTxt3 = new createjs.Bitmap(loader.getResult("2_header"));
    headerTxt3.y = 0;
    headerTxt3.x = 0;
    page.addChild(headerTxt3);

    const headerX = headerTxt3.x;
    headerTxt3.alpha = 0;

    const num3 = new createjs.Bitmap(loader.getResult("2_num"));
    num3.y = 0;
    num3.x = 0;
    page.addChild(num3);

    const subTxt3 = new createjs.Bitmap(loader.getResult("2_subtxt"));
    subTxt3.y = 0;
    subTxt3.x = 0;
    page.addChild(subTxt3);

    const subX = subTxt3.x;
    subTxt3.alpha = 0;

    const subScaleX = subTxt3.scaleX;
    const subScaleY = subTxt3.scaleY;

    page.line = line3;
    page.icon = icon3;
    page.num = num3;
    page.headerTxt = headerTxt3;
    page.subTxt = subTxt3;

    const circle = addCircle(page);

    page.runAnimation = () => {
     
        pageFadeTween(page);

        const elementShowDelay = 500;
        circle.alpha = 0;
        setTimeout(() => {
            circle.runAnimation();
        }, elementShowDelay);

        // Starting positions
        headerTxt3.alpha = 0;
        headerTxt3.x = headerX + 50;

        subTxt3.alpha = 0;
        subTxt3.x = subX - 42;

        // icon tween
        createjs.Tween.get(icon3, { loop: true })
            .to({
                y: icon3Y - 12,
                scaleX: 1.01,
                scaleY: 1.01
            }, ANIMATION_DELAY / 2, createjs.Ease.sineInOut)
            .to({
                y: icon3Y,
                scaleX: 1,
                scaleY: 1
            }, ANIMATION_DELAY / 2, createjs.Ease.sineInOut);

        // header bottom to top tween    
        createjs.Tween.get(headerTxt3)
            .wait(elementShowDelay)
            .to({ alpha: 1, x: headerX }, 500, createjs.Ease.quadOut)

        // subtext bottom to top tween
        createjs.Tween.get(subTxt3)
            .wait(elementShowDelay + 100)
            .to({ alpha: 1, x: subX }, 500, createjs.Ease.quadOut)
    }

    parent.addChild(page);
    page.visible = false;

    return page;
}

function createPage4(parent) {

    const page = new createjs.Container();

    addPageBackground(page, CONFIG.colors.page4);

    const line4 = new createjs.Bitmap(loader.getResult("3_line"));
    line4.x = 0;
    page.addChild(line4);

    const icon4 = new createjs.Bitmap(loader.getResult("3_icon"));
    icon4.x = 10;
    icon4.y = 139;
    icon4.angle = -4;
    page.addChild(icon4);
    const icon4Y = icon4.y;

    const subTxt4 = new createjs.Bitmap(loader.getResult("3_subtxt"));
    subTxt4.y = 0;
    subTxt4.x = 0;
    page.addChild(subTxt4);

    const subX = subTxt4.x;
    subTxt4.alpha = 0;

    const num4 = new createjs.Bitmap(loader.getResult("3_num"));
    num4.y = 0;
    num4.x = 0;
    page.addChild(num4);

    const headerTxt4 = new createjs.Bitmap(loader.getResult("3_header"));
    headerTxt4.y = 0;
    headerTxt4.x = 0;
    page.addChild(headerTxt4);

    const headerX = headerTxt4.x;
    headerTxt4.alpha = 0;

    page.line = line4;
    page.icon = icon4;
    page.num = num4;
    page.headerTxt = headerTxt4;
    page.subTxt = subTxt4;    

    const circle = addCircle(page);

    page.runAnimation = () => {
      
        pageFadeTween(page);

        const elementShowDelay = 500;
        circle.alpha = 0;
        setTimeout(() => {
            circle.runAnimation();
        }, elementShowDelay);

        // Starting positions
        headerTxt4.alpha = 0;
        headerTxt4.x = headerX - 60;

        subTxt4.alpha = 0;
        subTxt4.x = subX - 50;

        // icon tween
        createjs.Tween.get(icon4)
            .to({
                y: icon4Y - 7,
                rotation: 4
            }, ANIMATION_DELAY / 2, createjs.Ease.sineInOut)
            .to({
                y: icon4Y,
                rotation: -4
            }, ANIMATION_DELAY / 2, createjs.Ease.sineInOut);

        // header left to right tween
        createjs.Tween.get(headerTxt4)
            .wait(elementShowDelay)
            .to({ alpha: 1, x: headerX }, 500, createjs.Ease.quadOut)

        // subtext left to right tween
        createjs.Tween.get(subTxt4)
            .wait(elementShowDelay + 100)
            .to({ alpha: 1, x: subX }, 500, createjs.Ease.quadOut)
    }

    parent.addChild(page);
    page.visible = false;

    return page;
}

function createPage5(parent) {
    const page = new createjs.Container();

 addPageBackground(page, CONFIG.colors.page5);

    const line5 = new createjs.Bitmap(loader.getResult("4_line"));
    page.addChild(line5);

    const icon5 = new createjs.Bitmap(loader.getResult("4_icon"));
    icon5.x = -67;
    icon5.y = 156;
    page.addChild(icon5);

    const icon5Y = icon5.y;

    const subTxt5 = new createjs.Bitmap(loader.getResult("4_subtxt"));
    subTxt5.y = 0;
    subTxt5.x = 0;
    page.addChild(subTxt5);

    const subX = subTxt5.x;
    subTxt5.alpha = 0;

    const num5 = new createjs.Bitmap(loader.getResult("4_num"));
    num5.y = 0;
    num5.x = 0;
    page.addChild(num5);

    const headerTxt5 = new createjs.Bitmap(loader.getResult("4_header"));
    headerTxt5.y = 0;
    headerTxt5.x = 0;
    page.addChild(headerTxt5);

    const headerX = headerTxt5.x;
    headerTxt5.alpha = 0;

    page.line = line5;
    page.icon = icon5;
    page.num = num5;
    page.headerTxt = headerTxt5;
    page.subTxt = subTxt5;

    const circle = addCircle(page);

    page.runAnimation = () => {
      
        pageFadeTween(page);

        const elementShowDelay = 500;
        circle.alpha = 0;
        setTimeout(() => {
            circle.runAnimation();
        }, elementShowDelay);

        // Starting positions
        headerTxt5.alpha = 0;
        headerTxt5.x = headerX + 50;

        subTxt5.alpha = 0;
        subTxt5.x = subX + 50;

        // icon tween    
        createjs.Tween.get(icon5)
            .to({
                y: icon5Y - 6,
                scaleX: 1.02,
                scaleY: 1.02
            }, ANIMATION_DELAY / 2, createjs.Ease.sineInOut)
            .to({
                y: icon5Y,
                scaleX: 1,
                scaleY: 1
            }, ANIMATION_DELAY / 2, createjs.Ease.sineInOut);

        // header left to right tween
        createjs.Tween.get(headerTxt5)
            .wait(elementShowDelay)
            .to({ alpha: 1, x: headerX }, 500, createjs.Ease.quadOut)

        // subtext left to right tween
        createjs.Tween.get(subTxt5)
            .wait(elementShowDelay + 100)
            .to({ alpha: 1, x: subX }, 500, createjs.Ease.quadOut)

    }

    parent.addChild(page);
    page.visible = false;

    return page;
}

function createPage6(parent) {
    const page = new createjs.Container();

 addPageBackground(page, CONFIG.colors.page6);

    const line6 = new createjs.Bitmap(loader.getResult("5_line"));
    page.addChild(line6);

    const icon6 = new createjs.Bitmap(loader.getResult("5_icon"));
    icon6.x = -1;
    icon6.y = 124;
    page.addChild(icon6);

    const startX = icon6.x;

    const subTxt6 = new createjs.Bitmap(loader.getResult("5_subtxt"));
    subTxt6.y = 0;
    subTxt6.x = 0;
    page.addChild(subTxt6);


    const subX = subTxt6.x;
    subTxt6.alpha = 0;

    const subY6 = subTxt6.y;
    subTxt6.alpha = 0;

    const num6 = new createjs.Bitmap(loader.getResult("5_num"));
    num6.y = 0;
    num6.x = 0;
    page.addChild(num6);

    const headerTxt6 = new createjs.Bitmap(loader.getResult("5_header"));
    headerTxt6.y = 0;
    headerTxt6.x = 0;
    page.addChild(headerTxt6);

    const headerX = headerTxt6.x;
    headerTxt6.alpha = 0;

    const headerY2 = headerTxt6.y || 0;

    page.line = line6;
    page.icon = icon6;
    page.num = num6;
    page.headerTxt = headerTxt6;
    page.subTxt = subTxt6;    

    const circle = addCircle(page);

    page.runAnimation = () => {

        pageFadeTween(page);

        const elementShowDelay = 500;
        circle.alpha = 0;
        setTimeout(() => {
            circle.runAnimation();
        }, elementShowDelay);

        // Starting positions
        headerTxt6.alpha = 0;
        headerTxt6.x = headerX - 60;

        subTxt6.alpha = 0;
        subTxt6.x = subX + 50;

        // icon tween
        createjs.Tween.get(icon6)
            .to({
                x: startX - 15
            }, ANIMATION_DELAY / 2, createjs.Ease.sineInOut)
            .to({
                x: startX
            }, ANIMATION_DELAY / 2, createjs.Ease.sineInOut)

        // header left to right tween
        createjs.Tween.get(headerTxt6)
            .wait(elementShowDelay)
            .to({ alpha: 1, x: headerX }, 500, createjs.Ease.quadOut)

        // subtext left to right tween
        createjs.Tween.get(subTxt6)
            .wait(elementShowDelay + 100)
            .to({ alpha: 1, x: subX }, 500, createjs.Ease.quadOut)

    }

    parent.addChild(page);
    page.visible = false;

    return page;
}

function addCircle(parent, x = 105, y = 12, isFirstPage = false) {

    let circleTxt;
    if (isFirstPage)
        circleTxt = new createjs.Bitmap(loader.getResult("0_circle_txt"));
    else
        circleTxt = new createjs.Bitmap(loader.getResult("circle_txt"));

    parent.addChild(circleTxt);

    circleTxt.x = x;
    circleTxt.y = y;
    circleTxt.alpha = 0;

    circleTxt.runAnimation = () => {
        createjs.Tween.removeTweens(circleTxt);

        circleTxt.y = y - 80;

        createjs.Tween.get(circleTxt)
            .to({ alpha: 1, y: y }, 500, createjs.Ease.cubicOut)
    }

    return circleTxt;
}

function addMask(x, y, width, height, parent, elementToMask) {
    const maskShape = new createjs.Shape();
    maskShape.graphics
        .beginFill("#00000000")
        .drawRoundRect(0, 0, width, height, 9.5);

    maskShape.x = x;
    maskShape.y = y;

    parent.addChild(maskShape);
    elementToMask.mask = maskShape;
}

function startAnimationTimer(page) {

    // prevent from other animations 
    stopAnimationTimer();

    // selected page 
    activePage = page;

    // run immediately
    activePage.runAnimation();

    // repeat every 3 sec
    animationTimer = setInterval(() => {

        if (!activePage) return;

        activePage.runAnimation();

    }, ANIMATION_DELAY);
}

function stopAnimationTimer() {

    // clear animationTimer & Interval to assign new animation
    if (animationTimer) {
        clearInterval(animationTimer);
        animationTimer = null;
    }

    // reset activepage 
    activePage = null;
}

function resetThumbToFinalState(page) {

    page.children.forEach(child => {

        child.alpha = 1;

        createjs.Tween.removeTweens(child);
    });

}

function containInRange(thumbContainerX, thumbContainer, THUMB_GAP) {
    const thumbWidth = 84;
    const contentWidth = thumbContainer.children.length * (thumbWidth + THUMB_GAP);

    const minX = Math.min(10, 312 - contentWidth - 10);

    if (thumbContainerX > 10) {
        thumbContainerX = 10;
    }

    if (thumbContainerX < minX) {
        thumbContainerX = minX;
    }

    return thumbContainerX;
}

export function buildBanner(loaderArg, stageArg) {
    loader = loaderArg;
    stage = stageArg;

    // <---------- create stage container to store different pages ---------->
    root = new createjs.Container();
    stage.addChild(root);

    addRedirectionRect();

    // Clip main content to left area only
    const pageMask = new createjs.Shape();
    pageMask.graphics
        .beginFill("#ffffff")
        .drawRect(0, 450, 300, 150);

    stage.addChild(pageMask);

    const bgWhite = new createjs.Shape();
    bgWhite.graphics
        .beginFill("#ffffff")
        .drawRect(0, 0, 300, 600);
    root.addChild(bgWhite);

    page1 = createPage1(root);
    page2 = createPage2(root);
    page3 = createPage3(root);
    page4 = createPage4(root);
    page5 = createPage5(root);
    page6 = createPage6(root);

    const bgFront = new createjs.Shape();
    bgFront.graphics
        .beginFill("#ffffff")
        .drawRect(0, 0, 300, 600);
    root.addChild(bgFront);
    root.bgFront = bgFront;

    startAnimationTimer(page1);

    // <---------- circle text & disclaimer for PAGE 1 & other pages ---------->

    const disclaimerTxt = new createjs.Bitmap(loader.getResult("disclaimer"));
    stage.addChild(disclaimerTxt);
    disclaimerTxt.x = 0;
    disclaimerTxt.y = 0;

    disclaimerTxt.alpha = 0;
    createjs.Tween.get(disclaimerTxt, { loop: false })
        .to({ alpha: 1 }, 1000)

    // =====================================
    // SIDEBAR FOR 300x600 BANNER
    // LEFT AREA = 300x450
    // RIGHT SIDEBAR = 150x450
    // =====================================

    const pages = [
        page1,
        page2,
        page3,
        page4,
        page5,
        page6
    ];

    // ---------------------
    // SIDEBAR CONTAINER
    // ---------------------

    const sideBarYOffset = 12;
    const sidebar = new createjs.Container();
    sidebar.x = 0;
    sidebar.y = 462 - sideBarYOffset;

    stage.addChild(sidebar);

    // ---------------------
    // SCROLL AREA
    // ---------------------

    const thumbContainer = new createjs.Container();
    thumbContainer.x = 10;

    sidebar.addChild(thumbContainer);


    // =====================================
    // TOUCH + DRAG SCROLL SUPPORT
    // =====================================

    createjs.Touch.enable(stage);

    let isDragging = false;
    let dragStartX = 0;
    let containerStartX = 0;

    thumbContainer.on("mousedown", (evt) => {
        isDragging = false;
        dragStartX = evt.stageX;
        containerStartX = thumbContainer.x;
    });

    thumbContainer.on("pressmove", (evt) => {

        const deltaX = evt.stageX - dragStartX;

        if (Math.abs(deltaX) > 5) {
            isDragging = true;
        }

        thumbContainer.x = containerStartX + deltaX;
        thumbContainer.x = containInRange(thumbContainer.x, thumbContainer, THUMB_GAP);
    });

    thumbContainer.on("pressup", () => {
        setTimeout(() => {
            isDragging = false;
        }, 50);
    });

    // ---------------------
    // THUMBNAILS
    // ---------------------
    const THUMB_GAP = 11;

    const pageCreators = [createPage1, createPage2, createPage3, createPage4, createPage5, createPage6];

    for (let i = 0; i < pageCreators.length; i++) {
        const thumbWrapper = new createjs.Container();
        const thumb = pageCreators[i](thumbWrapper);
        thumb.visible = true;

        // for show original positions of all element tomake proper thumbnail
        resetThumbToFinalState(thumb);

        // ADD THUMB DISCLAIMER HERE
        const thumbDisclaimer = new createjs.Bitmap(
            loader.getResult("disclaimer")
        );

        thumbDisclaimer.x = 0;
        thumbDisclaimer.y = 0;
        thumbDisclaimer.alpha = 1;

        thumb.addChild(thumbDisclaimer);

        thumb.scaleX = 0.28;
        thumb.scaleY = 0.28;
        const thumbWidth = 84;
        const thumbHeight = 126;

        addMask(0, 0, 84, 126, thumbWrapper, thumb);

        // Black rounded frame
        const frame = new createjs.Shape();
        frame.graphics
            .setStrokeStyle(3)
            .beginStroke("#000000")
            .drawRoundRect(
                0,
                0,
                thumbWidth,
                thumbHeight,
                9.5
            );

        frame.visible = (i === 0);
        frame.name = "frame";

        thumbWrapper.x = i * (thumbWidth + THUMB_GAP);
        thumbWrapper.y = sideBarYOffset;

        thumbWrapper.cursor = "pointer";

        // thumbWrapper.alpha = i === 0 ? 1 : 0.5;

        thumbWrapper.addChild(frame);

        thumbWrapper.on("click", () => {

            if (isDragging) return;
            if (pages[i].visible) return;

            pages.forEach(page => {
                page.visible = false;
            });

            pages[i].visible = true;

            startAnimationTimer(pages[i]);

            thumbContainer.children.forEach(item => {
                const itemFrame = item.getChildByName("frame");

                if (itemFrame) {
                    itemFrame.visible = false;
                    itemFrame.alpha = 0;
                }
            });

            thumbWrapper.alpha = 1;
            frame.visible = true;
            frame.alpha = 0;

            createjs.Tween.get(frame)
                .to({ alpha: 0.8 }, 300);

            stage.update();
        });

        thumbContainer.addChild(thumbWrapper);
    }

    // ---------------------
    // SCROLL WITH MOUSE WHEEL
    // ---------------------
    stage.canvas.addEventListener("wheel", (e) => {

        e.preventDefault();

        thumbContainer.x -= e.deltaY * 0.5;
        thumbContainer.x = containInRange(thumbContainer.x, thumbContainer, THUMB_GAP);
    });

    // ---------------------
    // SHOW PAGE 1 DEFAULT
    // ---------------------
    pages.forEach(page => page.visible = false);
    page1.visible = true;

    // <---------- UPDATE TICKER or UPDATE STAGE---------->

    createjs.Ticker.framerate = 60;
    createjs.Ticker.on("tick", stage);
}

