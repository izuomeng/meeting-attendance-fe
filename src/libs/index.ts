import * as moment from 'moment'
import * as qs from 'qs'

export function customFormat(str: string, format: string): string {
  if (!str) {
    return '-'
  }
  return moment(str).format(format)
}

export function formatTime(time: string): string {
  return customFormat(time, 'HH:mm')
}

export function formatDate(date: string): string {
  return customFormat(date, 'YYYY-MM-DD')
}

export function getQuery(): any {
  return qs.parse(location.search.slice(1))
}

export function toFixed(num: number, digit = 1): number {
  return parseFloat(num.toFixed(digit))
}
