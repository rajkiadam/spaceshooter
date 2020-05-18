/* eslint-disable dot-notation */
/* eslint-disable no-array-constructor */
/* eslint-disable indent */
import * as PIXI from 'pixi.js'
import { PlayerSpaceShip } from './PlayerSpaceShip'
import xwing from '../images/xwing.png'
import tie from '../images/tie.png'
import rocket from '../images/rocket.png'
import far from '../images/far.png'
import middle from '../images/middle.png'
import front from '../images/front.png'
import explode from '../images/explosion.png'
import { Controls } from './enums'
import { Constants } from './constants'
import { Rocket } from './rocket'
import { EnemySpaceShip } from './EnemySpaceShip'
import { Particle } from './Particle'
// eslint-disable-next-line no-unused-vars
import { IDisposable } from './IDisposable'
import { Explosion } from './Explosion'

export class Game {
    app: PIXI.Application = new PIXI.Application(
        {
            width: Constants.APPWIDTH,
            height: Constants.APPHEIGHT
        }
    );

    playerSpaceShip!: PlayerSpaceShip;
    middle!: PIXI.TilingSprite;
    front!: PIXI.TilingSprite;
    rockets: Array<Rocket> = new Array<Rocket>();
    enemies: Array<EnemySpaceShip> = new Array<EnemySpaceShip>();

    enemyTime: number = 0;
    enemyMovementTimer: number = 0;
    enemyMoveY = 0;
    endTimer: number = 0;

    menuScene!: PIXI.Container;
    gameScene!: PIXI.Container;

    state: any;

    keys: {
        [key: number]: boolean;
    } = {};

    initializeGame () : void {
        document.body.appendChild(this.app.view)

        this.app.loader
            .add('player', xwing)
            .add('enemy', tie)
            .add('rocket', rocket)
            .add('front', front)
            .add('far', far)
            .add('middle', middle)
            .add('explode', explode)

        this.app.loader.onProgress.add(this.showProgress)
        this.app.loader.onComplete.add(this.setup)
        this.app.loader.load()

        window.addEventListener('keydown', this.keysDown)
        window.addEventListener('keyup', this.keysUp)
    }

    showProgress = (e: any) => {
        console.log(e)
    }

    setup = () => {
        this.menuScene = new PIXI.Container()
        this.app.stage.addChild(this.menuScene)
        this.menuScene.visible = true
        this.state = this.menu
        this.app.ticker.add(delta => this.gameLoop(Constants.DELTA))
    }

    setupGame = () => {
        this.gameScene = new PIXI.Container()
        // this.gameScene.visible = false;
        this.app.stage.addChild(this.gameScene)
        const far = new PIXI.Sprite(this.app.loader.resources['far'].texture)
        far.position.x = far.position.y = 0
        this.gameScene.addChild(far)

        this.middle = new PIXI.TilingSprite(this.app.loader.resources['middle'].texture, 800, 600)
        this.middle.position.x = 0
        this.middle.position.y = 0
        this.middle.tilePosition.x = 0
        this.middle.tilePosition.y = -100
        this.gameScene.addChild(this.middle)

        this.front = new PIXI.TilingSprite(this.app.loader.resources['front'].texture, 800, 600)
        this.front.position.x = 0
        this.front.position.y = 0
        this.front.tilePosition.x = 0
        this.front.tilePosition.y = -100
        this.gameScene.addChild(this.front)

        this.playerSpaceShip = new PlayerSpaceShip(50, this.app.view.height / 2, this.app.loader.resources['player'].texture)
        this.gameScene.addChild(this.playerSpaceShip)
    }

    gameLoop = (delta: number) => {
        this.state(delta)
    }

