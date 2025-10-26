let convAnim = 0
let lives = 0
let busting = true
let best = 0
let nuts = {
    "lifetime": 0,
    "score": 0,
    "active": []
}

let cloudBest = localStorage.getItem("BUSTANUT")
if (cloudBest != null){best = JSON.parse(cloudBest)}

function moveNuts(){
    if (nuts.active.length == 0){
        generateNut()
    } else if (nuts.active[nuts.active.length-1].pos > 68 && Math.random() > 0.9){
        generateNut()
    }

    let toBeKilled = []
    for (let x = 0; x < nuts.active.length; x++){
        nuts.active[x].pos += 4
        document.querySelector("." + nuts.active[x].class).style.left = 512-nuts.active[x].pos + "px"

        if (nuts.active[x].pos >= 348 && !nuts.active[x].broken){
            nuts.active[x].broken = true
            hurt(1)
        }

        if (nuts.active[x].pos > 512+64){
            toBeKilled.push(x)
        }
    }

    for (let x = 0; x < toBeKilled.length; x++){
        nuts.active.shift()
    }
}

function generateNut(){
    nuts.active.push({
        "pos": 0,
        "broken": false,
        "class": "nut" + nuts.lifetime
    })

    let newNut = document.createElement("div")
    newNut.className = "nut" + nuts.lifetime
    newNut.style.position = "absolute"
    newNut.style.left = "512px"
    newNut.style.width = "64px"
    newNut.style.height = "64px"
    newNut.style.backgroundImage = "url(img/nutSheet.png)"
    newNut.style.backgroundSize = "128px"
    newNut.style.backgroundPosition = "0px 0px;"
    newNut.style.imageRendering = "pixelated"

    document.querySelector(".nuts").appendChild(newNut)

    nuts.lifetime++
}

function crackNut(){
    for (let x = 0; x < nuts.active.length; x++){
        if (nuts.active[x].broken){continue}
        if (nuts.active[x].pos >= 268 && nuts.active[x].pos <= 308){
            document.querySelector("." + nuts.active[x].class).style.backgroundPosition = "64px 0px"
            nuts.score++
            nuts.active[x].broken = true
        } else if (nuts.active[x].pos >= 228 && nuts.active[x].pos <= 308){
            document.querySelector("." + nuts.active[x].class).style.backgroundPosition = "64px -64px"
            hurt(0.5)
            nuts.active[x].broken = true
        } else if (nuts.active[x].pos >= 268 && nuts.active[x].pos <= 348){
            document.querySelector("." + nuts.active[x].class).style.backgroundPosition = "0px -64px"
            hurt(0.5)
            nuts.active[x].broken = true
        }
    }
}

function hurt(damage){
    lives -= damage

    let hearts = `<div style="display: flex; width: max-content; height: 64px; margin: auto;">`
    for (let x = 0; x < 3; x++){
        hearts += `<div style="background-image: url(img/heart.png); image-rendering: pixelated; background-size: 64px; width: 64px; height: 64px; background-position: 0px ${[-128, -64, 0][(lives-x >= 1)+(lives-x >= 0.5)+0]}px;"></div>`
    }
    hearts += `</div>`

    if (lives <= 0){
        if (best < nuts.score){
            best = nuts.score
            localStorage.setItem("BUSTANUT", JSON.stringify(best))
        }
        if (damage != 0){
            NGIO.postScore(15304, nuts.score, function(){})
            unlockMedal(86829, nuts.score >= 1)
            unlockMedal(86830, nuts.score >= 100)
        }
        hearts = renderString("ca"+best)
    }
    document.querySelector(".hp").innerHTML = hearts
}

function bust(){
    if (lives <= 0){reset()}
    document.querySelector(".pressEffect").style.display = "block"
    document.querySelector(".press").style.top = "-4px"
    crackNut()
    playSound("sfx/smash.mp3")
}

function reset(){
    lives = 3
    nuts.lifetime = 0
    nuts.score = 0
    nuts.active = []
    hurt(0)
    document.querySelector(".nuts").innerHTML = ""
}

setInterval(function(){
    document.querySelector(".score").innerHTML = renderString("ba"+nuts.score)
    hurt(0)
    if (lives <= 0){return}

    convAnim++

    if (convAnim%4==0){
        convAnim = 0
    }

    moveNuts()

    document.querySelector(".conveyor").style.backgroundPosition = "0px " + -(convAnim*64) + "px"
}, 100)

setInterval(()=>{
    if (busting){busting = false; return}
    document.querySelector(".pressEffect").style.display = "none"
    document.querySelector(".press").style.top = "-64px"
}, 1000/60)