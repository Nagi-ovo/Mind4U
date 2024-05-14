# Mind4U

## Setups

1. Install dependencies using Poetry:
   ```shell
   poetry install
   ```

2. Run the Flask application:
   ```shell
   poetry run python main.py
   ```

## Configuring Environment Variables

To run this application, you need to set up the `OPENAI_API_KEY` environment variable. Create a file named `.env` in the root directory of your project and add the following line:

   ```text
   OPENAI_API_KEY=your_openai_api_key_here
   ```