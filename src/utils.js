import { useEffect, useRef } from 'react';

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