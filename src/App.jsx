import { useMemo, useState } from 'react'
import { songs, talams } from './songs.js'

const defaultPattern = ['A', 'B', 'A', 'B', 'A']

function mod(value, divisor) {
  return ((value % divisor) + divisor) % divisor
}

export default function App() {
  const [songTitle, setSongTitle] = useState(songs[0].title)
  const [aLength, setALength] = useState(10)
  const [bLength, setBLength] = useState(6)
  const [pattern, setPattern] = useState(defaultPattern)
  const [landing, setLanding] = useState(1)
  const [showAnswer, setShowAnswer] = useState(false)

  const song = songs.find((item) => item.title === songTitle)
  const tala = talams[song.talam]
  const total = pattern.reduce((sum, section) => sum + (section === 'A' ? Number(aLength) : Number(bLength)), 0)
  const endPosition = mod(landing - 1 - total, tala.beats) + 1
  const cycles = Math.ceil(total / tala.beats)
  const sequenceText = pattern.join('')

  const answer = useMemo(() => ({ total, endPosition, cycles }), [total, endPosition, cycles])

  function toggleSection(index) {
    setPattern((current) => current.map((section, position) => position === index ? (section === 'A' ? 'B' : 'A') : section))
    setShowAnswer(false)
  }

  return (
    <main>
      <header className="hero">
        <p className="eyebrow">Kalpana swaram practice</p>
        <h1>Korvai Compass</h1>
        <p>Choose a familiar krithi, build a pattern, and work out the eDam that lands it in the right place.</p>
      </header>

      <section className="card setup">
        <label>
          Song
          <select value={songTitle} onChange={(event) => { setSongTitle(event.target.value); setShowAnswer(false) }}>
            {songs.map((item) => <option key={item.title}>{item.title}</option>)}
          </select>
        </label>
        <div className="tala-summary">
          <span className="label">Talam</span>
          <strong>{song.talam}</strong>
          <span>{tala.description}{song.note ? ` · ${song.note}` : ''}</span>
        </div>
      </section>

      <section className="card">
        <div className="section-heading"><div><p className="eyebrow">1. Build the korvai</p><h2>{sequenceText}</h2></div><span className="hint">Click a block to switch A ↔ B</span></div>
        <div className="pattern">
          {pattern.map((section, index) => <button className={`block block-${section.toLowerCase()}`} onClick={() => toggleSection(index)} key={`${section}-${index}`}>{section}</button>)}
        </div>
        <div className="lengths">
          <label>A length <input type="number" min="1" value={aLength} onChange={(event) => { setALength(event.target.value); setShowAnswer(false) }} /></label>
          <label>B length <input type="number" min="1" value={bLength} onChange={(event) => { setBLength(event.target.value); setShowAnswer(false) }} /></label>
          <p><strong>{total}</strong> total counts</p>
        </div>
      </section>

      <section className="card">
        <div className="section-heading"><div><p className="eyebrow">2. Choose the landing point</p><h2>Land on beat {landing}</h2></div><span className="hint">Beat 1 is samam</span></div>
        <div className="beat-grid" style={{ '--beats': tala.beats }}>
          {Array.from({ length: tala.beats }, (_, index) => index + 1).map((beat) => <button key={beat} onClick={() => { setLanding(beat); setShowAnswer(false) }} className={landing === beat ? 'selected' : ''}>{beat}{beat === 1 && <small>samam</small>}</button>)}
        </div>
      </section>

      <section className="challenge card">
        <p className="eyebrow">3. Find the eDam</p>
        <h2>Where should this {sequenceText} korvai begin?</h2>
        <p>Count backwards from the chosen landing point around the {song.talam} cycle.</p>
        <button className="answer-button" onClick={() => setShowAnswer((value) => !value)}>{showAnswer ? 'Hide answer' : 'Show answer'}</button>
        {showAnswer && <div className="answer"><span>Start on</span><strong>beat {answer.endPosition}</strong><p>The pattern has {answer.total} counts, spanning {answer.cycles} tala cycle{answer.cycles === 1 ? '' : 's'}.</p></div>}
      </section>
      <footer>Initial repertoire drawn from your Krithis and tala reference sheets.</footer>
    </main>
  )
}
