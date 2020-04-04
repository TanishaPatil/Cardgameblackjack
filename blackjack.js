/* -------------
   DECK OF CARDS
   ------------- */
function Deck(num=1){
    var deck = [];
    var suits = ["spades","diamonds","clubs","hearts"];
    var values = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"];    
    
    this.getDeck = function(){
        return this.setDeck();
    };

    this.setDeck = function(){
        for(var x=0;x<num;x++){
            for(var i=0;i<suits.length;i++){
                for(var j=0;j<values.length;j++){
                    var card = {Value: values[j], Suit: suits[i]};
                    deck.push(card);
                }
            }
        }
        return deck;
    };
}

function Shuffle(deck){
    var set = deck.getDeck(),shuffled = [],card;
    this.setShuffle = function(){
        while(set.length>0){
            card = Math.floor(Math.random()*set.length);
            shuffled.push(set[card]);
            set.splice(card,1);
        }
        return shuffled;
    };
    this.getShuffled = function(){
        return this.setShuffle();
    };
}

/* PLAYER */
var shuffled;
var playerhand = [];
var dealerhand = [];
var playerWager = 0;
var playerCurrency = 1000;

function deal()
{
    if(document.getElementById("wager").value == ""){
        playerWager = 10;
        playerCurrency -= playerWager;
    } else {
        playerWager = document.getElementById("wager").value;
        if(playerWager > playerCurrency){
            alert('You dont have enough money');
            return;
        }
        playerCurrency -= playerWager;
    }
 
    document.getElementById("bet").innerHTML = "Current Bet: $"+playerWager;
    document.getElementById("currency").innerHTML = "You have: $"+playerCurrency;

    playerhand = [];
    dealerhand = [];

    var div = document.getElementById("player-hand");
    while(div.firstChild){
        div.removeChild(div.firstChild);
    }

    var div = document.getElementById("dealer-hand");
    while(div.firstChild){
        div.removeChild(div.firstChild);
    }

    var card = shuffled.pop();
    dealerhand.push(card);
    renderHand(card,"dealer");
    card = shuffled.pop();
    playerhand.push(card);
    renderHand(card,"player");
    
    card = shuffled.pop();
    dealerhand.push(card);
    renderHand(card,"dealer",true);
    card = shuffled.pop();
    playerhand.push(card);
    renderHand(card,"player");

    document.getElementById("phand").hidden = false;
    document.getElementById("dhand").hidden = false;
    document.getElementById('dealer-hand-value').innerHTML = "";
    document.getElementById('player-hand-value').innerHTML = getHandValue(playerhand);
    document.getElementById("deal").disabled = true;
    document.getElementById("hit").disabled = false;
    document.getElementById("stand").disabled = false;
    document.getElementById("double").disabled = false;
    document.getElementById("wager").value = "";
    
}

function renderHand(Card,sender,isHidden){
    var hand = document.getElementById(sender+'-hand');
    if(isHidden==null || isHidden==undefined){
        let card = document.createElement('div');
        let value = document.createElement('div');
        let suit = document.createElement('div');

        card.className = "card";
        value.className = "value";
        suit.className = "suit "+Card.Suit;
        value.innerHTML = Card.Value;

        card.appendChild(value);
        card.appendChild(suit);

        hand.appendChild(card);
    }
}

function hit(){
    var card = shuffled.pop();
    playerhand.push(card);
    renderHand(card,"player");
    var value = getHandValue(playerhand);
    document.getElementById('player-hand-value').innerHTML = value;
    if(value>21){
        stand();
        document.getElementById('hit').disabled = true;
        document.getElementById('stand').disabled = true;
        document.getElementById("double").disabled = true;
        document.getElementById('deal').disabled = false;        
    }
}

function getHandValue(sender){
    var score=0,aces=0;
    for(var i=0;i<sender.length;i++){
        if(sender[i].Value == "A"){
            score+=11;
            aces++;
            // console.log(aces);
        } else if(sender[i].Value == "K"){
            score+=10;
        } else if(sender[i].Value == "Q"){
            score+=10;
        } else if(sender[i].Value == "J"){
            score+=10;
        } else {
            score+=parseInt(sender[i].Value,0);
        }
    }
    while(score>21 && aces){
        score-=10;
        aces--;
    }
    return score;
}

function stand(){
    var dealerHandValue = getHandValue(dealerhand);
    var playerHandValue = getHandValue(playerhand);
    if(playerHandValue > 21){
        checkForWinner(playerHandValue,dealerHandValue);
        return;
    }
    renderHand(dealerhand[1],"dealer");
    while (dealerHandValue < 17){
        var card = shuffled.pop()
        dealerhand.push(card);
        renderHand(card,"dealer");
        dealerHandValue = getHandValue(dealerhand);
        document.getElementById('dealer-hand-value').innerHTML = dealerHandValue;
    }
    document.getElementById('hit').disabled = true;
    document.getElementById('stand').disabled = true;
    document.getElementById('double').disabled = true;
    checkForWinner(playerHandValue,dealerHandValue);
}

function checkForBlackjack(handValue){
    if (handValue == 21 && playerhand.length == 2 
            && (playerhand[0].Value=="A" || playerhand[1].Value=="A"))
        return true;
    return false;
}

function checkForWinner(phand,dhand){
    var isBlackjack = checkForBlackjack(phand);
    if(!isBlackjack){
        if(phand>21){
            alert ('House Wins. You lose: $'+playerWager);
        } else if (dhand > 21){
            alert ('You Won!!');
            playerCurrency += 2*playerWager;
            document.getElementById('dealer-hand-value').innerHTML = dhand;
        } else if (dhand == phand){
            alert ('Push');
            playerCurrency += playerWager;
            document.getElementById('dealer-hand-value').innerHTML = dhand;
        } else if (dhand > phand){ 
            var card;
            alert ('House Wins. You lose: $'+playerWager);
            document.getElementById('dealer-hand-value').innerHTML = dhand;
        } else {
            alert ('You Won!!');
            playerCurrency += 2*playerWager;
            document.getElementById('dealer-hand-value').innerHTML = dhand;
        }
    } else {
        alert('BlackJack!!');
        playerCurrency += 2.5*playerWager;
    }
    document.getElementById("currency").innerHTML='You have: $'+playerCurrency;
    document.getElementById("deal").disabled = false;
}

function double(){
    if(playerCurrency - playerWager < 0){
        alert('You cannot double down!');
        document.getElementById("double").disabled = true;
    } else {
        playerCurrency -= playerWager;
        playerWager *= 2;
        var card = shuffled.pop();
        playerhand.push(card);
        renderHand(card,"player");
        console.log(card);
        console.log(playerhand);
        stand();
        document.getElementById('hit').disabled = true;
        document.getElementById('stand').disabled = true;
        document.getElementById('double').disabled = true;
        document.getElementById('player-hand-value').innerHTML = getHandValue(playerhand);
        document.getElementById("bet").innerHTML = "Current Bet: $"+playerWager;
        document.getElementById('currency').innerHTML = "You have: $"+playerCurrency;
    }
}

window.onload = function(){
    document.getElementById("currency").innerHTML='You have: $'+playerCurrency;
    document.getElementById("bet").innerHTML = "Current Bet: $"+playerWager;
    this.document.getElementById("dhand").hidden = true;
    this.document.getElementById("phand").hidden = true;

    var deck = new Deck(5);
    var shuffle = new Shuffle(deck);
    shuffled = shuffle.getShuffled();
};