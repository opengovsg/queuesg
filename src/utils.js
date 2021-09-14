import { useEffect, useRef } from 'react';
import { QUEUE_TITLES } from './constants'

/**
 * React setInterval Equivalent
 * 
 * @param {*} callback 
 * @param {*} delay 
 */
export const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

/**
 * Gets the queue name from the list name
 * 
 * @param {string} name 
 * @param {string} queueNumber 
 */
 export const getQueueName = (name) => {
  Object.values(QUEUE_TITLES).forEach(TITLE => {
    name = name.replace(TITLE, '')
  })
  return name.trim()
}

/**
 * Gets the queue number from the card name
 * 
 * @param {string} name 
 * @param {string} queueNumber 
 */
export const getQueueNumber = (name) => {
  return '#' + name.split('-')[0]
}

/**
 * Gets the customer name from the card name
 * 
 * @param {string} name 
 * @param {string} customerName
 */
export const getCustomerName = (name) => {
  return name.split('-')[1]
}

/**
 * Authentication
 */
export const authentication = {
  login: (key, token) => {
    localStorage.setItem('key', key)
    localStorage.setItem('token', token)
  },
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('key')
  },
  getToken: () => localStorage.getItem('token'),
  setKey: (key) => localStorage.setItem('key', key),
  getKey: () => localStorage.getItem('key'),
}

/**
 * Is the queue open
 * 
 * opening hours is 
 *  { 
 *    "0": "09:00-12:00",
 *    "1": "08:00-22:00",
 *    "2": "09:00-22:00",
 *    "3": "10:00-21:00"
 *  }
 */
export const isQueueClosed = (openingHours) => {
  const date = new Date()
  const day = date.getDay()
  const hour = String(date.getHours())
  const min = String(date.getMinutes())
  const currentTime = `${hour.padStart(2,'0')}:${min.padStart(2,'0')}`

  if (typeof openingHours !== 'object' || !openingHours[day]) return false

  const currentDayOpeningHours = openingHours[day].split('-')
  
  if (Array.isArray(currentDayOpeningHours) && currentDayOpeningHours.length === 2) {
    return currentTime < currentDayOpeningHours[0] || currentTime > currentDayOpeningHours[1]
  }

  return true
}
