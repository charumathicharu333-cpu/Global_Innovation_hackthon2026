import { useState } from 'react'
import { optionMeta } from '../data'
import { Icon } from './Icons'

function Metric({ icon, label, value, tone = 'teal' }) {
  return <div className={`impact-metric tone-${tone}`}><div className="metric-icon"><Icon name={icon} size={20} /></div><div><span>{label}</span><strong>{value}</strong></div></div>
}

function ObjectVisual({ result, imageUrl }) {
  if (imageUrl) return <img src={imageUrl} alt={result.object_name || result.object?.name || 'Uploaded object'} className="result-object-image" />
  return <div className={`result-object-image sample-preview ${result.art || 'art-table'}`}><Icon name={result.icon || 'table'} size={105} strokeWidth={1.05} /><span className="result-scan-line" /></div>
}

function scoreColor(score) {
  if (score >= 85) return 'high'
  if (score >= 70) return 'mid'
  return 'low'
}

export function ResultsPage({ result, imageUrl, navigate }) {
  const [selectedAction, setSelectedAction] = useState(result.recommended_action || result.recommendation?.pathway || 'REPURPOSE')
  const [actionMessage, setActionMessage] = useState('')
  const pathways = result.pathways || []
  const selectedPath = pathways.find((item) => item.type === selectedAction) || pathways[0]
  const condition = result.condition || result.condition_assessment?.label || 'Unknown'
  const conditionScore = result.condition_score || result.condition_assessment?.score || 0
  const components = result.materials?.length && typeof result.materials[0] === 'object' ? result.materials : (result.components || [])
  const recommendation = result.recommendation || { title: selectedPath?.title || 'Choose a next-life path', reason: result.recommendation_reason, steps: result.action_plan || [] }
  const breakdown = result.score_breakdown || {}
  const lifeScore = result.life_path_score || selectedPath?.life_path_score || 0
  const objectName = result.object_name || result.object?.name || 'Unknown object'
  const confidence = result.confidence || result.object?.confidence || 0

  const runAction = (message) => {
    setActionMessage(message)
    window.setTimeout(() => setActionMessage(''), 3600)
  }

  return <div className="results-page page-section"><div className="container results-container">
    <div className="results-topline"><div><div className="section-kicker">ANALYSIS COMPLETE</div><h1>Your object’s<br /><em>next chapter.</em></h1></div><button className="text-button" onClick={() => navigate('/analyze')}><Icon name="refresh" size={15} /> Analyze another</button></div>

    <div className="result-hero-card"><div className="result-visual-wrap"><ObjectVisual result={result} imageUrl={imageUrl} /><span className="visual-stamp"><Icon name="check" size={13} /> visible details only</span></div><div className="result-summary"><div className="summary-top"><span className="live-pill">OBJECTDNA ANALYSIS</span>{result.demo_data && <span className="demo-pill">DEMO ANALYSIS</span>}</div><h2>{objectName}</h2><div className="result-tags"><span>{result.category || 'Object'}</span><span className="condition-tag"><i /> {condition}</span></div><p>{result.description || 'This result is based only on the visible details in your photo.'}</p><div className="confidence-block"><div className="confidence-heading"><span>Identification confidence</span><strong>{Math.round(confidence)}%</strong></div><div className="confidence-track"><span style={{ width: `${Math.min(100, Math.max(0, confidence))}%` }} /></div><small>Confidence reflects visual identification, not hidden condition.</small></div></div></div>

    <section className="evidence-section"><div className="section-heading-row"><div><div className="section-kicker">02 · UNDERSTAND</div><h2>Condition, with<br /><em>receipts.</em></h2></div><div className="condition-score"><strong>{conditionScore}</strong><span>/ 100 condition score</span></div></div><div className="evidence-grid"><div className="condition-card"><div className="condition-card-top"><span className={`condition-orb ${scoreColor(conditionScore)}`}><Icon name="eye" size={21} /></span><div><strong>{condition}</strong><span>Visible condition assessment</span></div></div><div className="condition-bar"><i style={{ width: `${conditionScore}%` }} /></div><small>Higher means more of the object appears usable at a glance.</small></div><div className="reasoning-card"><span className="micro-label">VISIBLE SIGNALS</span>{(result.visible_damage || result.condition_assessment?.reasoning || []).map((reason) => <div key={reason}><Icon name="check" size={14} />{reason}</div>)}</div></div><p className="visual-note"><Icon name="shield" size={15} /> Visual assessment only. A physical inspection may be required before repair, loading, electrical work, or reuse.</p></section>

    <section className="components-section"><div className="section-heading-row"><div><div className="section-kicker">03 · DECOMPOSE</div><h2>What is inside<br /><em>the object?</em></h2></div><p className="section-side-copy">Materials and components become the building blocks for a better next life.</p></div><div className="component-grid">{components.map((component, index) => <div className="component-card" key={`${component.name || component.material}-${index}`}><div className="component-icon"><Icon name={component.material?.toLowerCase().includes('metal') ? 'wrench' : component.material?.toLowerCase().includes('wood') ? 'layers' : 'package'} size={19} /></div><div><strong>{component.name || component.component || component.material}</strong><span>{component.material || 'Mixed material'}</span></div><b>{component.reuse_potential || component.reusePotential || 'Medium'} reuse</b></div>)}</div></section>

    <section className="best-action-section"><div className="section-heading-row"><div><div className="section-kicker">06 · EXTEND LIFE</div><h2>Recommended<br /><em>next life.</em></h2></div><span className="recommendation-mark"><Icon name="sparkles" size={14} /> highest practical fit</span></div><div className="recommendation-card tone-indigo"><div className="recommendation-icon"><Icon name={optionMeta[result.recommended_action]?.icon || 'sparkles'} size={27} /></div><div className="recommendation-copy"><span className="micro-label">{optionMeta[result.recommended_action]?.label || result.recommended_action || 'RECOMMENDATION'}</span><h3>{recommendation.title || selectedPath?.title}</h3><p>{recommendation.reason || result.recommendation_reason}</p></div><div className="recommendation-side"><span>{lifeScore} / 100 life-path score</span><button className="round-button" onClick={() => document.getElementById('comparison')?.scrollIntoView({ behavior: 'smooth' })} aria-label="See score comparison"><Icon name="arrow" size={18} /></button></div></div></section>

    <section id="comparison" className="comparison-section"><div className="section-heading-row"><div><div className="section-kicker">05 · COMPARE</div><h2>Compare next-life<br /><em>options.</em></h2></div><p className="section-side-copy">A transparent ranking across practicality, reuse potential, impact, cost, effort, and time.</p></div><div className="pathway-grid">{pathways.map((item) => <button key={item.type} className={`pathway-card tone-${optionMeta[item.type]?.tone || 'teal'} ${selectedAction === item.type ? 'selected' : ''}`} onClick={() => setSelectedAction(item.type)}><div className="pathway-card-top"><span className="option-icon"><Icon name={optionMeta[item.type]?.icon || 'route'} size={20} /></span>{item.type === result.recommended_action && <span className="mini-recommended">best fit</span>}</div><strong>{optionMeta[item.type]?.label || item.type}</strong><h3>{item.title}</h3><p>{item.description}</p><div className="pathway-score"><span>Life-path score</span><b>{item.life_path_score}</b></div><div className="pathway-meta"><span><small>Cost</small>{item.estimated_cost}</span><span><small>Effort</small>{item.effort}</span><span><small>Time</small>{item.time}</span></div></button>)}</div><div className="selected-path-detail"><div><span className="micro-label">SELECTED PATH</span><h3>{selectedPath?.title}</h3><p>{selectedPath?.description}</p></div><div className="selected-path-stats"><span>Cost <b>{selectedPath?.estimated_cost}</b></span><span>Skill <b>{selectedPath?.skill}</b></span><span>Value <b>{selectedPath?.estimated_value}</b></span></div></div></section>

    <section className="score-section"><div className="score-card"><div className="score-ring" style={{ '--score': `${lifeScore * 3.6}deg` }}><div><strong>{lifeScore}</strong><span>/ 100</span></div></div><div className="score-copy"><span className="section-kicker">LIFE-PATH SCORE</span><h2>Explainable by design.</h2><p>There is no mystery number here. ObjectDNA ranks options using a configurable weighted formula.</p><code>25% practicality · 20% reuse · 20% impact · 15% cost · 10% effort · 10% time</code></div><div className="score-breakdown">{[['Practicality', 'practicality'], ['Reuse potential', 'reuse_potential'], ['Environmental impact', 'environmental_impact'], ['Cost efficiency', 'cost_efficiency'], ['Effort', 'effort'], ['Time', 'time']].map(([label, key]) => <div key={key}><span>{label}</span><b>{breakdown[key] || selectedPath?.[`${key}_score`] || 0}</b><i><em style={{ width: `${breakdown[key] || selectedPath?.[`${key}_score`] || 0}%` }} /></i></div>)}</div></div></section>

    <section className="ideas-section"><div className="ideas-intro"><div className="section-kicker">04 · REIMAGINE</div><h2>What can it<br /><em>become?</em></h2><p>Creative routes keep the object’s useful material in circulation.</p></div><div className="ideas-grid">{(result.second_life_ideas || []).slice(0, 5).map((idea, index) => <div className="idea-card" key={idea}><span className="idea-index">0{index + 1}</span><div className="idea-art"><Icon name={index % 2 ? 'layers' : 'sparkles'} size={21} /></div><strong>{idea}</strong><span className="idea-arrow"><Icon name="arrow-up" size={15} /></span></div>)}</div></section>

    <section className="impact-result-section"><div className="section-heading-row"><div><div className="section-kicker">A ROUGH ESTIMATE, A REAL CHOICE</div><h2>Potential <em>impact.</em></h2></div><span className="estimate-badge"><Icon name="leaf" size={14} /> AI-generated estimates</span></div><div className="impact-metrics"><Metric icon="trash" label="waste avoided" value={`${result.estimated_waste_avoided_kg ?? 0} kg`} tone="teal" /><Metric icon="leaf" label="estimated CO2 avoided" value={`${result.estimated_co2_avoided_kg ?? 0} kg`} tone="lime" /><Metric icon="recycle" label="material recovery" value={`${result.material_recovery_kg ?? 0} kg`} tone="violet" /></div><p className="estimate-note">These are approximate estimates, not verified measurements. Actual impact depends on the object, local options, and what happens next.</p></section>

    <section className="action-plan-section"><div className="action-plan-copy"><div className="section-kicker">MAKE IT REAL</div><h2>What to do<br /><em>next.</em></h2><p>Small, practical actions keep good objects moving through the world.</p>{result.safety_notes?.length > 0 && <div className="safety-callout"><Icon name="warning" size={19} /><div><strong>A note on safety</strong>{result.safety_notes.map((note) => <span key={note}>{note}</span>)}</div></div>}</div><div className="plan-list">{(recommendation.steps || result.action_plan || []).map((step, index) => <div className="plan-step" key={step}><span>{String(index + 1).padStart(2, '0')}</span><p>{step}</p><Icon name="check" size={16} /></div>)}<div className="action-buttons"><button className="button button-dark" onClick={() => runAction('DIY plan ready to adapt to your tools and skill level.')}>Generate DIY plan <Icon name="wand" size={16} /></button><button className="button button-outline" onClick={() => runAction('Save this analysis to your local history.')}>Save analysis <Icon name="history" size={16} /></button></div></div></section>

    <div className="results-footer-cta"><div><span className="eyebrow dark-eyebrow"><span className="eyebrow-dot" />Keep the loop going</span><h2>One less thing<br />in the <em>throwaway pile.</em></h2></div><button className="button button-cream" onClick={() => navigate('/impact')}>View circular impact <Icon name="arrow" size={16} /></button></div>
    {actionMessage && <div className="toast" role="status"><Icon name="check" size={16} />{actionMessage}</div>}
  </div></div>
}
