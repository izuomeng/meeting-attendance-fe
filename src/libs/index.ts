import * as moment from 'moment'

export function customFormat(str: string, format: string): string {
  if (!str) {
    return '-'
  }
  return moment(str).format(format)
}

export function formatTime(time: string): string {
  return customFormat(time, 'hh:mm')
}

export function formatDate(date: string): string {
  return customFormat(date, 'YYYY-MM-DD')
}
