import { SpaceShip } from './spaceship'
import { IPlayerSpaceShip } from './IPlayerSpaceShip'
import { Rocket } from './rocket';

export class PlayerSpaceShip extends SpaceShip implements IPlayerSpaceShip {
    constructor(x: number, y: number, texture: PIXI.Texture) {        
        super(x, y, texture)
    }

    shoot(texture: PIXI.Texture): Rocket {
        return new Rocket(this.x + this.width / 2, this.y, texture);
    }

}