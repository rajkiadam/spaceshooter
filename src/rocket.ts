/* eslint-disable indent */
import * as PIXI from 'pixi.js'
import { Constants } from './constants'
// eslint-disable-next-line no-unused-vars
import { IDisposable } from './IDisposable'

export class Rocket extends PIXI.Sprite implements IDisposable {
    disposable: boolean = false;
    constructor (x: number, y: number, texture: PIXI.Texture) {
        super(texture)
        this.anchor.set(0.5)
        this.x = x
        this.y = y
    }

    move (delta: number = 0) {
        this.disposable = this.outOfBorder(delta)
        if (!this.disposable) {
            this.x += delta
        }
    }

    outOfBorder (deltaX: number): boolean {
        return this.x - this.width / 2 + deltaX > Constants.APPWIDTH
    }

    blowUp () {
        this.disposable = true
    }
}
