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

async function getInterviewReportByIdController(req, res) {
    const {interviewId} = req.params
    const interviewReport = await interviewReportModel.findOne({_id: interviewId, user: req.user.id})

    if(!interviewReport){
        return res.status(404).json({
            message: 'Interview report not found'
        })
    }
    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}

async function getAllInterviewReportsController(req, res){
    const interviewReports = await interviewReportModel.find({user: req.user.id}).sort({created: -1}).select("-resume -selfDescription -jobDescription -_v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")
    res.status(200).json({
        message: "Interview reports fetched Successfully",
        interviewReports
    })
}


module.exports = {generateInterViewReportController, getInterviewReportController, getInterviewReportByIdController, getAllInterviewReportsController}