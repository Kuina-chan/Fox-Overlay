let socket = CreateProxiedReconnectingWebSocket("ws://${window.overlay.config.host}:${window.overlay.config.port}/ws", ['grade', 'simulatedPp', 'mapsetid','osu_mSSPP', 'gameMode', 'mania_m1_000_000PP', 'currentBpm']);
let mapid = document.getElementById("mapid");
let mapBG = document.getElementById("mapBG");
let mapTitle = document.getElementById("mapTitle");
let accInfo = document.getElementById("accInfo");
let h100 = document.getElementById("h100");
let h50 = document.getElementById("h50");
let h0 = document.getElementById("h0");
let hSB = document.getElementById("hSB");
let pp = document.getElementById("pp");
let ppInGame = document.getElementById('ppInGame')
let ppFC = document.getElementById("ppFC");
let modsUsed = document.getElementById("modsUsed");
let grade = document.getElementById('grade')
let bpm = document.getElementById('BPM')

socket.onopen = () => {
    console.log("Successfully Connected");
};
socket.onclose = (event) => {
    console.log("Socket Closed Connection: ", event);
    socket.send("Client Closed!");
};
socket.onerror = (error) => {
    console.log("Socket Error: ", error);
};

socket.onmessage = (event) => {
    let data = event.data;

    //map info
    title.innerHTML = data.menu.bm.metadata.artist + " - " + data.menu.bm.metadata.title
    diff.innerHTML = data.menu.bm.metadata.difficulty
    let width = 1920,
    height = 1080;
    data.menu.bm.path.full = data.menu.bm.path.full.replace(/#/g, "%23").replace(/%/g, "%25").replace(/\\/g, "/").replace(/'/g, "%27");
    mapCont.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url('${window.overlay.config.getUrl()}/backgroundImage?width=${width}&height=${height}&mapset=${data.tokens.mapsetid}&dummyData=${encodeURIComponent(data.tokens.md5)}&crop=1')`;

    //map stat
    OD.innerHTML = `OD: ${data.menu.bm.stats.OD}`
    AR.innerHTML = `AR: ${data.menu.bm.stats.AR}`
    HP.innerHTML = `HP: ${data.menu.bm.stats.HP}`
    CS.innerHTML = `CS: ${data.menu.bm.stats.CS}`
    SR.innerHTML = `★ ${data.menu.bm.stats.fullSR.toFixed(2)}`

    //ingame stats
    const currentGrade = data.tokens.grade
    console.log(currentGrade)
    if (currentGrade == 0){
        grade.style.backgroundImage = `url("http://localhost:20727/overlays/static/conv/Fox's%20Overlay/static/SS%20sliver.png")`
    }
    else if (currentGrade == 1){
        grade.style.backgroundImage = `url("http://localhost:20727/overlays/static/conv/Fox's%20Overlay/static/S%20sliver.png")`
    }
    else if (currentGrade == 2){
        grade.style.backgroundImage = `url("http://localhost:20727/overlays/static/conv/Fox's%20Overlay/static/X.png")`
    }
    else if (currentGrade == 3){
        grade.style.backgroundImage = `url("http://localhost:20727/overlays/static/conv/Fox's%20Overlay/static/S.png")`
    }
    else if (currentGrade == 4){
        grade.style.backgroundImage = `url("http://localhost:20727/overlays/static/conv/Fox's%20Overlay/static/A.png")`
    }
    else if (currentGrade == 5){
        grade.style.backgroundImage = `url("http://localhost:20727/overlays/static/conv/Fox's%20Overlay/static/B.png")`
    }
    else if (currentGrade == 6){
        grade.style.backgroundImage = `url("http://localhost:20727/overlays/static/conv/Fox's%20Overlay/static/C.png")`
    }
    else if (currentGrade == 7){
        grade.style.backgroundImage = `url("http://localhost:20727/overlays/static/conv/Fox's%20Overlay/static/D.png")`
    }

    //BPM info
    bpm.innerHTML = `${data.tokens.currentBpm}bpm`
    if (data.menu.state === 2){
        BpmCont.style.transform = `translateX(0px)`
        BpmCont.style.transform = `translateY(0)`
        bpm.style.transform = `translateX(0)`
        bpm.style.transform = `translateY(5px)`
        bpm.style.opacity = 1
    } else {
        bpm.style.transform = `translateX(200px)`

        bpm.style.opacity = 0
        BpmCont.style.transform = `translateX(200px)`

    }
    //ingame hit counter
    h100.innerHTML = data.gameplay.hits[100]
    h50.innerHTML = data.gameplay.hits[50]
    h0.innerHTML = data.gameplay.hits[0]
    hSB.innerHTML = data.gameplay.hits.sliderBreaks

    //pepepepepepepe
    pp.innerHTML = data.gameplay.pp.current
    ppFC.innerHTML = data.tokens.simulatedPp

    //checking current game mode, whether is mania or osu! standard
    let currentGameMode = data.tokens.gameMode
    if (currentGameMode === "Osu"){
        ppInGame.innerHTML = data.tokens.osu_mSSPP.toFixed(0)
    } else if (currentGameMode === "OsuMania"){
        ppInGame.innerHTML = data.tokens.mania_m1_000_000PP.toFixed(0)
    }

    //mod
    modsUsed.innerHTML = `Mods: ${data.menu.mods.str}`

    //osu! state
    if (data.menu.state === 2) {
        accInfo.style.transform = `translateX(0)`;
        ppCont.style.transform = `translateX(0)`;
        ppCont.style.opacity = 1
        ppInGame.style.opacity = 0
    }  else if (data.menu.state === 5 || data.menu.state === 12 || data.menu.state === 13){
        accInfo.style.transform = `translateX(200px)`;
        ppCont.style.opacity = 0
        ppInGame.style.opacity = 1
        ppInGame.style.transform = `translateX(0px)`;
    } else if (data.menu.state === 7 || data.menu.state === 14){
        accInfo.style.transform = `translateX(200px)`;
        ppCont.style.transform = `translateX(0)`;
        ppCont.style.opacity = 1
        ppInGame.style.transform = `translateX(200px)`;
        ppInGame.style.opacity = 0
    } else if (data.menu.state === 1){
        accInfo.style.transform = `translateX(200px)`;
        ppCont.style.transform = `translateX(200px)`;
        ppInGame.style.transform = `translateX(200px)`;
    }
    else {
        accInfo.style.transform = `translateX(200px)`;
        ppCont.style.transform = `translateX(200px)`;
        ppInGame.style.transform = `translateX(200px)`
    }

    //mod panel
    if (data.menu.mods.str === "" || "NM"){
        modsUsed.style.opacity = 0
    }
    if (data.menu.mods.str === "" || "NM" && data.menu.state === 2){
        modsUsed.style.opacity = 1
    }
    else {
        modsUsed.style.opacity = 1
    }
    
    //grade ranking
    if (data.menu.state === 2){
        grade.style.opacity = 1
    } else{
        grade.style.opacity = 0
    }
}