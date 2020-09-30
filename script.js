const body = document.getElementsByTagName("BODY")[0];
const grid = document.getElementById('grid-container');
const start = document.getElementById('start');
const player = document.getElementById('player');
const stay = document.getElementById('stay');
const playerhand = document.getElementById('playerhand');
const cpu1 = document.getElementById('cpu1');
const cpu2 = document.getElementById('cpu2');
const cpu3 = document.getElementById('cpu3');
let playerscore = '';
let cpu1score = '';
let cpu2score = '';
let cpu3score = '';
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
        let cardBack = document.createElement("img");
        let cardFront = document.createElement("div");
        let card = document.createElement("div");
       
        cardBack.setAttribute("src", cardBackgPNG);
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
        let currentTracker = document.getElementById(`score${i}`)
        if(currentTracker){
            currentTracker.parentNode.removeChild(currentTracker);
        }
        stillPlaying.push(true);
        hands.push([]);
        const scoreTracker = document.createElement("p");
        scoreTracker.setAttribute("id", `score${i}`);
        scoreTracker.setAttribute("class", "tracker");
        body.appendChild(scoreTracker);
        scoreTracker.style.position = 'absolute';
        switch (i) {
            case 0:
                playerscore = scoreTracker;
                playerscore.style.top = (grid.offsetHeight+grid.offsetTop-playerhand.offsetHeight-18) + 'px';
                playerscore.style.left = (grid.offsetLeft+(grid.offsetWidth/2)) + 'px';
                break;
        
            case 1:
                cpu1score = scoreTracker;
                cpu1score.style.top = (cpu1.offsetHeight+grid.offsetTop-18) + 'px';
                cpu1score.style.left = (grid.offsetLeft+(grid.offsetWidth/2)) + 'px';
                break;
        
            case 2:
                cpu2score = scoreTracker;
                cpu2score.style.top = ((grid.offsetHeight/2)+grid.offsetTop-18) + 'px';
                cpu2score.style.left = (grid.offsetLeft+cpu2.offsetWidth) + 'px';
                break;

            case 3:
                cpu3score = scoreTracker;
                cpu3score.style.top = ((grid.offsetHeight/2)+grid.offsetTop-18) + 'px';
                cpu3score.style.left = (grid.offsetLeft+grid.offsetWidth-cpu3.offsetWidth-18) + 'px';
                break;
            
            default:
                break;
        }
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
        const cardToDraw = deck.pop();
        hands[player].push(cardToDraw);
        const cardElement = document.getElementById(cardToDraw[1]+cardToDraw[0]);
        switch (player) {
            case 0:
                playerhand.appendChild(cardElement);
                cardElement.style.position = "static";
                cardElement.classList.add('drawn');
                break;
        
            case 1:
                cpu1.appendChild(cardElement);
                cardElement.style.position = "static";
                hands[player].length > 1 ? cardElement.classList.add('drawn') : '';
                break;

            case 2:
                cpu2.appendChild(cardElement);
                cardElement.style.transform = "rotate(90deg)";
                cardElement.style.position = "static";
                hands[player].length > 1 ? cardElement.classList.add('drawn') : '';
                break;

            case 3:
                cpu3.appendChild(cardElement);
                cardElement.style.transform = "rotate(-90deg)";
                cardElement.style.position = "static";
                hands[player].length > 1 ? cardElement.classList.add('drawn') : '';
                break;

            default:
                break;
        }
    }
}

function cpuDraw(player){
    if(checker(player) < 18){
        drawCard(player);
    } else {
        stillPlaying[player] = false;
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

function visualUpdater(end){
    for(let i = 0; i < players; i++){
        let target = document.getElementById(`score${i}`);
        if(!end && i!==0){
            target.innerHTML = `${(checker(i)-(hands[i][0][1] === 11 || hands[i][0][1] === 12 || hands[i][0][1] === 13 ? 10 : hands[i][0][1] === 14 ? 11 : hands[i][0][1]))}`;
        } else {  
            target.innerHTML = `${checker(i)}`;
        }
    }
}

function playRound(){
    drawCard(0);
    for(let i = 1; i < players; i++){
        cpuDraw(i);
    }
    checker(0);
    checker(1);
    visualUpdater(false);
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
    visualUpdater(true);
    let order = [];
    let scores = [];
    for(let i = 0; i < players; i++){ 
        score = checker(i);
        scores.push(score);
        score <= 21 ? order.push(i) : '';
    }
    for(let i = 1; i < players; i++){ 
        const cardElement = document.getElementById(hands[i][0][1] + hands[i][0][0]);
        cardElement.classList.add('drawn');
    }
    order.sort((b,a) => {return scores[a] < scores[b] ? -1 : scores[a] > scores[b] ? 1 : hands[a].length > hands[b].length ? -1 : 0});
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

