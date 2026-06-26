const {GoogleGenAI} = require("@google/genai")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

const MODELS = ["gemini-3-flash-preview", "gemini-2.5-flash", "gemini-2.0-flash"]

const interviewResponseSchema = {
    type: "object",
    properties: {
        matchScore: { type: "number", description: "The match score between the candidate and the job description, ranging from 0 to 100" },
        technicalQuestions: {
            type: "array", description: "A list of technical interview questions with intention and answer",
            items: {
                type: "object",
                properties: {
                    question: { type: "string", description: "The technical question" },
                    intention: { type: "string", description: "Why the interviewer is asking this" },
                    answer: { type: "string", description: "How to answer with key points and what to avoid" }
                },
                required: ["question", "intention", "answer"]
            }
        },
        behavioralQuestions: {
            type: "array", description: "A list of behavioral interview questions with intention and answer",
            items: {
                type: "object",
                properties: {
                    question: { type: "string", description: "The behavioral question" },
                    intention: { type: "string", description: "Why the interviewer is asking this" },
                    answer: { type: "string", description: "How to answer with key points and what to avoid" }
                },
                required: ["question", "intention", "answer"]
            }
        },
        skillGaps: {
            type: "array", description: "Skills the candidate is lacking",
            items: {
                type: "object",
                properties: {
                    skills: { type: "string", description: "The missing skill name" },
                    severity: { type: "string", enum: ["low", "medium", "high"], description: "How critical this gap is" }
                },
                required: ["skills", "severity"]
            }
        },
        preparationPlan: {
            type: "array", description: "A day-by-day preparation roadmap",
            items: {
                type: "object",
                properties: {
                    day: { type: "string", description: "Time period (e.g. Week 1-2)" },
                    focus: { type: "string", description: "The focus area for this period" },
                    tasks: { type: "string", description: "Specific tasks to complete" }
                },
                required: ["day", "focus", "tasks"]
            }
        },
        title: { type: "string", description: "The job title this report is for" }
    },
    required: ["matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan", "title"]
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function generateInterviewReport({resume, selfDescription, jobDescription}){

    const prompt = `Generate an interview report for the candidate based on the following information:
    Resume: ${resume}
    Self-Description: ${selfDescription}
    Job-Description: ${jobDescription}
    `

    let lastError = null

    for (const model of MODELS) {
        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                const response = await ai.models.generateContent({
                    model,
                    contents: prompt,
                    config:{
                        responseMimeType: "application/json",
                        responseSchema: interviewResponseSchema,
                    }
                })

                if (!response?.text) {
                    throw new Error("AI returned empty response")
                }

                return JSON.parse(response.text)
            } catch (err) {
                lastError = err
                const isOverload = err.message?.includes("503") || err.message?.includes("UNAVAILABLE") || err.message?.includes("429") || err.message?.includes("RESOURCE_EXHAUSTED")

                if (isOverload && attempt < 3) {
                    const delay = Math.pow(2, attempt) * 1000
                    console.log(`Model ${model} overloaded (attempt ${attempt}), retrying in ${delay}ms...`)
                    await sleep(delay)
                } else if (!isOverload) {
                    // Non-transient error — skip retries for this model
                    break
                }
            }
        }
    }

    throw lastError || new Error("All models exhausted")
}
module.exports = generateInterviewReport