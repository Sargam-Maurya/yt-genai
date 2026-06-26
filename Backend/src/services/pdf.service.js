const puppeteer = require("puppeteer")

function generateReportHtml(report) {
  const { title, matchScore, technicalQuestions, behavioralQuestions, skillGaps, preparationPlan } = report

  const techQuestions = (technicalQuestions || []).map((q, i) => `
    <div class="question-card">
      <div class="q-number">${i + 1}</div>
      <div class="q-body">
        <p class="q-text">${escapeHtml(q.question)}</p>
        <p class="q-intention"><strong>Intention:</strong> ${escapeHtml(q.intention)}</p>
        <p class="q-answer-label">Answer:</p>
        <p class="q-answer">${escapeHtml(q.answer)}</p>
      </div>
    </div>
  `).join("")

  const behQuestions = (behavioralQuestions || []).map((q, i) => `
    <div class="question-card">
      <div class="q-number">${i + 1}</div>
      <div class="q-body">
        <p class="q-text">${escapeHtml(q.question)}</p>
        <p class="q-intention"><strong>Intention:</strong> ${escapeHtml(q.intention)}</p>
        <p class="q-answer-label">Answer:</p>
        <p class="q-answer">${escapeHtml(q.answer)}</p>
      </div>
    </div>
  `).join("")

  const gaps = (skillGaps || []).map(g => {
    const color = g.severity === "high" ? "#ef4444" : g.severity === "medium" ? "#f59e0b" : "#22c55e"
    return `<span class="tag" style="border-color:${color}40;color:${color}">${escapeHtml(g.skills)}</span>`
  }).join("")

  const plan = (preparationPlan || []).map(p => `
    <div class="plan-card">
      <span class="plan-day">${escapeHtml(p.day)}</span>
      <h3>${escapeHtml(p.focus)}</h3>
      <p>${escapeHtml(p.tasks)}</p>
    </div>
  `).join("")

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; padding: 40px; }
    h1 { font-size: 24px; margin-bottom: 4px; }
    .subtitle { color: #64748b; font-size: 14px; margin-bottom: 24px; }
    .score-bar { display: flex; align-items: center; gap: 12px; margin-bottom: 32px; }
    .score-fill { height: 10px; border-radius: 5px; background: #22c55e; flex: 1; max-width: 300px; }
    .score-fill.low { background: #ef4444; }
    .score-fill.med { background: #f59e0b; }
    .score-label { font-size: 14px; font-weight: 600; }
    hr { border: none; border-top: 1px solid #e2e8f0; margin: 24px 0; }
    h2 { font-size: 18px; margin-bottom: 16px; }
    .question-card { display: flex; gap: 12px; margin-bottom: 16px; padding: 12px; background: #f8fafc; border-radius: 8px; page-break-inside: avoid; }
    .q-number { width: 28px; height: 28px; border-radius: 50%; background: #3b82f6; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; flex-shrink: 0; }
    .q-body { flex: 1; }
    .q-text { font-weight: 600; margin-bottom: 6px; font-size: 14px; }
    .q-intention { font-size: 12px; color: #64748b; margin-bottom: 6px; }
    .q-answer { font-size: 13px; color: #475569; margin-top: 6px; line-height: 1.5; }
    .q-answer-label { font-size: 12px; font-weight: 600; color: #3b82f6; margin-top: 6px; }
    .tags { display: flex; flex-wrap: wrap; gap: 8px; }
    .tag { padding: 4px 10px; border: 1px solid; border-radius: 20px; font-size: 12px; }
    .plan-card { padding: 12px; background: #f8fafc; border-radius: 8px; margin-bottom: 12px; page-break-inside: avoid; }
    .plan-day { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #3b82f6; font-weight: 600; }
    .plan-card h3 { font-size: 14px; margin: 4px 0; }
    .plan-card p { font-size: 13px; color: #475569; }
    @media print { body { padding: 20px; } .question-card, .plan-card { break-inside: avoid; } }
  </style>
</head>
<body>
  <h1>${escapeHtml(title || "Interview Report")}</h1>
  <p class="subtitle">AI-Generated Interview Preparation Report</p>

  <div class="score-bar">
    <span class="score-label">Match Score: ${matchScore ?? "—"}%</span>
    <div class="score-fill${matchScore < 40 ? " low" : matchScore < 70 ? " med" : ""}" style="width:${Math.min(matchScore ?? 0, 100)}%"></div>
  </div>

  <hr>

  ${techQuestions ? `<h2>Technical Questions</h2>${techQuestions}<hr>` : ""}
  ${behQuestions ? `<h2>Behavioral Questions</h2>${behQuestions}<hr>` : ""}

  ${gaps ? `<h2>Skill Gaps</h2><div class="tags">${gaps}</div><hr>` : ""}

  ${plan ? `<h2>Preparation Plan</h2>${plan}` : ""}
</body>
</html>`
}

function escapeHtml(str) {
  if (typeof str !== "string") return str ?? ""
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}

async function generateReportPdf(report) {
  const html = generateReportHtml(report)
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  })
  try {
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: "networkidle0" })
    const pdf = await page.pdf({
      format: "A4",
      margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" },
      printBackground: true,
    })
    return pdf
  } finally {
    await browser.close()
  }
}

function generateResumeHtml(resumeText, title) {
  const lines = resumeText.split('\n').filter(Boolean)

  const bodyLines = lines.map(line => {
    const trimmed = line.trim()
    if (!trimmed) return ''
    // Heuristic: short uppercase lines look like headings
    if (trimmed.length < 60 && (trimmed === trimmed.toUpperCase() || /^[A-Z][a-z]+(?:[\s/][A-Z][a-z]+)*$/.test(trimmed) && trimmed.length < 40)) {
      return `<h2>${escapeHtml(trimmed)}</h2>`
    }
    // Bullet points
    if (trimmed.startsWith('-') || trimmed.startsWith('•') || /^\d+\./.test(trimmed)) {
      return `<li>${escapeHtml(trimmed.replace(/^[-•]\s*/, '').replace(/^\d+\.\s*/, ''))}</li>`
    }
    return `<p>${escapeHtml(trimmed)}</p>`
  }).join('\n')

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; padding: 40px; }
    h1 { font-size: 26px; margin-bottom: 4px; color: #1e293b; }
    .subtitle { color: #64748b; font-size: 14px; margin-bottom: 24px; border-bottom: 2px solid #3b82f6; padding-bottom: 12px; }
    h2 { font-size: 16px; color: #3b82f6; margin-top: 20px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
    p { font-size: 13px; line-height: 1.7; color: #334155; margin-bottom: 6px; }
    ul { padding-left: 20px; margin-bottom: 10px; }
    li { font-size: 13px; line-height: 1.7; color: #334155; margin-bottom: 4px; }
    hr { border: none; border-top: 1px solid #e2e8f0; margin: 20px 0; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <h1>${escapeHtml(title || 'Resume')}</h1>
  <p class="subtitle">Professional Resume</p>
  ${bodyLines}
</body>
</html>`
}

async function generateResumePdf(resumeText, title) {
  const html = generateResumeHtml(resumeText, title)
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  })
  try {
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: "networkidle0" })
    const pdf = await page.pdf({
      format: "A4",
      margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" },
      printBackground: true,
    })
    return pdf
  } finally {
    await browser.close()
  }
}

module.exports = { generateReportPdf, generateResumePdf }
