document.getElementById('meltBtn').addEventListener('click', async () => {
    const statusEl = document.getElementById('status');
    const btn = document.getElementById('meltBtn');

    statusEl.innerText = 'Cooking... 💀';
    btn.disabled = true;

    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (!tab) {
            statusEl.innerText = 'No active tab found.';
            btn.disabled = false;
            return;
        }

        // Ping the content script to see if it's there
        chrome.tabs.sendMessage(tab.id, { type: 'START_BRAINROT' }, (response) => {
            if (chrome.runtime.lastError) {
                statusEl.innerText = 'Error: Refresh the page first!';
                btn.disabled = false;
            } else {
                statusEl.innerText = 'Brain rot in progress...';
                // The content script will handle the replacement
                setTimeout(() => {
                    statusEl.innerText = 'Mission accomplished. 🤡';
                    btn.disabled = false;
                }, 5000);
            }
        });

    } catch (err) {
        statusEl.innerText = 'Critical Error: ' + err.message;
        btn.disabled = false;
    }
});
