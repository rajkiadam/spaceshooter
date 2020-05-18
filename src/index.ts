import * as _ from 'lodash';
import * as Game from './game';

let game: Game.Game;
window.onload = () => {
    let timer = setTimeout(() => {
        let item = document.getElementById("splashscreen");
        if(item != null) {
            item.classList.add("splashscreen-fade");
            let zindexTimer = setTimeout(() => {
                if(item != null){
                    item.classList.add("splashscreen-z");
                }
            }, 1000)
        }
    }, 2000)

    game = new Game.Game();
    game.initializeGame()

    let gameCall = game.startGame;

    Array.from(document.getElementsByClassName("gameButton")).forEach((item) => {
        item.addEventListener('click', gameCall);
    })

    let exit = document.getElementById("exitButton");
    if(exit != null)
    exit.addEventListener('click', () => {
        window.location.href = 'https://www.pixijs.com'
    })    
}






