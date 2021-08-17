//初始化整个游戏的精灵，作为游戏的入口
import {ResourceLoader} from "./js/base/ResourceLoader.js";
import {BackGround} from "./js/runtime/BackGround.js";
import {DataStore} from "./js/base/DataStore.js";
import {Director} from "./js/Director.js";
import {Land} from "./js/runtime/Land.js";
import {Birds} from "./js/player/Birds.js";
import {StartButton} from "./js/player/StartButton.js";
import {Score} from "./js/player/Score.js";
import {Joke} from "./js/player/Joke.js";

// import {ApiExamples} from "./js/ApiExamples";

export class Main {
    constructor() {
        this.canvas = wx.createCanvas();
        this.ctx = this.canvas.getContext('2d');
        this.dataStore = DataStore.getInstance();
        this.director = Director.getInstance();
        const loader = ResourceLoader.create();
        loader.onLoaded(map => this.onResourceFirstLoaded(map));
    }

    createBackGroundMusic() {
        const bgm = wx.createInnerAudioContext();
        bgm.autoplay = true
        bgm.loop = true
        bgm.src = 'audios/bgm.mp3'
    }

    onResourceFirstLoaded(map) {
        this.dataStore.canvas = this.canvas;
        this.dataStore.ctx = this.ctx;
        this.dataStore.res = map;
        this.createBackGroundMusic();
        // const example = new ApiExamples();
        // example.getUserInfo();
        this.init()

    }

    init() {
        this.director.isGameOver = false;
        this.dataStore
            .put('pencils', [])
            .put('background', BackGround)
            .put('land', Land)
            .put('birds', Birds)
            .put('score', Score)
            .put('startButton', StartButton)
            .put('joke', Joke);
        this.registerEvent();
        this.director.createPencil();
        this.director.run();
    }

    registerEvent() {
        // this.canvas.addEventListener('touchstart',e=>{
        //    e.preventDefault();
        //    if(this.director.isGameOver){
        //        console.log('游戏开始');
        //        this.init();
        //    }else {
        //        this.director.bridsEvent();
        //    }
        // });
        wx.onTouchStart(() => {
            if (this.director.isGameOver) {
                console.log('游戏开始');
                this.init();
            } else {
                this.director.bridsEvent();
            }
        })
    }

}