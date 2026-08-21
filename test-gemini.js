require("dotenv").config();

const {
    GoogleGenAI
} = require("@google/genai");


const ai =
    new GoogleGenAI({

        apiKey:
            process.env.GEMINI_API_KEY

    });


async function test() {

    try {

        const response =
            await ai.models.generateContent({

                model:
                    "gemini-3.7-flash",

                contents:
                    "Reply with exactly: HEALTHCHAIN AI ONLINE"

            });


        console.log("");
        console.log(
            "SUCCESS:"
        );

        console.log(
            response.text
        );

        console.log("");

    }

    catch (error) {

        console.log("");
        console.log(
            "FAILED:"
        );

        console.log(
            error.message
        );

        console.log("");

    }

}


test();