/* eslint-disable indent */
import * as PIXI from 'pixi.js'
// eslint-disable-next-line no-unused-vars
import { IDisposable } from './IDisposable'

/**
 * Represents an explosion
 */
export class Explosion extends PIXI.Sprite implements IDisposable {
    disposable: boolean = false;
    scaleCounter: number = 0;

    /**
     * Ctor
     * @param x x coordinate of the Explosion
     * @param y y coordinate of the Explosion
     * @param texture texture of the Explosion
     */
    constructor (x: number, y: number, texture: PIXI.Texture) {
        super(texture)
        this.anchor.set(0.5)
        this.x = x
        this.y = y
        this.width = this.height = 5
    }

    /**
     * Scaling the explosion img
     */
    scaleUp = () => {
        if (this.scaleCounter < 20) {
            this.scaleCounter++
            const scaleRatio = 1.16
            this.width *= scaleRatio
            this.height *= scaleRatio
        } else {
            this.disposable = true
        }
    }
}
