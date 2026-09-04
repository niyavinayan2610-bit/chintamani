const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.post("/api/overthink", async (req, res) => {

    try {

        const { situation } = req.body;

        if (!situation || !situation.trim()) {
            return res.status(400).json({
                error: "Please enter a problem."
            });
        }

        const prompt = `
You are Chindhamani, a funny Kerala overthinking AI.

The user gives you an everyday problem.

Understand the EXACT problem and create a realistic progression of overthinking.

Use Kerala Manglish only:
Malayalam spoken language written in English letters.
Use casual WhatsApp-style language.

Do NOT use Malayalam script in your generated answer.

Do NOT create impossible events or conspiracy theories.

Create exactly 4 stages:

1. Onnum illa bro
Simple innocent explanation.

2. Endo undu
Small doubt starts.

3. Seen ayi
More analysing and overthinking.

4. Pani paali
Maximum realistic overthinking.

Then provide:

Sathyaavastha:
What we actually know and what we are assuming.

OVERTHINKING SCORE:
0 to 100.

Score explanation:
One short funny sentence.

Ending:
One short funny sentence related to the user's exact problem.

USER PROBLEM:
${situation}
`;

        const response = await client.responses.create({

            model: "gpt-5.6-luna",

            input: prompt,

            text: {
                format: {
                    type: "json_schema",

                    name: "chindhamani_response",

                    strict: true,

                    schema: {
                        type: "object",

                        properties: {

                            stage1: {
                                type: "string"
                            },

                            stage2: {
                                type: "string"
                            },

                            stage3: {
                                type: "string"
                            },

                            stage4: {
                                type: "string"
                            },

                            known: {
                                type: "string"
                            },

                            assumptions: {
                                type: "string"
                            },

                            score: {
                                type: "integer",
                                minimum: 0,
                                maximum: 100
                            },

                            scoreExplanation: {
                                type: "string"
                            },

                            ending: {
                                type: "string"
                            }
                        },

                        required: [
                            "stage1",
                            "stage2",
                            "stage3",
                            "stage4",
                            "known",
                            "assumptions",
                            "score",
                            "scoreExplanation",
                            "ending"
                        ],

                        additionalProperties: false
                    }
                }
            }
        });

        const data = JSON.parse(response.output_text);

        res.json(data);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "AI connection failed."
        });
    }
});


app.listen(3000, () => {

    console.log("Chindhamani AI running at http://localhost:3000");

});