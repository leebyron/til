import * as path from 'path'
import * as url from 'url'

export const TIL_PATH = path.dirname(url.fileURLToPath(import.meta.url))
export const ENTRIES_PATH = path.resolve(TIL_PATH, '../entries')

/**
 * Prints an RFC3339 date including time zone:
 *   https://www.ietf.org/rfc/rfc3339.txt
 */
export function dateTo3339(date) {
  const tz = date.getTimezoneOffset()
  const dt = new Date(date.getTime() - tz * 60000).toISOString().split('.')[0]
  const offset = (tz < 0 ? '-' : '+') + p2(tz / 60) + ':' + p2(tz % 60)
  return dt + offset
}

const p2 = n => String(Math.floor(Math.abs(n))).padStart(2, '0')

export function dateFrom3339(iso) {
  return new Date(Date.parse(iso))
}
