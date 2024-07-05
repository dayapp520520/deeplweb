import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import url from 'url';
import cors from 'cors'; // 引入cors中间件

const app = express();
const port = 5000;

// Middleware to parse JSON request body
app.use(express.json());

// 使用cors中间件允许跨域请求
app.use(cors());

// Get the current directory path
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/translate', async (req, res) => {
  const { text, source_lang, target_lang } = req.body;

  // Validate request data
  if (!text || !source_lang || !target_lang) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    // Make a request to the translation API
    const apiResponse = await fetch('xxx.xx.xxx.xx/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
      },
      body: JSON.stringify({
        text,
        source_lang,
        target_lang
      })
    });

    // Check if the response is OK
    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('API Error:', errorText);
      return res.status(apiResponse.status).json({ error: errorText });
    }

    // Print the response text
    const responseText = await apiResponse.text();
    console.log('API Response:', responseText);

    // Parse the response text as JSON
    const data = JSON.parse(responseText);

    // Prepare the response
    const response = {
      code: 200,
      id: data.id,
      data: data.data,
      alternatives: data.alternatives
    };

    // Return the response
    res.json(response);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while translating' });
  }
});
app.post('/tts', async (req, res) => {
  const { text, target_lang } = req.body;

  if (!text || !target_lang) {
    return res.status(400).json({ error: 'Missing text or target language parameter' });
  }

    let model;
  switch (target_lang) {
    case 'EN':
      model = 'en-US-JennyNeural';
      break;
    case 'ZH':
      model = 'zh-TW-HsiaoChenNeural';
      break;
    case 'JA':
      model = 'en-US-AvaMultilingualNeural';
      break;
    case 'FR':
      model = 'fr-FR-VivienneMultilingualNeural';
      break;
    case 'DE':
      model = 'de-DE-SeraphinaMultilingualNeural';
      break;
    default:
      return res.status(400).json({ error: 'Unsupported target language' });
  }

  try {
    const ttsResponse = await fetch('https://mistpe-edge.hf.space/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        input: text,
        voice: 'pitch:0.1|rate:0.2'
      })
    });

    if (!ttsResponse.ok) {
      const errorText = await ttsResponse.text();
      console.error('TTS API Error:', errorText);
      return res.status(ttsResponse.status).json({ error: errorText });
    }

    ttsResponse.body.pipe(res);
  } catch (error) {
    console.error('TTS Error:', error);
    res.status(500).json({ error: 'An error occurred while generating TTS' });
  }
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
