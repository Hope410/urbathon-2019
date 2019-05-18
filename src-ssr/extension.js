const formData = require("express-form-data");
const fetch = require("node-fetch");
const os = require('os');
const fs = require('fs');

module.exports.extendApp = function ({ app }) {
  const options = {
    uploadDir: os.tmpdir(),
    autoClean: true
  };

  app.use(formData.parse(options));

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
}
