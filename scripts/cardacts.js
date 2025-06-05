async function draw(drawer){
    const response = await fetch(apiurl + deck_id + "/draw/?count=5") //robar 5 cartas
    const data = await response.json()
    if (data.success == true){
        if (drawer == "opponent"){
            opponentFill()
        }else if (drawer == "player"){
            playerFill(data.cards)
        }
        await moveToPile(drawer, data.cards)
    }else{
        alert("FAILED (reload the page pls)")
    }
}

async function refill(pile){
    const response = await fetch(apiurl + deck_id + "/pile/" + pile + "/list/")
    const data = await response.json()
    if (data.success != true){
        alert("FAILED (reload the page pls)")
    }else{
        var remaining = 5 - data.piles[pile].remaining
        const redrawresp = await fetch(apiurl + deck_id + "/draw/?count=" + remaining)
        const redrawdata = await redrawresp.json()
        if(redrawdata.success != true){
            alert("FAILED (reload the page pls)")
        }else{
            await playerReFill(redrawdata.cards)
            await moveToPile(pile,redrawdata.cards)
        }
    }

}

async function revealOpponentCards(){
    const response = await fetch(apiurl + deck_id + "/pile/opponent/list")
    const data = await response.json()
    if (data.success != true){
        alert("FAILED (reload the page pls)")
    }else{
        opponentShow(data.piles.opponent.cards)
    }
}

async function moveToPile(pile,cards){
    cardList = "" //lista de cartas para mandar a la pila
    cards.forEach((card) => {
        cardList += card.code
        cardList += ","
    })
    cardList = cardList.substring(0,cardList.length - 1) //eliminar la ultima coma que sobra
    const response = await fetch(apiurl + deck_id + "/pile/" + pile + "/add/?cards=" + cardList) //añadir las cartas a la pila
    const data = await response.json()
    if (data.success != true){
        alert("FAILED (reload the page pls)")
    }
}

async function moveSingleToPile(pile,cardcode){
    cardList = cardList.substring(0,cardList.length - 1) //eliminar la ultima coma que sobra
    const response = await fetch(apiurl + deck_id + "/pile/" + pile + "/add/?cards=" + cardcode) //añadir las cartas a la pila
    const data = await response.json()
    if (data.success != true){
        alert("FAILED (reload the page pls)")
    }
}

async function discard(cardcode){
    await moveSingleToPile("discard",cardcode)
    const response = await fetch(apiurl + deck_id + "/pile/player/list/")
    const data = await response.json()
    if (data.success != true){
        alert("FAILED (reload the page pls)")
    }else{
        await playerFill(data.piles.player.cards)
    }
}