
const gameStart = document.getElementById('start');
const gameStop = document.getElementById('stop');
const gameTimer = document.getElementById('timer');
const gamePlayer = document.getElementById('players');
const gameFish = document.getElementById('fish1');
const showFish = document.getElementById('showFish');
const playerPos1 = document.getElementById('step1');
const playerPos2 = document.getElementById('step2');
const playerPos3 = document.getElementById('step3');
const playerPos4 = document.getElementById('step4');
const fishLine = document.getElementById('fishLine');
const fishPond = document.getElementById('pond');
const score = document.getElementById('score');

console.log('herex');

 class Pond {
    constructor(){
        this.pondCenter = [245, 245];
        this.pondRadius = 200;
        this.fishRadius = 10;
        this.catchRadius = 20;
        this.personAngle = 45;
        // this.fishMargin = [240, 240];
        this.fishMargin = [Math.ceil(Math.random() * 300) + 60, Math.ceil(Math.random() * 300) + 60];
        this.lineMargin = [245, 245];
    }
}
class Fish{
    constructor (pond){
        this.x = pond.fishMargin[0];
        this.y = pond.fishMargin[1];
        this.fishRadius = pond.fishRadius;
        this.pondRadius = pond.pondRadius;
        this.pondCenter = pond.pondCenter;
        const angle = pond.personAngle;
        this.nextXYOffset = [];

        const xOffset = Math.floor(Math.cos(angle) * this.fishRadius); 
        const yOffset = Math.floor(Math.sin(angle) * this.fishRadius); 
        const north = [0, -this.fishRadius];
        const northeast = [xOffset, -1*yOffset];
        const east = [this.fishRadius, 0];
        const southeast = [xOffset, yOffset];
        const south = [0, this.fishRadius];
        const southwest = [-1*xOffset, yOffset];
        const west = [-this.fishRadius, 0];
        const northwest = [-1*xOffset, -1*yOffset];

        this.nextXYOffset = [north, northeast, east, southeast, south, southwest, west, northwest];
    }

    nextXY () {
        let XYOffset = this.nextXYOffset.map((x) => x);
        while(true) {
            let offsetIndex = Math.floor(Math.random() * XYOffset.length);
            let selectXY = XYOffset[offsetIndex];
            
            let tempX = this.x + selectXY[0];
            let tempY = this.y + selectXY[1];
            
            let hypo = Math.ceil(Math.sqrt((tempX - this.pondCenter[0])**2 + (tempY - this.pondCenter[1])**2));

            if (hypo > this.pondRadius){
                XYOffset.splice(offsetIndex, 1);
            }
            else{
                this.x = tempX;
                this.y = tempY;
                
                break;
            }
        }
    }
}
 
class Person{
    constructor (pond){
        
        this.lineX = pond.lineMargin[0];
        this.lineY = pond.lineMargin[1];
        this.pondRadius = pond.pondRadius;
        
        const north = [200, 50];
        const east = [400, 200];
        const south = [200, 400];
        const west = [50, 200];

        this.nextPersonPos = [north, east, south, west];
        this.personX = this.nextPersonPos[0][0];
        this.personY = this.nextPersonPos[0][1];
    }

    newPerPos(personPosIndex) {
        this.personX = this.nextPersonPos[personPosIndex][0];
        this.personY = this.nextPersonPos[personPosIndex][1];
        this.lineX = pond.lineMargin[0];
        this.lineY = pond.lineMargin[1];

        if (personPosIndex === 0){
            playerPos1.style.backgroundColor = "red";
            playerPos2.style.backgroundColor = "gray";
            playerPos3.style.backgroundColor = "gray";
            playerPos4.style.backgroundColor = "gray";

        } else if (personPosIndex === 1) {
            playerPos2.style.backgroundColor = "red";
            playerPos1.style.backgroundColor = "gray";
            playerPos3.style.backgroundColor = "gray";
            playerPos4.style.backgroundColor = "gray";

        } else if (personPosIndex === 2) {
            playerPos3.style.backgroundColor = "red";
            playerPos2.style.backgroundColor = "gray";
            playerPos1.style.backgroundColor = "gray";
            playerPos4.style.backgroundColor = "gray";
        
        } else if (personPosIndex === 3) {
            playerPos4.style.backgroundColor = "red";
            playerPos2.style.backgroundColor = "gray";
            playerPos3.style.backgroundColor = "gray";
            playerPos1.style.backgroundColor = "gray";
        
        }
    }

    newLinePos(lineOffsetX, lineOffsetY) {
        
        console.log(lineOffsetX, lineOffsetY, this.personX, this.personY, Math.ceil(Math.sqrt((lineOffsetX - this.personX)**2 + (lineOffsetY - this.personY)**2)));        
        if (Math.ceil(Math.sqrt((lineOffsetX - this.personX)**2 + (lineOffsetY - this.personY)**2) < (this.pondRadius - 3))){
            this.lineX = lineOffsetX + 50;
            this.lineY = lineOffsetY + 50;
            fishLine.style.marginLeft = this.lineX + "px";
            fishLine.style.marginTop = this.lineY + "px";
        }
    }

    gotFish (fishObj) {
        console.log('here');
        if (Math.ceil(Math.sqrt((this.lineX - fishObj.x)**2 + (this.lineY - fishObj.y)**2) < pond.catchRadius)){
            alert('You caught a fish!');            
            updateScore();
            return true;
        }
        return false;
    }
}


function updateScore () {
    //go to form and update score from score array
    score.innerHTML = "1";

}

// Placeholder code for multiple fish and players
function start(persons, fish, timer) {
    let arrayPersons = [];
    for (let i = 0; i <= persons; i++){
        let personObj = Person;
        arrayPersons.push(personObj);
    }

    let arrayFish = [];
    for (let i = 0; i <= fish; i++){
        let fishObj = Fish;
        arrayFish.push(fishObj);
    }
    timer = 0;
}

const pond = new Pond();
const person = new Person(pond);
const fish = new Fish(pond);

function startGame(e){
    person.newPerPos(0);
    moveFish();
}

function stopGame() {
    window.location.reload();
}

function sleep(ms){
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();

    } while (currentDate - date < ms);
}

function moveFish(){
    fish.nextXY();
    if (person.gotFish(fish)){
        exit();
    }
    gameFish.style.marginLeft = fish.x + "px";
    gameFish.style.marginTop = fish.y + "px";
    sleep(200);
    requestAnimationFrame(moveFish);
    
}

function moveLine(fishPond, event) {
    let rect = fishPond.getBoundingClientRect();
    let x = Math.floor(event.clientX - rect.left);
    let y = Math.floor(event.clientY - rect.top);
    person.newLinePos(x, y);
}

function movePerson(index) {
    person.newPerPos(index);
}

gameStart.addEventListener('click', startGame);
gameStop.addEventListener('click', stopGame);

fishPond.addEventListener('mousedown', function (e) {
    moveLine(fishPond, e);
});

playerPos1.addEventListener('mousedown', function (e) {
    console.log('1');
    movePerson(0);
});

playerPos2.addEventListener('mousedown', function (e) {
    console.log('2');
    movePerson(1);
});
playerPos3.addEventListener('mousedown', function (e) {
    console.log('3');
    movePerson(2);
});
playerPos4.addEventListener('mousedown', function (e) {
    console.log('4');
    movePerson(3);
});

