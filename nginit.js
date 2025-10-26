let offline = true

// Set up the options for NGIO.
var options = {
    version: "1.0.0",
    preloadScoreBoards: true,
    preloadMedals: true,
    preloadSaveSlots: true
};

NGIO.init("61026:RomCFngP", "EfkbfjIjpJFyGCa8Mbb/cw==", options);

let ngLoop = setInterval(function(){
    NGIO.getConnectionStatus(function(status) {
        
        switch (status) {

            // we have version and license info
            case NGIO.STATUS_LOCAL_VERSION_CHECKED:

                if (!NGIO.legalHost) {
                    document.body.innerHTML = "<h1>THIS GAME IS BEING HOSTED ILLEGALLY, GO TO <a href=\"https://waspventman.co.uk\">WASPVENTMAN.CO.UK</a> OR <a href=\"https://waspventman.newgrounds.com/\">WASPVENTMAN.NEWGROUNDS.COM</a></h1>"
                }

                break

            // user needs to log in
            case NGIO.STATUS_LOGIN_REQUIRED: break

            // We are waiting for the user to log in
            case NGIO.STATUS_WAITING_FOR_USER: break

            // user needs to log in
            case NGIO.STATUS_READY:
                offline = false
                break
        }

    })
}, 100)

function unlockMedal(medal, condition = true){
    if (!offline){
        if (!NGIO.getMedal(medal).unlocked && condition){
            NGIO.unlockMedal(medal, ()=>{})
        }
    }
}