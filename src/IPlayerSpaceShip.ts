import { Rocket } from "./rocket";

export interface IPlayerSpaceShip {
    shoot(texture: PIXI.Texture): Rocket
}