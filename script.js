let deck = [];
let players = 2;
let stillPlaying = [];
let hands = [];


function createDeck() {
    deck = [];
    for(let i = 1; i <= 4; i++){
        for(let j = 2; j <= 14; j++){
            deck.push([i,j]);
        }
    } 
}

function shuffleDeck(){
    for(let i = 0; i < 100; i++){
        let x = Math.floor(Math.random() * 52);
        let y = Math.floor(Math.random() * 52);
        if(x !== y){
            let firstCard = deck[x];
            let secondCard = deck[y];
            deck[x] = secondCard;
            deck[y] = firstCard;
        }
    }
}

function startGame(){
    hands = [];
    stillPlaying = []
    for(let i = 0; i < players; i++){
        stillPlaying.push(true);
    }
    for(let i = 0; i < players; i++){
        hands.push([]);
    }
    createDeck()
    shuffleDeck()
    for(let j = 0; j < 2; j ++){
        for(let i = 0; i < players; i++){
            drawCard(i);
        }  
    }
    visualUpdater();
    console.log(hands)
}

function drawCard(player){
    if(stillPlaying[player]){
        hands[player].push(deck.pop())
    }
}

function cpuDraw(player){
    if(checker(player) < 18){
        drawCard(player);
    }
}

function handValuator(player, times, overMax){
    let playersSum = hands[player].reduce((sum, playersHand) => {
        return sum + playersHand[1];
    }, 0);

    const aces = hands[player].reduce((sum, playersHand) => {
        return playersHand[1] === 14 ? sum + 1 : sum;
    }, 0);

    if (overMax){
        switch (times) {
            case 1:
                aces >= 1 ? playersSum -= (13 * 1) : '';
                break;
            case 2:
                aces >= 2 ? playersSum -= (13 * 2) : '';
                break;
            case 3:
                aces >= 3 ? playersSum -= (13 * 3) : '';
                break;
            case 4:
                aces >= 4 ? playersSum -= (13 * 4) : '';
                break;
            default:
                break;
        }
    }
    return playersSum;
}

function checker(player){
    let maxed = false;
    let handValue = 0;

    for(let i = 0; i < 5; i++){
        handValuator(player, i, maxed) > 21 ? maxed = true : handValue = handValuator(player, i, maxed);
    } 
    if(handValue === 0){
        handValue = handValuator(player, 4, maxed);
        stillPlaying[player] = false;
    }
    return handValue;
}

function visualUpdater(){
    cards.innerHTML = `Player hand ${hands[0].map(card => card[1])} CPU hand ${hands[1].map(card => card[1])}`;
    values.innerHTML = `Player ${checker(0)} CPU${checker(1)}`;
}

function playRound(){
    drawCard(0);
    for(let i = 1; i < players; i++){
        cpuDraw(i);
    }
    checker(0);
    visualUpdater();
    if(!stillPlaying.includes(true)){
        endGame();
    }
}

function endGame(){
    checker(0) > checker(1);
}

const start = document.getElementById('start');
const player = document.getElementById('player');
const cards = document.getElementById('cards');
const values = document.getElementById('values');
const stay = document.getElementById('stay');

start.addEventListener('click', startGame);
player.addEventListener('click', () => playRound());
stay.addEventListener('click', endGame())

