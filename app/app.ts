import express from 'express';
const app: express.Application = express();

import cors from 'cors';
app.use(cors())

const { exec } = require('child_process');

import fs from 'fs';

app.get('/:m3u8_url', async (req, res) => {
  const m3u8_url = req.params.m3u8_url;

  if (!m3u8_url) {
    res.send('Url not Found')
    return;
  }

  const filename = Date.now();
  console.log(`Downloading ${m3u8_url} as ${filename}.mp4 ...`);

  // Save file in ./videos/toto.mp4
  await exec(`ffmpeg -i ${m3u8_url} -c copy -bsf:a aac_adtstoasc ./videos/${filename}.mp4`, (err: any) => {
    if (err) {
      res.send(err);
      return;
    }
    console.log(`${filename}.mp4 downloaded.`);

    res.download(`videos/${filename}.mp4`, `${filename}.mp4`, (err) => {
      if (err) {
        console.log(err);
        return;
      }

      // Delete file after 10 minutes
      setTimeout(() => {
        fs.unlink(`./videos/${filename}.mp4`, (err) => { if (err) console.log(err) });
      }, 1000 * 60 * 10);
    });
  });
});



app.listen(3000, () => {
  console.log('** Server is listening on localhost:3000, open your browser on http://localhost:3000/ **');
});
