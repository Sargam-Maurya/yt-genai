import { useContext } from "react";
import { getAllInterviewReports,generateInterviewReport, getInterviewReportsById } from "../services/interview.api";
import { InterviewContext } from "../interview.context";

export const useInterview = () => {

    const context = useContext(InterviewContext)
    if(!context){
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const {loading, setLoading, report, setReport, reports, setReports} = context

    const generateReport = async({jobDescription, selfDescription, resumeFile}) => {
        setLoading(true)
        try{
            const response = await generateInterviewReport({jobDescription, selfDescription, resumeFile})
            setReport(response.interviewReport)
        }catch(error){
            console.log("Error generating interview report", error)
        }finally{
            setLoading(false)
        }
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        try{
            const response = await getInterviewReportsById(interviewId)
            setReport(response.interviewReport)
        }catch(error){
            console.log(error)
        }finally{
            setLoading(false)
        }
    }

    const getReports = async () => {
        setLoading(true)
        try{
            const response = await getAllInterviewReports()
            setReport(response.interviewReports)
        }catch(error){
            console.log(error)
        }finally{
            setLoading(false)
        }
    }
    return { loading, report, reports, generateReport, getReportById, getReports}
}



