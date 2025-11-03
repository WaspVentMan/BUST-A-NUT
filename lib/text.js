let charIndex = ` 0123456789abcdefghijklmnopqrstuvwxyz.,!?'-+$"~&/#%():[]|{}<>`

function renderChar(char){
    char = char.toLowerCase()

    let letter = [false, 0]
    for (let x = 0; x < charIndex.length; x++){if (char == charIndex[x]){letter = [true, x]; break}}
    if (letter[0]){return `<div style="width: 64px; height: 64px; background-size: 3000%; image-rendering: pixelated; background-image: url(img/font.png); background-position: ${(letter[1]+1)*64}px 0px;"></div>`}
}

function renderString(string){
    let newString = `<div style="width: max-content; margin: auto; height: 64px; display: flex; text-align: center">`
    for (let x = 0; x < string.length; x++){newString += renderChar(string[x])}

    newString += `</div>`

    return newString
}

function renderStrings(strings){
    let newString = ``

    for (let x = 0; x < strings.length; x++){newString += renderString(strings[x])}

    return newString
}