import axios from 'axios';
import redis from '../../../lib/redis';

export default async function handler(req, res) {
  const { code } = req.query;
  const service = req.cookies.service;

  if (!code || !service) {
    return res.status(400).json({ error: "Code or service is missing" });
  }

  try {

    const tokenResponse = await axios.post(
      'https://discord.com/api/oauth2/token',
      new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.DISCORD_REDIRECT_URI,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const { access_token } = tokenResponse.data;


    const userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const { id: discordId, username } = userResponse.data;


    const ticket = Math.random().toString(36).substring(2, 15);


    await redis.set(
      `ticket:${ticket}`,
      JSON.stringify({ discordId, username, access_token }),
      'EX',
      300
    );


    res.redirect(`${service}?ticket=${ticket}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Authentication failed" });
  }
}
