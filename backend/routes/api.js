const express = require('express')
const webPush = require('web-push');
const router = express.Router();

const VAPID_PUBLIC_KEY = 'BLsFILKIrzQwvk6MO80Bj2w4aQoWnPkvMXRkUlXBoaod7ytSyyxOMcS1g48bd44FtXOqX0Ble3rY3c0PbHqDBWQ'
const VAPID_PRIVATE_KEY = 'DkYd2kJj7AJKL7U0jr6NnF850WtlE4SaiWEt0anlTK8'

webPush.setVapidDetails(
  'http://localhost:4000/',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

router.get('/', async (req, res) => {
  try {
    // const email = req.user!.id

    res.status(200).json({ data: '123' })
  } catch (err) {
    res.status(400)
  }
})

router.get('/vapidPublicKey', function (req, res) {
  res.send(VAPID_PUBLIC_KEY);
});

router.post('/register', function (req, res) {
  console.log(req.body);
  // A real world application would store the subscription info.
  res.sendStatus(201);
});

router.post('/sendNotification', function (req, res) {
  const subscription = "1";
  const payload = "1";
  const options = {
    TTL: "1"
  };

  setTimeout(function () {
    webPush.sendNotification({
      endpoint: 'https://fcm.googleapis.com/fcm/send/djZa8W-bsNA:APA91bHtW7ZZL5YbyrA22V503Y2KssjioGCqMQeaogk8mwv8doKH9rZwMgq0mgLb8QPO0S2c7pHbfa2H_IxLC3L-GFevPqqZVNEzsSgbFreufJkz-YZI8UtbQmn2k3tpcRX8lnXgeDIb',
      expirationTime: null,
      keys: {
        p256dh: 'BJ4Xurg07FknZlk392N-5uXY7oKUfvTdm_UlcIwKzgzahsPr1L90GngNpYMHwdf8GMyBQpbgLQPkfU4TL9uKbQM',
        auth: 'Ct3qh98iNxgAtNuH78sC5Q'
      }
    }, payload, options)
      .then(function () {
        res.sendStatus(201);
      })
      .catch(function (error) {
        console.log(error);
        res.sendStatus(500);
      });
  }, 2 * 1000);

  res.status(200)
});

module.exports = router;
