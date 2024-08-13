chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => { // Listen for messages from the content script
      if (request.action === 'transferText') { // Check if the message action is 'transferText'
        chrome.storage.local.set({ transferredText: request.text }, () => { // Saves transferred text to local storage and executes callback
          sendResponse({ status: 'Text saved' }); // Sends a response with a status
        }); // Saves transferred text to local storage and sends a response
      }
      return true; // Required for async sendResponse to prevent undefined
    }
  );
  
  // Logs a message when the extension is installed or updated
  chrome.runtime.onInstalled.addListener(() => { // Listener to log a message when extension is installed or updated
    console.log("EZRead extension installed and background script running."); // Logs the message
  });