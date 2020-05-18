/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import * as PIXI from 'pixi.js'
import { ISpaceShip } from './ISpaceShip'
import { Constants } from './constants'
import { IDisposable } from './IDisposable'

export class SpaceShip extends PIXI.Sprite implements ISpaceShip, IDisposable {
    anchorRate: number = 0.5;
    disposable: boolean = false;

    constructor (x: number, y: number, texture: PIXI.Texture, width: number = 0, height: number = 0) {
        super(texture)
        this.anchor.set(this.anchorRate)
        this.x = x
        this.y = y
        this.height = height !== 0 ? height : this.height
        this.width = width !== 0 ? width : this.width
    }

    moveX = (deltaX: number = 0): boolean => {
        if (!this.outOfBorderX(deltaX)) {
            this.x += deltaX
            return true
        }
        return false
    }

    moveY = (deltaY: number = 0): boolean => {
        if (!this.outOfBorderY(deltaY)) {
            this.y += deltaY
            return true
        }
        return false
    }

    outOfBorderX = (deltaX: number): boolean => {
        return this.x - this.width / 2 + deltaX < 0 ||
            this.x + this.width / 2 + deltaX > Constants.APPWIDTH
    }

    outOfBorderY = (deltaY: number): boolean => {
        return this.y - this.height / 2 + deltaY < 0 ||
            this.y + this.height / 2 + deltaY > Constants.APPHEIGHT
    }

    blowUp () : void {
        this.disposable = true
    }
}
