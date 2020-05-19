/* eslint-disable indent */
import * as PIXI from 'pixi.js'
import { Constants } from './Constants'
// eslint-disable-next-line no-unused-vars
import { IDisposable } from './IDisposable'

/**
 * Class represents particles emmitted from a point
 */
export class Particle extends PIXI.Graphics implements IDisposable {
    disposable: boolean = false;

    /**
     * X velocity of the particle
     */
    private velocityX: number = 0;

    /**
     * Y velocity of the particle
     */
    private velocityY: number = 0;

    /**
     * Scaling rate of the particle
     */
    private autoScale: number = 2;

    /**
     * Ctor
     * @param x x coordinate
     * @param y y coordinate
     */
    constructor (x: number, y: number) {
        super()
        this.beginFill(0xFFFFFF)
        this.drawCircle(x, y, 1)
        this.endFill()
        this.x = 0
        this.y = 0

        const speed = Constants.PARTICLESPEED
        const degree = Math.random() * 360

        // random generating particle velocity (move direction) using a random degree and the basei speed of the particle
        this.velocityY = speed * Math.sin(degree / 180 * Math.PI)
        this.velocityX = Math.sqrt(Math.pow(speed, 2) - Math.pow(this.velocityY, 2))
        if (degree > 90 && degree < 270) {
            this.velocityY = this.velocityY * -1
            this.velocityX = this.velocityX * -1
        }
    }

    /**
     * Moving the particle
     */
    move = () => {
        if (this.outOfBorderX(this.velocityX) || this.outOfBorderY(this.velocityY)) {
            this.disposable = true
        } else {
            this.x += this.velocityX * (Math.abs(this.x) / 40 + 1)
            this.y += this.velocityY * (Math.abs(this.y) / 30 + 1)
        }
    }

    /**
     * Checks if out of border horizontally
     * @param deltaX desired X position modification
     */
    private outOfBorderX = (deltaX: number): boolean => {
        return this.x + this.width + deltaX < Constants.APPWIDTH / -2 ||
            this.x - this.width + deltaX > Constants.APPWIDTH / 2
    }

    /**
     * Checks if out of border vertically
     * @param deltaY desired Y position modification
     */
    private outOfBorderY = (deltaY: number): boolean => {
        return this.y + this.height + deltaY < Constants.APPHEIGHT / -2 ||
            this.y - this.height + deltaY > Constants.APPHEIGHT / 2
    }
}
