/* eslint-disable indent */
import { SpaceShip } from './spaceship'

export class EnemySpaceShip extends SpaceShip implements IEnemySpaceShip {
    emitParticles (): void {
        throw new Error('Method not implemented.')
    }

    moveX = (delta: number = 0): boolean => {
        if (!this.outOfBorderX(delta)) {
            this.x += delta
            return true
        } else {
            this.disposable = true
            return false
        }
    }

    outOfBorderX = (deltaX: number): boolean => {
      return this.x + this.width + deltaX < 0
    }
}
