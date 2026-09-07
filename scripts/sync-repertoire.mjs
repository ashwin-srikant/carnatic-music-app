import { writeFile } from 'node:fs/promises'
import { google } from 'googleapis'

const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON

if (!serviceAccountJson) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON is required')

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(serviceAccountJson),
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
})
const sheets = google.sheets({ version: 'v4', auth })
const response = await sheets.spreadsheets.get({
  spreadsheetId: '1jyqLYguaj1hK1W4Xb6zXbJeajVw_Jpsx5tWIVYqHwjQ',
  ranges: ["'Ashwin Songs Taught'!A1:AB100"],
  includeGridData: true,
  fields: 'sheets(properties(title),data(startColumn,columnMetadata(hiddenByUser),rowData(values(formattedValue))))',
})
const grid = response.data.sheets?.[0]?.data?.[0]
const rows = (grid?.rowData ?? []).map((row) => (row.values ?? []).map((cell) => cell.formattedValue ?? ''))
const hiddenColumns = new Set((grid?.columnMetadata ?? []).flatMap((metadata, index) => metadata.hiddenByUser ? [index + (grid?.startColumn ?? 0)] : []))
const header = rows[0]
const start = rows.findIndex((row) => row[0]?.trim() === 'Krithis')
if (start < 0) throw new Error('Could not find the Krithis section')

const students = {}
header.slice(1).forEach((group, offset) => {
  if (hiddenColumns.has(offset + 1)) return
  group?.split('/').map((name) => name.trim()).filter(Boolean).forEach((name) => { students[name] = [] })
})

for (const row of rows.slice(start + 1)) {
  const title = row[0]?.trim()
  if (!title) break
  if (title === 'Thillanas') break
  row.slice(1).forEach((mark, offset) => {
    if (hiddenColumns.has(offset + 1)) return
    if (!mark?.trim().toUpperCase().startsWith('X')) return
    header[offset + 1]?.split('/').map((name) => name.trim()).filter(Boolean).forEach((name) => students[name].push(title))
  })
}

const activeStudents = Object.fromEntries(Object.entries(students).filter(([, learnedSongs]) => learnedSongs.length > 0))

await writeFile('public/repertoire.json', `${JSON.stringify({ updatedAt: new Date().toISOString().slice(0, 10), students: activeStudents }, null, 2)}\n`)
