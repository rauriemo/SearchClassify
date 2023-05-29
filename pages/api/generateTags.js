import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
    console.log("SERVER - generate tags api req body:")
    console.log(req.body);

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
            temperature: 0,
            max_tokens: 200
        });

        let str = completion.data.choices[0].text.trim();
        let startIndex = str.indexOf('[');
        let newStr = str.substring(startIndex);

        // if(str.startsWith("Answer:")) {
        //   str = str.substring(8); // Remove "Answer: " from the string
        // };

        console.log("SERVER- non parsed Tags generated:");
        console.log(newStr);

        let strArray;
        try {
            strArray = JSON.parse(newStr);
        } catch (error) {
            console.error("Failed to parse the string:", error);
        };

        console.log("SERVER- Tags generated:");
        console.log(strArray);

        res.status(200).json({ result: strArray });
    } catch(error) {
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
      // return `After the semi-colon I will show you a text file and its title. I want you the Extract Key Words, Key Themes, and other relevant terms that are related to that text. Each term should not exceed 2 to 3 words and the array of terms should include 20 terms. The 20 terms should never contain repeated terms. Return the terms to me in an array of strings formatted exactly like this example: ["key term 1", "key term 2","key term 3", ... ,"key term 20"]. The elipsis represents the remaining terms. This is the title: ${title}, This is the text: ${fileContent}`;
      return `title: ${title}, This is the text: ${fileContent}

      Assignment:
      
      Interpret the title and text provided above. Generate an array containing 20 key terms related to the title and text.
      
      Format of the response:
      
      ["key term 1", "key term 2","key term 3", ... ,"key term 20"] 
      
      Choosing the terms for the array:
      
      You want to use these terms to classify the text in a database, so choose terms that are likely to be common classifications. Choices to consider might be the key themes or topics in the text (ex: software architecture, psychology, biology, neural netwroks), the type of document the text is (ex: poem, notes to self, grocery list, research paper), the overarching categories of the text (ex: science, everyday tasks, art). Feel free to determine other choices for the rest of the terms.`
    } else {
      console.error("Cannot generate tags for a non text file.")
    }
}


  