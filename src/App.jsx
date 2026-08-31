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
  const [speed, setSpeed] = useState(2)
  const [landing, setLanding] = useState(0)
  const [startGuess, setStartGuess] = useState(null)
  const [answerStatus, setAnswerStatus] = useState(null)

  const song = songs.find((item) => item.title === songTitle)
  const tala = talams[song.talam]
  const isTisraGati = song.note === 'Tisra gati'
  const swaramsPerBeat = isTisraGati ? speed * 1.5 : speed
  const total = pattern.reduce((sum, section) => sum + (section === 'A' ? Number(aLength) : Number(bLength)), 0)
  const cycleSwarams = tala.beats * swaramsPerBeat
  const startPosition = mod(landing - total, cycleSwarams)
  const cycles = Math.ceil(total / cycleSwarams)
  const sequenceText = pattern.join('')
  const landingBeat = Math.floor(landing / swaramsPerBeat) + 1
  const landingSubdivision = (landing % swaramsPerBeat) + 1
  const startBeat = Math.floor(startPosition / swaramsPerBeat) + 1
  const startSubdivision = (startPosition % swaramsPerBeat) + 1

  const answer = useMemo(() => ({ total, cycles, startBeat, startSubdivision }), [total, cycles, startBeat, startSubdivision])

  function toggleSection(index) {
    setPattern((current) => current.map((section, position) => position === index ? (section === 'A' ? 'B' : 'A') : section))
    setStartGuess(null)
    setAnswerStatus(null)
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
          <select value={songTitle} onChange={(event) => { setSongTitle(event.target.value); setLanding(0); setStartGuess(null); setAnswerStatus(null) }}>
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
          <label>A length <input type="number" min="1" value={aLength} onChange={(event) => { setALength(event.target.value); setStartGuess(null); setAnswerStatus(null) }} /></label>
          <label>B length <input type="number" min="1" value={bLength} onChange={(event) => { setBLength(event.target.value); setStartGuess(null); setAnswerStatus(null) }} /></label>
          <p><strong>{total}</strong> total swarams</p>
        </div>
      </section>

      <section className="card">
        <div className="section-heading"><div><p className="eyebrow">2. Choose the speed</p><h2>{speed === 2 ? '1st speed' : '2nd speed'}</h2></div><span className="hint">How many swarams fit in one beat?</span></div>
        <div className="speed-options" role="radiogroup" aria-label="Swaram speed">
          <button className={speed === 2 ? 'selected' : ''} onClick={() => { setSpeed(2); setLanding(0); setStartGuess(null); setAnswerStatus(null) }} role="radio" aria-checked={speed === 2}><strong>1st speed</strong><span>{isTisraGati ? '3 swarams per beat' : '2 swarams per beat'}</span></button>
          <button className={speed === 4 ? 'selected' : ''} onClick={() => { setSpeed(4); setLanding(0); setStartGuess(null); setAnswerStatus(null) }} role="radio" aria-checked={speed === 4}><strong>2nd speed</strong><span>{isTisraGati ? '6 swarams per beat' : '4 swarams per beat'}</span></button>
        </div>
      </section>

      <section className="card">
        <div className="section-heading"><div><p className="eyebrow">3. Choose the landing point</p><h2>Land on beat {landingBeat}, swaram {landingSubdivision}</h2></div><span className="hint">Beat 1, swaram 1 is samam</span></div>
        <div className="beat-grid" style={{ '--beats': tala.beats, '--speed': swaramsPerBeat }}>
          {Array.from({ length: tala.beats }, (_, index) => index + 1).map((beat) => <div className="beat" key={beat}><span>{beat}{beat === 1 && <small>samam</small>}</span><div className="subdivisions">{Array.from({ length: swaramsPerBeat }, (_, subIndex) => {
            const position = (beat - 1) * swaramsPerBeat + subIndex
            return <button key={position} onClick={() => { setLanding(position); setStartGuess(null); setAnswerStatus(null) }} className={landing === position ? 'selected' : ''} aria-label={`Beat ${beat}, swaram ${subIndex + 1}`}>{subIndex + 1}</button>
          })}</div></div>)}
        </div>
      </section>

      <section className="challenge card">
        <p className="eyebrow">4. Find the eDam</p>
        <h2>Where should this {sequenceText} korvai begin?</h2>
        <p>Count backwards from the chosen landing point, one swaram at a time, around the {song.talam} cycle.</p>
        <p className="guess-prompt">Choose the beat and swaram where you think the korvai should start.</p>
        <div className="beat-grid answer-grid" style={{ '--beats': tala.beats, '--speed': swaramsPerBeat }}>
          {Array.from({ length: tala.beats }, (_, index) => index + 1).map((beat) => <div className="beat" key={beat}><span>{beat}{beat === 1 && <small>samam</small>}</span><div className="subdivisions">{Array.from({ length: swaramsPerBeat }, (_, subIndex) => {
            const position = (beat - 1) * swaramsPerBeat + subIndex
            return <button key={position} onClick={() => { setStartGuess(position); setAnswerStatus(null) }} className={startGuess === position ? 'selected' : ''} aria-label={`Start guess: beat ${beat}, swaram ${subIndex + 1}`}>{subIndex + 1}</button>
          })}</div></div>)}
        </div>
        <button className="answer-button" disabled={startGuess === null} onClick={() => setAnswerStatus(startGuess === startPosition ? 'correct' : 'incorrect')}>Check answer</button>
        {answerStatus === 'correct' && <div className="answer correct"><span>Correct</span><strong>Start on beat {answer.startBeat}, swaram {answer.startSubdivision}</strong><p>The pattern has {answer.total} swarams, spanning {answer.cycles} tala cycle{answer.cycles === 1 ? '' : 's'} at this speed.</p></div>}
        {answerStatus === 'incorrect' && <div className="answer incorrect"><span>Not quite</span><strong>Try counting backwards again</strong><p>Adjust your starting point and check again.</p></div>}
      </section>
      <footer>Initial repertoire drawn from your Krithis and tala reference sheets.</footer>
    </main>
  )
}
