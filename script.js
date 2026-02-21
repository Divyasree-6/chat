class WhatsAppClone {
    constructor() {          //brain
        this.currentChat = null;
        this.chats = this.loadChats();
        this.contacts = this.loadContacts();
        this.init();
    }

    init() {                //display
        this.bindEvents();
        this.renderChatList();
        this.renderContacts();
        this.updateOnlineStatus();
    }

    bindEvents() {
        // New chat button
        document.getElementById('newChatBtn').addEventListener('click', () => {
            document.getElementById('newChatModal').style.display = 'block';
        });

        // Close modal
        document.getElementById('closeModal').addEventListener('click', () => {
            document.getElementById('newChatModal').style.display = 'none';
        });

        // Send message
        document.getElementById('sendBtn').addEventListener('click', () => {
            this.sendMessage();
        });

        // Enter key to send message
        document.getElementById('messageInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchChats(e.target.value);
        });

        // Contact search
        document.getElementById('contactSearch').addEventListener('input', (e) => {
            this.searchContacts(e.target.value);
        });

        // Click outside modal to close
        document.getElementById('newChatModal').addEventListener('click', (e) => {
            if (e.target.id === 'newChatModal') {
                document.getElementById('newChatModal').style.display = 'none';
            }
        });
    }

    loadChats() {
        const savedChats = localStorage.getItem('whatsapp_chats');
        if (savedChats) {
            return JSON.parse(savedChats);
        }
        
        // Default chats
        return [
            {
                id: 1,
                name: 'John Doe',
                avatar: 'https://i.pravatar.cc/150?img=1',
                lastMessage: 'Hey! How are you doing?',
                time: '10:30 AM',
                unread: 2,
                online: true,
                messages: [
                    { id: 1, text: 'Hi there!', sent: false, time: '10:25 AM' },
                    { id: 2, text: 'Hey! How are you doing?', sent: false, time: '10:30 AM' }
                ]
            },
            {
                id: 2,
                name: 'Sarah Wilson',
                avatar: 'https://i.pravatar.cc/150?img=2',
                lastMessage: 'Thanks for your help yesterday',
                time: '9:45 AM',
                unread: 0,
                online: false,
                messages: [
                    { id: 1, text: 'Could you help me with the project?', sent: false, time: '9:40 AM' },
                    { id: 2, text: 'Sure! What do you need?', sent: true, time: '9:42 AM' },
                    { id: 3, text: 'Thanks for your help yesterday', sent: false, time: '9:45 AM' }
                ]
            },
            {
                id: 3,
                name: 'Mike Johnson',
                avatar: 'https://i.pravatar.cc/150?img=3',
                lastMessage: 'See you tomorrow!',
                time: 'Yesterday',
                unread: 0,
                online: true,
                messages: [
                    { id: 1, text: 'Are we still meeting tomorrow?', sent: true, time: 'Yesterday' },
                    { id: 2, text: 'Yes, at 3 PM', sent: false, time: 'Yesterday' },
                    { id: 3, text: 'See you tomorrow!', sent: false, time: 'Yesterday' }
                ]
            },
            {
                id: 4,
                name: 'Emma Davis',
                avatar: 'https://i.pravatar.cc/150?img=4',
                lastMessage: 'Great job on the presentation!',
                time: 'Yesterday',
                unread: 1,
                online: false,
                messages: [
                    { id: 1, text: 'How did the presentation go?', sent: false, time: 'Yesterday' },
                    { id: 2, text: 'It went really well, thanks!', sent: true, time: 'Yesterday' },
                    { id: 3, text: 'Great job on the presentation!', sent: false, time: 'Yesterday' }
                ]
            }
        ];
    }

    loadContacts() {
        return [
            { id: 5, name: 'Alex Brown', avatar: 'https://i.pravatar.cc/150?img=5', online: true },
            { id: 6, name: 'Lisa Garcia', avatar: 'https://i.pravatar.cc/150?img=6', online: false },
            { id: 7, name: 'David Miller', avatar: 'https://i.pravatar.cc/150?img=7', online: true },
            { id: 8, name: 'Jennifer Taylor', avatar: 'https://i.pravatar.cc/150?img=8', online: false },
            { id: 9, name: 'Robert Anderson', avatar: 'https://i.pravatar.cc/150?img=9', online: true },
            { id: 10, name: 'Maria Rodriguez', avatar: 'https://i.pravatar.cc/150?img=10', online: false }
        ];
    }

    saveChats() {
        localStorage.setItem('whatsapp_chats', JSON.stringify(this.chats));
    }

    renderChatList() {
        const chatList = document.getElementById('chatList');
        chatList.innerHTML = '';

        this.chats.forEach(chat => {
            const chatItem = document.createElement('div');
            chatItem.className = 'chat-item';
            chatItem.dataset.chatId = chat.id;
            
            chatItem.innerHTML = `
                <img src="${chat.avatar}" alt="${chat.name}">
                <div class="chat-details">
                    <div class="chat-name">${chat.name}</div>
                    <div class="last-message">${chat.lastMessage}</div>
                </div>
                <div class="chat-meta">
                    <div class="chat-time">${chat.time}</div>
                    ${chat.unread > 0 ? `<div class="unread-count">${chat.unread}</div>` : ''}
                </div>
            `;

            chatItem.addEventListener('click', () => {
                this.openChat(chat.id);
            });

            chatList.appendChild(chatItem);
        });
    }

    renderContacts() {
        const contactsList = document.getElementById('contactsList');
        contactsList.innerHTML = '';

        this.contacts.forEach(contact => {
            const contactItem = document.createElement('div');
            contactItem.className = 'contact-item';
            
            contactItem.innerHTML = `
                <img src="${contact.avatar}" alt="${contact.name}">
                <div class="contact-name">${contact.name}</div>
            `;

            contactItem.addEventListener('click', () => {
                this.startNewChat(contact);
            });

            contactsList.appendChild(contactItem);
        });
    }

    openChat(chatId) {
        // Remove active class from all chat items
        document.querySelectorAll('.chat-item').forEach(item => {
            item.classList.remove('active');
        });

        // Add active class to selected chat
        document.querySelector(`[data-chat-id="${chatId}"]`).classList.add('active');

        // Find the chat
        const chat = this.chats.find(c => c.id === chatId);
        if (!chat) return;

        this.currentChat = chat;

        // Mark messages as read
        chat.unread = 0;
        this.saveChats();

        // Hide welcome screen and show chat interface
        document.getElementById('welcomeScreen').style.display = 'none';
        document.getElementById('chatInterface').style.display = 'flex';

        // Update chat header
        document.getElementById('contactPic').src = chat.avatar;
        document.getElementById('contactName').textContent = chat.name;
        document.getElementById('contactStatus').textContent = chat.online ? 'online' : 'last seen recently';

        // Render messages
        this.renderMessages();
        this.renderChatList(); // Re-render to update unread count
    }

    renderMessages() {//painter ---->display new updates on screen
        if (!this.currentChat) return;

        const messagesContainer = document.getElementById('messages');
        messagesContainer.innerHTML = '';

        this.currentChat.messages.forEach(message => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${message.sent ? 'sent' : 'received'}`;
            
            messageDiv.innerHTML = `
                <div class="message-text">${message.text}</div>
                <div class="message-time">${message.time}</div>
            `;

            messagesContainer.appendChild(messageDiv);
        });

        // Scroll to bottom--->50msg-then new go to bottom --telling browser to move to bottom
        document.getElementById('messagesContainer').scrollTop = document.getElementById('messagesContainer').scrollHeight;
    }

    sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const messageText = messageInput.value.trim();

        if (!messageText || !this.currentChat) return;

        // Create new message
        const newMessage = {
            id: Date.now(),
            text: messageText,
            sent: true,
            time: this.getCurrentTime()
        };

        // Add message to current chat
        this.currentChat.messages.push(newMessage);
        this.currentChat.lastMessage = messageText;
        this.currentChat.time = newMessage.time;

        // Clear input
        messageInput.value = '';

        // Save and re-render
        this.saveChats();
        this.renderMessages();
        this.renderChatList();

        // Simulate response after 1-3 seconds
        setTimeout(() => {
            this.simulateResponse();
        }, Math.random() * 2000 + 1000);
    }

    simulateResponse() {
        if (!this.currentChat) return;

        const responses = [
            "That's interesting!",
            "I see what you mean",
            "Thanks for letting me know",
            "Got it!",
            "Sure thing",
            "Absolutely!",
            "I agree",
            "That makes sense",
            "Cool!",
            "Awesome!"
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const responseMessage = {
            id: Date.now(),
            text: randomResponse,
            sent: false,
            time: this.getCurrentTime()
        };

        this.currentChat.messages.push(responseMessage);
        this.currentChat.lastMessage = randomResponse;
        this.currentChat.time = responseMessage.time;

        this.saveChats();
        this.renderMessages();
        this.renderChatList();
    }

    startNewChat(contact) {
        // Check if chat already exists
        const existingChat = this.chats.find(chat => chat.name === contact.name);
        
        if (existingChat) {
            this.openChat(existingChat.id);
        } else {
            // Create new chat
            const newChat = {
                id: Date.now(),
                name: contact.name,
                avatar: contact.avatar,
                lastMessage: 'Start a conversation',
                time: 'now',
                unread: 0,
                online: contact.online,
                messages: []
            };

            this.chats.unshift(newChat);
            this.saveChats();
            this.renderChatList();
            this.openChat(newChat.id);
        }

        // Close modal
        document.getElementById('newChatModal').style.display = 'none';
    }

    searchChats(query) {
        const chatItems = document.querySelectorAll('.chat-item');
        
        chatItems.forEach(item => {
            const chatName = item.querySelector('.chat-name').textContent.toLowerCase();
            const lastMessage = item.querySelector('.last-message').textContent.toLowerCase();
            
            if (chatName.includes(query.toLowerCase()) || lastMessage.includes(query.toLowerCase())) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    searchContacts(query) {
        const contactItems = document.querySelectorAll('.contact-item');
        
        contactItems.forEach(item => {
            const contactName = item.querySelector('.contact-name').textContent.toLowerCase();
            
            if (contactName.includes(query.toLowerCase())) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
    }

    updateOnlineStatus() {
        // Randomly update online status every 30 seconds
        setInterval(() => {
            this.chats.forEach(chat => {
                if (Math.random() > 0.7) {
                    chat.online = !chat.online;
                }
            });

            this.contacts.forEach(contact => {
                if (Math.random() > 0.7) {
                    contact.online = !contact.online;
                }
            });

            // Update current chat status if open
            if (this.currentChat) {
                document.getElementById('contactStatus').textContent = 
                    this.currentChat.online ? 'online' : 'last seen recently';
            }

            this.saveChats();
        }, 30000);
    }
}

// Initialize the app when DOM is loaded  ---->browser event
document.addEventListener('DOMContentLoaded', () => {
    new WhatsAppClone();
});