import { useRef, useState } from 'react'
import { analysisSteps, sampleObjects } from '../data'
import { Icon } from './Icons'

function formatSize(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

function SampleArt({ sample }) {
  return <div className={`sample-art ${sample.art} is-small`} aria-hidden="true"><Icon name={sample.icon} size={25} strokeWidth={1.45} /></div>
}

export function AnalyzePage({ isAnalyzing, analysisStep = 0, selectedFile, previewUrl, selectedSample, error, onFile, onRemove, onAnalyze, onSample }) {
  const inputRef = useRef(null)
  const [dragActive, setDragActive] = useState(false)
  const samples = Object.values(sampleObjects)

  if (isAnalyzing) {
    return <section className="analysis-loading page-section"><div className="container loading-container"><div className="loading-orb"><div className="loading-orb-inner"><Icon name="scan" size={34} /></div><span /><span /><span /></div><div className="section-kicker">OBJECTDNA ENGINE</div><h1>Looking closer at<br /><em>what’s possible.</em></h1><p className="loading-intro">Your photo is becoming a practical plan for a more useful next chapter.</p><div className="analysis-steps">{analysisSteps.map((step, index) => <div className={`analysis-step ${index < analysisStep ? 'complete' : ''} ${index === analysisStep ? 'current' : ''}`} key={step.label}><span className="step-icon">{index < analysisStep ? <Icon name="check" size={15} /> : <Icon name={step.icon} size={17} />}</span><span><strong>{step.number} {step.label}</strong><small>{step.detail}</small></span>{index < analysisStep && <span className="step-status">complete</span>}</div>)}</div><div className="loading-footnote"><Icon name="shield" size={15} /> Only visible details inform your result. Estimates are approximate.</div></div></section>
  }

  const hasSelection = Boolean(selectedFile || selectedSample)
  return <section className="page-section analyze-page"><div className="container analyze-layout"><div className="analyze-heading"><div className="section-kicker">SEE · UNDERSTAND · EXTEND LIFE</div><h1>Analyze your<br /><em>object DNA.</em></h1><p>Upload a clear photo and ObjectDNA will map its condition, materials, and best next-life paths before disposal.</p></div><div className="analyze-card">
    <div className={`drop-zone ${dragActive ? 'drag-active' : ''} ${hasSelection ? 'has-selection' : ''}`} onDragOver={(event) => { event.preventDefault(); setDragActive(true) }} onDragLeave={() => setDragActive(false)} onDrop={(event) => { event.preventDefault(); setDragActive(false); onFile(event.dataTransfer.files?.[0]) }} onClick={() => !hasSelection && inputRef.current?.click()} role="button" tabIndex="0" onKeyDown={(event) => { if ((event.key === 'Enter' || event.key === ' ') && !hasSelection) inputRef.current?.click() }}>
       <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" capture="environment" onChange={(event) => onFile(event.target.files?.[0])} hidden />
      {hasSelection ? <div className="preview-state">{previewUrl ? <img src={previewUrl} alt="Selected object" className="uploaded-preview" /> : <div className={`uploaded-preview sample-preview ${sampleObjects[selectedSample]?.art || 'art-phone'}`}><Icon name={sampleObjects[selectedSample]?.icon || 'smartphone'} size={65} strokeWidth={1.1} /></div>}<div className="preview-details"><span className="micro-label">ready for analysis</span><strong>{selectedFile?.name || sampleObjects[selectedSample]?.label}</strong>{selectedFile && <small>{formatSize(selectedFile.size)} · {selectedFile.type.split('/')[1].toUpperCase()}</small>}<button className="remove-button" onClick={(event) => { event.stopPropagation(); onRemove() }}><Icon name="x" size={14} /> Remove</button></div></div> : <div className="drop-prompt"><div className="upload-icon"><Icon name="upload" size={28} /></div><strong>Drop your image here</strong><span>or <b>choose a photo</b></span><small>JPG, JPEG, PNG or WEBP · max 5 MB</small></div>}
    </div>
    {error && <div className="inline-error" role="alert"><Icon name="warning" size={16} />{error}</div>}
     <div className="analyze-card-footer"><div><span className="privacy-note"><Icon name="shield" size={15} /> Your photo is only used for this analysis.</span></div><button className="button button-dark" onClick={onAnalyze} disabled={!hasSelection}>Run ObjectDNA <Icon name="sparkles" size={16} /></button></div>
   </div><div className="try-sample"><div className="try-sample-heading"><span>TRY DEMO MODE</span><span className="sample-line" /></div><div className="mini-samples">{samples.map((sample) => <button key={sample.key} onClick={() => onSample(sample.key)}><SampleArt sample={sample} /><span>{sample.shortLabel}</span></button>)}</div></div><div className="analyze-note"><Icon name="zap" size={16} /><span><strong>Reliable hackathon demo.</strong> Demo objects run the complete six-stage flow without an external AI key.</span></div></div></section>
}
