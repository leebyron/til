import * as child_process from 'child_process'
import * as path from 'path'
import * as url from 'url'
import * as util from 'util'
import { DateTime } from 'luxon'

export const TIL_PATH = path.dirname(
  path.dirname(url.fileURLToPath(import.meta.url))
)
export const ENTRIES_PATH = path.resolve(TIL_PATH, './entries')

// Escape quotes
export const quot = str => str.replace(/\"/g, '\\"')

/**
 * Prints an RFC3339 date including time zone:
 *   https://www.ietf.org/rfc/rfc3339.txt
 */
export function dateTo3339(date) {
  return DateTime.now()
    .set({ milliseconds: 0 })
    .toISO({ suppressMilliseconds: true })
}

// Run a command and print the results to stdout
export const run = async (...args) => {
  const result = await exec(...args)
  if (result) console.log(result)
}

// Execute a command and return the results.
export const exec = async (...args) => {
  const result = await util.promisify(child_process.exec)(...args)
  if (result.stderr) console.error(result.stderr.trimEnd())
  return result.stdout.trimEnd()
}

// Show a spinner while running an async `doing` function.
export const spin = async doing => {
  let frame = 0
  const SPINNER = [
    '\u2808\u2801',
    '\u2800\u2811',
    '\u2800\u2830',
    '\u2800\u2860',
    '\u2880\u2840',
    '\u2884\u2800',
    '\u2806\u2800',
    '\u280A\u2800',
  ]
  const spinner = setInterval(() => {
    frame = (frame + 1) % SPINNER.length
    process.stdout.write('  ' + SPINNER[frame] + '\r')
  }, 100)
  try {
    await doing()
  } finally {
    clearInterval(spinner)
  }
}
