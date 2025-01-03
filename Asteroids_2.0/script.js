const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth - 200;
canvas.height = window.innerHeight - 200;

const gameStatus = document.getElementById("gameStatus");


class Asteroid {
    constructor(x, y, radius, speedX, speedY, health) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speedX = speedX;
        this.speedY = speedY;
        this.health = health;
        this.colors = ["#ff6666", "#ffcc66", "#66ff66", "#6666ff"];
    }

    draw() {
        ctx.fillStyle = this.colors[this.health - 1];
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.font = `${this.radius / 2}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.health, this.x, this.y);
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        this.radius = this.health * 15 + 10;

        this.draw();
    }
}
class SpaceShip {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = 15;
        this.size = 20;
        this.lives = 3;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.lineTo(-this.size / 2, this.size / 2);
        ctx.lineTo(this.size / 2, this.size / 2);
        ctx.closePath();
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.restore();
    }

    move() {
        const dx = Math.cos(this.angle) * this.speed;
        const dy = Math.sin(this.angle) * this.speed;

        this.x += dx;
        this.y += dy;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }

    rotateLeft() {
        this.angle -= Math.PI / 36;
    }

    rotateRight() {
        this.angle += Math.PI / 36;
    }

    checkCollisionWithAsteroid(asteroid) {
        const dx = this.x - asteroid.x;
        const dy = this.y - asteroid.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size / 2 + asteroid.radius) {
            return true;
        }
        return false;
    }
    
}

const spaceship = new SpaceShip(canvas.width / 2, canvas.height / 2, 0);
const asteroids = [];
const rockets = [];
let score = 0;
const pointsToLife = 50;
var scoreCheckPoint = pointsToLife;
const highScoresKey = "highScores";
const maxScores = 5;
const highScores = getHighScores();
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

function getHighScores() {
    let highScores = JSON.parse(localStorage.getItem(highScoresKey));
    if (!highScores) {
        return [];
    }
    return highScores;
}

function refreshPage() {
    location.reload();
}

function saveHighScore(playerName, playerScore) {
    let highScores = getHighScores();

    highScores.push({ name: playerName, score: playerScore });

    highScores.sort((a, b) => b.score - a.score);
    highScores = highScores.slice(0, maxScores);

    localStorage.setItem(highScoresKey, JSON.stringify(highScores));
}

function displayHighScores() {
    const highScoresList = document.getElementById("highScoresList");

    if (!highScoresList) {
        console.error("Elementul highScoresList nu a fost găsit!");
        return;
    }
    highScoresList.innerHTML = "";
    highScores.forEach(({ name, score }) => {
        const li = document.createElement("li");
        li.textContent = `${name}: ${score}`;
        highScoresList.appendChild(li);
    });
}

function updateGameStatus() {
    gameStatus.textContent = `Score: ${score} | Lives: ${spaceship.lives}`;
}

function createAsteroid() {
    const health = Math.floor(Math.random() * 4) + 1;
    const radius = health * 15 + 10;
    const speedX = (Math.random() - 0.5) * 3;
    const speedY = (Math.random() - 0.5) * 3;
    let x, y;
    const side = Math.floor(Math.random() * 4);

    switch (side) {
        case 0: // Partea de sus
            x = Math.random() * canvas.width;
            y = -radius;
            break;
        case 1: // Partea de jos
            x = Math.random() * canvas.width;
            y = canvas.height + radius;
            break;
        case 2: // Partea din stanga
            x = -radius;
            y = Math.random() * canvas.height;
            break;
        case 3: // Partea din dreapta
            x = canvas.width + radius;
            y = Math.random() * canvas.height;
            break;
    }

    asteroids.push(new Asteroid(x, y, radius, speedX, speedY, health));
}

function createRocket() {
    if (rockets.length >= 3) return;
    
    const rocketX = spaceship.x + Math.cos(spaceship.angle - Math.PI / 2) * spaceship.size;
    const rocketY = spaceship.y + Math.sin(spaceship.angle - Math.PI / 2) * spaceship.size;

    const rocket = {
        x: rocketX,
        y: rocketY,
        angle: spaceship.angle,

        dx: Math.cos(spaceship.angle - Math.PI / 2) * 7, 
        dy: Math.sin(spaceship.angle - Math.PI / 2) * 7  
    };

    rockets.push(rocket);
}

function drawRockets() {
    for (let i = rockets.length - 1; i >= 0; i--) {
        const rocket = rockets[i];

        ctx.beginPath();
        ctx.moveTo(rocket.x, rocket.y);
        ctx.lineTo(rocket.x + rocket.dx, rocket.y + rocket.dy);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 10;
        ctx.stroke();
        ctx.closePath();

        rocket.x += rocket.dx;
        rocket.y += rocket.dy;

        for (let j = asteroids.length - 1; j >= 0; j--) {
            const asteroid = asteroids[j];
            if (isCollision(rocket, asteroid)) {
                asteroid.health -= 1;

                if (asteroid.health <= 0) {
                    asteroids.splice(j, 1);
                }

                rockets.splice(i, 1);
                break;
            }
        }

        if (rocket.x < 0 || rocket.x > canvas.width || rocket.y < 0 || rocket.y > canvas.height) {
            rockets.splice(i, 1);
        }
    }
}

function isCollision(rocket, asteroid) {
    const distX = rocket.x - asteroid.x;
    const distY = rocket.y - asteroid.y;
    const distance = Math.sqrt(distX * distX + distY * distY);

    if (distance <= asteroid.radius) {
        if(asteroid.health == 1) score += 10;
        else score += 1;

        if (score >= scoreCheckPoint) {
            if(spaceship.lives < 3) spaceship.lives += 1; 
            scoreCheckPoint += pointsToLife;
        }

        updateGameStatus();
        return true;
    }
    return false;
}

function checkAsteroidCollision(asteroid1, asteroid2) {
    const dx = asteroid2.x - asteroid1.x;
    const dy = asteroid2.y - asteroid1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance < asteroid1.radius + asteroid2.radius;
}

function endGame() {
    const playerName = prompt("Game Over! Enter your name:");
    var playerScore = score;
    saveHighScore(playerName, playerScore);
    console.log("Apel funcție displayHighScores()");
    refreshPage();
}


function checkAsteroidCollisionWithSpaceShip() {
    asteroids.forEach((asteroid, index) => {
        if (spaceship.checkCollisionWithAsteroid(asteroid)) {
            spaceship.lives--; 

            if (spaceship.lives <= 0) {
                endGame(); 
            } else {
                resetGame(); 
            }

            asteroids.splice(index, 1);
            return true; 
        }
    });
}

function handleAsteroidCollision(asteroid1, asteroid2) {
    // Calculam masele asteroizilor pe baza razei lor (dimensiunii)
    const mass1 = Math.pow(asteroid1.radius, 3); // Raza este proportionala cu masa
    const mass2 = Math.pow(asteroid2.radius, 3);

    // Calculam viteza totala inainte de coliziune
    const velocityX1 = asteroid1.speedX;
    const velocityY1 = asteroid1.speedY;
    const velocityX2 = asteroid2.speedX;
    const velocityY2 = asteroid2.speedY;

    // Calculam vitezele pe baza legii conservarii impulsului:
    const newSpeedX1 = (mass1 - mass2) * velocityX1 / (mass1 + mass2) + (2 * mass2) * velocityX2 / (mass1 + mass2);
    const newSpeedY1 = (mass1 - mass2) * velocityY1 / (mass1 + mass2) + (2 * mass2) * velocityY2 / (mass1 + mass2);
    
    const newSpeedX2 = (2 * mass1) * velocityX1 / (mass1 + mass2) + (mass2 - mass1) * velocityX2 / (mass1 + mass2);
    const newSpeedY2 = (2 * mass1) * velocityY1 / (mass1 + mass2) + (mass2 - mass1) * velocityY2 / (mass1 + mass2);

    // Aplica viteza calculata pentru fiecare asteroid după coliziune
    asteroid1.speedX = newSpeedX1;
    asteroid1.speedY = newSpeedY1;
    
    asteroid2.speedX = newSpeedX2;
    asteroid2.speedY = newSpeedY2;
}

function separateAsteroids(asteroid1, asteroid2) {
    const dx = asteroid2.x - asteroid1.x;
    const dy = asteroid2.y - asteroid1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const overlap = asteroid1.radius + asteroid2.radius - distance;

    if (overlap > 0) {
        const angle = Math.atan2(dy, dx);
        const overlapX = Math.cos(angle) * overlap;
        const overlapY = Math.sin(angle) * overlap;

        // Mutam asteroizii inapoi pentru a preveni blocarea lor
        asteroid1.x -= overlapX / 2;
        asteroid1.y -= overlapY / 2;
        asteroid2.x += overlapX / 2;
        asteroid2.y += overlapY / 2;
    }
}

function updateAsteroids() {
    for (let i = 0; i < asteroids.length; i++) {
        for (let j = i + 1; j < asteroids.length; j++) {
            if (checkAsteroidCollision(asteroids[i], asteroids[j])) {
                handleAsteroidCollision(asteroids[i], asteroids[j]);
                separateAsteroids(asteroids[i], asteroids[j]);
            }
        }
        asteroids[i].update();
    }
}

function resetGame() {
    spaceship.x = canvas.width / 2; 
    spaceship.y = canvas.height / 2;
    spaceship.angle = 0; 

    asteroids.length = 0;
    rockets.length = 0;
}

// Detectarea miscarilor pe touchscreen
canvas.addEventListener('touchstart', function (e) {
    e.preventDefault();

    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, false);

canvas.addEventListener('touchmove', function (e) {
    e.preventDefault();

    touchEndX = e.touches[0].clientX;
    touchEndY = e.touches[0].clientY;
}, false);

canvas.addEventListener('touchend', function (e) {
    e.preventDefault();

    // Calculam diferentele de coordonate pentru a detecta gesturile
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    // Miscarea navei pe baza gestului
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Dacă diferenta pe axa X este mai mare decat pe Y, consideram ca este un gest de glisare orizontala
        if (deltaX > 0) {
            spaceship.x += spaceship.speed; // Glisare la dreapta
        } else {
            spaceship.x -= spaceship.speed; // Glisare la stanga
        }
    } else {
        // Dacă diferenaa pe axa Y este mai mare decat pe X, consideram ca este un gest de glisare verticala
        if (deltaY > 0) {
            spaceship.y += spaceship.speed; // Glisare in jos
        } else {
            spaceship.y -= spaceship.speed; // Glisare in sus
        }
    }

    // Detectam rotatia
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Daca swipe-ul este mai mult pe orizontala (dreapta-stanga)
        if (deltaX > 0) {
            spaceship.rotateRight(); // Roteste la dreapta
        } else {
            spaceship.rotateLeft(); // Roteste la stanga
        }
    }

    // Lansarea rachetelor la atingere
    createRocket();
}, false);

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM complet încărcat. Apelăm displayHighScores.");
    displayHighScores();
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
        spaceship.y -= spaceship.speed;
    }
    if (event.key === 'ArrowDown') {
        spaceship.y += spaceship.speed;
    }
    if (event.key === 'ArrowLeft') {
        spaceship.x -= spaceship.speed;
    }
    if (event.key === 'ArrowRight') {
        spaceship.x += spaceship.speed;
    }
    if (event.key === 'z') {
        spaceship.rotateLeft();
    }
    if (event.key === 'c') {
        spaceship.rotateRight();
    }
    if (event.key === 'x') {
        createRocket();
    }
});

function gameLoop() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    spaceship.draw();
    drawRockets();

    updateAsteroids();
    checkAsteroidCollisionWithSpaceShip();
    updateGameStatus();

    requestAnimationFrame(gameLoop);
}

console.log("Scorurile curente sunt:", highScores);

// Spawnam asteroizii
setInterval(createAsteroid, 500);
// Start joc
gameLoop();
