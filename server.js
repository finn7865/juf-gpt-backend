// GPT Voice Agent Backend (Node.js + Express + WebSocket + OpenAI TTS Integration)

import express from 'express';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY not found in environment variables');
}

app.get('/', (req, res) => {
  res.status(200).send('Juf GPT backend is live 🎙️');
});

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Backend draait op http://0.0.0.0:${port}`);
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('🎧 WebSocket verbonden');

  ws.on('message', async (message) => {
    console.log('📥 Ontvangen audio van frontend');

    const antwoordTekst = "Hoi! Wat leuk dat je met mij praat. Wat wil je leren vandaag?";
console.log("🗣️ GPT antwoord:", antwoordTekst);

    try {
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'tts-1-hd',
          input: antwoordTekst,
          voice: 'nova'
        })
      });

      const buffer = await response.arrayBuffer();
      console.log('📤 Terugsturen audio van GPT naar frontend');
      ws.send(buffer);
    } catch (error) {
      console.error('❌ Fout bij ophalen van GPT-audio:', error);
      ws.send('Er ging iets mis bij het genereren van spraak.');
    }
  });

  ws.on('close', () => {
    console.log('🔌 WebSocket gesloten');
  });
});

