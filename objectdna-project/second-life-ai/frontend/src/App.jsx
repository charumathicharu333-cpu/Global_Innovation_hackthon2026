import { useEffect, useState } from 'react'
import { analyzeImage, analyzeDemo } from './api'
import { AppShell } from './components/AppShell'
import { HomePage } from './components/HomePage'
import { AnalyzePage } from './components/AnalyzePage'
import { ResultsPage } from './components/ResultsPage'
import { ImpactPage } from './components/ImpactPage'
import { HistoryPage } from './components/HistoryPage'
import { DashboardPage } from './components/DashboardPage'
import { HowItWorksPage } from './components/HowItWorksPage'
import { analysisSteps, getFallbackResult, sampleObjects } from './data'

const IMPACT_KEY = 'objectdna-impact'
const RESULT_KEY = 'objectdna-last-result'
const HISTORY_KEY = 'objectdna-history'
const defaultImpact = { objectsAnalyzed: 0, reused: 0, repairable: 0, recovered: 0, donated: 0, wasteAvoided: 0, usefulLifeHours: 0 }

function readJson(storage, key, fallback) {
  try { return { ...fallback, ...(JSON.parse(storage.getItem(key) || 'null') || {}) } } catch { return fallback }
}

function readLastResult() {
  try { return JSON.parse(sessionStorage.getItem(RESULT_KEY) || 'null') } catch { return null }
}

function readHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]') } catch { return [] }
}

function makeHistoryRecord(result) {
  return {
    id: result.id || `analysis-${Date.now()}`,
    created_at: result.created_at || new Date().toISOString(),
    object_name: result.object_name || result.object?.name || 'Unknown object',
    condition: result.condition || result.condition_assessment?.label || 'Unknown',
    recommended_action: result.recommended_action || result.recommendation?.pathway || 'RECOVER',
    life_path_score: result.life_path_score || 0,
    result,
  }
}

export default function App() {
  const [path, setPath] = useState(window.location.pathname || '/')
  const [result, setResult] = useState(readLastResult)
  const [previewUrl, setPreviewUrl] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [selectedSample, setSelectedSample] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisStep, setAnalysisStep] = useState(0)
  const [error, setError] = useState('')
  const [impact, setImpact] = useState(() => readJson(localStorage, IMPACT_KEY, defaultImpact))
  const [history, setHistory] = useState(readHistory)

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname || '/')
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const navigate = (nextPath) => {
    if (nextPath === path) return
    window.history.pushState({}, '', nextPath)
    setPath(nextPath)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const recordImpact = (analysis) => {
    const action = analysis.recommended_action || analysis.recommendation?.pathway || 'RECOVER'
    const next = {
      ...impact,
      objectsAnalyzed: impact.objectsAnalyzed + 1,
      reused: impact.reused + (['REUSE', 'REPURPOSE', 'DONATE'].includes(action) ? 1 : 0),
      repairable: impact.repairable + (action === 'REPAIR' ? 1 : 0),
      recovered: impact.recovered + (action === 'RECOVER' ? 1 : 0),
      donated: impact.donated + (action === 'DONATE' ? 1 : 0),
      wasteAvoided: Number((impact.wasteAvoided + (analysis.estimated_waste_avoided_kg || 0)).toFixed(1)),
      usefulLifeHours: impact.usefulLifeHours + (action === 'REPURPOSE' ? 120 : action === 'REPAIR' ? 180 : 60),
    }
    setImpact(next)
    localStorage.setItem(IMPACT_KEY, JSON.stringify(next))
  }

  const saveHistory = (analysis) => {
    const record = makeHistoryRecord(analysis)
    const next = [record, ...history.filter((item) => item.object_name !== record.object_name || item.created_at !== record.created_at)].slice(0, 30)
    setHistory(next)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
  }

  const selectFile = (file) => {
    setError('')
    if (!file) return
    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) { setError('Please choose a JPG, PNG, or WEBP image.'); return }
    if (file.size > 5 * 1024 * 1024) { setError('That image is larger than 5 MB. Try a smaller photo.'); return }
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setSelectedFile(file)
    setSelectedSample('')
    setPreviewUrl(URL.createObjectURL(file))
  }

  const removeFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setSelectedFile(null)
    setPreviewUrl('')
    setError('')
  }

  const beginAnalysis = async ({ file = null, sampleKey = 'table' } = {}) => {
    setError('')
    setIsAnalyzing(true)
    setAnalysisStep(0)
    navigate('/analyze')

    let timer
    const animation = new Promise((resolve) => {
      let current = 0
      timer = window.setInterval(() => {
        current += 1
        setAnalysisStep(Math.min(current, analysisSteps.length - 1))
        if (current >= analysisSteps.length - 1) { window.clearInterval(timer); window.setTimeout(resolve, 360) }
      }, 330)
    })

    let response
    try {
      response = file ? await Promise.race([analyzeImage(file), new Promise((_, reject) => window.setTimeout(() => reject(new Error('timeout')), 5500))]) : await analyzeDemo(sampleKey)
    } catch {
      response = getFallbackResult(sampleKey)
    }
    await animation
    window.clearInterval(timer)
    const finalResult = response?.object_name || response?.object?.name ? { ...response, demo_data: Boolean(response.demo_data) } : getFallbackResult(sampleKey)
    setResult(finalResult)
    sessionStorage.setItem(RESULT_KEY, JSON.stringify(finalResult))
    recordImpact(finalResult)
    saveHistory(finalResult)
    setIsAnalyzing(false)
    navigate('/results')
  }

  const analyzeSelected = () => {
    if (selectedFile) return beginAnalysis({ file: selectedFile, sampleKey: 'table' })
    if (selectedSample) return beginAnalysis({ sampleKey: selectedSample })
    setError('Choose an image or try one of the demo objects to begin.')
  }

  const chooseSample = (key) => {
    setSelectedSample(key)
    setSelectedFile(null)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl('')
    setError('')
    beginAnalysis({ sampleKey: key })
  }

  const openHistoryRecord = (record) => {
    setResult(record.result)
    sessionStorage.setItem(RESULT_KEY, JSON.stringify(record.result))
    navigate('/results')
  }

  const resetImpact = () => { setImpact(defaultImpact); localStorage.removeItem(IMPACT_KEY) }
  const clearHistory = () => { setHistory([]); localStorage.removeItem(HISTORY_KEY) }

  let content
  if (isAnalyzing) content = <AnalyzePage isAnalyzing analysisStep={analysisStep} />
  else if (path === '/results' && result) content = <ResultsPage result={result} imageUrl={previewUrl} navigate={navigate} />
  else if (path === '/analyze') content = <AnalyzePage selectedFile={selectedFile} previewUrl={previewUrl} selectedSample={selectedSample} error={error} onFile={selectFile} onRemove={removeFile} onAnalyze={analyzeSelected} onSample={chooseSample} />
  else if (path === '/dashboard') content = <DashboardPage impact={impact} history={history} navigate={navigate} />
  else if (path === '/history') content = <HistoryPage history={history} onOpen={openHistoryRecord} onClear={clearHistory} navigate={navigate} />
  else if (path === '/impact') content = <ImpactPage impact={impact} onReset={resetImpact} navigate={navigate} />
  else if (path === '/how-it-works') content = <HowItWorksPage navigate={navigate} />
  else content = <HomePage navigate={navigate} onSample={chooseSample} />

  return <AppShell path={path} navigate={navigate}>{content}</AppShell>
}

export { sampleObjects }
