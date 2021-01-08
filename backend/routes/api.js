const express = require('express')
const router = express.Router();

const VAPID_PUBLIC_KEY = 'BLsFILKIrzQwvk6MO80Bj2w4aQoWnPkvMXRkUlXBoaod7ytSyyxOMcS1g48bd44FtXOqX0Ble3rY3c0PbHqDBWQ'
const VAPID_PRIVATE_KEY = 'DkYd2kJj7AJKL7U0jr6NnF850WtlE4SaiWEt0anlTK8'



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

  res.status(200)
});

module.exports = router;
