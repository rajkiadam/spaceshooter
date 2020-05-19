/* eslint-disable dot-notation */
/* eslint-disable no-array-constructor */
/* eslint-disable indent */
import * as PIXI from 'pixi.js'
import { PlayerSpaceShip } from './PlayerSpaceShip'
import xwing from './images/xwing.png'
import tie from './images/tie.png'
import rocket from './images/rocket.png'
import far from './images/far.png'
import middle from './images/middle.png'
import front from './images/front.png'
import explode from './images/explosion.png'
import { Controls } from './Enums'
import { Constants } from './Constants'
import { Rocket } from './Rocket'
import { EnemySpaceShip } from './EnemySpaceShip'
import { Particle } from './Particle'
// eslint-disable-next-line no-unused-vars
import { IDisposable } from './IDisposable'
import { Explosion } from './Explosion'

/**
 * Main game
 */
export class Game {
    // application
    app: PIXI.Application = new PIXI.Application(
        {
            width: Constants.APPWIDTH,
            height: Constants.APPHEIGHT
        }
    );

    // player spaceship
    playerSpaceShip!: PlayerSpaceShip;

    // middle parallax tile
    middle!: PIXI.TilingSprite;

    // front parallax tile
    front!: PIXI.TilingSprite;

    // time between enemy spawn
    enemyTime: number = 0;

    // movement change time
    enemyMovementTimer: number = 0;

    // enemy vertical movement
    enemyMoveY = 0;

    // timer for the end of the game
    endTimer: number = 0;

    // scene for the menu animation
    menuScene!: PIXI.Container;

    // scene for the game
    gameScene!: PIXI.Container;

    // app state
    state: any;

    // generic dictionary for game Controls (up, down, left, right, shoot)
    keys: {
        [key: number]: boolean;
    } = {};

    /**
     * Game initialization
     */
    initializeGame () : void {
        document.body.appendChild(this.app.view)

        // preloading pics
        this.app.loader.baseUrl = '/dist/'
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

    // track progress
    showProgress = (e: any) => {
        console.log(e)
    }

    /**
     * sets up the menu scene and ticker
     */
    setup = () => {
        this.menuScene = new PIXI.Container()
        this.app.stage.addChild(this.menuScene)
        this.menuScene.visible = true
        this.state = this.menu
        this.app.ticker.add(delta => this.gameLoop(Constants.DELTA))
    }

    /**
     * Sets up the game
     */
    setupGame = () => {
        this.gameScene = new PIXI.Container()
        this.app.stage.addChild(this.gameScene)

        // far "Galaxy" picture init
        const far = new PIXI.Sprite(this.app.loader.resources['far'].texture)
        far.position.x = far.position.y = 0
        this.gameScene.addChild(far)

        // middle "Moon" picture init
        this.middle = new PIXI.TilingSprite(this.app.loader.resources['middle'].texture, 800, 600)
        this.middle.position.x = 0
        this.middle.position.y = 0
        this.middle.tilePosition.x = 0
        this.middle.tilePosition.y = -100
        this.gameScene.addChild(this.middle)

        // front "atmosphere" picture init
        this.front = new PIXI.TilingSprite(this.app.loader.resources['front'].texture, 800, 600)
        this.front.position.x = 0
        this.front.position.y = 0
        this.front.tilePosition.x = 0
        this.front.tilePosition.y = -100
        this.gameScene.addChild(this.front)

        // player spaceship init
        this.playerSpaceShip = new PlayerSpaceShip(50, this.app.view.height / 2, this.app.loader.resources['player'].texture)
        this.gameScene.addChild(this.playerSpaceShip)
    }

    /**
     * Basic game loop
     * @param delta basic speed
     */
    gameLoop = (delta: number) => {
        this.state(delta)
    }

    /**
     * Play logic for the loop
     * @param delta basic speed
     */
    play = (delta: number) : void => {
        // parallax
        this.middle.tilePosition.x -= 0.15
        this.front.tilePosition.x -= 0.8

        // player destory and game end
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

        // enemy spawn time
        this.enemyTime += this.app.ticker.elapsedMS
        if (this.enemyTime > 2000) {
            this.enemyTime = 0
            this.gameScene.addChild(new EnemySpaceShip(this.app.view.width + 80, Math.random() * 500 + 40, this.app.loader.resources['enemy'].texture))
        }

        const rocketSpeed = Constants.ROCKETSPEED
        // control handling
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
        if (this.keys[Controls.Shoot] && !this.playerSpaceShip.disposable) {
            const rocket = (this.playerSpaceShip as PlayerSpaceShip).shoot(this.app.loader.resources['rocket'].texture)
            this.gameScene.addChild(rocket)
        }

        // game objects handling (movement)
        this.gameScene.children.forEach((item) => {
            if (item instanceof Rocket) {
                const rocket = (item as Rocket)
                rocket.move(rocketSpeed)
            } else if (item instanceof EnemySpaceShip) {
                const enemySpeed = Constants.ENEMYSPEED
                this.enemyMovementTimer += this.app.ticker.deltaMS

                // enemy moving
                const enemy = (item as EnemySpaceShip)
                enemy.moveX(-enemySpeed)
                if (this.enemyMovementTimer > 300) {
                    this.enemyMoveY = Math.random() > 0.5 ? -enemySpeed : enemySpeed
                    this.enemyMovementTimer = 0
                }
                enemy.moveY(this.enemyMoveY)

                // player blowup
                if (!this.playerSpaceShip.disposable && this.collisionDetection(enemy, this.playerSpaceShip)) {
                    enemy.blowUp()
                    this.playerSpaceShip.blowUp()
                    this.gameScene.addChild(new Explosion(this.playerSpaceShip.x, this.playerSpaceShip.y, this.app.loader.resources['explode'].texture))
                    this.gameScene.addChild(new Explosion(enemy.x, enemy.y, this.app.loader.resources['explode'].texture))
                }

                // rocket moving and collision detection
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
            } else if (item instanceof Particle) { // particle move
                const particle = (item as Particle)
                particle.move()
            } else if (item instanceof Explosion) { // explosion move
                const explosion = (item as Explosion)
                explosion.scaleUp()
            }

            // object removal (excluding player spaceship)
            if (!(item instanceof PlayerSpaceShip)) {
                const disposable = (item as unknown as IDisposable)
                if (disposable.disposable) {
                    this.gameScene.removeChild(item)
                }
            }
        })
    }

    /**
     * Key down event handler
     * @param e event
     */
    keysDown = (e: any) => {
        this.keys[e.keyCode] = true
    }

    /**
     * Key down event handler
     * @param e event
     */
    keysUp = (e: any) => {
        this.keys[e.keyCode] = false
    }

    /**
     * Collision detection
     * @param entity1 first entity for collision detection
     * @param entity2 second entity for collision detection
     */
    collisionDetection (entity1: PIXI.Sprite, entity2: PIXI.Sprite) {
        const [aBound, bBound] = [entity1.getBounds(), entity2.getBounds()]
        return aBound.x + aBound.width > bBound.x &&
               aBound.y + aBound.height > bBound.y &&
               bBound.x + bBound.width > aBound.x &&
               bBound.y + bBound.height > aBound.y
    }

    /**
     * Menu animation
     */
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

    /**
     * Start the game
     */
    startGame = () => {
        this.setupGame()
        this.gameScene.visible = true
        this.toggleMenu(false)
        this.menuScene.visible = false
        this.state = this.play
    }

    /**
     * Switching menu on and off
     * @param menuOn true if menu should be ON otherwise false
     */
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
