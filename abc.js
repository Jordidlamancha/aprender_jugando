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
    const currentLetterDisplay = document.getElementById('current-letter');
    
    // ========== NUEVO ELEMENTO ========== //
    const pointsInput = document.getElementById('points-input'); // Añade este input en tu HTML
    // ========== FIN NUEVO ELEMENTO ========== //
    
    // Variables del juego
    let score = 0;
    let currentLetter = '';
    let isGameActive = false;
    const alphabet = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
    const letterSounds = {};
    const TOTAL_LETTERS = alphabet.length;
    // ========== NUEVA VARIABLE ========== //
    let pointsToWin = 10; // Valor por defecto
    // ========== FIN NUEVA VARIABLE ========== //
    
    // Sonidos locales
    const correctSound = new Audio('./media/effects/cheer.mp3');
    const wrongSound = new Audio('./media/effects/lose.mp3');
    const victorySound = new Audio('./media/effects/applause.mp3'); // Corregido el nombre del archivo

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
        card.classList.add('correct');
        
        playLetterSound(currentLetter);
        correctSound.currentTime = 0;
        correctSound.play();
        
        updateScore(1);
        showConfetti();
        
        setTimeout(() => {
            card.classList.remove('correct');
            // ========== ACTUALIZADO ========== //
            if (score < pointsToWin) { // Usamos pointsToWin en lugar de TOTAL_LETTERS
            // ========== FIN ACTUALIZADO ========== //
                pickRandomLetter();
            }
        }, 3000);
    }
    
    // Manejar respuesta incorrecta
    function handleWrongAnswer(card) {
        card.classList.add('incorrect');
        wrongSound.currentTime = 0;
        wrongSound.play();
        updateScore(-1);
        
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
        
        // ========== ACTUALIZADO ========== //
        if (score >= pointsToWin) { // Usamos pointsToWin en lugar de TOTAL_LETTERS
        // ========== FIN ACTUALIZADO ========== //
            gameComplete();
        }
    }
    
    function gameComplete() {
        isGameActive = false;
        victorySound.currentTime = 0;
        victorySound.play();
        
        // ========== ACTUALIZADO ========== //
        instructionDisplay.textContent = `¡GANASTE! Has alcanzado ${pointsToWin} puntos.`;
        // ========== FIN ACTUALIZADO ========== //
        currentLetterDisplay.textContent = '★';
        
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
        currentLetterDisplay.textContent = '?';
        instructionDisplay.textContent = 'Escucha y encuentra la letra';
        
        setTimeout(() => {
            playLetterSound(currentLetter);
        }, 1000);
    }
    
    // Iniciar juego
    function startGame() {
        // ========== NUEVO CÓDIGO ========== //
        // Obtener el valor de puntos para ganar
        const inputValue = parseInt(pointsInput.value);
        pointsToWin = isNaN(inputValue) || inputValue < 1 ? 27 : inputValue;
        // ========== FIN NUEVO CÓDIGO ========== //
        
        isGameActive = true;
        score = 0;
        scoreDisplay.textContent = score;
        startBtn.disabled = true;
        currentLetterDisplay.textContent = '?';
        instructionDisplay.textContent = 'Escucha y encuentra la letra';
        pickRandomLetter();
    }
    
    // Reiniciar juego
    function resetGame() {
        isGameActive = false;
        startBtn.disabled = false;
        currentLetterDisplay.textContent = '?';
        instructionDisplay.textContent = 'Presiona "Iniciar Juego" para comenzar';
        score = 0;
        scoreDisplay.textContent = score;
    }
    
    // Event listeners
    startBtn.addEventListener('click', startGame);
    resetBtn.addEventListener('click', resetGame);
    
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