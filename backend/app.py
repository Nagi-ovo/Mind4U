import json
import os

from bs4 import BeautifulSoup  # noqa: F401
from dotenv import load_dotenv
from flask import Flask, jsonify, render_template, request
from flask_cors import CORS
from langchain_community.document_loaders import WebBaseLoader
from litellm import completion

load_dotenv()

deepseek_api_key = os.getenv('DEEPSEEK_API_KEY')
openai_api_key = os.getenv('OPENAI_API_KEY')
openai_base_url = os.getenv('OPENAI_API_BASE')

app = Flask(__name__)
CORS(app)

IS_URL = True

def deepseek_react(messages):
    """
    Ask DeepSeek-V2 to determine 
    an optimal action based on the given messages.
    
    Parameters:
    messages (list): A list containing dictionaries with 'role' and 'content' 
                     representing the conversation.
                     
    Returns:
    dict: A dictionary containing 'thought' (the reasoning behind the action) 
          and 'action' (one of ["WebScrawler"]).
    """

    instruct_prompt = """
    你是一个擅长对网页提取文本结果清洗的专家，请在不改变原先内容的前提下去除输入文本中与主题无关的内容，并尽可能在不减少篇幅和原有表达方式的条件下让网页内容更能够体现信息之间的关系。
    """  # noqa: E501
    tools = """
    {
        "工具": [
            {
                "名称": "WebCrawler",
                "描述": "从网站中提取信息的工具",
                "选择条件": "当用户输入是一个https:开头的网站链接而非大段文字时使用"
            },
            {
                "名称": "Condenser",
                "描述": "压缩文本",
                "选择条件": "如果不使用WebCrawler工具才使用这个"
            }
        ]
    }
    """  # noqa: E501

    react_prompt = f"""
    你的工作是根据用户输入内容，请你经过谨慎思考选择下面的一种工具，只需回复工具名称即可(不包括引号)
    {tools}
    """  # noqa: E501

    messages = [
            {
                "role": "user",
                "content": f"{messages}"
            },
            {
                "role": "system",
                "content": f"{react_prompt if IS_URL else instruct_prompt}"  # noqa: E501
            }
        ]
    
    result = generate_text_completion("deepseek/deepseek-chat", messages)
    print(result)
    if 'error' in result:
        return jsonify({'error': result['error']})

    # Convert the content string into JSON format (assuming JSON content is returned)
    try:
        clean_response = result['response']
        return clean_response
    except Exception as e:
        return jsonify({'error': f"Error while returning: {str(e)}"})


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


def webScrawler(doc_url) -> str:
    loader = WebBaseLoader(doc_url)
    loader.requests_per_second = 1
    docs = loader.aload()
    print(docs[0].page_content[:1000])
    return docs[0].page_content


def generate_graph(text):
    """
    Generate a graph from the given text.
    """
    print("\nGenerating graph...\n")

    # Few-shot prompt for the LMM to understand the task
    with open("prompt.json", "r") as f:
        json_data = f.read()

    data = json.loads(json_data)

    few_shot_prompt = ""
    for _, example_value in data.items():
        input_text = example_value["input"]
        nodes = example_value["nodes"]
        edges = example_value["edges"]

        few_shot_prompt += f'input: "{input_text}"\noutput: nodes: [{nodes}], edges: [{edges}]\n'  # noqa: E501

    messages = [
            {
                "role": "user",
                "content": f"{text}"
            },
            {
                "role": "system",
                "content": f"""
                  <role>
                  You are an AI expert specializing in knowledge graph creation.
                  </role>
                  <task>
                  Your task is to create a complex knowledge graph based on the input which can excavate deep relationships.
                  Nodes must have a label parameter. where the label is a direct word or phrase from the input.
                  <Example>
                  You should learn the pattern of these examples below, think step by step, learn how to use **instinct relationships** instead of something like "is a".
                  {few_shot_prompt}
                  </Example>
                  </task>
                  <Precautions>
                  - Edges must also have a label parameter, wher the label is a direct word or phrase from the input.
                  - Respons only with JSON in a format where we can jsonify in python and feed directly into  cy.add(data); to display a graph on the front-end.
                  Make sure the target and source of edges match an existing node.
                  - Do not include the markdown triple quotes above and below the JSON, jump straight into it with a curly bracket.
                  - Make sure that the information on the edges between nodes clearly expresses the node relationship and is not meaningless.
                    </Precautions>
                  <Your Output>
                """  # noqa: F541, E501
            }
        ]

    result = generate_text_completion("gpt-4o", messages)
    # result = generate_text_completion("deepseek/deepseek-chat", messages)
    return result


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/update_graph', methods=['POST'])
def update_graph():
    global IS_URL
    IS_URL = True
    text = request.json.get('text', '')
    action = deepseek_react(text) 
    print(text, action)
    if action == "WebCrawler":
        print("\nUsing WebCrawler Tool......\n")
        text = webScrawler(text)

    IS_URL = False
    if len(text) > 2000:
        print("\nCondensing......\n")
        condensed_text = deepseek_react(text)
    else:
        condensed_text = text

    result = generate_graph(condensed_text)

    if 'error' in result:
        return jsonify({'error': result['error']})

    # Convert the content string into JSON format (assuming JSON content is returned)
    try:
        clean_response = result['response'].replace('```', '').strip()
        graph_data = json.loads(clean_response)
        # print(graph_data)
        return jsonify(graph_data)
    except Exception as e:
        return jsonify({'error': f"Error parsing graph data: {str(e)}"})


if __name__ == '__main__':
  app.run(host='0.0.0.0', port=80)
