const {GoogleGenAI} = require("@google/genai")
const {z} = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

const interviewReportSchema = z.object({
    matchScore: z.number().describe("The match score between the candidate and the job description, ranging from 0 to 100"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking the technical question"),
        answer: z.string().describe("How to answer this question, what points to cover, what to avoid, and how to answer in a way that impresses the interviewer")
    })).describe("A list of technical questions that can be asked in the interview, along with their intention and answer"),

    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking the behavioral question"),    
    answer: z.string().describe("How to answer this question, what points to cover, what to avoid, and how to answer in a way that impresses the interviewer")
    })).describe("A list of behavioral questions that can be asked in the interview, along with their intention and answer"),

    skillGaps: z.array(z.object({
        skills: z.string().describe("The skill that the candidate is lacking"),
        severity: z.enum(["low", "medium", "high"]).describe("The severity of the skill gap")        
    })).describe("A list of skill gaps that the candidate has, along with their severity"),

    preparationPlan: z.array(z.object({
        day: z.string().describe("The day of the preparation plan"),
        focus: z.string().describe("The focus of the preparation plan for that day"),
        tasks: z.string().describe("The tasks to be completed for that day")
    })).describe("A preparation plan for the candidate to follow, with focus and tasks for each day"),
    
    title: z.string().describe("The title of the job for which the interview report is generated"),

})

async function generateInterviewReport({resume, selfDescription, jobDescription}){

    const prompt = `Generate an interview report for the candidate based on the following information:  
    Resume: ${resume}
    Self-Description: ${selfDescription}
    Job-Description: ${jobDescription}
    `

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config:{
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema),

        }
    })

    return JSON.parse(response.text)
}
module.exports = generateInterviewReport