import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useInterview } from '../hooks/useInterview.js'
import '../style/reports.scss'

const SEVERITY_COLORS = {
  low: '#4caf50',
  medium: '#ff9800',
  high: '#ef4444'
}

const Reports = () => {
  const { reports, loading, getReports } = useInterview()
  const navigate = useNavigate()

  useEffect(() => {
    getReports()
  }, [])

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <main className="reports">
      <div className="reports__bg" />

      <header className="reports__header">
        <div className="reports__header-top">
          <button className="reports__back" onClick={() => navigate('/')}>
            ← Back
          </button>
          <h1>Recent Reports</h1>
        </div>
        <p>View all your AI-generated interview preparation reports.</p>
      </header>

      {loading ? (
        <div className="reports__empty">
          <p>Loading reports...</p>
        </div>
      ) : !reports?.length ? (
        <div className="reports__empty">
          <span className="reports__empty-icon">📋</span>
          <h3>No reports yet</h3>
          <p>Generate your first interview report to see it here.</p>
          <button className="reports__empty-btn" onClick={() => navigate('/')}>
            Create Report
          </button>
        </div>
      ) : (
        <div className="reports__grid">
          {reports.map((report) => (
            <div
              key={report._id}
              className="reports__card"
              onClick={() => navigate(`/interview/${report._id}`)}
            >
              <div className="reports__card-top">
                <h3 className="reports__card-title">{report.title || 'Untitled Report'}</h3>
                {report.matchScore != null && (
                  <span
                    className="reports__card-score"
                    style={{
                      color: report.matchScore >= 70 ? '#22c55e' : report.matchScore >= 40 ? '#f59e0b' : '#ef4444'
                    }}
                  >
                    {report.matchScore}%
                  </span>
                )}
              </div>
              <p className="reports__card-date">{formatDate(report.createdAt)}</p>
              <span className="reports__card-arrow">→</span>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

export default Reports
