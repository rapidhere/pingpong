function draw(parent, curTime, toShowList, toShowTypeList) {
    var pxList = [];
    for (var i = 0; i < toShowList.length; i++) {
        pxList[i] = curTime - toShowList[i];
        pxList[i] /= beatInterv;
        pxList[i] *= 333;
    }
    drawNotes(parent, pxList, toShowTypeList);
}

function hola() {
    seh.play();
}
function drawScore(parent, score) {
    var vscore = Math.round(score);
    //console.log(vscore);
    parent.children[9].style['background'] = 'url(\'static/img/' + Math.floor(vscore / 10000) + '.png\') no-repeat center';
    parent.children[9].style['background-size'] = 'contain';
    vscore %= 10000;
    parent.children[10].style['background'] = 'url(\'static/img/' + Math.floor(vscore / 1000) + '.png\') no-repeat center';
    parent.children[10].style['background-size'] = 'contain';
    vscore %= 1000;
    parent.children[11].style['background'] = 'url(\'static/img/' + Math.floor(vscore / 100) + '.png\') no-repeat center';
    parent.children[11].style['background-size'] = 'contain';
    vscore %= 100;
    parent.children[12].style['background'] = 'url(\'static/img/' + Math.floor(vscore / 10) + '.png\') no-repeat center';
    parent.children[12].style['background-size'] = 'contain';
    vscore %= 10;
    parent.children[13].style['background'] = 'url(\'static/img/' + (vscore % 10) + '.png\') no-repeat center';
    parent.children[13].style['background-size'] = 'contain';

}
function drawCombo(parent, combo) {
    var vcombo = Math.round(combo);

    parent.children[5].style['background'] = 'url(\'static/img/' + Math.floor(vcombo / 1000) + '.png\') no-repeat center';
    parent.children[5].style['background-size'] = 'contain';
    vcombo %= 1000;
    parent.children[6].style['background'] = 'url(\'static/img/' + Math.floor(vcombo / 100) + '.png\') no-repeat center';
    parent.children[6].style['background-size'] = 'contain';
    vcombo %= 100;
    parent.children[7].style['background'] = 'url(\'static/img/' + Math.floor(vcombo / 10) + '.png\') no-repeat center';
    parent.children[7].style['background-size'] = 'contain';
    vcombo %= 10;
    parent.children[8].style['background'] = 'url(\'static/img/' + (vcombo % 10) + '.png\') no-repeat center';
    parent.children[8].style['background-size'] = 'contain';

}
function drawTime(parent, time) {
    //console.log(parent);

    var vtime = Math.round(time);
    if (vtime % 1000 > 500) {
        parent.children[2].style['opacity'] = 1;
    } else {
        parent.children[2].style['opacity'] = 0;
    }

    vtime = Math.floor(vtime / 1000);
    var seconds = vtime % 60;
    var minutes = Math.floor(vtime / 60);
    parent.children[0].style['background'] = 'url(\'static/img/' + Math.floor(minutes / 10) + '.png\') no-repeat center';
    parent.children[0].style['background-size'] = 'contain';
    parent.children[1].style['background'] = 'url(\'static/img/' + (minutes % 10) + '.png\') no-repeat center';
    parent.children[1].style['background-size'] = 'contain';

    parent.children[3].style['background'] = 'url(\'static/img/' + Math.floor(seconds / 10) + '.png\') no-repeat center';
    parent.children[3].style['background-size'] = 'contain';
    parent.children[4].style['background'] = 'url(\'static/img/' + (seconds % 10) + '.png\') no-repeat center';
    parent.children[4].style['background-size'] = 'contain';
}
function drawQuality(parent, lastHitTime, curTime, quality) {
//phase 1: quickly show 0.3s
//phase 2: hold 1.5s
//phase 3: slowly fade out 0.1s
// console.log("Draw quality = " + quality);

    var phase1Time = 200;
    var phase2Time = 300;
    var phase3Time = 100;

    if (gameStop == 1) {
        phase1Time = 500;
        phase2Time = 2000;
        phase3Time = 3000;
    }

    var opacity = 1;
    var t = (curTime - lastHitTime);
    // console.log(t);
    if (t <= phase1Time) {
        parent.style.opacity = Math.sqrt(t / phase1Time);
    } else if (t <= phase1Time + phase2Time) {
        parent.style.opacity = 1;
    } else if (t <= phase1Time + phase2Time + phase3Time) {
        parent.style.opacity = 1 - (t - phase1Time - phase2Time) / phase3Time;
    }
    if (quality == 0) {
        parent.style['background'] = 'url(static/img/perfect.png) no-repeat center';
    } else if (quality == 1) {
        parent.style['background'] = 'url(static/img/good.png) no-repeat center';
    } else if (quality == 2) {
        parent.style['background'] = 'url(static/img/bad.png) no-repeat center';
    } else if (quality == 3) {
        parent.style['background'] = 'url(static/img/miss.png) no-repeat center';
    } else if (quality == 4) {
        parent.style['background'] = 'url(static/img/fullcombo.png) no-repeat center';
    }
}

