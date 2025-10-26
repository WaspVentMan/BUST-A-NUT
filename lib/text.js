let charIndex = ` 0123456789abcdefghijklmnopqrstuvwxyz.,!?'-+$"~&/#%():[]|{}<>`

let fonts = {
    "default": [64, 64],
}

/**
 * Renders a character into a HTML String.
 * 
 * @param {string} char 
 * @returns {string} HTML UFO 50 Text, apply to an element's `.innerHTML`
 */
function renderChar(char, effect="none", font="default"){
    char = char.toLowerCase()

    let letter = [false, 0]
    for (let x = 0; x < charIndex.length; x++){if (char == charIndex[x]){letter = [true, x]; break}}
    if (letter[0]){return `<div class="${effect}" style="width: ${fonts[font][0]}px; height: ${fonts[font][1]}px; background-size: 1400%; image-rendering: pixelated; background-image: url(img/font/${font}.png); background-position: ${(letter[1]+1)*fonts[font][0]}px 0px;"></div>`}
}

/**
 * Renders a string into a HTML String.
 * 
 * @param {string} string 
 * @returns {string} HTML UFO 50 Text, apply to an element's `.innerHTML`
 */
function renderString(string, effect="none", font="default", allign="centre"){
    let newString = `<div style="width: max-content; margin: auto; height: ${fonts[font][1]}px; display: flex; text-align: center">`

    if (allign == "left"){
        newString = newString.replaceAll("margin: auto;", "margin: auto; margin-left: 0px;")
    }
    if (allign == "right"){
        newString = newString.replaceAll("margin: auto;", "margin: auto; margin-right: 0px;")
    }

    for (let x = 0; x < string.length; x++){
        newString += renderChar(string[x], effect=effect, font=font)
    }

    newString += `</div>`

    return newString
}