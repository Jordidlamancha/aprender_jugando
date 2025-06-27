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
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    const musicStatus = document.getElementById('music-status');
    const gameCards = document.querySelectorAll('.game-card');

    // Configuración inicial de audio
    function setupAudio() {
        // Precargar y configurar música
        bgMusic.load();
        bgMusic.volume = 0.1; // Volumen moderado para niños
        
        // Establecer estado inicial en UI
        musicStatus.textContent = bgMusic.play ? "Música: ON":"Música: OFF" ;
    }

    // Control de reproducción de música
    function toggleMusic() {
        if (bgMusic.paused) {
            const playPromise = bgMusic.play();
            
            playPromise.then(() => {
                bgMusic.muted = false;
                musicStatus.textContent = "Música: ON";
            }).catch(error => {
                console.error("Error al reproducir:", error);
                musicStatus.textContent = "Música: OFF (Click para activar)";
            });
        } else {
            bgMusic.pause();
            musicStatus.textContent = "Música: OFF";
        }
    }

    // Efectos hover para tarjetas de juego
    function setupGameCards() {
        gameCards.forEach(card => {
            // Efecto visual al pasar el mouse
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px)';
                card.style.transition = 'transform 0.3s ease';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
            
            // Feedback táctil para dispositivos móviles
            card.addEventListener('touchstart', () => {
                card.style.transform = 'translateY(-5px)';
            });
            
            card.addEventListener('touchend', () => {
                card.style.transform = '';
            });
        });
    }

    // Inicialización después de interacción del usuario
    function initAfterInteraction() {
        // Intenta iniciar música
        const playPromise = bgMusic.play();
        
        playPromise.catch(error => {
            musicStatus.textContent = "Música: OFF (Click para activar)";
            bgMusic.muted = true;
        });
        
        // Elimina el listener después de la primera interacción
        document.body.removeEventListener('click', initAfterInteraction);
        document.body.removeEventListener('touchstart', initAfterInteraction);
    }

    // Configuración inicial
    setupAudio();
    setupGameCards();

    // Event listeners
    musicToggle.addEventListener('click', toggleMusic);
    
    // Iniciar después de interacción (click o touch)
    document.body.addEventListener('click', initAfterInteraction, { once: true });
    document.body.addEventListener('touchstart', initAfterInteraction, { once: true });

});