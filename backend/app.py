import json
import os

from dotenv import load_dotenv
from flask import Flask, jsonify, render_template, request
from flask_cors import CORS
from litellm import completion

load_dotenv()

# deepseek_api_key = os.getenv('DEEPSEEK_API_KEY')
openai_api_key = os.getenv('OPENAI_API_KEY')
openai_base_url = os.getenv('OPENAI_API_BASE')

app = Flask(__name__)
CORS(app)

def generate_text_completion(model, messages):
    """
    Generates text completion for the given messages using the specified model.
    """
    try:
        response = completion(model=model, messages=messages)  # noqa: E501
        content = response['choices'][0]['message']['content']
        return {"response": content}
    except Exception as e:
        return {"error": f"Failed to generate response: {str(e)}"}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/update_graph', methods=['POST'])
def update_graph():
    text = request.json.get('text', '')

    messages = [
            {
                "role": "user",
                "content": f"{text}"
            },
            {
                "role": "system",
                "content": f"""
                  <role>
                  You are an AI expert specializing in knowledge graph creation with the goal of capturing relationships based on a given input or request.
                  Based on the user input in various forms such as paragraph, email, text files, and more.
                  </role>
                  <task>
                  - Your task is to create a knowledge graph based on the input.
                  Nodes must have a label parameter. where the label is a direct word or phrase from the input.
                  - Edges must also have a label parameter, wher the label is a direct word or phrase from the input.
                  - Respons only with JSON in a format where we can jsonify in python and feed directly into  cy.add(data); to display a graph on the front-end.
                  Make sure the target and source of edges match an existing node.
                  - Do not include the markdown triple quotes above and below the JSON, jump straight into it with a curly bracket.
                  - Make sure that the information on the edges between nodes clearly expresses the node relationship and is not meaningless.
                  </task>
                  <Your Output>
                """  # noqa: F541, E501
            }
        ]

    # result = generate_text_completion("gpt-4-0125-preview", messages)
    result = generate_text_completion("gpt-4o", messages)
    print(result)

    if 'error' in result:
        return jsonify({'error': result['error']})

    # Convert the content string into JSON format (assuming JSON content is returned)
    try:
        clean_response = result['response'].replace('```', '').strip()
        graph_data = json.loads(clean_response)
        print(graph_data)
        return jsonify(graph_data)
    except Exception as e:
        return jsonify({'error': f"Error parsing graph data: {str(e)}"})


if __name__ == '__main__':
  app.run(host='0.0.0.0', port=80)
