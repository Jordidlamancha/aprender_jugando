document.addEventListener('DOMContentLoaded', function() {
    // Bloqueador de inspección
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        alert('¡Vamos a seguir aprendiendo! Esta función está deshabilitada.');
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) || 
            (e.ctrlKey && e.key === 'u')) {
            e.preventDefault();
            alert('¡Enfócate en el juego! Las teclas están deshabilitadas.');
        }
    });
    
    // Elementos del DOM
    const alphabetGrid = document.getElementById('alphabet-grid');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const scoreDisplay = document.getElementById('score');
    const instructionDisplay = document.getElementById('instruction');
    const letterDisplay = document.getElementById('letter-display');
    const repeatSoundBtn = document.getElementById('repeat-sound-btn');
    const pointsInput = document.getElementById('points-input');
    
    // Variables del juego
    let score = 0;
    let currentLetter = '';
    let isGameActive = false;
    const alphabet = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
    const letterSounds = {};
    const TOTAL_LETTERS = alphabet.length;
    let pointsToWin = 10; // Valor por defecto
    
    // Sonidos locales
    const correctSound = new Audio('./media/effects/cheer.mp3');
    const wrongSound = new Audio('./media/effects/lose.mp3');
    const victorySound = new Audio('./media/effects/applause.mp3');

    // Ajustar volúmenes
    correctSound.volume = 0.1;
    wrongSound.volume = 0.1;
    victorySound.volume = 0.2;
    
    // Precargar sonidos de letras
    function preloadLetterSounds() {
        alphabet.forEach(letter => {
            letterSounds[letter] = new Audio(`./media/words/${letter}.mp3`);
            letterSounds[letter].volume = 1.0;
            letterSounds[letter].onerror = function() {
                console.error(`Error al cargar el sonido para la letra ${letter}`);
            };
        });
    }
    
    // Inicializar el tablero de letras
    function initAlphabetGrid() {
        alphabetGrid.innerHTML = '';
        alphabet.forEach(letter => {
            const letterCard = document.createElement('div');
            letterCard.className = 'letter-card';
            letterCard.textContent = letter;
            letterCard.dataset.letter = letter;
            
            letterCard.addEventListener('click', function() {
                if (!isGameActive) return;
                
                const selectedLetter = this.dataset.letter;
                
                if (selectedLetter === currentLetter) {
                    handleCorrectAnswer(this);
                } else {
                    handleWrongAnswer(this);
                }
            });
            
            alphabetGrid.appendChild(letterCard);
        });
    }
    
    // Manejar respuesta correcta
    function handleCorrectAnswer(card) {
        const selectedLetter = card.dataset.letter; // Obtiene la letra clickeada
        card.classList.add('correct');
        playLetterSound(selectedLetter); // Reproduce el sonido de ESA letra
        correctSound.currentTime = 0; // Reinicia el sonido de CORRECTO
        correctSound.play(); // Reproduce el sonido de CORRECTO
        
        updateScore(1);
        showConfetti();
        
        setTimeout(() => {
            card.classList.remove('correct');
            if (score < pointsToWin) {
                pickRandomLetter();
            }
        }, 3000);
    }
    
    // Manejar respuesta incorrecta
    function handleWrongAnswer(card) {
        const selectedLetter = card.dataset.letter; // Obtiene la letra clickeada
        card.classList.add('incorrect');
        playLetterSound(selectedLetter); // Reproduce el sonido de ESA letra
        wrongSound.currentTime = 0; // Reinicia el sonido de error
        wrongSound.play(); // Reproduce el sonido de error
        updateScore(-1); // 3. Penalizar puntuación
        setTimeout(() => {
            card.classList.remove('incorrect');
        }, 2000);
    }
    
    // Reproducir sonido de letra
    function playLetterSound(letter) {
        if (letterSounds[letter]) {
            letterSounds[letter].currentTime = 0;
            letterSounds[letter].play().catch(e => console.error(e));
        }
    }
    
    // Actualizar puntuación
    function updateScore(points) {
        score = Math.max(0, score + points);
        scoreDisplay.textContent = score;
        
        if (score >= pointsToWin) {
            gameComplete();
        }
    }
    
    function gameComplete() {
        isGameActive = false;
        victorySound.currentTime = 0;
        victorySound.play();
        instructionDisplay.textContent = `¡GANASTE! Has alcanzado ${pointsToWin} puntos.`;
        letterDisplay.textContent = '★';
        repeatSoundBtn.style.display = 'none';
        
        // Celebración mejorada
        showConfetti();
        setTimeout(() => {
            showConfetti();
            showConfetti();
        }, 1000);
        
        startBtn.disabled = false;
    }
    
    // Mostrar confeti
    function showConfetti() {
        confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.6 },
            colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']
        });
    }
    
    // Seleccionar letra aleatoria
    function pickRandomLetter() {
        const randomIndex = Math.floor(Math.random() * alphabet.length);
        currentLetter = alphabet[randomIndex];
        letterDisplay.textContent = '?';
        repeatSoundBtn.style.display = 'none';
        instructionDisplay.textContent = 'Escucha y encuentra la letra';
        
        setTimeout(() => {
            playLetterSound(currentLetter);
            // Muestra el botón después de que suene la letra
            setTimeout(() => {
                repeatSoundBtn.style.display = 'inline-block';
            }, 500);
        }, 1000);
    }
    
    // Iniciar juego
    function startGame() {
        const inputValue = parseInt(pointsInput.value);
        pointsToWin = isNaN(inputValue) || inputValue < 1 ? 27 : inputValue;
        
        isGameActive = true;
        score = 0;
        scoreDisplay.textContent = score;
        startBtn.disabled = true;
        letterDisplay.textContent = '?';
        repeatSoundBtn.style.display = 'none';
        instructionDisplay.textContent = 'Escucha y encuentra la letra';
        pickRandomLetter();
    }
    
    // Reiniciar juego
    function resetGame() {
        isGameActive = false;
        startBtn.disabled = false;
        letterDisplay.textContent = '?';
        repeatSoundBtn.style.display = 'none';
        instructionDisplay.textContent = 'Presiona "Iniciar Juego" para comenzar';
        score = 0;
        scoreDisplay.textContent = score;
    }
    
    // Event listeners
    startBtn.addEventListener('click', startGame);
    resetBtn.addEventListener('click', resetGame);
    repeatSoundBtn.addEventListener('click', function() {
        if (isGameActive && currentLetter) {
            playLetterSound(currentLetter);
        }
    });
    
    // Precargar sonidos al iniciar
    window.addEventListener('load', function() {
        preloadLetterSounds();
        initAlphabetGrid();
        
        document.body.addEventListener('touchstart', function initAudio() {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = ctx.createOscillator();
            oscillator.connect(ctx.destination);
            oscillator.start();
            oscillator.stop(ctx.currentTime + 0.001);
            this.removeEventListener('touchstart', initAudio);
        }, { once: true });
    });
});