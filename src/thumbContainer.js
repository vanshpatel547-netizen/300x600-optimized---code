/**
 * thumbContainer.js - Manages the thumbnail scrolling sidebar, frames, and touch interactions
 */

export class ThumbBlock {
    constructor(loader, stage, config, onPageSelect, onResetIdle) {
        this.loader = loader;
        this.stage = stage;
        this.config = config;
        this.onPageSelect = onPageSelect;
        this.onResetIdle = onResetIdle;

        this.container = new createjs.Container();
        this.thumbContainer = new createjs.Container();
        this.isDragging = false;
    }

    init() {
        this.container.x = this.config.thumb.sidebarX;
        this.container.y = this.config.thumb.sidebarY;

        this.thumbContainer.x = this.config.thumb.startX;
        this.container.addChild(this.thumbContainer);

        // White rectangle to hide overflowing elements behind the thumbnail bar
        const pageMask = new createjs.Shape();
        pageMask.graphics
            .beginFill("#ffffff")
            .drawRect(
                this.config.thumb.direction === "horizontal" ? 0 : this.config.thumb.sidebarX,
                this.config.thumb.direction === "horizontal" ? this.config.thumb.sidebarY : 0,
                this.config.thumb.direction === "horizontal" ? this.config.width : this.config.width - this.config.thumb.sidebarX,
                this.config.thumb.direction === "horizontal" ? this.config.height - this.config.thumb.sidebarY : this.config.height
            );
        this.stage.addChild(pageMask);

        let dragStartX = 0;
        let dragStartY = 0;
        let containerStartX = 0;
        let containerStartY = 0;

        // Touch and drag scroll listeners
        this.thumbContainer.on("mousedown", (evt) => {
            if (this.onResetIdle) this.onResetIdle();
            this.isDragging = false;
            dragStartX = evt.stageX;
            dragStartY = evt.stageY;
            containerStartX = this.thumbContainer.x;
            containerStartY = this.thumbContainer.y;
        });

        this.thumbContainer.on("pressmove", (evt) => {
            if (this.onResetIdle) this.onResetIdle();
            if (this.config.thumb.direction === "horizontal") {
                const deltaX = evt.stageX - dragStartX;
                if (Math.abs(deltaX) > 5) {
                    this.isDragging = true;
                }
                this.thumbContainer.x = this.containInRange(containerStartX + deltaX);
            } else {
                const deltaY = evt.stageY - dragStartY;
                if (Math.abs(deltaY) > 5) {
                    this.isDragging = true;
                }
                this.thumbContainer.y = this.containInRangeVertical(containerStartY + deltaY);
            }
        });

        this.thumbContainer.on("pressup", () => {
            setTimeout(() => {
                this.isDragging = false;
            }, 50);
        });

        // Populate thumbnail container using page structures
        for (let i = 0; i < this.config.pages.length; i++) {
            const thumbWrapper = new createjs.Container();
            const thumb = this.createPageThumb(thumbWrapper, i);
            thumb.visible = true;

            this.resetThumbToFinalState(thumb);

            const thumbDisclaimer = new createjs.Bitmap(this.loader.getResult("disclaimer"));
            thumbDisclaimer.x = 0;
            thumbDisclaimer.y = 0;
            thumbDisclaimer.alpha = 1;
            thumb.addChild(thumbDisclaimer);

            thumb.scaleX = this.config.thumb.scaleX;
            thumb.scaleY = this.config.thumb.scaleY;

            this.addMask(0, 0, this.config.thumb.width, this.config.thumb.height, thumbWrapper, thumb);

            // Thumbnail black border frame
            const frame = new createjs.Shape();
            frame.graphics
                .setStrokeStyle(this.config.thumb.borderWidth)
                .beginStroke("#000000")
                .drawRoundRect(0, 0, this.config.thumb.width, this.config.thumb.height, this.config.thumb.borderRadius);

            frame.visible = (i === 0);
            frame.name = "frame";

            if (this.config.thumb.direction === "horizontal") {
                thumbWrapper.x = i * (this.config.thumb.width + this.config.thumb.gap);
                thumbWrapper.y = this.config.thumb.startY;
            } else {
                thumbWrapper.x = this.config.thumb.startX;
                thumbWrapper.y = this.config.thumb.startY + i * (this.config.thumb.height + this.config.thumb.gap);
            }

            thumbWrapper.cursor = "pointer";
            thumbWrapper.addChild(frame);

            // Thumbnail click transitions to respective page
            thumbWrapper.on("click", () => {
                if (this.onResetIdle) this.onResetIdle();
                if (this.isDragging) return;
                if (this.onPageSelect) this.onPageSelect(i);
            });

            this.thumbContainer.addChild(thumbWrapper);
        }

        this.stage.addChild(this.container);

        // Mouse wheel scroll listener
        this.stage.canvas.addEventListener("wheel", (e) => {
            e.preventDefault();
            if (this.onResetIdle) this.onResetIdle();
            if (this.config.thumb.direction === "horizontal") {
                this.thumbContainer.x -= e.deltaY * 0.5;
                this.thumbContainer.x = this.containInRange(this.thumbContainer.x);
            } else {
                this.thumbContainer.y -= e.deltaY * 0.5;
                this.thumbContainer.y = this.containInRangeVertical(this.thumbContainer.y);
            }
        });
    }

