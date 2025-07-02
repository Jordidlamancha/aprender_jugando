document.addEventListener('DOMContentLoaded', function() {

    // Bloqueador de inspección (opcional - descomentar si necesario)
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
    const cards = document.querySelectorAll('.vowel-card');
    const backButton = document.querySelector('.back-button');
    
    // Precargar todos los sonidos de vocales y animales
    const sounds = {
        'A': { 
            vowel: new Audio('../media/words/A.mp3'), 
            animal: new Audio('../media/effects/ardilla.mp3'),
            img: '../media/img/ardilla.webp'
        },
        'E': { 
            vowel: new Audio('../media/words/E.mp3'), 
            animal: new Audio('../media/effects/elefante.mp3'),
            img: '../media/img/elefante.png'
        },
        'I': { 
            vowel: new Audio('../media/words/I.mp3'), 
            animal: new Audio('../media/effects/iguana.mp3'), // Asegúrate que la ruta es correcta
            img: '../media/img/iguana.png'
        },
        'O': { 
            vowel: new Audio('../media/words/O.mp3'), 
            animal: new Audio('../media/effects/oso.mp3'),
            img: '../media/img/oso.png'
        },
        'U': { 
            vowel: new Audio('../media/words/U.mp3'), 
            animal: new Audio('../media/effects/urraca.mp3'),
            img: '../media/img/urraca.png'
        }
    };

    // Ajustar volumen y precargar sonidos
    function preloadSounds() {
        Object.keys(sounds).forEach(vowel => {
            sounds[vowel].vowel.volume = 1.0;
            sounds[vowel].animal.volume = 0.7;
            
            sounds[vowel].vowel.load().catch(e => console.error(`Error precargando vocal ${vowel}:`, e));
            sounds[vowel].animal.load().catch(e => console.error(`Error precargando animal ${vowel}:`, e));
        });
    }

    // Reproducir sonido con manejo de errores
    function playSound(audioElement) {
        return new Promise((resolve) => {
            try {
                audioElement.currentTime = 0;
                audioElement.play().then(() => {
                    audioElement.onended = resolve;
                }).catch(e => {
                    console.error("Error al reproducir:", e);
                    resolve();
                });
            } catch (e) {
                console.error("Error fatal con el audio:", e);
                resolve();
            }
        });
    }

    // Lógica principal para las tarjetas
    cards.forEach(card => {
        card.addEventListener('click', async function() {
            // Evitar múltiples clics mientras está activa
            if (card.classList.contains('flipped')) return;
            
            const vowel = card.dataset.vowel;
            const currentSounds = sounds[vowel];
            
            // 1. Voltear tarjeta
            card.classList.add('flipped');
            
            // 2. Efecto visual
            card.style.transform = 'scale(1.05)';
            setTimeout(() => { card.style.transform = 'scale(1)'; }, 200);
            
            // 3. Secuencia de sonidos
            try {
                // Reproducir vocal y esperar a que termine
                await playSound(currentSounds.vowel);
                
                // Esperar 300ms antes del sonido del animal
                await new Promise(resolve => setTimeout(resolve, 300));
                
                // Reproducir sonido del animal
                await playSound(currentSounds.animal);
                
            } catch (e) {
                console.error("Error en la secuencia de sonidos:", e);
            }
            
            // 4. Reiniciar después de 2 segundos (si no se ha hecho clic de nuevo)
            setTimeout(() => {
                if (card.classList.contains('flipped')) {
                    card.classList.remove('flipped');
                }
            }, 1000);
        });
    });

    // Precargar todos los sonidos al inicio
    preloadSounds();

    // Inicializar contexto de audio para móviles (requerido en iOS)
    function initAudioContext() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = ctx.createOscillator();
            oscillator.connect(ctx.destination);
            oscillator.start();
            oscillator.stop(ctx.currentTime + 0.001);
        } catch (e) {
            console.error("Error al inicializar contexto de audio:", e);
        }
    }

    // Activar audio con el primer toque/clic (para iOS)
    const initAudio = () => {
        initAudioContext();
        document.body.removeEventListener('click', initAudio);
        document.body.removeEventListener('touchstart', initAudio);
    };
    
    document.body.addEventListener('click', initAudio, { once: true });
    document.body.addEventListener('touchstart', initAudio, { once: true });
});