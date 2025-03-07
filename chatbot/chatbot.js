// Elements
const chatbotIcon = document.getElementById("chatbot-icon");
const chatPopup = document.getElementById("chat-popup");
const closeChat = document.getElementById("close-chat");
const sendBtn = document.getElementById("send-btn");
const chatInput = document.getElementById("chat-input");
const chatContent = document.getElementById("chat-content");
const predefinedQuestionsContainer = document.getElementById("predefined-questions"); // Container for predefined questions

// Define sets of predefined questions
const questionSets = [
    [
        "What services do you offer?",
        "How can I volunteer?",
        "What are your working hours?",
        "How can I donate food?"
    ],
    [
        "How can I get involved with the NGO?",
        "Where are your donation centers located?",
        "Can I donate money instead of food?",
        "What is your mission?"
    ],
    [
        "How do you distribute food to those in need?",
        "Are there any upcoming events?",
        "What kind of food donations are most needed?",
        "How can I contact support?"
    ]
];

// Show popup when chatbot icon is clicked and refresh predefined questions
chatbotIcon.addEventListener("click", () => {
    chatPopup.style.display = "flex";
    refreshPredefinedQuestions(); // Refresh predefined questions on each open
});

// Close chat when 'x' is clicked
closeChat.addEventListener("click", () => {
    chatPopup.style.display = "none";
});

// Function to refresh predefined questions from one of the 3 sets
function refreshPredefinedQuestions() {
    // Clear existing questions
    predefinedQuestionsContainer.innerHTML = '';

    // Randomly pick one of the sets
    const randomSet = questionSets[Math.floor(Math.random() * questionSets.length)];

    // Add each question as a button to the container
    randomSet.forEach(question => {
        const questionBtn = document.createElement('button');
        questionBtn.classList.add('question-btn');
        questionBtn.innerText = question;

        // Add event listener for each button to handle the question click
        questionBtn.addEventListener('click', () => {
            addMessageToChat("You", question);
            processUserMessage(question); // Process the question (use pre-defined answer or API)
        });

        predefinedQuestionsContainer.appendChild(questionBtn); // Append button to container
    });
}

// Send message to chatbot (through Express.js server)
sendBtn.addEventListener("click", () => {
    const userMessage = chatInput.value;
    if (userMessage.trim() === "") return;

    addMessageToChat("You", userMessage);
    chatInput.value = ""; // Clear input field

    processUserMessage(userMessage);
});

// Function to display messages in chat window
function addMessageToChat(sender, message) {
    const messageElem = document.createElement("div");
    messageElem.classList.add("message");
    messageElem.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatContent.appendChild(messageElem);
    chatContent.scrollTop = chatContent.scrollHeight; // Scroll to the latest message
}

// Predefined question-answer mapping
const predefinedQA = {
    "What services do you offer?": "We offer food donation services, volunteer opportunities, and food distribution to those in need.",
    "How can I volunteer?": "To volunteer, you can sign up on our website and choose from various available volunteer programs.",
    "What are your working hours?": "Our working hours are Monday to Friday, 9 AM to 6 PM.",
    "How can I donate food?": "You can donate food by filling out the form on our website. We’ll arrange a pickup or direct you to the nearest drop-off location.",
    "How can I get involved with the NGO?": "You can get involved by volunteering, donating, or spreading awareness of our cause.",
    "Where are your donation centers located?": "Our donation centers are spread across multiple cities. Check the website for locations.",
    "Can I donate money instead of food?": "Yes, we accept monetary donations through our website.",
    "What is your mission?": "Our mission is to eliminate food waste and distribute surplus food to people in need.",
    "How do you distribute food to those in need?": "We partner with local organizations and volunteers to ensure food reaches those who need it most.",
    "Are there any upcoming events?": "Yes, check out our website's events page for more information on upcoming activities.",
    "What kind of food donations are most needed?": "Non-perishable items, such as canned foods, grains, and packaged goods, are most needed.",
    "How can I contact support?": "You can contact support through our helpline or by emailing support@feedcycle.org."
};

// Function to fetch chatbot response from server or use pre-defined answers
function processUserMessage(userMessage) {
    // Check if the question has a pre-defined answer
    if (predefinedQA[userMessage]) {
        addMessageToChat("Chatbot", predefinedQA[userMessage]); // Use pre-defined answer
    } else {
        // If no pre-defined answer, send request to server API
        fetchChatbotResponse(userMessage);
    }
}

// Function to fetch chatbot response from server
function fetchChatbotResponse(userMessage) {
    fetch('http://localhost:3000/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userMessage })
    })
    .then(response => response.json())
    .then(data => {
        addMessageToChat("Chatbot", data.response);
    })
    .catch(error => {
        console.error('Error:', error);
        addMessageToChat("Error", "Failed to get a response from the server.");
    });
}
