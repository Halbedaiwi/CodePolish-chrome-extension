# CodePolish
CodePolish is a Chrome extension that enhances code readability by auto-formatting and generating documentation for multiple languages. It allows custom formatting rules and seamlessly integrates into development workflows, making coding more efficient.

## Features
- **Auto-Format:** Automatically refines and beautifies your code for better readability.
- **Documentation Generation:** Instantly creates code comments and documentation blocks.
- **Customizable Settings:** Tailor formatting rules to match your coding style and preferences.
- **Multi-Language Support:** Works with various programming languages for versatile usage.

Use the package manager [pip](https://pip.pypa.io/en/stable/) to install the required packages.
```bash
pip install flask
pip install flask-cors
pip install groq
```
After installing the packages, clone the the repository with ```git clone https://github.com/Halbedaiwi/CodePolish-chrome-extension.git ```.
## API Key Setup

CodePolish uses the powerful Llama 3.1 model from Meta. To use this LLM, createa an API key with [GroqCloud](https://console.groq.com/keys). 
Make sure to set the GROQ_API_KEY in your environment to use the Groq API within the ```api_backend.py``` folder.

## Load Unpacked Extensions
1. While loged in on a Chrome browser, head to [manage extensions](chrome://extensions/). This can be found while clicking on your profile icon on the top right of the Chrome browser
2. On the top left, select ```Load unpacked```.
3. Naviate to the directory containing CodePolish, and select it

At this point, CodePolish should appear as a load unpacked extension within the Chrome Extensions page.

## Run The Program via Terminal
1. If not already, change directories to where the program has been saved. For example, ```cd C:\Users\YourUsername\Documents\YourProjectDirectory```
2. Run the command ```python api_backend.py```
