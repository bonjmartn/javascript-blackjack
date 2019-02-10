// ---------------- //
// Global Variables //
// ---------------- //

// UI elements
const drawnCardsDiv = document.getElementById('drawnCardsDiv'),
        dealerCardsDiv = document.getElementById('dealerCardsDiv'),
        drawButton = document.getElementById('drawButton'),
        hitButton = document.getElementById('hitButton'),
        standButton = document.getElementById('standButton'),
        resetBetButton = document.getElementById('resetBetButton'),
        totalDisplay = document.getElementById('total'),
        totalText = document.getElementById('totalText'),
        dealerTotalDisplay = document.getElementById('dealerTotal'),
        dealerTotalText = document.getElementById('dealerTotalText'),
        gameMessage = document.getElementById('gameMessage'),
        dealerMessage = document.getElementById('dealerMessage'),
        aceMessage = document.getElementById('aceMessage'),
        betDisplay = document.getElementById('bet'),
        creditsDisplay = document.getElementById('credits'),
        chip10link = document.getElementById('chip10link'),
        chip25link = document.getElementById('chip25link'),
        chip50link = document.getElementById('chip50link');
        chipsDiv = document.getElementById('chipsDiv');      

// Player drawn cards array
let drawnCards = new Array();
let total = 0;

// Dealer drawn cards array
let dealerDrawnCards = new Array();
let dealerTotal = 0;

// Betting
let creditsTotal = 500;
let bet = 0;
creditsDisplay.innerHTML = creditsTotal;

// Initial setup
hitButton.disabled = true;
standButton.disabled = true;
gameMessage.innerHTML = 'Play Blackjack!';

// ---------------- //
// Draw Cards       //
// ---------------- //

// Choose a card from the deck
function getCard(card, player) {
    
    // get a random card number
    let randomCardID = Math.floor(Math.random()*(52)+1);
    
    // this loop looks through the array of cards to find the one with the same ID as the random number, then uses that card's image property to set the image in the browser    
    for (i = 0; i < deck.length; i++) { 
        
        if (randomCardID === deck[i].id) {
            // put the card on the screen           
            card.src = deck[i].image;
            // get the card value and add it to the array of drawn cards
            cardValue = deck[i].value; 
            
            if (player) { // this is a player draw
                drawnCards.push(cardValue);

                // deal with Aces
                if (deck[i].name === "Ace") {
                    aces();
                }
            }
            else if (!player) { // this is a dealer draw
                dealerDrawnCards.push(cardValue);

                // deal with Aces
                if (deck[i].name === "Ace") {
                    dealerAces();                
                }
            }
        }
    }
    standButton.disabled = false;
}

// ----------------  //
// Dealer Draw Cards //
// ----------------  //

function dealerDraw() {
    // remove first card back
    dealerCardsDiv.firstChild.remove();

    const dealerCard2 = document.createElement('img');
    dealerCard2.id = 'dealerCard2';
    dealerCardsDiv.appendChild(dealerCard2);

    const player = false; // this is the dealer

    // get the second dealer card and add them up
    getCard(dealerCard2, player);
    dealerAddCards();
}

// ---------------- //
// Aces             //
// ---------------- //

// allow player to choose whether an Ace is 1 or 11
function aces() {

    // if total is already 21 then no need to do it
    if (total !== 21) {    
        aceMessage.innerHTML = 'Ace! Choose 1 or 11 ';        

        // make buttons for 1 or 11 choices
        const chooseAce1Button = document.createElement('button');
        chooseAce1Button.innerHTML = '1';
        const chooseAce11Button = document.createElement('button');
        chooseAce11Button.innerHTML = '11';
        aceMessage.appendChild(chooseAce1Button);
        aceMessage.appendChild(chooseAce11Button);

        // will they choose 1?
        chooseAce1Button.addEventListener('click', function(){
            // total stays the same
            aceMessage.innerHTML = '';            
        });

        // will they choose 11?
        chooseAce11Button.addEventListener('click', function(){
            // add 10 to the total
            drawnCards.push(10);
            total += 10;
            totalDisplay.innerHTML = total;
            aceMessage.innerHTML = '';
            if (total == '21') {
                win();
            }
            else if (total > '21') {
                lose();
            }
            else if (total < '21') {
               hitButton.disabled = false;
               standButton.disabled = false; 
            }
        });
    }
}

