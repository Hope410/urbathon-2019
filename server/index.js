const express = require('express'),
      app = express(),
      port = process.env.PORT || 3001,

      formData = require("express-form-data"),
      fetch = require("node-fetch"),
      os = require('os'),
      fs = require('fs'),
      cors = require('cors'),
      qs = require('querystring');

const options = {
  uploadDir: os.tmpdir(),
  autoClean: true
};

app.use(cors());
app.use(formData.parse(options));

app.get('/geo', async (req, res) => {
  try{
    const query = qs.stringify(req.query);
    const resp = await fetch('http://51.15.240.2:3000/geo?'+query);

    res.json(await resp.json());
  }catch(e){
    console.log(e);
    res.sendStatus(500);
  }
});

app.get('/synthesize.ogg', async (req, res) => {
  try{
    const { text } = req.query;

    const resp = await fetch('https://tts.api.cloud.yandex.net/speech/v1/tts:synthesize?lang=ru-RU', {
      method: 'POST',
      body: encodeURI(`text=${text}`),
      headers: {
        Authorization: `Api-Key AQVNxJVXjCYrbXStgHspLdfjKUmDBrw3tP4kOz0-`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      }
    })

    res.send(await resp.buffer());
  }catch(e){
    console.log(e);
    res.sendStatus(500);
  }
});

app.post('/recognize', async (req, res) => {
  try{
    const { audio } = req.files;

    const resp = await fetch(
      'https://stt.api.cloud.yandex.net/speech/v1/stt:recognize?topic=general', {
        method: 'POST',
        body: fs.readFileSync(audio.path),
        headers: Object.assign({
          Authorization: `Api-Key AQVNxJVXjCYrbXStgHspLdfjKUmDBrw3tP4kOz0-`
        }, audio.headers)
      })

    res.send(await resp.json());
  }catch(e){
    console.log(e);
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`Server listening at port ${port}`)
})

