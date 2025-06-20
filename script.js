// Funciones básicas para el chatbot

document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('chat-toggle');
    const windowEl = document.getElementById('chat-window');
    const messages = document.getElementById('chat-messages');

    toggle.addEventListener('click', function() {
        windowEl.classList.toggle('open');
        if (messages.innerHTML.trim() === '') {
            addMessage('¿A dónde quieres volar?');
            setTimeout(() => addMessage('¿Desde qué ciudad partes?'), 2000);
            setTimeout(() => addMessage('Consulta nuestros precios aquí.'), 4000);
        }
    });

    function addMessage(text) {
        const p = document.createElement('p');
        p.textContent = text;
        messages.appendChild(p);
    }
});