// dealer Aces
function dealerAces() {

    // if this is the first draw, add 10 to dealerTotal but don't display it yet
    if (dealerTotal == 0) {
        dealerDrawnCards.push(10);
    }   
    // if making an ace 11 would not cause a bust, make it 11 
    else if (dealerTotal > 0 && (dealerTotal + 11) <= 21) {
        dealerTotal += 10;
        dealerTotalDisplay.innerHTML = dealerTotal;
    }
}

// ---------------- //
// Player Add Cards //
// ---------------- //

// Add the values of the cards drawn so far
function addCards() {

    // this loops through the array of drawn cards to add them up
    for (i = 0; i < drawnCards.length; i++) { 
        total += drawnCards[i];
        totalDisplay.innerHTML = total;        
    }
    
    if (total > 21) {
        lose();
    }
    else if (total == 21) {
        win();
    }
    else if (total < 21) { // game continuing
        drawButton.disabled = true; // don't redraw yet
        hitButton.disabled = false; // you can hit
        standButton.disabled = false; // you can stand
    }
}

// ---------------- //
// Dealer Add Cards //
// ---------------- //

// Add the values of the cards drawn so far
function dealerAddCards() {

    // this loops through the array of drawn cards to add them up
    for (i = 0; i < dealerDrawnCards.length; i++) { 
        dealerTotal += dealerDrawnCards[i];                
    }
    dealerTotalDisplay.innerHTML = dealerTotal;
    checkDealerTotal();
}

// ---------------- //
// Start a Game     //
// ---------------- //

// Listen for click on draw button
drawButton.addEventListener('click', function(){ 
    
    // reset the elements from any existing game
    newDraw();

    // make sure a bet is placed first
    if (bet != 0) {

        // get rid of card backs
        drawnCardsDiv.innerHTML = '';

        // make first 2 player card elements
        const card1 = document.createElement('img');
        card1.id = 'playerCard1';
        drawnCardsDiv.appendChild(card1);
        const card2 = document.createElement('img');
        card2.id = 'playerCard2';
        drawnCardsDiv.appendChild(card2);

        // these are player cards
        const player = true;

        // get the first 2 cards and add them up
        getCard(card1, player);
        getCard(card2, player);
        addCards();

        // get first dealer card
        dealerCard1();

        // disable ability to change bet
        betsOff();

        gameMessage.innerHTML = '';

    }
    else {
        gameMessage.innerHTML = 'Place a bet before drawing cards!';
        betsOn();
    }
});

// first dealer card
function dealerCard1() {
    
    // get rid of card back 1
    dealerCardsDiv.firstChild.remove();

    // make first dealer card element
    const dealerCard1 = document.createElement('img');
    dealerCard1.id = 'dealerCard1';
    dealerCardsDiv.appendChild(dealerCard1);

    // these are dealer cards
    const player = false;

    // get the first 2 cards and add them up
    getCard(dealerCard1, player);
}

// ---------------- //
// Win Lose Push    //
// ---------------- //

// what happens when you win
function win() {
    gameMessage.innerHTML = 'YOU WIN! Credits Won: ' + bet;
    // update credits
    creditsTotal = creditsTotal + bet;
    creditsDisplay.innerHTML = creditsTotal;
    outcomeReset();
}

// what happens when you lose
function lose() {
    outcomeReset();
    gameMessage.innerHTML = 'YOU LOSE! Credits Lost: ' + bet;
    // update credits
    creditsTotal = creditsTotal - bet;
    creditsDisplay.innerHTML = creditsTotal;
    // check credits and give another 500 if dropped to 0
    if (creditsTotal <= 0) {
        creditsTotal += 500;        
        gameMessage.innerHTML = 'You lost all your credits, so the house has granted you another 500.';
        creditsDisplay.innerHTML = creditsTotal;
    }
}

function push() {    
    gameMessage.innerHTML = 'Deal Outcome: PUSH'; 
    outcomeReset();
}

function outcomeReset() {
    hitButton.disabled = true;
    drawButton.disabled = false;
    standButton.disabled = true;
    aceMessage.innerHTML = '';
    // allow bets again
    betsOn();
}

// ---------------- //
// Stand            //
// ---------------- //

