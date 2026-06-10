/**
 * pageContainer.js - Manages the main page containers and their entrance animations
 */

export class PageBlock {
    constructor(loader, config) {
        this.loader = loader;
        this.config = config;
        this.container = new createjs.Container();
        this.pages = [];
        this.activePage = null;
        this.animationTimer = null;
        this.bgFront = null;
    }

    init(root) {
        const bgWhite = new createjs.Shape();
        bgWhite.graphics
            .beginFill("#ffffff")
            .drawRect(0, 0, this.config.width, this.config.height);
        this.container.addChild(bgWhite);

        // Initialize all pages from CONFIG
        this.pages = this.config.pages.map((_, i) => this.createPage(i));

        // White foreground fade overlay used for transitions
        this.bgFront = new createjs.Shape();
        this.bgFront.graphics
            .beginFill("#ffffff")
            .drawRect(0, 0, this.config.width, this.config.height);
        this.container.addChild(this.bgFront);
        this.container.bgFront = this.bgFront;

        root.addChild(this.container);
    }

    addPageBackground(parent, color) {
        const bg = new createjs.Shape();
        bg.graphics
            .beginFill(color)
            .drawRect(0, 0, this.config.width, this.config.height);
        parent.addChild(bg);
        return bg;
    }

    pageFadeTween(page) {
        const duration = 800;
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

        this.bgFront.alpha = 1;
        createjs.Tween.get(this.bgFront)
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

    createPage(index) {
        const config = this.config.pages[index];
        const page = new createjs.Container();

        // Set up Background
        if (config.bgAsset) {
            const bg = new createjs.Bitmap(this.loader.getResult(config.bgAsset));
            page.addChild(bg);
        } else if (config.bgColor) {
            this.addPageBackground(page, config.bgColor);
        }

        // Set up optional Line asset
        if (config.lineAsset) {
            const line = new createjs.Bitmap(this.loader.getResult(config.lineAsset));
            page.addChild(line);
            page.line = line;
        }

        // Set up optional floating Icon
        if (config.icon) {
            const icon = new createjs.Bitmap(this.loader.getResult(config.icon.asset));
            icon.x = config.icon.x;
            icon.y = config.icon.y;
            if (config.icon.rotation !== undefined) {
                icon.rotation = config.icon.rotation;
            }
            page.addChild(icon);
            page.icon = icon;
        }

        // Set up Header text image
        const headerTxt = new createjs.Bitmap(this.loader.getResult(config.headerAsset));
        page.addChild(headerTxt);
        page.headerTxt = headerTxt;
        const headerFinalX = headerTxt.x;

        // Set up optional Page Number asset
        if (config.numAsset) {
            const num = new createjs.Bitmap(this.loader.getResult(config.numAsset));
            page.addChild(num);
            page.num = num;
        }

        // Set up Subtext image
        const subTxt = new createjs.Bitmap(this.loader.getResult(config.subtxtAsset));
        page.addChild(subTxt);
        page.subTxt = subTxt;
        const subTextFinalX = subTxt.x;

        // Set up decorative Circle Text
        let circle = null;
        if (config.circle) {
            circle = this.addCircle(page, config.circle.x, config.circle.y, index === 0);
        }

        // Encapsulate page entrance animation sequence
        page.runAnimation = () => {
            this.pageFadeTween(page);

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

        this.container.addChild(page);
        page.visible = (index === 0);

        return page;
    }

    addCircle(parent, x = 105, y = 12, isFirstPage = false) {
        const circleTxt = new createjs.Bitmap(this.loader.getResult(isFirstPage ? "0_circle_txt" : "circle_txt"));
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

    startAnimationTimer(page) {
        this.stopAnimationTimer();
        this.activePage = page;
        this.activePage.runAnimation();

        this.animationTimer = setInterval(() => {
            if (!this.activePage) return;
            this.activePage.runAnimation();
        }, 4000); // 4 seconds animation delay
    }

    stopAnimationTimer() {
        if (this.animationTimer) {
            clearInterval(this.animationTimer);
            this.animationTimer = null;
        }
        this.activePage = null;
    }

    switchToPage(index) {
        this.pages.forEach((page, idx) => {
            page.visible = (idx === index);
        });
        this.startAnimationTimer(this.pages[index]);
    }
}
