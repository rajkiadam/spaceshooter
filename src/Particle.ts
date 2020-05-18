import * as PIXI from 'pixi.js'
import { Constants } from './constants';
import { IDisposable } from './IDisposable';

export class Particle extends PIXI.Graphics implements IDisposable {
    disposable: boolean = false;
    
    velocityX: number = 0;
    velocityY: number = 0;
    autoScale: number = 2;

    constructor(x: number, y: number) {
        super();
        this.beginFill(0xFFFFFF);
        this.drawCircle(x,y,1);
        this.endFill();
        this.x = 0;
        this.y = 0;

        let speed = Constants.PARTICLESPEED;
        let degree = Math.random() * 360;
        
        this.velocityY = speed * Math.sin(degree / 180 * Math.PI)
        this.velocityX = Math.sqrt(Math.pow(speed, 2) - Math.pow(this.velocityY, 2))
        if(degree > 90 && degree < 270){
            this.velocityY = this.velocityY * -1;
            this.velocityX = this.velocityX * -1;
        }
    }

    move = () => {
        if(this.outOfBorderX(this.velocityX) || this.outOfBorderY(this.velocityY)){
            this.disposable = true;
        }
        else {
            this.x += this.velocityX * (Math.abs(this.x) / 40 + 1); 
            this.y += this.velocityY * (Math.abs(this.y) / 30 + 1);
        }
    }

    outOfBorderX = (deltaX: number): boolean => {
        return this.x + this.width + deltaX < Constants.APPWIDTH / -2
            || this.x - this.width + deltaX > Constants.APPWIDTH / 2;
    }

    outOfBorderY = (deltaY: number): boolean => {
        return this.y + this.height + deltaY < Constants.APPHEIGHT / -2 
            || this.y - this.height + deltaY > Constants.APPHEIGHT / 2;
    }

}