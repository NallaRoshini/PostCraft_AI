from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from post_generator import generate_post
from llm_helper import llm
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.exceptions import OutputParserException
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://post-craft-ai-bot.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatInput(BaseModel):
    message: str

@app.post("/chat")
def chat(chat: ChatInput):
    prompt = '''
    You are given a user prompt which asks to generate a LinkedIn post.
    Extract 3 things:
    1. "length": One of "Short", "Medium", or "Long"
    2. "language": Assume "English"
    3. "topic": The subject of the post (1-3 words max, in Title Case)

    Return JSON with exactly 3 fields: length, language, topic
    No explanation.

    Here is the prompt:
    {abc}
    '''
    try:
        pt=PromptTemplate.from_template(prompt)
        chain=pt | llm
        response = chain.invoke(input={'abc':chat.message})
        parser = JsonOutputParser()
        parsed = parser.parse(response.content)

        # Generate the post using existing logic
        generated = generate_post(parsed["length"], parsed["language"], parsed["topic"])
        return {"response": generated}

    except OutputParserException:
        return {"response": "Sorry, I couldn't understand that. Please rephrase."}