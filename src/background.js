import { GoogleGenAI } from "@google/genai";
const apiKey = "AIzaSyC0QvKfd6cdAVvRSW-KABZiat5pRWCF5jc";
console.log("Background service worker loaded");
const ai = new GoogleGenAI({ apiKey });

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "BRAINROT") {
        generateBrainrot(msg.prompt)
            .then(text => sendResponse(text));

        return true;
    }
});

async function generateBrainrot(prompt) {
    console.log(`prompt: ${prompt}`);
    try {
        const brainrot = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt
        })
        console.log(brainrot.text);
        return brainrot.text;
    } catch (error) {
        console.error(error);
        return null;
    }
}