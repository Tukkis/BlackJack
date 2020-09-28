const start = document.getElementById('start');
const player = document.getElementById('player');
const cards = document.getElementById('cards');
const values = document.getElementById('values');
const stay = document.getElementById('stay');
const playerhand = document.getElementById('playerhand');
const cpu1 = document.getElementById('cpu1');
const cpu2 = document.getElementById('cpu2');
const cpu3 = document.getElementById('cpu3');
const renderedDeck = document.getElementById("deck");
const cardBackgPNG = "./Kortti.png";

let deck = [];
let players = 3;
let stillPlaying = [];
let hands = [];

function createDeck() {
    deck = [];
    for(let i = 1; i <= 4; i++){
        for(let j = 2; j <= 14; j++){
            const suits = '♠︎ ♥︎ ♣︎ ♦︎'.split(' ');
            deck.push([suits[i - 1],j]);
        }
    } 
    renderDeck(deck);
}

function renderDeck(deck)
{
    renderedDeck.innerHTML = "";
    playerhand.innerHTML = "";
    cpu1.innerHTML = "";
    cpu2.innerHTML = "";
    cpu3.innerHTML = "";

    const ranks = '2 3 4 5 6 7 8 9 10 J Q K A'.split(' ');

	for(let i = 0; i < deck.length; i++)
	{
        let cardBack = document.createElement("img");
        let cardFront = document.createElement("div");
        let card = document.createElement("div");
        let icon = '';
        let color = '';
		if (deck[i][0] == '♥︎'){
            icon='♥︎';
            color='red'
        }
		else if (deck[i][0] == '♠︎'){
            icon='♠︎';
            color='black'
        }
		else if (deck[i][0] == '♣︎'){
            icon='♣︎';
            color='black'
        }
		else{
            icon='♦︎';
            color='red'
        }

        cardBack.setAttribute("src", cardBackgPNG);
        cardFront.style.display = "none";
		cardFront.innerHTML = ranks[deck[i][1] - 2] + '' + icon;
        card.className = 'card ' + color;
        cardFront.className = color + ' cardfront';
        card.appendChild(cardBack);
        card.appendChild(cardFront);
        card.id = deck[i][1] + icon;
		renderedDeck.appendChild(card);
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
    renderDeck(deck);
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
        let cardToDraw = deck.pop();
        hands[player].push(cardToDraw);
        let cardElement = document.getElementById(cardToDraw[1]+cardToDraw[0]);
        switch (player) {
            case 0:
                playerhand.appendChild(cardElement);
                cardElement.style.position = "static";
                cardElement.classList.add('drawn');
                break;
        
            case 1:
                cpu1.appendChild(cardElement);
                cardElement.style.position = "static";
                break;

            case 2:
                cpu2.appendChild(cardElement);
                cardElement.style.transform = "rotate(90deg)";
                cardElement.style.position = "static";
                break;

            case 3:
                cpu3.appendChild(cardElement);
                cardElement.style.transform = "rotate(-90deg)";
                cardElement.style.position = "static";
                break;

            default:
                break;
        }
    }
}

function cpuDraw(player){
    if(checker(player) < 18){
        drawCard(player);
    } 
}

function handValuator(player, times, overMax){
    let playersSum = hands[player].reduce((sum, playersHand) => {
        return sum + (playersHand[1] === 11 || playersHand[1] ===  12 || playersHand[1] ===  13 ? 10 : playersHand[1] === 14 ? 11 : playersHand[1]);
    }, 0);

    const aces = hands[player].reduce((sum, playersHand) => {
        return playersHand[1] === 14 ? sum + 1 : sum;
    }, 0);

    if (overMax){
        switch (times) {
            case 1:
                aces >= 1 ? playersSum -= (10 * 1) : '';
                break;
            case 2:
                aces >= 1 ? playersSum -= (10 * aces) : '';
                break;
            case 3:
                aces >= 1 ? playersSum -= (10 * aces) : '';
                break;
            case 4:
                aces >= 1 ? playersSum -= (10 * aces) : '';
                break;
            default:
                break;
        }
    }
    playersSum <= 21 ? maxed = false : '';

    return playersSum;
}

function checker(player){
    let maxed = false;
    let handValue = 0;

    for(let i = 0; i < 5; i++){
        if(handValuator(player, i, maxed) > 21){
            maxed = true;
        } else {
            handValue = handValuator(player, i, maxed);
            maxed = false;
        }
    } 
    if(handValue === 0){
        handValue = handValuator(player, 4, maxed);
        stillPlaying[player] = false;
    }
    return handValue;
}

function visualUpdater(){
    function cpuhands(){
        let returnValue = '';
        for(let i = 1; i < players; i++){
            returnValue += ` CPU${i} hand ${hands[i].map(card => card[1])}`;
        }
        return returnValue;
    }

    function cpuvalues() {
        let returnValue = '';
        for(let i = 1; i < players; i++){
            returnValue += ` CPU${i} ${checker(i)}`;
        }
        return returnValue;
    }

    cards.innerHTML = `Player hand ${hands[0].map(card => card[1])}${cpuhands()}`;
    values.innerHTML = `Player ${checker(0)}${cpuvalues()}`;
}

function playRound(){
    drawCard(0);
    for(let i = 1; i < players; i++){
        cpuDraw(i);
    }
    checker(0);
    checker(1);
    visualUpdater();
    if(!stillPlaying.includes(true)){
        endGame();
    }
}

function endGame(){
    for(let i = 0; i < 5; i++){
        for(let j = 1; j < players; j++){
            checker(j) < checker(0) ? cpuDraw(j) : '';
        }
    } 
    visualUpdater();
    let order = [];
    let scores = [];
    for(let i = 0; i < players; i++){
        scores.push(checker(i));
        stillPlaying[i] ? order.push(i) : '';
    }
    order.sort((b,a) => {return scores[a] < scores[b] ? -1 : scores[a] > scores[b] ? 1 : 0});
    console.log(order, scores);
    if(order[0] === 0){
        window.alert('Player Wins!');
    } else if(order[0] === undefined){
        window.alert('All Bust!');
    } else {
        window.alert(`CPU${order[0]} Wins!`)
    }
}




start.addEventListener('click', startGame);
player.addEventListener('click', () => playRound());
stay.addEventListener('click', () => endGame());

