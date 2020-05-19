/* eslint-disable indent */
import { SpaceShip } from './Spaceship'

/**
 * Class represents an Enemy Spaceship
 */
export class EnemySpaceShip extends SpaceShip {
    emitParticles (): void {
        throw new Error('Method not implemented.')
    }

    /**
     * Moves the spaceship horizontally
     * @param delta the velocity of the spaceship movement
     */
    moveX = (delta: number = 0): boolean => {
        if (!this.outOfBorderX(delta)) {
            this.x += delta
            return true
        } else {
            this.disposable = true
            return false
        }
    }

    /**
     * Check if the spaceship is out of the view area
     * @param delta the velocity of the spaceship movement
     */
    outOfBorderX = (deltaX: number): boolean => {
      return this.x + this.width + deltaX < 0
    }
}
