// Background script for AutoFillEXT
console.log('AutoFillEXT background script loaded');

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
    console.log('AutoFillEXT installed successfully');
});

// Handle messages from popup to content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Background script received message:', request);
    
    if (request.action === 'autofill') {
        // Forward the message to the active tab
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs && tabs.length > 0) {
                chrome.tabs.sendMessage(tabs[0].id, request.data, (response) => {
                    console.log('Content script response:', response);
                    sendResponse(response);
                });
            } else {
                sendResponse({ 
                    status: 'Error', 
                    message: 'No active tab found' 
                });
            }
        });
        
        // Keep the message channel open
        return true;
    }
}); 