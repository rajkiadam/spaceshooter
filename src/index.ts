/**
 * Main entry point of the application
 */

/* eslint-disable indent */
// eslint-disable-next-line no-unused-vars
import * as _ from 'lodash'
import * as Game from './Game'

let game: Game.Game

window.onload = () => {
    // menu handling
    setTimeout(() => {
        const item = document.getElementById('splashscreen')
        if (item != null) {
            item.classList.add('splashscreen-fade')
            setTimeout(() => {
                if (item != null) {
                    item.classList.add('splashscreen-z')
                }
            }, 1000)
        }
    }, 2000)

    // game initialization
    game = new Game.Game()
    game.initializeGame()

    const gameCall = game.startGame

    // add listeners on game buttons
    Array.from(document.getElementsByClassName('gameButton')).forEach((item) => {
        item.addEventListener('click', gameCall)
    })

    // add listener on exit button
    const exit = document.getElementById('exitButton')
    if (exit != null) {
        exit.addEventListener('click', () => {
            window.location.href = 'https://www.pixijs.com'
        })
    }
}
