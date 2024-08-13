document.addEventListener('DOMContentLoaded', function () {
    // Get transferred text from storage and display it if available
    chrome.storage.local.get('transferredText', function (result) {
        if (result.transferredText) {
            document.getElementById('inputText').value = result.transferredText;
            chrome.storage.local.remove('transferredText');  // Clear the stored text after displaying it
        }
    });

    const inputText = document.getElementById('inputText'); // Get input field element
    const formatButton = document.getElementById('formatButton'); // Get format button element
    const responseContainer = document.getElementById('responseContainer'); // Get response container element
    const zoomInButton = document.getElementById('zoomInButton'); // Get zoom in button element
    const zoomOutButton = document.getElementById('zoomOutButton'); // Get zoom out button element
    const resetButton = document.getElementById('resetButton'); // Get reset button element
    const clearButton = document.getElementById('clearButton'); // Get clear button element
    const copyButton = document.getElementById('copyButton'); // Get copy button element
    let zoomLevel = 1; // Initialize zoom level to 1
    let paddingLevel = 20; // Initialize padding level to 20

    // Load saved state and zoom settings on DOMContentLoaded
    loadSavedState();
    loadZoomSettings();

    formatButton.addEventListener('click', function () {
        // Send formatted text to backend when format button is clicked
        sendToBackend(inputText.value.trim(), 'format');
    });

    clearButton.addEventListener('click', function () {
        // Save current state before clearing
        saveCurrentState();
        inputText.value = ''; // Clear input text
        responseContainer.textContent = ''; // Clear response
    });

    copyButton.addEventListener('click', function () {
        // Copy response to clipboard when copy button is clicked
        const contentToCopy = responseContainer.textContent.trim();
        if (contentToCopy) {
            navigator.clipboard.writeText(contentToCopy).then(() => {
                console.log('Output copied to clipboard');
            }).catch(err => {
                console.error('Error copying text: ', err);
            });
        }
    });

    zoomInButton.addEventListener('click', function () {
        // Increase zoom level by 0.1 and set padding level accordingly
        zoomLevel += 0.1;
        document.body.style.transform = `scale(${zoomLevel})`;

        if (paddingLevel === 20) {
            paddingLevel = 50;
        } else if (paddingLevel === 50) {
            paddingLevel = 80;
        } else {
            paddingLevel += 30;
        }

        document.querySelector('.container').style.padding = `${paddingLevel}px`;
        saveZoomSettings(); // Save settings after zooming
    });

    zoomOutButton.addEventListener('click', function () {
        // Decrease zoom level by 0.1 and set padding level accordingly
        if (zoomLevel > 0.1) {
            zoomLevel -= 0.1;
            document.body.style.transform = `scale(${zoomLevel})`;

            if (paddingLevel === 80) {
                paddingLevel = 50;
            } else if (paddingLevel === 50) {
                paddingLevel = 20;
            } else {
                paddingLevel = Math.max(20, paddingLevel - 30);
            }

            document.querySelector('.container').style.padding = `${paddingLevel}px`;
            saveZoomSettings(); // Save settings after zooming
        }
    });

    resetButton.addEventListener('click', function () {
        // Reset zoom level and padding level to default values
        zoomLevel = 1;
        paddingLevel = 20;
        document.body.style.transform = `scale(${zoomLevel})`;
        document.querySelector('.container').style.padding = `${paddingLevel}px`;
        saveZoomSettings(); // Save default settings
    });

    function saveCurrentState() {
        // Save current state to local storage
        const userInput = inputText.value.trim();
        const generatedInfo = responseContainer.textContent.trim();

        if (userInput || generatedInfo) {
            chrome.storage.local.set({ userInput, generatedInfo });
        }
    }

    function loadSavedState() {
        // Load saved state from local storage when popup loads
        chrome.storage.local.get(['userInput', 'generatedInfo'], function (result) {
            if (result.userInput) {
                inputText.value = result.userInput;
            }
            if (result.generatedInfo) {
                responseContainer.textContent = result.generatedInfo;
            }
        });
    }

    function saveZoomSettings() {
        // Save zoom settings to local storage
        chrome.storage.local.set({ zoomLevel, paddingLevel });
    }

    function loadZoomSettings() {
        // Load saved zoom settings from local storage when popup loads
        chrome.storage.local.get(['zoomLevel', 'paddingLevel'], function (result) {
            if (result.zoomLevel && result.paddingLevel) {
                zoomLevel = result.zoomLevel;
                paddingLevel = result.paddingLevel;
                document.body.style.transform = `scale(${zoomLevel})`;
                document.querySelector('.container').style.padding = `${paddingLevel}px`;
            }
        });
    }

    function sendToBackend(userInput, clickedButton) {
        // Send request to backend with user input and clicked button
        fetch('http://localhost:5000/api/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userInput, clickedButton })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Display response from backend in response container
            console.log('Response from backend:', data.message);
            displayResponse(data.message);
        })
        .catch(error => {
            // Display error message when communication with backend fails
            console.error('Error communicating with backend:', error);
            responseContainer.textContent = 'Error communicating with backend. Please try again.';
        });
    }

    function displayResponse(content) {
        // Display response in response container
        responseContainer.textContent = content;
        saveCurrentState(); // Save state when response is updated
    }

    window.addEventListener('beforeunload', function () {
        // Save state before popup is closed
        saveCurrentState();
    });
});