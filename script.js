let globe = document.getElementById("snowglobe");
let particles = null;
var audio = new Audio('music.mp3');

function calculateAcceleration(event) {
    const {x, y, z} = event.accelerationIncludingGravity;
    return Math.sqrt(x * x + y * y + z * z);
}

function shakeItUp() {
    if (particles) {
        particles.play();
        globe.classList.add("shake");
        audio.play();
        setTimeout(() => {
            globe.classList.remove("shake");
        }, 1100);
    }
}

async function loadParticles() {
    try {
        console.log('Attempting to load particles.json...');
        
        const response = await fetch('particles.json');
        
        console.log('Response status:', response.status);
        console.log('Response OK?', response.ok);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - File not found or inaccessible`);
        }
        
        const config = await response.json();
        console.log('JSON loaded successfully:', config);
        
        const container = await tsParticles.load('particles', config);
        particles = container;
        particles.pause();
        
        globe.addEventListener('click', shakeItUp);
        
        window.addEventListener("devicemotion", (event) => {
            if (calculateAcceleration(event) > 23) {
                shakeItUp();
            }
        });
        
        console.log('snowglobe shaken :D');
        
    } catch (error) {
        console.error('Detailed error:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        
        document.getElementById('particles').innerHTML = `
            <div style="color:white;text-align:center;padding:20px;font-family:monospace;">
                <p> Error loading snow particles</p>
                <p style="font-size:12px;opacity:0.7;">${error.message}</p>
                <p style="font-size:12px;opacity:0.5;margin-top:10px;">Check console for details</p>
            </div>
        `;
    }
}

loadParticles();