// Listen for click on stand button
standButton.addEventListener('click', function(){ 
    // if you click Stand, that means you're done drawing
    // your total stays where it is

    // remove the remaining dealer card back
    dealerCardsDiv.firstChild.remove();
    // get the dealer's second card
    dealerDraw();
});

// ---------------- //
// Hits             //
// ---------------- //

// Listen for click on hit button
hitButton.addEventListener('click', function(){ 

    // can't double down anymore
    gameMessage.innerHTML = '';
    
    const cardHit = document.createElement('img');
    cardHit.className = 'playerCardHit';
    drawnCardsDiv.appendChild(cardHit);

    const player = true;
    getCard(cardHit, player);      

    // add hit value to existing array
    // but first reset total otherwise it'll count everything again
    total = 0;
    addCards();    
});

// ---------------- //
// Dealer Hit       //
// ---------------- //

// allow the dealer to hit if the player clicked the Stand button
function dealerHit() {

    setTimeout(function(){        
        const dealerCardHit = document.createElement('img');
        dealerCardHit.className = 'dealerCardHit';
        dealerCardsDiv.appendChild(dealerCardHit);

        const player = false;
        getCard(dealerCardHit, player);

        // add hit value to existing array
        // but first reset total otherwise it'll count everything again
        dealerTotal = 0;
        dealerAddCards();
    }, 800); 
}

// ---------------- //
// Reset Game       //
// ---------------- //

// New Draw - resets all elements
function newDraw() {
    drawnCards = [];
    dealerDrawnCards = [];
    total = 0;
    dealerTotal = 0;
    drawnCardsDiv.innerHTML = `<img src="img/deck/red_back.png">
    <img src="img/deck/red_back.png">`;
    dealerCardsDiv.innerHTML =  `<img id="cardBack1" src="img/deck/red_back.png">
    <img id="cardBack2" src="img/deck/red_back.png">`;
    totalDisplay.innerHTML = '';
    dealerTotalDisplay.innerHTML = '';
    gameMessage.innerHTML = 'Play Blackjack!';
    aceMessage.innerHTML = '';
    dealerMessage.innerHTML = '';
    creditsDisplay.innerHTML = creditsTotal;
    hitButton.disabled = true;
    standButton.disabled = true;
    drawButton.disabled = false;   
}

// ---------------- //
// Bets             //
// ---------------- //

function betsOff() {
    // disable clicking on the chips
    chipsDiv.classList.add("noClick");
    resetBetButton.disabled = true;
}

function betsOn() {
    // enable clicking on the chips
    chipsDiv.classList.remove("noClick"); 
    resetBetButton.disabled = false;   
}

function betCalculation(amount) {
    bet += amount;
    // check whether the bet is now more than the credits
    if (bet > creditsTotal) {
        bet -= amount;        
    }
    betDisplay.innerHTML = bet;
}

// Listen for click on 10 chip
chip10link.addEventListener('click', function(e){ 
    e.preventDefault(); // stop regular behavior of a link
    betCalculation(10);
});

// Listen for click on 25 chip
chip25link.addEventListener('click', function(e){ 
    e.preventDefault(); // stop regular behavior of a link
    betCalculation(25);
});

// Listen for click on 50 chip
chip50link.addEventListener('click', function(e){ 
    e.preventDefault(); // stop regular behavior of a link
    betCalculation(50);
});

// Listen for click on reset bet button
resetBetButton.addEventListener('click', function(){ 
    bet = 0;
    betDisplay.innerHTML = bet;
});

// ---------------- //
// Dealer Math      //
// ---------------- //

// check dealerTotal status
function checkDealerTotal() {

    // dealer stands on 17 (or more)
    if (dealerTotal > 16 && dealerTotal < 21) {
        dealerMessage.innerHTML = 'Dealer Stands'
        comparePlayerVSDealer();
    }
    // dealer got 21, see if the player did also
    else if (dealerTotal == 21) {
        comparePlayerVSDealer();
    }
    // dealer busted
    else if (dealerTotal > 21) {
        dealerMessage.innerHTML = 'Dealer Busted'
        win();
    }
    // dealer needs to hit again
    else {
        dealerHit();
    }
}

// check dealer total vs player's total
function comparePlayerVSDealer() {

    if (dealerTotal < total) {
        win();
    }
    else if (dealerTotal == total) {
        push();
    }
    else {
        lose();
    }
}