const GEMINI_API_KEY = "YOUR_API_KEY";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
console.log("Background service worker loaded");

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "BRAINROT") {
        generateBrainrot(msg.prompt)
            .then(text => sendResponse(text))
            .catch(err => {
                console.error("Gemini Error:", err);
                sendResponse(null);
            });
        return true;
    }
});

async function generateBrainrot(prompt) {
    console.log(`prompt: ${prompt}`);
    try {
        const response = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.candidates || data.candidates.length === 0) {
            console.error("Gemini Error: No candidates returned.", data);
            return "Brainrot failed (filtered content?)";
        }

        const candidate = data.candidates[0];
        if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
            console.error("Gemini Error: No content/parts in candidate.", data);
            return "Brainrot failed (empty response)";
        }

        const returnedthingy = candidate.content.parts[0].text;
        console.log(`check ts: ${returnedthingy}`);
        return returnedthingy;
    } catch (error) {
        console.error("Fetch failed:", error);
        return null;
    }
}