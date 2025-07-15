export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const email = req.query.email;
  if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid or missing email' });
  }
  const apiKey = process.env.ZEROBOUNCE_API_KEY;

  const apiUrl = `https://api.zerobounce.net/v2/validate?api_key=${apiKey}&email=${encodeURIComponent(email)}`;

  try {
    const zbRes = await fetch(apiUrl);
    const data = await zbRes.json();
    return res.status(zbRes.status).json(data);
  } catch (err) {
    return res.status(504).json({ error: 'Timeout or connection issue', details: err.message });
  }
}
