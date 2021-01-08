import '../styles/globals.css'
import { useEffect } from 'react'
import axios from 'axios'
// import { urlBase64ToUint8Array } from '../lib/tools'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    function urlBase64ToUint8Array(base64String) {
      var padding = '='.repeat((4 - base64String.length % 4) % 4);
      var base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

      console.log(base64String + padding);
      console.log(base64);
      var rawData = window.atob(base64);
      var outputArray = new Uint8Array(rawData.length);

      for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    }
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js')
          .then(
            function (registration) {
              console.log(
                'Service Worker registration successful with scope: ',
                registration.scope
              )
            },
            function (err) {
              console.log('Service Worker registration failed: ', err)
            }
          )

        navigator.serviceWorker.ready
          .then(function (registration) {
            // Use the PushManager to get the user's subscription to the push service.
            return registration.pushManager.getSubscription()
              .then(async function (subscription) {
                // If a subscription was found, return it.
                if (subscription) {
                  return subscription;
                }

                // Get the server's public key
                const response = await axios.get('http://localhost:4000/api/vapidPublicKey')
                const vapidPublicKey = await response.data;

                // Chrome doesn't accept the base64-encoded (string) vapidPublicKey yet
                // urlBase64ToUint8Array() is defined in /tools.js
                const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

                // Otherwise, subscribe the user (userVisibleOnly allows to specify that we don't plan to
                // send notifications that don't have a visible effect for the user).

                return registration.pushManager.subscribe({
                  userVisibleOnly: true,
                  applicationServerKey: convertedVapidKey
                });
              });
          }).then(function (subscription) {
            console.log(subscription);
            axios.post('http://localhost:4000/api/register', {
              subscription: subscription
            })
          });
      })
    }
  }, [])

  return <Component {...pageProps} />
}



export default MyApp