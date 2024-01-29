import OpenAI from "openai";

export const openai = new OpenAI({ apiKey: process.env.OPEN_AI_API_KEY });

export const prompt =
    "create me a image prompt to pass into dalle - make a random image of the words OHAYO in capital letters, you can choose any theme that you want. Only return the prompt.";

export async function generateImage(prompt: string, retries = 1) {
    return new Promise((resolve, reject) => {
        const attemptGeneration = async (retryCount: number) => {
            try {
                const image = await openai.images.generate({
                    model: "dall-e-3",
                    prompt,
                });
                console.log(image.data);
                resolve(image.data); // Resolve the promise with the image data.
            } catch (error: any) {
                console.error(error);
                if (
                    error.message.includes("Rate limit exceeded") &&
                    retryCount > 0
                ) {
                    console.log(`Rate limit hit. Retrying in 60 seconds...`);
                    setTimeout(() => attemptGeneration(retryCount - 1), 60000); // Retry after 60 seconds
                } else {
                    reject(error); // Reject the promise if it's not a rate limit error or retries are exhausted.
                }
            }
        };

        attemptGeneration(retries);
    });
}

export async function getText() {
    const response = await openai.chat.completions.create({
        model: "gpt-4-1106-preview",
        messages: [
            {
                role: "system",
                content: "You are a helpful assistant respond to the question",
            },
            { role: "user", content: prompt },
        ],
    });

    return response.choices[0].message.content;
}
