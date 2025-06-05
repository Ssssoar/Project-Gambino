var valueList = ["ACE","2","3","4","5","6","7","8","9","10","JACK","QUEEN","KING"]
var scoreValues = ["ACE","2","3","4","5","6","7","8","9","10","JACK","QUEEN","KING","PLUS"]
var handValues = ["StraightFlush","FourOfAKind","FullHouse","Flush","Straight","ThreeOfAKind","TwoPair","OnePair","HighCard"]

async function compareHands(first,second){ //if true, first won
    var ret
    if (first[0] == second[0]){ //it's a draw, check high values
        var flag = false
        var counter = 0
        if (first[1].isArray){
            first[1].forEach(() =>{
                if(!flag){
                    scoreValues.forEach((score) =>{
                        if(!flag){
                            if (score == first[1][counter]){
                                ret = true
                                flag = true
                            }else if (score == second[1][counter]){
                                ret = false
                                flag = true
                            }
                        }
                    })
                    counter += 1
                }
            })
        }else{
            scoreValues.forEach((score) =>{
                if(!flag){
                    if (score == first[1]){
                        ret = true
                        flag = true
                    }else if (score == second[1]){
                        ret = false
                        flag = true
                    }
                }
            })
        }
    }else{
        var flag = false
        handValues.forEach((value) =>{
            if (!flag){
                if (value == first[0]){
                    ret = true
                    flag = true
                }else if(value == second[0]){
                    ret = false
                    flag = true
                }
            }
        })
    }
    return ret
}

async function calculateHand(pile){
    const response = await fetch(apiurl + deck_id + "/pile/" + pile + "/list")
    const data = await response.json()
    if (data.success != true){
        alert("FAILED (reload the page pls)")
    }else{
        var values = []
        data.piles[pile].cards.forEach((card) => {
            values.push(card.value)
        })
        var sortedValues = await sortValues(values)
        var hand = false
        var value
        value = await isStraightFlush(data.piles[pile].cards,sortedValues)
        if (value != false){
            hand = "StraightFlush"
            return [hand,value]
        }
        value = await isFourOfAKind(sortedValues)
        if (value != false){
            hand = "FourOfAKind"
            return [hand,value]
        }
        value = await isFullHouse(sortedValues)
        if (value != false){
            hand = "FullHouse"
            return [hand,value]
        }
        value = await isFlush(data.piles[pile].cards)
        if (value != false){
            hand = "Flush"
            return [hand,value]
        }
        value = await isStraight(sortedValues)
        if (value != false){
            hand = "Straight"
            return [hand,value]
        }
        value = await isThreeOfAKind(sortedValues)
        if (value != false){
            hand = "ThreeOfAKind"
            return [hand,value]
        }
        value = await isTwoPair(sortedValues)
        if (value != false){
            hand = "TwoPair"
            return [hand,value]
        }
        value = await isOnePair(sortedValues)
        if (value != false){
            hand = "OnePair"
            return [hand,value]
        }
        value = await getHighCard(sortedValues)
        if (value != false){
            hand = "HighCard"
            return [hand,value]
        }
    }
}

async function getHighCard(sortedValues){
    if (sortedValues[0] == "ACE"){
        return "ACE"
    }else{
        return sortedValues[4]
    }
}

async function isTwoPair(sortedValues){
    var prevValue
    var repeats = 0
    var pair1 = "NONE"
    var pair2 = "NONE"
    var kicker = "NONE"
    sortedValues.forEach((value) =>{
        if ((repeats == 0) || (prevValue == value)){
            repeats += 1
            if (repeats == 2){
                if (pair1 == "NONE"){
                    pair1 = value
                }else{
                    pair2 = value
                }
            }
        }else{
            if(repeats == 1){
                kicker = value
            }
            repeats = 1
        }
        prevValue = value
    })
    if ((pair1 == "NONE")||(pair2 == "NONE")){
        return false
    }else{
        ret = await sortValues([pair1,pair2])
        ret.push(kicker)
        return ret
    }
}

async function isFullHouse(sortedValues){
    var prevValue
    var repeats = 0
    var trio = "NONE"
    var pair = "NONE"
    var ret = false
    sortedValues.forEach((value) =>{
        if ((repeats == 0) || (prevValue == value)){
            repeats += 1
            if (repeats == 3){
                trio = value
            }
        }else{
            if (repeats == 2){
                pair = value
            }
            repeats = 1
        }
        prevValue = value
    })
    if ((trio != "NONE") && (pair != "NONE")){
        return ([trio,pair])
    }else{
        return false
    }
}

async function isOnePair(sortedValues){
    var prevValue
    var repeats = 0
    var ret = false
    sortedValues.forEach((value) =>{
        if ((repeats == 0) || (prevValue == value)){
            repeats += 1
            if (repeats >= 2){
                ret = value
            }else{
                repeats = 1
            }
        }
        prevValue = value
    })
    return ret
}

async function isThreeOfAKind(sortedValues){
    var prevValue
    var repeats = 0
    var ret = false
    sortedValues.forEach((value) =>{
        if ((repeats == 0) || (prevValue == value)){
            repeats += 1
            if (repeats >= 3){
                ret = value
            }
        }else{
            repeats = 1
        }
        prevValue = value
    })
    return ret
}

async function isFourOfAKind(sortedValues){
    var prevValue
    var repeats = 0
    var ret = false
    sortedValues.forEach((value) =>{
        if ((repeats == 0) || (prevValue == value)){
            repeats += 1
            if (repeats >= 4){
                ret = value
            }else{
                repeats = 1
            }
        }
        prevValue = value
    })
    return ret
}

async function isStraightFlush(cards,sortedValues){
    if (!await isFlush(cards)){
        return false
    }
    var highCard = await isStraight(sortedValues)
    if (!highCard){
        return false
    }
    return highCard
}

async function isStraight(sortedValues){ //A run of consecutive cards 
    console.log(sortedValues)
    var currentIndex = 0
    var flag = false
    var ret
    for(let i=0; i< 9; i++){
        if (!flag){
            for(let j=0; j<5; j++){
                if (sortedValues[j] != valueList[i+j]){
                    break;
                }
                if (j == 4){
                    flag = true
                    ret = sortedValues[j]
                }
            }
        }else{
            break;
        }
    }
    if(!flag){
        if((sortedValues[0]=="ACE")&&(sortedValues[1]=="10")&&(sortedValues[2]=="JACK")&&(sortedValues[3]=="QUEEN")&&(sortedValues[4]=="KING")){
            ret = "PLUS"
        }else{
            ret = false
        }
    }
    return ret //WILL RETURN THE HIGH CARD OF THE STRAIGHT
}

async function isFlush(cards){ //all same suit
    var suit = "NONE"
    var ret = true
    cards.forEach((card) => {
        if (card.suit != suit){
            if (suit == "NONE"){
                suit = card.suit
            }else{
                ret = false
            }
        }
    })
    return ret
}

async function sortValues(toSort){
    var sorted = []
    valueList.forEach((value) =>{
        toSort.forEach((element) =>{
            if (element == value){
                sorted.push(value)
            }
        })
    })
    return sorted
}