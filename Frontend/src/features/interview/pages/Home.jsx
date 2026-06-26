import React, { useState, useRef } from 'react'
import '../style/home.scss'
import { useInterview } from '../hooks/useInterview.js'

const Home = () => {
  const [jobDesc, setJobDesc] = useState('')
  const [selfDesc, setSelfDesc] = useState('')
  const [resumeName, setResumeName] = useState('')
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef(null)

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
      if (fileRef.current) {
        const dt = new DataTransfer()
        dt.items.add(file)
        fileRef.current.files = dt.files
      }
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = () => setDragging(false)

  return (
    <main className="home">
      <div className="home__bg" />

      <header className="home__header">
        <h1>AI Interview Prep</h1>
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
            className="home__textarea home__textarea--grow"
            placeholder="Paste the job description here..."
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
          />
          <span className="home__char-count">{jobDesc.length} characters</span>
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
              onClick={() => fileRef.current?.click()}
            >
              <input
                ref={fileRef}
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
              className="home__textarea home__textarea--small"
              placeholder="Briefly describe your background, skills, and experience..."
              value={selfDesc}
              onChange={(e) => setSelfDesc(e.target.value)}
            />
          </div>

          <p className="home__note"><span className="home__note-icon">ℹ️</span> Either Resume or Self Description is required to generate a personalized plan</p>

          <button className="home__generate">
            Generate Interview Report 
            <span className="home__generate-arrow">→</span>
          </button>
        </section>
      </div>
    </main>
  )
}

export default Home
