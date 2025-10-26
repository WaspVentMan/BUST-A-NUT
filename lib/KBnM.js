let key = {}
let held = {}
let mouse = {"click": false, "pos": [0, 0]}
onmousemove = function(e){mouse.pos = [e.clientX, e.clientY]}
window.addEventListener('keydown', function (e) {key[e.key] = true })
window.addEventListener('keyup',   function (e) {key[e.key] = false; held[e.key] = false})
window.addEventListener('mousedown', function (e) {mouse.click = e.buttons})
window.addEventListener('mouseup', function (e) {mouse.click = false})