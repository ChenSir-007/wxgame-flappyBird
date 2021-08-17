//恶作剧类
import {Sprite} from "../base/Sprite.js";
import {DataStore} from "../base/DataStore";

export class Joke extends Sprite {
    constructor() {
        const image = Sprite.getImage('joke');
        super(image,
            0, 0,
            image.width, image.height,
            (DataStore.getInstance().canvas.width - image.width) / 2,
            (DataStore.getInstance().canvas.height - image.height) / 2.5,
            image.width, image.height);
    }
}