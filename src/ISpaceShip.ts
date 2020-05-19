/**
 * Interface for the spaceship functionalities
 */
export interface ISpaceShip {
    moveX(deltaX: number) : boolean;
    moveY(deltaY: number) : boolean;
    outOfBorderX(deltaX: number) : boolean;
    outOfBorderY(deltaY: number) : boolean;
    blowUp() : void;
}
