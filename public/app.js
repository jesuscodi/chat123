const currentPage = window.location.pathname.split("/").pop();

if(currentPage === "index.html"){
    const usernameInput = document.getElementById('username');
    const loginBtn = document.getElementById('loginBtn');
    const msg = document.getElementById('msg');

    loginBtn.addEventListener('click', async () => {
        const username = usernameInput.value.trim();
        if(!username) return msg.innerText = "Ingresa un nombre";

        // Login simple (no contraseña)
        const res = await fetch('/login', {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({username})
        });
        const data = await res.json();
        if(data.success){
            localStorage.setItem('username', username);
            window.location.href = 'chat.html';
        } else {
            msg.innerText = data.message;
        }
    });
}

if(currentPage === "chat.html"){
    const messagesContainer = document.getElementById('messages');
    const msgInput = document.getElementById('msgInput');
    const sendBtn = document.getElementById('sendBtn');

    const username = localStorage.getItem('username');
    if(!username) window.location.href = 'index.html';

    const fetchMessages = async () => {
        const res = await fetch('/messages');
        const data = await res.text();
        messagesContainer.innerText = data;
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    sendBtn.addEventListener('click', async () => {
        const message = msgInput.value.trim();
        if(!message) return;

        await fetch('/message', {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({username, message})
        });
        msgInput.value = '';
        fetchMessages();
    });

    setInterval(fetchMessages, 1000);
}