function drawNotes(parent, sequence, toShowTypeList) {
    //console.log("Drawing note");
    var temp = "";
    for (var i = 0; i < sequence.length; i++) {
        if (sequence[i] > 50) {
            temp += "<div style = \"position:absolute;width:100px;height:100px;background:url('static/img/note" + toShowTypeList[i] + ".png');background-size:cover;top:25px;right:" + (sequence[i] - 50) + "px;z-index:30\";></div>";
        }
    }
    parent.innerHTML = temp;
}

function drawBalls(parent, curTime, toShowList, toShowTypeList) {
    //console.log("Drawing ball");
    var timeList = [];
    var x = [];
    var y = [];
    var temp = "";
    for (var i = 0; i < toShowList.length; i++) {
        timeList[i] = curTime - toShowList[i];
        var size = timeList[i] / (3 * beatInterv + 300) * 15 + 15;
        if (timeList[i] < 1.3 * beatInterv) {
            if (toShowTypeList[i]) {
                x[i] = 540 + timeList[i] / (1.3 * beatInterv) * 90;
            } else {
                x[i] = 540 - timeList[i] / (1.3 * beatInterv) * 90;
            }
            y[i] = 17 * (x[i] - 540) * (x[i] - 540) / 810;
            y[i] += 60;
            temp += "<div style = \"position:absolute;width:" + size + "px;height:" + size + "px;background:url('static/img/note" + toShowTypeList[i] + ".png');background-size:cover;top:" + (y[i] - size / 2) + "px;left:" + (x[i] - size / 2) + "px;z-index:10\";></div>";
        } else {
            if (toShowTypeList[i]) {
                x[i] = (timeList[i] - 1.3 * beatInterv) / (1.7 * beatInterv + 300) * 350 + 630;
                y[i] = 4 * (x[i] - 630) * (x[i] - 630) / 1750 + 170;
            } else {
                x[i] = 450 - (timeList[i] - 1.3 * beatInterv) / (1.7 * beatInterv + 300) * 350;
                y[i] = 4 * (x[i] - 450) * (x[i] - 450) / 1750 + 170;
            }
            y[i] += 60;
            temp += "<div style = \"position:absolute;width:" + size + "px;height:" + size + "px;background:url('static/img/note" + toShowTypeList[i] + ".png');background-size:cover;top:" + (y[i] - size / 2) + "px;left:" + (x[i] - size / 2) + "px;z-index:10\";></div>";
        }
    }
    parent.innerHTML = temp;
}

