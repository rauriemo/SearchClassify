import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
    console.log(req.body);
    // need to be able to get file content, title and id from req

    if (!configuration.apiKey) {
        res.status(500).json({
          error: {
            message: "OpenAI API key not configured, please follow instructions in README.md",
          }
        });
        return;
    };

    let bodyObject;
    if (typeof req.body === 'string') {
        bodyObject = JSON.parse(req.body)
    } else {
          bodyObject = req.body;
    };

    try{
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: generatePrompt(bodyObject.content, bodyObject.title),
            temperature: 0.6,
        });
        res.status(200).json({ result: completion.data.choices[0].text });
    } catch(error) {
        // Consider adjusting the error handling logic for your use case
        if (error.response) {
          console.error(error.response.status, error.response.data);
          res.status(error.response.status).json(error.response.data);
        } else {
          console.error(`Error with OpenAI API request: ${error.message}`);
          res.status(500).json({
            error: {
              message: 'An error occurred during your request.',
            }
          });
        }
      }

};

function generatePrompt(fileContent, title) {
    if(typeof fileContent === 'string'){
      return `After the semi-colon I will show you a text file. I want you the Extract Key Words, Key Themes, Title, and other relevant terms that are related to that text. Each term should not exceed 2 to 3 words and the whole list should not exceed 20 terms. As such the 20 terms should be the 20 most relevant terms and should always include the title. Return the terms to me in an array, ordered from most important to least of the terms and the title being first. This is the title: ${title}, This is the text: ${fileContent}`;
    } else {
      console.error("Cannot generate tags for a non text file.")
    }
}


  