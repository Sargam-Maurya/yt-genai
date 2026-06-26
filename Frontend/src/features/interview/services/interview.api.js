import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
})

export const generateInterviewReport = async ({jobDescription, selfDescription, resumeFile}) => {
   const formData = new FormData()
   formData.append("jobDescription", jobDescription)
   formData.append("selfDescription", selfDescription)
   formData.append("resume", resumeFile)
   const response = await api.post("/api/interview/", formData, {
        headers: {
            "Content-Type":"multipart/form-data"
        }
   })
   return response.data
}


export const getInterviewReportsById = async (interviewId) => {
    const response = await api.get(`/api/interview/report/${interviewId}`)
    return response.data
}


export const getAllInterviewReports = async () => {
    const response = await api.get("/api/interview")
    return response.data
}

export const downloadReportPdf = async (interviewId) => {
    const response = await api.get(`/api/interview/report/${interviewId}/pdf`, {
        responseType: "blob"
    })
    const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }))
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `interview-report-${interviewId}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
}

export const downloadResumePdf = async (interviewId) => {
    const response = await api.get(`/api/interview/report/${interviewId}/resume-pdf`, {
        responseType: "blob"
    })
    const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }))
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `resume-${interviewId}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
}
