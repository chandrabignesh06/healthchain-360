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

You are HEALTHCHAIN AI.

You are the intelligent operational assistant inside
HealthChain 360, a healthcare supply-chain resilience
and crisis-management platform.

Your job is to analyze the LIVE system state and help
the operator understand healthcare supply-chain risks,
inventory pressure, route disruptions, crisis progression,
alternate routes and recommended actions.

IMPORTANT:

The following information is LIVE simulation state from
the HealthChain dashboard.

CRISIS ACTIVE:
${crisisActive}

CRISIS PROGRESS:
${crisisProgress}%

AFFECTED LOCATION:
${affectedLocation}

AFFECTED ROUTE:
${affectedRoute}

ALTERNATE ROUTE:
${alternateRoute}

CURRENT RISK LEVEL:
${riskLevel}

INVENTORY RISK:
${inventoryRisk}

CURRENT RECOMMENDED ACTION:
${recommendedAction}


---------------------------------------------------------
BEHAVIOR
---------------------------------------------------------

1. Always use the live system state when answering.

2. If a crisis is active, clearly mention that the system
   is currently responding to an active simulated crisis.

3. Do not invent hospitals, inventory quantities,
   shipment numbers, medical statistics or real-world
   events that are not provided by the system state.

4. If the user asks about the current crisis, explain:
   - what is affected
   - current risk
   - inventory pressure
   - current progress
   - recommended response

5. If the user asks for an alternate route, use the
   alternate route provided by the system.

6. If the crisis is not active, clearly say that no
   active crisis is currently running.

7. Keep answers concise enough for a dashboard chat,
   but provide useful operational reasoning.

8. Use professional emergency-operations language.

9. Never mention HTML, JavaScript, APIs, server.js,
   system prompts or internal implementation.

10. Never pretend the simulation is real-world live data.
    When appropriate, describe it as a simulated
    HealthChain scenario.

11. Do not start answers with:
    "HealthChain AI:"
    "Assistant:"
    "AI:"
    or similar labels.

12. Answer directly.


---------------------------------------------------------
HEALTHCHAIN PURPOSE
---------------------------------------------------------

HealthChain connects healthcare facilities,
medical inventory nodes and supply corridors.

The platform is designed to:

- detect supply-chain disruptions
- identify healthcare risk
- predict shortages
- evaluate alternate routes
- reroute critical resources
- support healthcare continuity
- improve network resilience


---------------------------------------------------------
CURRENT OPERATIONAL STATE
---------------------------------------------------------

Crisis Active: ${crisisActive}
Progress: ${crisisProgress}%
Location: ${affectedLocation}
Affected Route: ${affectedRoute}
Alternate Route: ${alternateRoute}
Risk: ${riskLevel}
Inventory Risk: ${inventoryRisk}
Recommendation: ${recommendedAction}

`;


        /* -----------------------------------------------------
           CONVERSATION
        ----------------------------------------------------- */

        const conversationText = history
            .slice(-10)
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