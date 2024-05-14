import os

from dotenv import load_dotenv
from litellm import completion

load_dotenv()

# deepseek_api_key = os.getenv('DEEPSEEK_API_KEY')
openai_api_key = os.getenv('OPENAI_API_KEY')
openai_base_url = os.getenv('OPENAI_API_BASE')

response = completion(
    model="gpt-3.5-turbo", 
    messages=[
       {"role": "user", "content": "hello from litellm"}
   ],
)
print(response)