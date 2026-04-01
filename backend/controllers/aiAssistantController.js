import { GoogleGenAI } from '@google/genai';

export const askAI = async (req, res) => {
    try {
        const { message, context } = req.body;
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        // Build context prompt
        const systemPrompt = `You are the CJ-Tech AI Assistant. You help manage a tech shop's job orders and schedules based on the data provided.\n\nCurrent Data Context:\n${JSON.stringify(context)}\n\nUser query: ${message}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: systemPrompt,
        });

        res.json({ success: true, response: response.text });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
