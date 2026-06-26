import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import '../style/interview.scss'
import { useInterview } from '../hooks/useInterview.js'

const TABS = {
  TECHNICAL: 'technical',
  BEHAVIORAL: 'behavioral',
  ROADMAP: 'roadmap'
}

const TAB_LABELS = {
  [TABS.TECHNICAL]: 'Technical Questions',
  [TABS.BEHAVIORAL]: 'Behavioral Questions',
  [TABS.ROADMAP]: 'Road Map'
}

const SEVERITY_COLORS = {
  low: '#4caf50',
  medium: '#ff9800',
  high: '#ef4444'
}

const DUMMY_TECHNICAL = [
  {
    question: "Explain the difference between controlled and uncontrolled components in React.",
    intention: "Tests understanding of React form handling and component state ownership.",
    answer: "Controlled components have their state managed by React via useState, while uncontrolled components manage their own state via refs."
  },
  {
    question: "How does React's Virtual DOM work and why is it efficient?",
    intention: "Evaluates knowledge of React's core rendering mechanism and performance optimization.",
    answer: "React maintains a lightweight virtual representation of the DOM. On state changes, it diffs the VDOM against the previous version and applies minimal real DOM updates."
  },
  {
    question: "Describe the MERN stack architecture and data flow.",
    intention: "Assesses understanding of full-stack architecture and how layers communicate.",
    answer: "MongoDB stores data, Express handles server logic, React renders the UI, and Node.js runs the server. The client communicates via REST API calls."
  },
  {
    question: "What are React hooks? Explain useState and useEffect with examples.",
    intention: "Tests practical knowledge of modern React patterns.",
    answer: "Hooks are functions that let you use state and lifecycle features in functional components. useState manages component state, useEffect handles side effects."
  },
  {
    question: "How do you optimize performance in a React application?",
    intention: "Evaluates experience with real-world performance bottlenecks and solutions.",
    answer: "Techniques include memoization (React.memo, useMemo), code splitting, lazy loading, and avoiding unnecessary re-renders."
  }
]

const DUMMY_BEHAVIORAL = [
  {
    question: "Tell me about a time you faced a challenging bug and how you resolved it.",
    intention: "Assesses problem-solving methodology and debugging approach.",
    answer: "I once had a memory leak caused by an unclosed WebSocket connection. I used Chrome DevTools to trace the issue and added proper cleanup in useEffect's return."
  },
  {
    question: "Describe a project you worked on that required collaboration with cross-functional teams.",
    intention: "Evaluates teamwork and communication skills.",
    answer: "I worked with designers and backend devs on a dashboard app. We used Git flow for version control and weekly standups to stay aligned."
  },
  {
    question: "How do you stay updated with the latest technologies and trends?",
    intention: "Checks for growth mindset and learning habits.",
    answer: "I follow tech blogs, watch conference talks, and build side projects to experiment with new tools and frameworks."
  },
  {
    question: "Give an example of a time you had to manage competing priorities.",
    intention: "Evaluates time management and prioritization skills.",
    answer: "During a sprint with two critical features due, I broke tasks into smaller chunks and communicated trade-offs with the team to adjust scope."
  },
  {
    question: "What motivates you to work in software development?",
    intention: "Assesses passion and long-term career alignment.",
    answer: "I enjoy building products that solve real problems. The constant learning and creativity in engineering keep me engaged."
  }
]

const DUMMY_ROADMAP = [
  {
    day: "Week 1-2",
    focus: "JavaScript Fundamentals",
    tasks: "Master closures, promises, async/await, ES6+ features, and event loop mechanics."
  },
  {
    day: "Week 3-4",
    focus: "React Deep Dive",
    tasks: "Build projects using hooks, context API, custom hooks, and React Router."
  },
  {
    day: "Week 5-6",
    focus: "Backend with Node.js & Express",
    tasks: "Create REST APIs, implement authentication (JWT), and handle file uploads."
  },
  {
    day: "Week 7-8",
    focus: "Database with MongoDB",
    tasks: "Design schemas, perform CRUD operations, and optimize queries with indexing."
  },
  {
    day: "Week 9-10",
    focus: "Full-Stack Integration",
    tasks: "Connect frontend to backend, deploy on Vercel/Netlify + Render, and monitor production."
  }
]

const DUMMY_SKILL_GAPS = [
  { skills: "redis", severity: "high" },
  { skills: "message queue", severity: "medium" },
  { skills: "Event Loop", severity: "low" },
  { skills: "Docker", severity: "high" },
  { skills: "TypeScript", severity: "medium" }
]

