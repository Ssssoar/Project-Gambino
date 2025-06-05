var apiurl = "https://www.deckofcardsapi.com/api/deck/"
var init = false /*si es que hemos inicializado la pagina o todavia no*/
var deck_id = false /*un valor retornado por la API que debe ser enviado en todos los requests para que se acuerde del estado de nuestro mazo.*/
var initial_body_loc = "bodies/initbody.html" //la direccion del documento que tiene el cuerpo inicial
var ingame_body_loc = "bodies/ingame.html"

readyDeckCheck()

/*fundion pide a la API que genere un mazo de cartas, y retorna la id del mazo generado*/
async function getDeckId(){
    const response = await fetch(apiurl + "new/shuffle/?deck_count=1")
    const data = await response.json()
    if (data.success == true){
        return data.deck_id
    }else{
        alert("FAILED (reload the page pls)")
        return 0
    }
}

//llamada cada 2 segundos, checkea si tenemos el id, si no, no hace nada, de lo contrario hace aparecer el resto de la pagina
async function readyDeckCheck(){
    if (init == false)
        init = true
        deck_id = await getDeckId()
        initPage()
}

//la funcion que inicializa la pagina
function initPage(){
    var main = document.querySelector("main")
    fillFromFile(main,initial_body_loc)
}

async function startGame(){
    var main = document.querySelector("main")
    fillFromFile(main,ingame_body_loc)
    await draw("opponent")
    console.log("opponent drew")
    await draw("player")
    console.log("player drew")
}

async function redrawPhase(){
    /* ENEMY DECIDE */
    await refill("player")
}

async function reveal(){
    await revealOpponentCards()
    var opponentResult = await calculateHand("opponent")
    await showHand(opponentResult,"opponent")
    console.log(opponentResult)
    var playerResult = await calculateHand("player")
    await showHand(playerResult,"player")
    console.log(playerResult)
    var winner = await compareHands(playerResult,opponentResult)
    if (typeof(winner) == "undefined"){
        await declareTie()
    }else{
        await declareWinner(winner)
    }
}