var gesture = -1;
function task1() {
    var timeCur = new Date().getTime();
    var timePassed = timeCur - timeStart;

    var cgesture = gesture;
    gesture = -1;

    var qualityToDraw = -1;
    if (actionReceived) {
        actionReceived = 0;

        if (toShowTime.length) {
            if (toShowType[0] !== cgesture) {
                console.log('wrong gesture ' + toShowType[0] + ' ' + cgesture);
            } else {
                var timeInterv = Math.abs(toShowTime[0] + 3 * beatInterv - timePassed);
                if (timeInterv < 600) {
                    hitTime = timeCur;
                }
                if (timeInterv < 100) {
                    combo++;
                    if (combo > maxCombo) {
                        maxCombo = combo;
                    }
                    qualityToDraw = 0;
                    perfectNum++;
                    score += 100 * (1 + combo / gradeTime.length);
                    toShowTime.shift();
                    toShowType.shift();
                    se.play();
                    if ((combo % 10) == 0) {
                        seh.play();
                    }
                    //sd.innerHTML = "Perfect:" + perfectNum + "\tGood:" + goodNum + "\tBad:" + badNum + "\tMiss:" + missNum + "\tMaxcombo:" + maxCombo + "\tScore:" + Math.floor(score) + "\t\t\tPERFECT!\t\t\tCombo:" + combo;
                } else if (timeInterv < 200) {
                    combo++;
                    if (combo > maxCombo) {
                        maxCombo = combo;
                    }
                    qualityToDraw = 1;
                    goodNum++;
                    score += 80 * (1 + combo / gradeTime.length);
                    toShowTime.shift();
                    toShowType.shift();
                    se.play();
                    //sd.innerHTML = "Perfect:" + perfectNum + "\tGood:" + goodNum + "\tBad:" + badNum + "\tMiss:" + missNum + "\tMaxcombo:" + maxCombo + "\tScore:" + Math.floor(score) + "\t\t\tGOOD!\t\t\tCombo:" + combo;
                } else if (timeInterv < 400) {
                    combo = 0;
                    qualityToDraw = 2;
                    badNum++;
                    score += 60 * (1 + combo / gradeTime.length);
                    toShowTime.shift();
                    toShowType.shift();
                    se.play();
                    if ((combo % 10) == 0) {
                        seh.play();
                    }
                    //sd.innerHTML = "Perfect:" + perfectNum + "\tGood:" + goodNum + "\tBad:" + badNum + "\tMiss:" + missNum + "\tMaxcombo:" + maxCombo + "\tScore:" + Math.floor(score) + "\t\t\tBAD!\t\t\tCombo:" + combo;
                } else if (timeInterv < 600) {
                    combo = 0;
                    qualityToDraw = 3;
                    missNum++;
                    toShowTime.shift();
                    toShowType.shift();
                    se.play();
                    //sd.innerHTML = "Perfect:" + perfectNum + "\tGood:" + goodNum + "\tBad:" + badNum + "\tMiss:" + missNum + "\tMaxcombo:" + maxCombo + "\tScore:" + Math.floor(score) + "\t\t\tMISS!\t\t\tCombo:" + combo;
                }
            }
        }
    }
    if ((index < showTime.length) && (timePassed >= showTime[index])) {
        toShowTime.push(showTime[index]);
        toShowType.push(typeList[index]);
        index++;
    }
    if ((gameStop == 0) && (toShowTime.length >= 1) && (toShowTime[0] + 3 * beatInterv - timePassed < -300)) {
        combo = 0;
        qualityToDraw = 3;
        hitTime = timeCur;
        missNum++;
        toShowTime.shift();
        toShowType.shift();
        //sd.innerHTML = "Perfect:" + perfectNum + "\tGood:" + goodNum + "\tBad:" + badNum + "\tMiss:" + missNum + "\tMaxcombo:" + maxCombo + "\tScore:" + Math.floor(score) + "\t\t\tMISS!\t\t\tCombo:" + combo;
        outIndex++;
    }

    drawBalls(ud, timePassed, toShowTime, toShowType);
    draw(dd, timePassed, toShowTime, toShowType);
    drawTime(bd, timePassed);
    drawCombo(bd, combo);
    // console.log(score);
    drawScore(bd, score);
    if ((gameStop == 0) && (timePassed >= showTime[showTime.length - 1] + 4000)) {
        gameStop = 1;
        if (combo == showTime.length) {
            hitTime = timeCur;
        }
        toShowType = -1;
    } else {
        drawQuality(qd, hitTime, timeCur, qualityToDraw);
    }
    if ((combo == showTime.length)) {
        drawQuality(qd, hitTime, timeCur, 4);
    }
    if (timePassed >= showTime[showTime.length - 1] + 12000) {
        window.clearInterval(t1);
    }
}

var se;
var seh;
var mu;
var ud;
var dd;
var qd;
var cd;
var bd;

$(function () {
    se = document.getElementById("soundEffect");
    seh = document.getElementById("soundEffect_hola");
    mu = document.getElementById("music");
    ud = document.getElementById("up_div");
    dd = document.getElementById("down_div");
    qd = document.getElementById("quality_div");
    cd = document.getElementById("clock_div");
    bd = document.getElementById("board_div");
});

var perfectNum = 0,
    goodNum = 0;
badNum = 0, missNum = 0;
var index = 0;
var outIndex = 0;
var timeStart = 0;
var actionReceived = 0;
var combo = 0;
var maxCombo = 0;
var score = 0;
var isPlaying = 0;
var showTime = [];
var t1;
var hitTime = 0;
for (var i = 0; i < gradeTime.length; i++) {
    showTime[i] = gradeTime[i] - 4 * beatInterv;
}
var toShowTime = [];
var toShowType = [];
var gameStop = 0;
var lastNoteTime = 0;
//sd.innerHTML = "Perfect:" + perfectNum + "\tGood:" + goodNum + "\tBad:" + badNum + "\tMiss:" + missNum + "\tMaxcombo:" + maxCombo + "\tWAVE YOUR HAND TO START!";

//Please do not debug by deleting the comment below
//window.setInterval(task1, 1);

function doMouseDown(event) {
    if (!isPlaying) {
        isPlaying = 1;
        mu.play();
        timeStart = new Date().getTime();
        //sd.innerHTML = "Perfect:" + perfectNum + "\tGood:" + goodNum + "\tBad:" + badNum + "\tMiss:" + missNum + "\tMaxcombo:" + maxCombo;
        t1 = window.setInterval(task1, 1);
    } else {
        actionReceived = 1;
        gesture = 1;
    }
}

function reactToGesture(data) {
    var parsedData = JSON.parse(data);
    console.log(parsedData);

    console.log(isPlaying);
    console.log(!isPlaying && parsedData === -1);

    if (!isPlaying && parsedData === -1) {
        isPlaying = 1;
        mu.play();
        timeStart = new Date().getTime();
        //sd.innerHTML = "Perfect:" + perfectNum + "\tGood:" + goodNum + "\tBad:" + badNum + "\tMiss:" + missNum + "\tMaxcombo:" + maxCombo;
        t1 = window.setInterval(task1, 1);
    } else {
        if (parsedData === 1)
            gesture = 0;
        else if (parsedData === -1)
            gesture = 1;

        actionReceived = 1;
    }
}
