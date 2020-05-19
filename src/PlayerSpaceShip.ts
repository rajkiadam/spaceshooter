/* eslint-disable indent */
import { SpaceShip } from './Spaceship'
// eslint-disable-next-line no-unused-vars
import { IPlayerSpaceShip } from './IPlayerSpaceShip'
import { Rocket } from './Rocket'

/**
 * Represents a Player spaceship
 */
export class PlayerSpaceShip extends SpaceShip implements IPlayerSpaceShip {
    /**
     * Shooting a new rocket
     * @param texture rocket texture
     */
    shoot (texture: PIXI.Texture): Rocket {
        return new Rocket(this.x + this.width / 2, this.y, texture)
    }
}
