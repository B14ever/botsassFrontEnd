(function() {
  const script = document.currentScript;
  const botId = script.getAttribute('data-bot-id');
  const apiUrl = script.getAttribute('data-api-url') || 'http://localhost:8081/api/v1';
  
  if (!botId) {
    console.error('BotSaas: data-bot-id is missing from script tag');
    return;
  }

  // Create container
  const container = document.createElement('div');
  container.id = 'botsaas-widget-container';
  document.body.appendChild(container);

  // Use Shadow DOM for isolation
  const shadow = container.attachShadow({ mode: 'open' });

  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    #botsaas-launcher {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 60px;
      height: 60px;
      border-radius: 20px;
      background: #7c3aed;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 10px 25px rgba(124, 58, 237, 0.3);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 999999;
    }
    #botsaas-launcher:hover {
      transform: scale(1.1) translateY(-2px);
      box-shadow: 0 15px 35px rgba(124, 58, 237, 0.4);
    }
    #botsaas-launcher svg {
      width: 30px;
      height: 30px;
      fill: currentColor;
    }
    #botsaas-chat-window {
      position: fixed;
      bottom: 100px;
      right: 24px;
      width: 400px;
      height: 600px;
      max-height: calc(100vh - 150px);
      background: #09090b;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
      z-index: 999998;
      display: none;
      flex-direction: column;
      overflow: hidden;
      font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
    }
    #botsaas-chat-window.open {
      display: flex;
      animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(20px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
  `;
  shadow.appendChild(style);

  // Launcher
  const launcher = document.createElement('div');
  launcher.id = 'botsaas-launcher';
  launcher.innerHTML = `
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.1 21.5l4.5-1.238c1.47.851 3.179 1.338 5 1.338 5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.477 0-2.863-.393-4.06-1.077L5 19.5l.577-2.94C4.893 15.363 4.5 13.977 4.5 12.5c0-4.142 3.358-7.5 7.5-7.5s7.5 3.358 7.5 7.5-3.358 7.5-7.5 7.5z"/>
    </svg>
  `;
  shadow.appendChild(launcher);

  // Window
  const chatWindow = document.createElement('div');
  chatWindow.id = 'botsaas-chat-window';
  
  // Use iFrame to completely isolate the chat app from host CSS/JS
  const hostUrl = window.location.origin; // Or use hardcoded dashboard URL
  const iframeUrl = `${script.src.replace('widget.js', '')}widget-chat?botId=${botId}&apiUrl=${encodeURIComponent(apiUrl)}`;
  
  chatWindow.innerHTML = `<iframe src="${iframeUrl}" title="BotSaas Chat"></iframe>`;
  shadow.appendChild(chatWindow);

  launcher.onclick = () => {
    chatWindow.classList.toggle('open');
  };

  // Close on Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && chatWindow.classList.contains('open')) {
      chatWindow.classList.remove('open');
    }
  });

})();
