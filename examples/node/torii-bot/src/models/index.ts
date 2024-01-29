import { OpenAI } from "langchain/llms/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";

export const llm = new OpenAI({
    openAIApiKey: process.env.OPEN_AI_API_KEY,
    modelName: "gpt-4-1106-preview",
});

export const chatModel = new ChatOpenAI({
    openAIApiKey: process.env.OPEN_AI_API_KEY,
    modelName: "gpt-4-1106-preview",
});

export const getPrediction = async (statement: string, text: string) => {
    const prompt = PromptTemplate.fromTemplate(statement);

    const chainA = new LLMChain({ llm: chatModel, prompt });

    const call = await chainA.call({ question: text });
    return call.text;
};
