import { handleMessage } from './src/handlers/messageHandler';

// Initialize the content script
console.log('AutoFillEXT content script initialized');

// Set up message listener for communication with the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Received message from popup:', request);
    return handleMessage(request, sender, sendResponse);
});