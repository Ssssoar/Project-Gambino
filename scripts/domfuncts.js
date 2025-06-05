async function opponentFill(){
    var opponent_hand = document.querySelector("#opponent")
    await fillFromFile(opponent_hand,"bodies/cardback.html")
    for(let i = 0; i < 4; i++){
        await addFromFile(opponent_hand,"bodies/cardback.html")
    }
}

async function opponentShow(cards){
    var opponent_hand = document.querySelector("#opponent")
    await fillFromFile(opponent_hand,"bodies/empty.html")
    cards.forEach((card) => {
        opponent_hand.innerHTML += "<div class='card' id='"+card.code+"'><img src='"+card.image+"'></div>"
    })
}

async function playerFill(cards){
    var player_hand = document.querySelector("#player")
    await fillFromFile(player_hand,"bodies/empty.html")
    num = 0
    cards.forEach((card) => {
        player_hand.innerHTML += "<div class='card' id='"+card.code+"'><img src='"+card.image+"'><br><button onClick='discard(&apos;"+card.code+"&apos;)'>Descartar</button></div>"
        num += 1
    })
    var advance = document.querySelector("#advance")
    advance.innerHTML = "<button onClick='redrawPhase()'>Cambiar Cartas</button>"
}

async function playerReFill(cards){
    var player_hand = document.querySelector("#player")
    await fillFromFile(player_hand,"bodies/empty.html")
    cards.forEach((card) =>{
        player_hand.innerHTML += "<div class='card' id='"+card.code+"'><img src='"+card.image+"'></div>"
    })
    const response = await fetch(apiurl + deck_id + "/pile/player/list/")
    const data = await response.json()
    data.piles.player.cards.forEach((card) =>{
        player_hand.innerHTML += "<div class='card' id='"+card.code+"'><img src='"+card.image+"'></div>"
    })
    var advance = document.querySelector("#advance")
    advance.innerHTML = "<button onClick='reveal()'>Revelar</button>"
}

async function showHand(result,owner){
    var text = "UH OH!"
    switch(result[0]){
        case "StraightFlush":
            text = "Escalera de color!!!"
        break;
        case "FourOfAKind":
            text = "Poker"
        break;
        case "FullHouse":
            text = "Full House"
        break;
        case "Flush":
            text = "Color"
        break;
        case "Straight":
            text = "Escalera"
        break;
        case "ThreeOfAKind":
            text = "Trio"
        break;
        case "TwoPair":
            text = "Doble Par"
        break;
        case "OnePair":
            text = "Par"
        break;
        case "HighCard":
            text = "Carta Alta"
        break;
    }
    var pattern
    if (owner == "player"){
        pattern = "#player"
    }else if (owner == "opponent"){
        pattern = "#opponent"
    }
    var hand = document.querySelector(pattern)
    hand.innerHTML += "<h1>"+text+"</h1>"
}

async function declareTie(){
    var player_hand = document.querySelector("#player")
    var opponent_hand = document.querySelector("#opponent")
    player_hand.innerHTML += "<h1>ES UN EMPATE</h1>"
    opponent_hand.innerHTML += "<h1>ES UN EMPATE</h1>"
}

async function declareWinner(win){
    var winnerselect
    var loserselect
    if (win){
        winnerselect = document.querySelector("#player")
        loserselect = document.querySelector("#opponent")
    }else{
        winnerselect = document.querySelector("#opponent")
        loserselect = document.querySelector("#player")
    }
    winnerselect.innerHTML += "<h1>GANADOR</h1>"
    loserselect.innerHTML += "<h1>PERDEDOR</h1>"
}

/*function to fill an already selected query from a file given as a string*/
async function fillFromFile(selected,fileURL) {
    await fetch(fileURL)
    .then(response => response.text())
    .then(textString => {
        selected.innerHTML = textString;
    });
}

//same as the previous but it appends rather than replacing
async function addFromFile(selected,fileURL){
    await fetch(fileURL)
    .then(response => response.text())
    .then(textString => {
        selected.innerHTML += textString;
    });
}