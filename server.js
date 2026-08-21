import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

/* Serve HealthChain website */
app.use(express.static("."));

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

/* =========================================================
   HEALTHCHAIN AI
========================================================= */

app.post("/api/chat", async (req, res) => {

    try {

        const {
            message,
            history = [],
            systemState = {}
        } = req.body;

        if (!message || !message.trim()) {

            return res.status(400).json({
                error: "Message is required."
            });

        }

        /* -----------------------------------------------------
           LIVE HEALTHCHAIN STATE
        ----------------------------------------------------- */

        const {
            crisisActive = false,
            crisisProgress = 0,
            affectedLocation = "Kolkata",
            affectedRoute = "Mumbai → Kolkata",
            alternateRoute = "Mumbai → Bengaluru",
            riskLevel = "LOW",
            inventoryRisk = "STABLE",
            recommendedAction =
                "Continue monitoring the healthcare network."
        } = systemState;


        /* -----------------------------------------------------
           HEALTHCHAIN SYSTEM PROMPT
        ----------------------------------------------------- */

        const systemPrompt = `
You are HealthChain AI, the operational intelligence assistant
inside HealthChain 360.

Analyze the supplied simulation state and answer the user's
question directly.

CURRENT STATE:
Crisis active: ${crisisActive}
Progress: ${crisisProgress}%
Location: ${affectedLocation}
Affected route: ${affectedRoute}
Alternate route: ${alternateRoute}
Risk: ${riskLevel}
Inventory risk: ${inventoryRisk}
Recommended action: ${recommendedAction}

RULES:
- Use the current state when relevant.
- Never invent data.
- Clearly distinguish simulation data from real-world information.
- For crisis questions explain the situation, risk and recommended action.
- For route questions use the supplied alternate route.
- Keep normal answers concise.
- Maximum approximately 120 words unless the user asks for detail.
`;


        /* -----------------------------------------------------
           CONVERSATION
        ----------------------------------------------------- */

        const conversationText = history
            .slice(-5)
            .map(item => {

                const role =
                    item.role === "assistant"
                        ? "Assistant"
                        : "User";

                return `${role}: ${item.content || ""}`;

            })
            .join("\n");


        /* -----------------------------------------------------
           GEMINI REQUEST
        ----------------------------------------------------- */

        const response =
    await ai.models.generateContent({

        model: "gemini-3.1-flash-lite",

        config: {
            temperature: 0.4,
            maxOutputTokens: 250
        },

        contents: [

                    {
                        role: "user",

                        parts: [

                            {
                                text:
                                    systemPrompt +
                                    "\n\n" +
                                    "CONVERSATION HISTORY:\n" +
                                    conversationText +
                                    "\n\n" +
                                    "CURRENT USER QUESTION:\n" +
                                    message
                            }

                        ]

                    }

                ]

            });


        let answer =
            response.text || "No response generated.";


        /* -----------------------------------------------------
           CLEAN RESPONSE
        ----------------------------------------------------- */

        answer = answer.replace(
            /^(HealthChain AI|HealthChain AI Assistant|Assistant|AI Assistant|AI):\s*/i,
            ""
        );


        /* -----------------------------------------------------
           RESPONSE
        ----------------------------------------------------- */

        res.json({
            answer
        });


    } catch (error) {

        console.error(
            "HealthChain Gemini Error:",
            error
        );


        if (error.status === 429) {

            return res.status(429).json({

                error:
                    "HealthChain AI is temporarily busy. Please try again shortly."

            });

        }


        if (error.status === 400) {

            return res.status(400).json({

                error:
                    "Invalid AI request. Please try again."

            });

        }


        if (error.status === 404) {

            return res.status(404).json({

                error:
                    "Gemini AI model was not found."

            });

        }


        return res.status(500).json({

            error:
                "HealthChain AI could not process the request."

        });

    }

});


/* =========================================================
   SERVER
========================================================= */

const PORT =
    process.env.PORT || 3000;


app.listen(PORT, () => {

    console.log(
        `HealthChain AI server running on port ${PORT}`
    );

});