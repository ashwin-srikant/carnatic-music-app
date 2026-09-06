import { writeFile } from 'node:fs/promises'

const sourceUrl = process.env.SONGS_TAUGHT_CSV_URL

if (!sourceUrl) throw new Error('SONGS_TAUGHT_CSV_URL is required')

function parseCsv(text) {
  const rows = []
  let row = []
  let value = ''
  let quoted = false

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index]
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') { value += '"'; index += 1 } else if (character === '"') quoted = false
      else value += character
    } else if (character === '"') quoted = true
    else if (character === ',') { row.push(value.trim()); value = '' }
    else if (character === '\n') { row.push(value.trim()); rows.push(row); row = []; value = '' }
    else if (character !== '\r') value += character
  }
  if (value || row.length) { row.push(value.trim()); rows.push(row) }
  return rows
}

const response = await fetch(sourceUrl)
if (!response.ok) throw new Error(`Could not download repertoire source: ${response.status}`)

const rows = parseCsv(await response.text())
const header = rows[0]
const start = rows.findIndex((row) => row[0]?.trim() === 'Krithis')
if (start < 0) throw new Error('Could not find the Krithis section')

const students = {}
header.slice(1).forEach((group, offset) => {
  group.split('/').map((name) => name.trim()).filter(Boolean).forEach((name) => { students[name] = [] })
})

for (const row of rows.slice(start + 1)) {
  const title = row[0]?.trim()
  if (!title) break
  if (title === 'Thillanas') break
  row.slice(1).forEach((mark, offset) => {
    if (!mark?.trim().toUpperCase().startsWith('X')) return
    header[offset + 1].split('/').map((name) => name.trim()).filter(Boolean).forEach((name) => students[name].push(title))
  })
}

await writeFile('public/repertoire.json', `${JSON.stringify({ updatedAt: new Date().toISOString().slice(0, 10), students }, null, 2)}\n`)
