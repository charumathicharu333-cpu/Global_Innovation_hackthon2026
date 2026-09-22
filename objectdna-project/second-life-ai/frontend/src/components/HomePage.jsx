import { Icon } from './Icons'
import { sampleObjects } from '../data'

function SampleArt({ sample, small = false }) {
  return <div className={`sample-art ${sample.art} ${small ? 'is-small' : ''}`} aria-hidden="true"><Icon name={sample.icon} size={small ? 25 : 40} strokeWidth={1.45} /></div>
}

export function HomePage({ navigate, onSample }) {
  const samples = Object.values(sampleObjects)
  return (
    <div>
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" />AI-powered circular intelligence</div>
            <h1>Give every object<br /><em>a next life.</em></h1>
            <p className="hero-lede">ObjectDNA looks past the discard pile to discover what unwanted objects can become, from a repair to a responsible material recovery plan.</p>
            <div className="hero-actions">
              <button className="button button-dark button-large" onClick={() => navigate('/analyze')}>Analyze my object <Icon name="arrow" size={17} /></button>
              <button className="text-button" onClick={() => navigate('/how-it-works')}>How it works <Icon name="arrow" size={15} /></button>
            </div>
            <div className="hero-proof"><div className="proof-avatars"><span>OD</span><span>AI</span><span>∞</span></div><span>Don’t throw it away. Let AI discover what it can become.</span></div>
          </div>
          <div className="hero-visual" aria-label="Object to second life visual">
            <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
            <div className="scan-label label-top"><span className="status-dot" />ready to scan</div>
            <div className="hero-object-card">
              <div className="object-card-top"><span>01 / OBJECT</span><span className="live-pill">LIVE DEMO</span></div>
              <div className="hero-object-image"><div className="phone-glow" /><Icon name="table" size={90} strokeWidth={1.1} /></div>
              <div className="object-card-meta"><div><span className="micro-label">detected item</span><strong>Wooden table</strong></div><span className="confidence-chip">94% match</span></div>
            </div>
            <div className="flow-connector connector-one"><span /><Icon name="arrow" size={14} /></div>
             <div className="hero-ai-card"><div className="ai-icon"><Icon name="sparkles" size={18} /></div><div><span className="micro-label">objectdna engine</span><strong>Finding possibilities<span className="dots">...</span></strong></div></div>
            <div className="flow-connector connector-two"><span /><Icon name="arrow" size={14} /></div>
             <div className="hero-destination"><div className="destination-icon"><Icon name="sparkles" size={22} /></div><span className="micro-label">next life</span><strong>Bookshelf, not landfill</strong></div>
            <div className="scan-corner corner-left" /><div className="scan-corner corner-right" />
          </div>
        </div>
      </section>

      <section className="signal-strip"><div className="container signal-inner"><span>BEFORE DISPOSAL, <b>EXPLORE POSSIBILITY.</b></span><div className="signal-line" /><span className="signal-note"><Icon name="leaf" size={15} /> A more circular habit starts here</span></div></section>

      <section className="pipeline-section section-pad"><div className="container"><div className="section-kicker">THE OBJECTDNA ENGINE</div><div className="pipeline-intro"><h2>From “what is it?”<br /><em>to “what can it become?”</em></h2><p>Six layers of intelligence turn one photo into a practical, explainable next-life plan.</p></div><div className="pipeline-grid">{[['01', 'SEE', 'Recognize the object', 'scan'], ['02', 'UNDERSTAND', 'Read visible condition', 'eye'], ['03', 'DECOMPOSE', 'Map materials and parts', 'layers'], ['04', 'REIMAGINE', 'Generate new uses', 'sparkles'], ['05', 'COMPARE', 'Score the trade-offs', 'chart'], ['06', 'EXTEND LIFE', 'Recommend what to do next', 'leaf']].map(([number, title, copy, icon]) => <div className="pipeline-step" key={number}><span>{number}</span><div className="pipeline-icon"><Icon name={icon} size={19} /></div><strong>{title}</strong><p>{copy}</p></div>)}</div></div></section>

      <section className="problem-section section-pad"><div className="container">
        <div className="section-kicker">THE PROBLEM</div>
        <div className="problem-intro"><h2>Most waste starts with<br /><em>one simple decision.</em></h2><p>People often discard objects because they don’t know what to do with them next. ObjectDNA turns that moment of uncertainty into a clear, better option.</p></div>
        <div className="decision-grid">
          <div className="decision-card discard-card"><div className="decision-number">01</div><div className="decision-object"><div className="decision-icon muted"><Icon name="box" size={28} /></div><strong>Everyday object</strong></div><div className="decision-arrow"><Icon name="arrow" size={18} /></div><div className="decision-quote">“I don’t know what<br />to do with it.”</div><div className="decision-arrow down"><Icon name="arrow" size={18} /></div><div className="decision-end trash-end"><Icon name="trash" size={19} /> Trash</div></div>
           <div className="decision-card discover-card"><div className="decision-number green">02</div><div className="decision-object"><div className="decision-icon green-icon"><Icon name="scan" size={28} /></div><strong>ObjectDNA</strong></div><div className="decision-arrow green-arrow"><Icon name="arrow" size={18} /></div><div className="possibility-list"><span><Icon name="wrench" size={15} /> Repair</span><span><Icon name="refresh" size={15} /> Reuse</span><span><Icon name="gift" size={15} /> Donate</span><span><Icon name="sparkles" size={15} /> Repurpose</span></div><div className="decision-end future-end"><Icon name="leaf" size={19} /> More possibility</div></div>
        </div>
      </div></section>

      <section className="sample-section section-pad"><div className="container"><div className="sample-heading"><div><div className="section-kicker">START WITH A SNAPSHOT</div><h2>What’s waiting for<br /><em>its next life?</em></h2></div><p>Try a sample object and see the full journey in seconds. No account, no setup.</p></div><div className="sample-grid">{samples.map((sample) => <button className="sample-card" key={sample.key} onClick={() => onSample(sample.key)}><SampleArt sample={sample} small /><span><strong>{sample.label}</strong><small>{sample.category}</small></span><Icon name="arrow-up" size={17} /></button>)}</div></div></section>

      <section className="home-cta section-pad"><div className="container cta-panel"><div><span className="eyebrow dark-eyebrow"><span className="eyebrow-dot" />One photo can change the outcome</span><h2>Before it becomes waste,<br /><em>ask what else it can be.</em></h2></div><button className="button button-cream button-large" onClick={() => navigate('/analyze')}>Find its next life <Icon name="arrow" size={17} /></button></div></section>
    </div>
  )
}
