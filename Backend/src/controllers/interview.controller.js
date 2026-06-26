const { PDFParse } = require("pdf-parse")
const generateInterviewReport = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")

async function generateInterViewReportController(req, res){
    try {
        const {selfDescription, jobDescription} = req.body

        // Extract resume text if file uploaded
        let resumeText = ""
        if (req.file) {
            const parser = new PDFParse({ data: req.file.buffer })
            const textResult = await parser.getText()
            resumeText = textResult.text
        }

        const interViewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        })

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            ...interViewReportByAi,
            title: interViewReportByAi?.title || jobDescription?.split('\n')[0]?.slice(0, 60) || 'Interview Report',
        })

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        })
    } catch (err) {
        console.error("Error generating interview report:", err)
        res.status(500).json({ message: err.message })
    }
}

async function getInterviewReportController(req, res) {
    try {
        const { interviewId } = req.params
        const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })
        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found" })
        }
        res.json({ interviewReport })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

async function getAllInterviewReportsController(req, res){
    const interviewReports = await interviewReportModel.find({user: req.user.id}).sort({createdAt: -1}).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")
    res.status(200).json({
        message: "Interview reports fetched Successfully",
        interviewReports
    })
}

module.exports = {generateInterViewReportController, getInterviewReportController, getAllInterviewReportsController}