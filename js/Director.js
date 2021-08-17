//导演类、控制游戏的逻辑
import {DataStore} from "./base/DataStore.js";
import {UpPencil} from "./runtime/UpPencil.js";
import {DownPencil} from "./runtime/DownPencil.js";

export class Director {
    constructor() {
        this.dataStore = DataStore.getInstance();
        this.moveSpeed = 2;
    }

    static getInstance() {
        if (!Director.instance) {
            Director.instance = new Director();
        }
        return Director.instance;
    }

    createPencil() {
        const minTop = DataStore.getInstance().canvas.height / 8;
        const maxTop = DataStore.getInstance().canvas.height / 2;
        const top = minTop + Math.random() * (maxTop - minTop);
        this.dataStore.get('pencils').push(new UpPencil(top));
        this.dataStore.get('pencils').push(new DownPencil(top));
    }

    bridsEvent() {
        for (let i = 0; i <= 2; i++) {
            this.dataStore.get('birds').y[i] = this.dataStore.get('birds').birdsY[i];
        }
        this.dataStore.get('birds').time = 0;
    }

    //判断小鸟是否和铅笔撞击
    static isStrike(bird, pencil) {
        let s = false;
        if (bird.top > pencil.bottom ||
            bird.bottom < pencil.top ||
            bird.right < pencil.left ||
            bird.left > pencil.right) {
            s = true;
            // console.log(s)
        }
        return !s;
    }

    //判断小鸟是否撞击地板和铅笔
    check() {
        const birds = this.dataStore.get('birds');
        const land = this.dataStore.get('land');
        const pencils = this.dataStore.get('pencils');
        const score = this.dataStore.get('score');
        if (birds.birdsY[0] + birds.birdsHeight[0] >= land.y) {
            console.log('我撞地板了');
            this.isGameOver = true;
            return;
        }
        //    小鸟的边框模型
        const birdsBorder = {
            top: birds.birdsY[0],
            bottom: birds.birdsY[0] + birds.birdsHeight[0],
            left: birds.birdsX[0],
            right: birds.birdsX[0] + birds.birdsWidth[0]
        };
        const length = pencils.length;
        for (let i = 0; i < length; i++) {
            const pencil = pencils[i];
            const pencilBorder = {
                top: pencil.y,
                bottom: pencil.y + pencil.height,
                left: pencil.x,
                right: pencil.x + pencil.width
            };
            if (Director.isStrike(birdsBorder, pencilBorder)) {
                // console.log('鸟上',birdsBorder.top);
                // console.log('鸟下',birdsBorder.bottom);
                // console.log('鸟左',birdsBorder.left);
                // console.log('鸟右',birdsBorder.right);
                // console.log('管上',pencilBorder.top);
                // console.log('管下',pencilBorder.bottom);
                // console.log('管左',pencilBorder.left);
                // console.log('管右',pencilBorder.right);
                console.log('撞到水管了');
                this.isGameOver = true;
                return;

            }
            //    加分逻辑
            if (birds.birdsX[0] > pencils[0].x + pencils[0].width
                && score.isScore) {
                wx.vibrateShort();
                score.isScore = false;
                score.scoreNumber++;
            }
        }
        if (score.scoreNumber === 19) {
            this.isGameOver = true;
        }
    }

    run() {
        this.check();
        if (!this.isGameOver) {
            this.dataStore.get('background').draw();
            const pencils = this.dataStore.get('pencils');
            if (pencils[0].x + pencils[0].width <= 0 && pencils.length === 4) {
                pencils.shift();
                pencils.shift();
            }
            if (pencils[0].x <= (DataStore.getInstance().canvas.width - pencils[0].width) / 2 && pencils.length === 2) {
                this.dataStore.get('score').isScore = true;
                this.createPencil();
            }
            this.dataStore.get('pencils').forEach(function (value) {
                value.draw();
            });
            this.dataStore.get('land').draw();
            this.dataStore.get('score').draw();
            this.dataStore.get('birds').draw();
            let timer = requestAnimationFrame(() => this.run());
            this.dataStore.put('timer', timer);
        } else {
            if (this.dataStore.get('score').scoreNumber === 19) {
                this.dataStore.get('joke').draw();
                cancelAnimationFrame(this.dataStore.get('timer'));
                this.dataStore.destroy();
            }
            else {
                this.dataStore.get('startButton').draw();
                cancelAnimationFrame(this.dataStore.get('timer'));
                this.dataStore.destroy();
            }
            //    触发微信小游戏的垃圾回收机制
            wx.triggerGC();
        }
    }
}