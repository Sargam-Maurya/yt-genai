const pdfParse = require("pdf-parse")
const generateInterviewReport = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")

async function generateInterViewReportController(req, res){

    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getTable()
    const {selfDescription, jobDescription} = req.body

    const interViewReportByAi = await generateInterviewReport({
        resume: resumeContent.text,
        selfDescription,
        jobDescription
        
    })
    
    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
        ...interViewReportByAi
    })

    res.status(201).json({
        message: "Interview report generated successfully.",
        interviewReport
    })
    
}

async function getInterviewReportController(req, res) {
    try {
        const interviewReport = await interviewReportModel.findById(req.params.id)
        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found" })
        }
        res.json({ interviewReport })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

module.exports = {generateInterViewReportController, getInterviewReportController}