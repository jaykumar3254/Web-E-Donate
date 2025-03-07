const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(cors());

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await axios.post('http://localhost:11434/api/generate', {
            model: 'qwen',
            prompt: userMessage,
            stream: false
        });

        res.json({ response: response.data.response });
    } catch (error) {
        console.error("API Error:", error);
        res.status(500).json({ response: "Something went wrong. Please try again later." });
    }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
