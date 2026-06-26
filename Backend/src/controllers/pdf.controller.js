const interviewReportModel = require("../models/interviewReport.model")
const { generateReportPdf, generateResumePdf } = require("../services/pdf.service")

async function downloadReportPdfController(req, res) {
    try {
        const { interviewId } = req.params

        const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })
        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found" })
        }

        const pdf = await generateReportPdf(interviewReport.toObject())

        res.setHeader("Content-Type", "application/pdf")
        res.setHeader("Content-Disposition", `attachment; filename="interview-report-${interviewId}.pdf"`)
        res.send(pdf)
    } catch (err) {
        console.error("Error generating PDF:", err)
        res.status(500).json({ message: err.message })
    }
}

async function downloadResumePdfController(req, res) {
    try {
        const { interviewId } = req.params

        const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })
        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found" })
        }

        if (!interviewReport.resume) {
            return res.status(404).json({ message: "No resume found in this report" })
        }

        const pdf = await generateResumePdf(interviewReport.resume, interviewReport.title)

        res.setHeader("Content-Type", "application/pdf")
        res.setHeader("Content-Disposition", `attachment; filename="resume-${interviewId}.pdf"`)
        res.send(pdf)
    } catch (err) {
        console.error("Error generating resume PDF:", err)
        res.status(500).json({ message: err.message })
    }
}

module.exports = { downloadReportPdfController, downloadResumePdfController }
