import 'dotenv/config';
import readline from 'node:readline/promises'
import Groq from "groq-sdk";
import { tavily } from '@tavily/core';

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main() {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
    const messages = [
        {
            role: "system",
            content: `You are a smart personal assistent who answers the asked questions.
                    You have access to following tools:
                    1.searchWeb({query}:{query:string}) //Search the latest information and relatime data on the internet.
                    current date and time:${new Date().toUTCString()}`
                    
        },
        // {
        //     role: "user",
        //     content: "hi",
        // },
    ]

    while (true) {
        //upper while is for user input
        const question = await rl.question('You: ');
        if(question==='bye'){
            break;
        }
        messages.push({
            role: 'user',
            content: question,
        });

        while (true) {
            const completion = await groq.chat.completions
                .create({
                    model: "llama-3.3-70b-versatile",
                    temperature: 0,
                    messages: messages,
                    "tools": [
                        {
                            "type": "function",
                            "function": {
                                "name": "webSearch",
                                "description": "Search the latest information and relatime data on the internet ",
                                "parameters": {
                                    "type": "object",
                                    "properties": {
                                        "query": {
                                            "type": "string",
                                            "description": "The search query to perform search on."
                                        },
                                    },
                                    "required": ["query"]
                                }
                            }
                        }
                    ],
                    tool_choice: 'auto',
                });

            messages.push(completion.choices[0].message)
            const toolCalls = completion.choices[0].message.tool_calls;

            if (!toolCalls) {
                //LLM n final answer generate kia h
                console.log(`Assistant:${completion.choices[0].message.content}`)
                break;
            }

            //toolCalling 
            for (const tool of toolCalls) {
                // console.log('tool:', tool);
                const functionName = tool.function.name;
                const functionParams = tool.function.arguments;

                if (functionName == "webSearch") {
                    const toolResult = await webSearch(JSON.parse(functionParams));
                    // console.log(toolResult);

                    messages.push({
                        tool_call_id: tool.id,
                        role: 'tool',
                        name: functionName,
                        content: toolResult
                    })
                }
            }

        }
    }
    rl.close()
}
main();

async function webSearch({ query }) {
    //Here we will do tavily api call
    console.log("calling web search...")
    const response = await tvly.search(query);
    // console.log("response", response);

    const finalResult = response.results.map(result => result.content).join('\n\n');
    return finalResult;
}