import { Configuration, OpenAIApi } from 'openai';
import dotenv from "dotenv";
dotenv.config()
const apiKey = process.env.API_KEY
const organization = process.env.ORGANIZATION
const configuration = new Configuration({
  organization: organization,
  apiKey: apiKey
});

const openai = new OpenAIApi(configuration);
export async function prompt(text){
    const chat_completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        temperature:0.3,
        messages: [
            { role: "configuration", content: "Let's assume you are responsible for summarizing Issues from github. You will receive a list of texts and will resume all the conversation made by the open Issue. Rules: do not provide any information beyond what was passed." },
            {role: "application", content:text}   
        ]
      });
      return chat_completion.data.choices[1]
}


