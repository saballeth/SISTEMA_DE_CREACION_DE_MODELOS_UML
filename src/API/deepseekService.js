import axios from 'axios';

const API_URL = 'https://deepseek-v3.p.rapidapi.com/chat';
const API_KEY = process.env.REACT_APP_API_DEEPSEEK;


export const fetchChatResponse = async (message) => {
    const data = {
        messages: [
            {
                content: 'You are a translator from natural language to plantUML code',
                role: 'system'
            },

            {
                role: 'user',
                content: message,
            },
        ],
    };
    const headers = {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': 'deepseek-v3.p.rapidapi.com',
        'Content-Type': 'application/json',
    };
    try {
        const response = await axios.post(API_URL, data, { headers });
        return response.data;
    } catch (error) {
        console.error('Error fetching chat response:', error);
        throw error;
    }
};