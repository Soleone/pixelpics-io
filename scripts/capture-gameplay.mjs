#!/usr/bin/env node
// Solves a built-in puzzle cell by cell through real clicks and encodes the run as a looping WebP.
// Usage: npm run media:capture -- [--url http://localhost:4173] [--out docs/media/gameplay.webp]
// Needs agent-browser (with its browser installed) and FFmpeg on the PATH. Recording and encoding come from showcase.
import { record } from '@soleone/showcase/capture'
import { parseArgs } from 'node:util'

const { values } = parseArgs({ options: { url: { type: 'string', default: 'https://pixelpics.soleone.xyz' }, out: { type: 'string', default: 'docs/media/gameplay.webp' } } })

const puzzle = 17 // "hello", 10x10
const clickMs = 110

// Runs in the page: reads the solution from the Vuex store and clicks each filled cell in reading order,
// marking a few empty cells along the way the way a player rules them out.
const solver = `(() => {
  const store = document.getElementById('app').__vue__.$store
  const rows = [...document.querySelectorAll('table.board tr.row')].slice(1).map((row) => row.querySelectorAll('td.cell'))
  const steps = []
  store.state.cells.forEach((row, y) => row.forEach((cell, x) => {
    if (cell.filled) steps.push({ x, y, mark: false })
    else if ((x + y * 3) % 11 === 0) steps.push({ x, y, mark: true })
  }))
  steps.forEach(({ x, y, mark }, i) => setTimeout(() => {
    rows[y][x].dispatchEvent(new MouseEvent(mark ? 'contextmenu' : 'click', { bubbles: true, cancelable: true }))
  }, i * ${clickMs}))
  return Date.now()
})()`

const { durationMs, grid } = await record({
  url: `${values.url}/#/boards/${puzzle}`,
  out: values.out,
  viewport: { width: 800, height: 720 },
  width: 800,
  // From below the nav to the success message under the title bar.
  crop: 'iw:ih*92/100:0:ih*7/100',
  attempts: 3,
  start: async (page) => {
    // Some Linux setups map "Noto Sans" to a CJK font with very wide spaces; pin a plain sans for the recording.
    await page.eval(`document.head.insertAdjacentHTML('beforeend', '<style>body{font-family:Lato,"DejaVu Sans",sans-serif}</style>')`)
    await page.waitFor(`document.querySelectorAll('td.cell').length === 100`)
    await page.sleep(1200)
  },
  async drive (page) {
    const startAt = await page.eval(solver)
    await page.waitFor(`!!document.querySelector('.alert-success')`, { timeoutMs: 20_000 })
    await page.sleep(2500)
    return { startAt }
  },
  async verify (page) {
    if (!(await page.eval(`!!document.querySelector('.alert-success')`))) return 'the puzzle was not solved'
  }
})

console.log(`Wrote ${values.out} (${(durationMs / 1000).toFixed(1)} s). Frame sheet: ${grid}`)
