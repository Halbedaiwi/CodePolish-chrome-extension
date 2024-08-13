from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from groq import Groq

os.environ["GROQ_API_KEY"] = "YOUR_API_KEY"

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

roleAI = "You will properly format the code you are given, and will return nothing but the code that is formated. Comments are limited to one just one line per line of code, and nothing more. Do not use block comments. Do not add ``` and the programing language at the begining and end of your output. Comments should be added to most lines of code, as long as they are limited to just one line, and they are not block comments. Do not remove, or edit lines of code. "

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

@app.route('/api/search', methods=['POST'])
def search():
    data = request.get_json()
    userInput = data.get('userInput')

    try:
        # API request to groq
        response = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": roleAI,
                },
                {
                    "role": "user",
                    "content": userInput,
                }
            ],
            model="llama-3.1-8b-instant",
        )
        response_content = response.choices[0].message.content
        return jsonify({'message': response_content})

    except Exception as e:
        print(f"Error communicating with API: {e}")
        return jsonify({'message': 'Error communicating with API.'}), 500

if __name__ == '__main__':
    app.run(debug=True)
