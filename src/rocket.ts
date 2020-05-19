/* eslint-disable indent */
import * as PIXI from 'pixi.js'
import { Constants } from './Constants'
// eslint-disable-next-line no-unused-vars
import { IDisposable } from './IDisposable'

/**
 * Represents a Rocket
 */
export class Rocket extends PIXI.Sprite implements IDisposable {
    disposable: boolean = false;

    /**
     * Ctor
     * @param x x coordinate
     * @param y y coordinate
     * @param texture rocket texture
     */
    constructor (x: number, y: number, texture: PIXI.Texture) {
        super(texture)
        this.anchor.set(0.5)
        this.x = x
        this.y = y
    }

    /**
     * Moves the rocket
     * @param delta velocity of the rocket
     */
    move (delta: number = 0) {
        this.disposable = this.outOfBorder(delta)
        if (!this.disposable) {
            this.x += delta
        }
    }

    /**
     * Checks if rocket is out of area
     * @param deltaX desired moving amount
     */
    outOfBorder (deltaX: number): boolean {
        return this.x - this.width / 2 + deltaX > Constants.APPWIDTH
    }

    /**
     * Sets the rocket
     */
    blowUp () : void {
        this.disposable = true
    }
}
