document.addEventListener('DOMContentLoaded', () => {
    // Niveles de dificultad
    const levels = {
        easy: ['MA', 'ME', 'MI', 'MO', 'MU', 'PA', 'PE', 'PI', 'PO', 'PU'],
        medium: ['BRA', 'BRE', 'BRI', 'BRO', 'BRU', 'CLA', 'CLE', 'CLI', 'CLO', 'CLU'],
        hard: ['TRI', 'TRA', 'TRE', 'PLA', 'PLE', 'PLI', 'FRA', 'FRE', 'FLU', 'GLO']
    };

    // Mensajes del profesor con sus correspondientes audios
    const professorMessages = {
        welcome: [
            {text: "¡Hola! Encuentra la siguiente silaba", audio: "../media/effects/Profe/welcome/hola.mp3"},
            {text: "Vamos a aprender juntos", audio: "../media/effects/Profe/welcome/aprender.mp3"},
            {text: "¿Listo para jugar?", audio: "../media/effects/Profe/welcome/listo.mp3"}
        ],
        correct: [
            {text: "¡Excelente!", audio: "../media/effects/Profe/correct/excelente.mp3"},
            {text: "¡Muy bien hecho!", audio: "../media/effects/Profe/correct/bien.mp3"},
            {text: "¡Eres genial!", audio: "../media/effects/profe/correct/genial.mp3"}
        ],
        incorrect: [
            {text: "¡Inténtalo de nuevo!", audio: "../media/effects/profe/incorrect/intenta.mp3"},
            {text: "Casi lo tienes", audio: "../media/effects/profe/incorrect/casi.mp3"},
            {text: "¡Tú puedes!", audio: "../media/effects/profe/incorrect/puedes.mp3"}
        ],
        encouragement: [
            {text: "Sigue así", audio: "../media/effects/profe/encouragement/sigue.mp3"},
            {text: "¡No te rindas!", audio: "../media/effects/profe/encouragement/no_rindas.mp3"},
            {text: "La práctica hace al maestro", audio: "../media/effects/profe/encouragement/practica.mp3"}
        ]
    };

    // Elementos DOM
    const grid = document.getElementById('syllablesGrid');
    const difficultyBtns = document.querySelectorAll('.difficulty-btn');
    const resultMessage = document.getElementById('resultMessage');
    const nextBtn = document.getElementById('nextBtn');
    const correctSound = document.getElementById('correctSound');
    const wrongSound = document.getElementById('wrongSound');
    const stars = document.querySelectorAll('.star');
    const character = document.getElementById('character');
    const speechBubble = document.getElementById('speechBubble');
    
    // Variables de estado
    let currentLevel = 'easy';
    let currentSyllables = [];
    let targetSyllable = '';
    let canClick = true;
    let score = 0;
    let consecutiveCorrect = 0;
    let loadedAudios = {};
    
    // Precargar audios del profesor
    function preloadProfessorAudios() {
        Object.values(professorMessages).forEach(category => {
            category.forEach(message => {
                const audio = new Audio(message.audio);
                loadedAudios[message.audio] = audio;
                audio.load();
            });
        });
    }
    
    // Inicializar juego
    function initGame(level) {
        currentSyllables = [...levels[level]];
        score = 0;
        consecutiveCorrect = 0;
        
        // Reiniciar estrellas
        stars.forEach(star => star.classList.remove('active'));
        
        // Precargar audios al iniciar
        preloadProfessorAudios();
        
        startRound();
        showProfessorMessage('welcome');
    }
    
    // Mostrar mensaje del profesor con audio
    function showProfessorMessage(type) {
        const messages = professorMessages[type];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        // Mostrar mensaje en burbuja
        speechBubble.textContent = randomMessage.text;
        speechBubble.classList.add('show');
        
        // Reproducir audio
        const audio = loadedAudios[randomMessage.audio];
        if(audio) {
            audio.currentTime = 0;
            audio.play().catch(e => console.error("Error al reproducir audio:", e));
        }
        
        // Animación según el tipo de mensaje
        if (type === 'correct') {
            character.classList.add('character-jump');
        } else if (type === 'incorrect') {
            character.classList.add('character-shake');
        }
        
        // Ocultar después de 3 segundos
        setTimeout(() => {
            speechBubble.classList.remove('show');
            character.classList.remove('character-jump', 'character-shake');
        }, 3000);
    }
    
    // Actualizar puntuación
    function updateScore(isCorrect) {
        if (isCorrect) {
            score++;
            consecutiveCorrect++;
            
            // Activar estrellas según el puntaje
            if (score <= 3) {
                stars[score - 1].classList.add('active');
            }
            
            // Mensaje especial cada 3 aciertos seguidos
            if (consecutiveCorrect % 3 === 0) {
                showProfessorMessage('encouragement');
            }
        } else {
            consecutiveCorrect = 0;
        }
    }
    
    // Selector de dificultad
    difficultyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            difficultyBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentLevel = btn.dataset.level;
            initGame(currentLevel);
        });
    });
    
    // Botón siguiente
    nextBtn.addEventListener('click', () => {
        nextBtn.classList.add('hidden');
        resultMessage.textContent = '';
        startRound();
    });
    
    // Comenzar nueva ronda
    function startRound() {
        grid.innerHTML = '';
        canClick = true;
        
        // Seleccionar sílaba objetivo al azar
        targetSyllable = currentSyllables[Math.floor(Math.random() * currentSyllables.length)];
        resultMessage.textContent = `Encuentra: ${targetSyllable}`;
        
        // Crear tarjetas
        const syllablesToShow = getRandomSyllables(targetSyllable, 6);
        syllablesToShow.forEach(syllable => {
            const card = document.createElement('div');
            card.className = 'syllable-card';
            card.textContent = syllable;
            card.dataset.syllable = syllable;
            
            card.addEventListener('click', () => canClick && checkAnswer(syllable));
            grid.appendChild(card);
        });
    }
    
    // Verificar respuesta
    function checkAnswer(syllable) {
        canClick = false;
        const cards = document.querySelectorAll('.syllable-card');
        
        if (syllable === targetSyllable) {
            // Respuesta correcta
            cards.forEach(card => {
                if (card.dataset.syllable === syllable) {
                    card.classList.add('correct');
                }
            });
            
            resultMessage.innerHTML = `¡Correcto! <br>${syllable}`;
            correctSound.currentTime = 0;
            correctSound.play();
            nextBtn.classList.remove('hidden');
            
            updateScore(true);
            showProfessorMessage('correct');
        } else {
            // Respuesta incorrecta
            cards.forEach(card => {
                if (card.dataset.syllable === syllable) {
                    card.classList.add('incorrect');
                }
            });
            
            resultMessage.textContent = 'Intenta de nuevo';
            if (wrongSound.paused) {
                wrongSound.currentTime = 0;
                wrongSound.play();
            }
            
            updateScore(false);
            showProfessorMessage('incorrect');
            
            // Mostrar la correcta después de 1 segundo
            setTimeout(() => {
                cards.forEach(card => {
                    if (card.dataset.syllable === targetSyllable) {
                        card.classList.add('correct');
                    }
                });
                nextBtn.classList.remove('hidden');
            }, 1000);
        }
    }
    
    // Obtener sílabas aleatorias
    function getRandomSyllables(target, count) {
        const otherSyllables = currentSyllables.filter(s => s !== target);
        const selected = [...otherSyllables]
            .sort(() => Math.random() - 0.5)
            .slice(0, count - 1);
        return [...selected, target].sort(() => Math.random() - 0.5);
    }
    
    // Interacción con el personaje
    character.addEventListener('click', () => {
        showProfessorMessage('welcome');
    });

    // Iniciar el juego
    initGame('easy');
});