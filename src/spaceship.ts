/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import * as PIXI from 'pixi.js'
import { ISpaceShip } from './ISpaceShip'
import { Constants } from './Constants'
import { IDisposable } from './IDisposable'

/**
 * Represents a general spaceship
 */
export class SpaceShip extends PIXI.Sprite implements ISpaceShip, IDisposable {
    anchorRate: number = 0.5;
    disposable: boolean = false;

    /**
     * Ctor
     * @param x x coordinate
     * @param y y coordinate
     * @param texture spaceship texture
     */
    constructor (x: number, y: number, texture: PIXI.Texture) {
        super(texture)
        this.anchor.set(this.anchorRate)
        this.x = x
        this.y = y
    }

    /**
     * Moves the spacehisp horizontally
     * @param deltaX x velocity
     */
    moveX = (deltaX: number = 0): boolean => {
        if (!this.outOfBorderX(deltaX)) {
            this.x += deltaX
            return true
        }
        return false
    }

    /**
     * Moves the spacehisp vertically
     * @param deltaY y velocity
     */
    moveY = (deltaY: number = 0): boolean => {
        if (!this.outOfBorderY(deltaY)) {
            this.y += deltaY
            return true
        }
        return false
    }

    /**
     * Checks if spaceship out of area horizontally
     * @param deltaX desired y moving amount
     */
    outOfBorderX = (deltaX: number): boolean => {
        return this.x - this.width / 2 + deltaX < 0 ||
            this.x + this.width / 2 + deltaX > Constants.APPWIDTH
    }

    /**
     * Checks if spaceship out of area vertically
     * @param deltaY desired x moving amount
     */
    outOfBorderY = (deltaY: number): boolean => {
        return this.y - this.height / 2 + deltaY < 0 ||
            this.y + this.height / 2 + deltaY > Constants.APPHEIGHT
    }

    /**
     * Sets the spaceship disposable
     */
    blowUp () : void {
        this.disposable = true
    }
}