const Interview = () => {
  const { interviewId } = useParams()
  const [activeTab, setActiveTab] = useState(TABS.TECHNICAL)
  const navigate = useNavigate()
  const { report, getReportById, loading, downloadPdf, downloadResume } = useInterview()

  useEffect(() => {
    if (!interviewId) return
    getReportById(interviewId)
  }, [interviewId])

  const questions = activeTab === TABS.TECHNICAL
    ? (report?.technicalQuestions?.length ? report.technicalQuestions : DUMMY_TECHNICAL)
    : (report?.behavioralQuestions?.length ? report.behavioralQuestions : DUMMY_BEHAVIORAL)

  const plan = report?.preparationPlan?.length ? report.preparationPlan : DUMMY_ROADMAP

  const skillGaps = report?.skillGaps?.length ? report.skillGaps : DUMMY_SKILL_GAPS

  return (
    <div className="interview">
      <aside className="interview__sidebar interview__sidebar--left">
        <button className="interview__back-btn" onClick={() => navigate('/reports')}>
          ← Reports
        </button>
        <nav className="interview__nav">
          {Object.values(TABS).map((tab) => (
            <button
              key={tab}
              className={`interview__nav-item${activeTab === tab ? ' interview__nav-item--active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </nav>
      </aside>

      <main className="interview__main">
        {loading ? (
          <p className="interview__placeholder">Loading...</p>
        ) : activeTab === TABS.ROADMAP ? (
          <div className="interview__content">
            <h2 className="interview__content-title">Preparation Road map</h2>
            <div className="interview__plan">
              {plan.map((item, i) => (
                <div key={i} className="interview__plan-card">
                  <span className="interview__plan-day">{item.day}</span>
                  <h3 className="interview__plan-focus">{item.focus}</h3>
                  <p className="interview__plan-tasks">{item.tasks}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="interview__content">
            <h2 className="interview__content-title">
              {activeTab === TABS.TECHNICAL ? 'Technical Questions' : 'Behavioral Questions'}
            </h2>
            <div className="interview__questions">
              {questions.map((q, i) => (
                <div key={i} className="interview__question-card">
                  <div className="interview__question-header">
                    <span className="interview__question-number">{i + 1}</span>
                    <p className="interview__question-text">{q.question}</p>
                  </div>
                  <div className="interview__question-meta">
                    <span className="interview__intention-label">Intention</span>
                    <p className="interview__question-intention">{q.intention}</p>
                  </div>
                  <details className="interview__answer">
                    <summary className="interview__answer-summary">View Answer</summary>
                    <p className="interview__answer-text">{q.answer}</p>
                  </details>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <aside className="interview__sidebar interview__sidebar--right">
        {report?.matchScore != null && (
          <div className="interview__match-score">
            <span className="interview__match-score-label">Match Score</span>
            <span
              className="interview__match-score-value"
              style={{
                color: report.matchScore >= 70 ? '#22c55e' : report.matchScore >= 40 ? '#f59e0b' : '#ef4444'
              }}
            >
              {report.matchScore}%
            </span>
            <div className="interview__match-score-bar">
              <div
                className="interview__match-score-fill"
                style={{
                  width: `${Math.min(report.matchScore, 100)}%`,
                  background: report.matchScore >= 70 ? '#22c55e' : report.matchScore >= 40 ? '#f59e0b' : '#ef4444'
                }}
              />
            </div>
          </div>
        )}
        <div className="interview__tags">
          <h3 className="interview__tags-title">Skills Gaps</h3>
          {skillGaps.map((item, i) => (
            <span
              key={i}
              className="interview__tag"
              style={{ borderColor: SEVERITY_COLORS[item.severity] + '40', color: SEVERITY_COLORS[item.severity] }}
            >
              {item.skills}
              <span
                className="interview__tag-dot"
                style={{ background: SEVERITY_COLORS[item.severity] }}
              />
            </span>
          ))}
        </div>

        <button
          className="interview__download-btn"
          onClick={() => downloadPdf(interviewId)}
        >
          📄 Report PDF
        </button>

        {report?.resume && (
          <button
            className="interview__download-btn interview__download-btn--resume"
            onClick={() => downloadResume(interviewId)}
          >
            📝 Resume PDF
          </button>
        )}
      </aside>
    </div>
  )
}

export default Interview