    createPageThumb(parent, index) {
        const config = this.config.pages[index];
        const page = new createjs.Container();

        // Set up Background
        if (config.bgAsset) {
            const bg = new createjs.Bitmap(this.loader.getResult(config.bgAsset));
            page.addChild(bg);
        } else if (config.bgColor) {
            const bg = new createjs.Shape();
            bg.graphics
                .beginFill(config.bgColor)
                .drawRect(0, 0, this.config.width, this.config.height);
            page.addChild(bg);
        }

        // Set up optional Line asset
        if (config.lineAsset) {
            const line = new createjs.Bitmap(this.loader.getResult(config.lineAsset));
            page.addChild(line);
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
        }

        // Set up Header text image
        const headerTxt = new createjs.Bitmap(this.loader.getResult(config.headerAsset));
        page.addChild(headerTxt);

        // Set up optional Page Number asset
        if (config.numAsset) {
            const num = new createjs.Bitmap(this.loader.getResult(config.numAsset));
            page.addChild(num);
        }

        // Set up Subtext image
        const subTxt = new createjs.Bitmap(this.loader.getResult(config.subtxtAsset));
        page.addChild(subTxt);

        // Set up decorative Circle Text
        if (config.circle) {
            const circleAsset = index === 0 ? "0_circle_txt" : "circle_txt";
            const circle = new createjs.Bitmap(this.loader.getResult(circleAsset));
            circle.x = config.circle.x;
            circle.y = config.circle.y;
            circle.alpha = 1;
            page.addChild(circle);
        }

        parent.addChild(page);
        return page;
    }

    resetThumbToFinalState(page) {
        page.children.forEach(child => {
            child.alpha = 1;
            createjs.Tween.removeTweens(child);
        });
    }

    addMask(x, y, width, height, parent, elementToMask) {
        const maskShape = new createjs.Shape();
        maskShape.graphics
            .beginFill("#00000000")
            .drawRoundRect(0, 0, width, height, this.config.thumb.borderRadius);

        maskShape.x = x;
        maskShape.y = y;

        parent.addChild(maskShape);
        elementToMask.mask = maskShape;
    }

    containInRange(thumbContainerX) {
        const contentWidth = this.thumbContainer.children.length * (this.config.thumb.width + this.config.thumb.gap);
        const minX = Math.min(this.config.thumb.startX, (this.config.width + 12) - contentWidth - this.config.thumb.startX);

        if (thumbContainerX > this.config.thumb.startX) {
            thumbContainerX = this.config.thumb.startX;
        }
        if (thumbContainerX < minX) {
            thumbContainerX = minX;
        }
        return thumbContainerX;
    }

    containInRangeVertical(thumbContainerY) {
        const contentHeight = this.thumbContainer.children.length * (this.config.thumb.height + this.config.thumb.gap);
        const minY = Math.min(this.config.thumb.startY, (this.config.height + 40) - contentHeight - this.config.thumb.startY);

        if (thumbContainerY > this.config.thumb.startY) {
            thumbContainerY = this.config.thumb.startY;
        }
        if (thumbContainerY < minY) {
            thumbContainerY = minY;
        }
        return thumbContainerY;
    }

    scrollThumbnailIntoView(index) {
        if (this.config.thumb.direction === "horizontal") {
            const wrapperX = index * (this.config.thumb.width + this.config.thumb.gap);
            const viewportWidth = this.config.width;
            let targetX = -wrapperX + (viewportWidth - this.config.thumb.width) / 2;
            targetX = this.containInRange(targetX);
            createjs.Tween.get(this.thumbContainer, { override: true })
                .to({ x: targetX }, 300, createjs.Ease.quadOut);
        } else {
            const wrapperY = index * (this.config.thumb.height + this.config.thumb.gap);
            const viewportHeight = this.config.height - this.config.thumb.sidebarY;
            let targetY = -wrapperY + (viewportHeight - this.config.thumb.height) / 2;
            targetY = this.containInRangeVertical(targetY);
            createjs.Tween.get(this.thumbContainer, { override: true })
                .to({ y: targetY }, 300, createjs.Ease.quadOut);
        }
    }

    updateFrameHighlights(index) {
        this.thumbContainer.children.forEach((item, idx) => {
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
    }
}