    play = (delta: number) : void => {
        this.middle.tilePosition.x -= 0.15
        this.front.tilePosition.x -= 0.8

        if (this.playerSpaceShip.disposable) {
            this.gameScene.removeChild(this.playerSpaceShip)
            this.endTimer += this.app.ticker.elapsedMS
            if (this.endTimer > 1000) {
                this.endTimer = 0
                this.gameScene.visible = false
                this.gameScene.destroy()
                this.toggleMenu(true)
                this.menuScene.visible = true
                this.state = this.menu
            }
        }

        this.enemyTime += this.app.ticker.elapsedMS

        if (this.enemyTime > 2000) {
            this.enemyTime = 0
            this.gameScene.addChild(new EnemySpaceShip(this.app.view.width + 80, Math.random() * 500 + 40, this.app.loader.resources['enemy'].texture))
        }

        const rocketSpeed = Constants.ROCKETSPEED
        let moved = false
        if (this.keys[Controls.Up]) {
            moved = (this.playerSpaceShip as PlayerSpaceShip).moveY(-delta)
            if (moved) {
                this.middle.tilePosition.y += 0.15
                this.front.tilePosition.y += 0.8
            }
        }
        if (this.keys[Controls.Down]) {
            moved = (this.playerSpaceShip as PlayerSpaceShip).moveY(delta)
            if (moved) {
                this.middle.tilePosition.y -= 0.15
                this.front.tilePosition.y -= 0.8
            }
        }
        if (this.keys[Controls.Left]) {
            moved = (this.playerSpaceShip as PlayerSpaceShip).moveX(-delta)
            if (moved) {
                this.middle.tilePosition.x += 0.075
                this.front.tilePosition.x += 0.4
            }
        }
        if (this.keys[Controls.Right]) {
            moved = (this.playerSpaceShip as PlayerSpaceShip).moveX(delta)
            if (moved) {
                this.middle.tilePosition.x -= 0.3
                this.front.tilePosition.x -= 1.6
            }
        }
        if (this.keys[Controls.Shoot]) {
            const rocket = (this.playerSpaceShip as PlayerSpaceShip).shoot(this.app.loader.resources['rocket'].texture)
            this.gameScene.addChild(rocket)
        }

        this.gameScene.children.forEach((item) => {
            if (item instanceof Rocket) {
                const rocket = (item as Rocket)
                rocket.move(rocketSpeed)
            } else if (item instanceof EnemySpaceShip) {
                const enemySpeed = Constants.ENEMYSPEED
                this.enemyMovementTimer += this.app.ticker.deltaMS

                const enemy = (item as EnemySpaceShip)
                enemy.moveX(-enemySpeed)
                if (this.enemyMovementTimer > 300) {
                    this.enemyMoveY = Math.random() > 0.5 ? -enemySpeed : enemySpeed
                    this.enemyMovementTimer = 0
                }
                enemy.moveY(this.enemyMoveY)

                if (!this.playerSpaceShip.disposable && this.collisionDetection(enemy, this.playerSpaceShip)) {
                    enemy.blowUp()
                    this.playerSpaceShip.blowUp()
                    this.gameScene.addChild(new Explosion(this.playerSpaceShip.x, this.playerSpaceShip.y, this.app.loader.resources['explode'].texture))
                    this.gameScene.addChild(new Explosion(enemy.x, enemy.y, this.app.loader.resources['explode'].texture))
                }

                this.gameScene.children.filter((item) => {
                    return item instanceof Rocket
                }).forEach((item) => {
                    const rocket = (item as Rocket)
                    if (this.collisionDetection(enemy, rocket)) {
                        for (let i = 0; i < 10; i++) {
                            this.gameScene.addChild(new Particle(enemy.x, enemy.y))
                        }
                        enemy.blowUp()
                        rocket.blowUp()
                        this.gameScene.addChild(new Explosion(enemy.x, enemy.y, this.app.loader.resources['explode'].texture))
                    }
                })
            } else if (item instanceof Particle) {
                const particle = (item as Particle)
                particle.move()
            } else if (item instanceof Explosion) {
                const explosion = (item as Explosion)
                explosion.scaleUp()
            }

            if (!(item instanceof PlayerSpaceShip)) {
                const disposable = (item as unknown as IDisposable)
                if (disposable.disposable) {
                    this.gameScene.removeChild(item)
                }
            }
        })
    }

    keysDown = (e: any) => {
        this.keys[e.keyCode] = true
    }

    keysUp = (e: any) => {
        this.keys[e.keyCode] = false
    }

    collisionDetection (entity1: PIXI.Sprite, entity2: PIXI.Sprite) {
        const [aBound, bBound] = [entity1.getBounds(), entity2.getBounds()]
        return aBound.x + aBound.width > bBound.x
               && aBound.y + aBound.height > bBound.y
               && bBound.x + bBound.width > aBound.x
               && bBound.y + bBound.height > aBound.y
    }

    menu = () => {
        for (let i = 0; i < 5; i++) {
            this.menuScene.addChild(new Particle(this.app.view.width / 2, this.app.view.height / 2))
        }

        this.menuScene.children.filter((item) => {
            return item instanceof Particle
        }).forEach(element => {
            const particle = (element as Particle)
            particle.move()
            if (particle.disposable) {
                this.menuScene.removeChild(particle)
            }
        })
    }

    startGame = () => {
        this.setupGame()
        this.gameScene.visible = true
        this.toggleMenu(false)
        this.menuScene.visible = false
        this.state = this.play
    }

    toggleMenu (menuOn: boolean) {
        const menuElement = document.getElementById('menu')
        if (menuElement != null) {
            if (!menuOn) {
                menuElement.classList.add('menu-z')
            } else {
                menuElement.classList.remove('menu-z')
            }
        }
    }
}
