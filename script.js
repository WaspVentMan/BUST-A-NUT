let convAnim = 0
let lives = 0
let busting = true
let best = 0
let wr = undefined
let nuts = {
    "lifetime": 0,
    "score": 0,
    "active": []
}
let speed = [4, 4]
let particles = []

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
        let nut = document.querySelector("." + nuts.active[x].class)
        nuts.active[x].pos += 4
        nut.style.left = 512-nuts.active[x].pos + "px"

        if (nuts.active[x].pos >= 348 && !nuts.active[x].broken){
            nuts.active[x].broken = true
            hurt(1)
        }

        if (nuts.active[x].pos > 512+64){
            toBeKilled.push(x)
            nut.remove()
        }
    }

    for (let x = 0; x < toBeKilled.length; x++){nuts.active.shift()}
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
    newNut.style.backgroundImage = "url(img/sheet.png)"
    newNut.style.backgroundSize = "64px"
    newNut.style.backgroundPosition = "0px 256px"

    document.querySelector(".nuts").appendChild(newNut)

    nuts.lifetime++
}

function crackNut(){
    for (let x = 0; x < nuts.active.length; x++){
        if (nuts.active[x].broken){continue}
        let nut = document.querySelector("." + nuts.active[x].class)
        if (nuts.active[x].pos >= 268 && nuts.active[x].pos <= 308){
            nut.style.backgroundPosition = "0px 128px"
            nuts.score++
            nuts.active[x].broken = true
            spawnParticle("L", nuts.active[x].pos)
            spawnParticle("R", nuts.active[x].pos)

            let speedCache = speed[0]
            if (nuts.score >= 40){speed[0] = 1} else if (nuts.score >= 20){speed[0] = 2} else if (nuts.score >= 10){speed[0] = 3} else {speed[0] = 4}
            if (speedCache != speed[0]){document.querySelector(".logo").innerHTML = renderStrings(["nliih pl", "", "", "nliih pl"])}
        } else if (nuts.active[x].pos >= 228 && nuts.active[x].pos <= 308){
            nut.style.backgroundPosition = "0px 192px"
            nut.style.transform = "scaleX(-1)"
            hurt(0.5)
            nuts.active[x].broken = true
            spawnParticle("L", nuts.active[x].pos)
        } else if (nuts.active[x].pos >= 268 && nuts.active[x].pos <= 348){
            nut.style.backgroundPosition = "0px 192px"
            hurt(0.5)
            nuts.active[x].broken = true
            spawnParticle("R", nuts.active[x].pos)
        }
    }
}

function hurt(damage){
    lives -= damage

    let hearts = ""
    for (let x = 0; x < 3; x++){
        hearts += "srq"[(lives-x >= 1)+(lives-x >= 0.5)+0]
    }

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
    }
    document.querySelector(".hp").innerHTML = renderString(hearts)
}

function bust(){
    document.querySelector(".logo").innerHTML = renderString("fpnoekpo")
    if (lives <= 0){reset()}
    document.querySelector(".pressEffect").style.display = "block"
    document.querySelector(".press").style.top = "-4px"
    crackNut()
}

function spawnParticle(type, pos){
    let newParticle = document.createElement("div")
    newParticle.className = ("particle" + Date.now() + "r" + Math.random()).replaceAll(".", "")

    newParticle.style.backgroundImage = "url(img/sheet.png)"
    newParticle.style.width = "32px"
    newParticle.style.height = "64px"
    newParticle.style.position = "absolute"
    newParticle.style.left = 512-pos + "px"
    newParticle.style.bottom = "0px"
    newParticle.style.zIndex = "-1"

    
    newParticle.style.backgroundSize = "64px"

    newParticle.style.backgroundPosition = "0px 64px"
    if (type == "R"){
        newParticle.style.transform = "scaleX(-1)"
    }

    document.querySelector(".nuts").appendChild(newParticle)
    particles.push({"pos": [pos, 0], "vel": [[16, -16][(type == "R")+0], 16], "className": newParticle.className})
}

function updateParticles(){
    if (particles.length != 0){
        while (particles[0].pos[1] < -512){
            document.querySelector("." + particles[0].className).remove()
            particles.splice(0, 1)

            if (particles.length == 0){
                break
            }
        }
    }

    for (let x = 0; x < particles.length; x++){
        particles[x].pos[0] += particles[x].vel[0]
        particles[x].pos[1] += particles[x].vel[1]

        particles[x].vel[1] -= 8

        document.querySelector("." + particles[x].className).style.left = 512-particles[x].pos[0] + "px"
        document.querySelector("." + particles[x].className).style.bottom = particles[x].pos[1] + "px"
    }
}

function reset(){
    lives = 3
    speed[0] = 4
    nuts.lifetime = 0
    nuts.score = 0
    nuts.active = []
    particles = []
    hurt(0)
    document.querySelector(".nuts").innerHTML = ""
}

setInterval(function(){
    document.querySelector(".score").innerHTML = renderStrings(["ba"+nuts.score, "ca"+best, ["", "da"+wr][(wr!=undefined)+0]])
    hurt(0)
    if (lives <= 0){return}

    if (speed[1] != 0){
        speed[1]--
        return
    }

    speed[1] = speed[0]

    convAnim++

    if (convAnim%4==0){convAnim = 0}

    updateParticles()
    moveNuts()

    document.querySelector(".conveyor").style.backgroundPosition = "0px " + -(convAnim*64) + "px"
}, 25)

setInterval(()=>{
    if (busting){busting = false; return}
    document.querySelector(".pressEffect").style.display = "none"
    document.querySelector(".press").style.top = "-64px"
}, 1000/60)

document.querySelector(".logo").innerHTML = renderStrings(["fpnoekpo", "", "o0pgj", "2 fpno"])