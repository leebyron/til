import * as child_process from 'child_process'
import * as fs from 'fs/promises'
import * as path from 'path'
import * as readline from 'readline/promises'
import * as url from 'url'
import * as util from 'util'
import { DateTime } from 'luxon'

export const TIL_PATH = path.dirname(
  path.dirname(url.fileURLToPath(import.meta.url))
)
export const ENTRIES_PATH = path.resolve(TIL_PATH, 'entries')
export const MEDIA_PATH = path.resolve(TIL_PATH, 'media')
export const DIST_PATH = path.resolve(TIL_PATH, 'dist')

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

// Check to see if a file exists.
const exists = predicate => p =>
  fs
    .lstat(p)
    .then(predicate)
    .catch(error => {
      if (error.code === 'ENOENT') return false
      throw error
    })

export const fileExists = exists(stats => stats.isFile())
export const directoryExists = exists(stats => stats.isDirectory())

// Show a spinner while running an async `doing` function.
export async function spin(name, doing) {
  if (!doing) [name, doing] = [doing, name]
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
    const title = name ? name + ' ' : ''
    process.stdout.write('\x1B[?25l' + title + SPINNER[frame] + '\r')
  }, 100)
  process.on('SIGINT', handleInterrupt)
  process.on('exit', clearSpinner)
  try {
    return await doing()
  } finally {
    process.off('SIGINT', handleInterrupt)
    process.off('exit', clearSpinner)
    clearSpinner()
    clearInterval(spinner)
  }
}

// Ask for confirmation before continuing
export async function confirm(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  const response = (await rl.question(query + ' (Y/n): ')).trim().toLowerCase()
  rl.close()
  return response === 'y' || response === ''
}

function handleInterrupt(event, code) {
  process.exit(code)
}

function clearSpinner() {
  process.stdout.write('\x1B[2K\x1B[?25h')
}
