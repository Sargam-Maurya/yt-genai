import React, { useState, useRef, useEffect } from 'react'
import '../style/home.scss'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router-dom'

const Home = () => {

  const { loading, reports, generateReport, getReports } = useInterview()

  useEffect(() => {
    getReports()
  }, [])
  const [jobDescription, setJobDescription] = useState('')
  const [selfDescription, setSelfDescription] = useState('')
  const [resumeName, setResumeName] = useState('')
  const [dragging, setDragging] = useState(false)
  const resumeInputRef = useRef()

  const navigate = useNavigate()

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) setResumeName(file.name)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      setResumeName(file.name)
      if (resumeInputRef.current) {
        const dt = new DataTransfer()
        dt.items.add(file)
        resumeInputRef.current.files = dt.files
      }
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = () => setDragging(false)

  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current.files[0]
    const data = await generateReport({ jobDescription, selfDescription, resumeFile })
    if (data?.interviewReport?._id) {
      navigate(`/interview/${data.interviewReport._id}`)
    }
  }

  return (
    <main className="home">
      <div className="home__bg" />

      {loading && (
        <div className="home__loader">
          <div className="home__loader-content">
            <div className="home__loader-spinner" />
            <h3>Generating Your Interview Report</h3>
            <p>Analyzing your resume & job description with AI...</p>
            <div className="home__loader-steps">
              <span className="home__loader-step home__loader-step--active">📄 Parsing inputs</span>
              <span className="home__loader-step">🤖 AI is analyzing</span>
              <span className="home__loader-step">📝 Creating questions & plan</span>
            </div>
          </div>
        </div>
      )}

      <header className="home__header">
        <div className="home__nav">
          <h1>AI Interview Prep</h1>
        </div>
        <p>Paste a job description, upload your resume, and let AI generate tailored interview questions.</p>
      </header>

      <div className="home__grid">
        <div className="home__card-bg" />
        <section className="home__card home__card--left">
          <div className="home__card-header">
            <span className="home__card-icon">🎯</span>
            <h2>Target Job Description</h2>
            <span className="home__badge">Required</span>
          </div>
          <textarea
            onChange={(e) => setJobDescription(e.target.value)}
            className="home__textarea home__textarea--grow"
            placeholder="Paste the job description here..."
            value={jobDescription}
          />
          <span className="home__char-count">{jobDescription.length} characters</span>
        </section>

        <section className="home__card home__card--right">
          <div className="home__card-header">
            <span className="home__card-icon">👤</span>
            <h2>Your Profile</h2>
          </div>

          <div className="home__subsection">
            <span className="home__subsection-label">Upload Resume <span className="home__subsection-tag">Best result</span></span>
            <div
              className={`home__dropzone${dragging ? ' home__dropzone--active' : ''}${resumeName ? ' home__dropzone--has-file' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => resumeInputRef.current?.click()}
            >
              <input
                ref={resumeInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                hidden
              />
              {resumeName ? (
                <>
                  <span className="home__dropzone-icon">📄</span>
                  <span className="home__dropzone-file">{resumeName}</span>
                  <span className="home__dropzone-hint">Tap to change</span>
                </>
              ) : (
                <>
                  <span className="home__dropzone-icon">☁️</span>
                  <span className="home__dropzone-text">Upload Resume</span>
                  <span className="home__dropzone-hint">PDF, DOC or DOCX</span>
                </>
              )}
            </div>
          </div>

          <div className="home__divider">
            <span className="home__divider-line" />
            <span className="home__divider-text">OR</span>
            <span className="home__divider-line" />
          </div>

          <div className="home__subsection">
            <span className="home__subsection-label">Quick Self-Description</span>
            <textarea
              onChange={(e) => setSelfDescription(e.target.value)}
              className="home__textarea home__textarea--small"
              placeholder="Briefly describe your background, skills, and experience..."
              value={selfDescription}
            />
          </div>

          <p className="home__note"><span className="home__note-icon">ℹ️</span> Either Resume or Self Description is required to generate a personalized plan</p>

          <button
            onClick={handleGenerateReport}
            className="home__generate"
            disabled={loading}>
            {loading ? 'Generating...' : 'Generate Interview Report'}
            <span className="home__generate-arrow">→</span>
          </button>
        </section>
      </div>

      {reports?.length > 0 && (
        <section className="home__recent">
          <h2 className="home__recent-title">Recent Reports</h2>
          <div className="home__recent-grid">
            {reports.map((report) => (
              <div
                key={report._id}
                className="home__recent-card"
                onClick={() => navigate(`/interview/${report._id}`)}
              >
                <div className="home__recent-card-top">
                  <h3 className="home__recent-card-title">{report.title || 'Untitled Report'}</h3>
                  {report.matchScore != null && (
                    <span
                      className="home__recent-card-score"
                      style={{
                        color: report.matchScore >= 70 ? '#22c55e' : report.matchScore >= 40 ? '#f59e0b' : '#ef4444'
                      }}
                    >
                      {report.matchScore}%
                    </span>
                  )}
                </div>
                <p className="home__recent-card-date">
                  {new Date(report.createdAt).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </p>
                <span className="home__recent-card-arrow">&rarr;</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}

export default Home
