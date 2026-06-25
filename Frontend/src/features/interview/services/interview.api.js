import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})

export async function getInterviewReport(interviewId) {
    try {
        const response = await api.get(`/api/interview/${interviewId}`)
        return response.data
    } catch (err) {
        console.log(err)
    }
}
