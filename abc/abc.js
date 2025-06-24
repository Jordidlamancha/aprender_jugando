document.addEventListener('DOMContentLoaded', function() {

    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        alert('¡Vamos a seguir aprendiendo! Esta función está deshabilitada.');
    });

    document.addEventListener('keydown', function(e) {
        // Bloquear F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
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
    
    // Variables del juego
    let score = 0;
    let currentLetter = '';
    let isGameActive = false;
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÑ'.split('');
    const letterSounds = {};
    
    // Sonidos locales
    const correctSound = new Audio('./media/effects/cheer.mp3');
    const wrongSound = new Audio('./media/effects/lose.mp3');

    // Ajustar volúmenes (valores entre 0 y 1)
    correctSound.volume = 0.1;  // 50% de volumen para los efectos
    wrongSound.volume = 0.1;    // 50% de volumen para los efectos
    
    // Precargar sonidos de letras
    function preloadLetterSounds() {
        alphabet.forEach(letter => {
            letterSounds[letter] = new Audio(`./media/words/${letter}.mp3`);
            letterSounds[letter].volume = 1.0;  // 80% de volumen para las letras
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
        
        // Reproducir sonido de la letra correcta
        playLetterSound(currentLetter);
        
        // Reproducir sonido de acierto
        correctSound.currentTime = 0;
        correctSound.play();
        
        updateScore(1);
        showConfetti();
        
        setTimeout(() => {
            card.classList.remove('correct');
            pickRandomLetter();
        }, 5000);
    }
    
    // Manejar respuesta incorrecta
    function handleWrongAnswer(card) {
        card.classList.add('incorrect');
        
        // Reproducir sonido de error
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
        score = Math.max(0, score + points); // No permitir puntuación negativa
        scoreDisplay.textContent = score;
    }
    
    // Mostrar confeti
    function showConfetti() {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']
        });
    }
    
    // Seleccionar letra aleatoria
    function pickRandomLetter() {
        const randomIndex = Math.floor(Math.random() * alphabet.length);
        currentLetter = alphabet[randomIndex];
        currentLetterDisplay.textContent = '?'; // Mostrar "?" en lugar de la letra
        instructionDisplay.textContent = 'Escucha y encuentra la letra';
        
        // Reproducir sonido de la letra
        setTimeout(() => {
            playLetterSound(currentLetter);
        }, 500);
    }
    
    // Iniciar juego
    function startGame() {
        isGameActive = true;
        score = 0;
        scoreDisplay.textContent = score;
        startBtn.disabled = true;
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
        
        // Habilitar audio en móviles
        document.body.addEventListener('touchstart', function initAudio() {
            // Reproducir sonido silencioso para activar audio
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = ctx.createOscillator();
            oscillator.connect(ctx.destination);
            oscillator.start();
            oscillator.stop(ctx.currentTime + 0.001);
            
            this.removeEventListener('touchstart', initAudio);
        }, { once: true });
    });
});