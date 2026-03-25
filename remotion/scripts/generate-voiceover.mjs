/**
 * Generate voiceover audio for KarloShaadi vendor promo video v2
 * Uses ElevenLabs TTS API with George voice (professional, warm, authoritative)
 */
import { writeFileSync, mkdirSync, existsSync } from 'fs';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
if (!ELEVENLABS_API_KEY) {
  console.error('ELEVENLABS_API_KEY not set');
  process.exit(1);
}

// George voice - warm, professional male voice perfect for business pitch
const VOICE_ID = 'JBFqnCBsd6RMkjVDRZzb';

const scenes = [
  {
    id: 'scene1-hook',
    text: 'Aapka talent hai, aapki mehnat hai... par leads kahan se aayenge? Har din WedMeGood ko 15 percent commission dete raho? Yeh system aapke against kaam karta hai.',
  },
  {
    id: 'scene2-pain',
    text: 'Sochiye... Ek lakh ka booking hua, 15 hazaar commission gaya. Das bookings mein dedh lakh sirf commission. Aur response time guarantee? Koi nahi deta. Aapka paisa, unka profit.',
  },
  {
    id: 'scene3-solution',
    text: 'KarloShaadi mein ZERO commission. Aapki kamaai, puri aapki. Free mein milega smart CRM, digital contracts, aur apna portfolio mini-site. Sab kuch ek jagah.',
  },
  {
    id: 'scene4-proof',
    text: 'Pehle 500 vendors ko lifetime price lock mil raha hai. Lucknow, Delhi, Kanpur mein already vendors join kar rahe hain. Yeh offer limited hai, jaldi decide karein.',
  },
  {
    id: 'scene5-cta',
    text: 'Abhi register karein, bilkul FREE. Apne wedding business ko next level pe le jaayein. KarloShaadi dot com. Aapka business, aapke rules.',
  },
];

const outDir = 'public/voiceover';
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

for (const scene of scenes) {
  console.log(`Generating: ${scene.id}...`);
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: scene.text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.55,
          similarity_boost: 0.8,
          style: 0.4,
          use_speaker_boost: true,
          speed: 1.05,
        },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    console.error(`Failed for ${scene.id}: ${res.status} ${err}`);
    process.exit(1);
  }

  const buf = Buffer.from(await res.arrayBuffer());
  const path = `${outDir}/${scene.id}.mp3`;
  writeFileSync(path, buf);
  console.log(`  ✓ ${path} (${(buf.length / 1024).toFixed(1)} KB)`);
}

console.log('\nAll voiceover files generated!');
