// eslint-disable-next-line no-unused-vars
import { Rocket } from './Rocket'

/**
 * Player spaceship specific interface
 */
export interface IPlayerSpaceShip {
    /**
     * Shooting rockets
     * @param texture rocket texture
     */
    shoot(texture: PIXI.Texture): Rocket
}
