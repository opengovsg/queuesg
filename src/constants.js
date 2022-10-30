export const API_ENDPOINT = '/api'

export const COOKIE_MAX_AGE = 60 * 90

export const BOARD_ID = process.env.NEXT_PUBLIC_TRELLO_BOARD_ID || ''

export const TICKET_STATUS = {
  PENDING: 'pending',
  REMOVED: 'removed',
  ALERTED: 'alerted',
  SERVED: 'served',
  MISSED: 'missed',
  ERROR: 'error'
}

export const QUEUE_TITLES = {
  PENDING: '[PENDING]',
  ALERTED: '[ALERT]',
  DONE: '[DONE]',
  MISSED: '[MISSED]'
}