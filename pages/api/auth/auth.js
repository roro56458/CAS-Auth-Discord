export default async function handler(req, res) {
    const { service } = req.query;
  
    if (!service) {
      return res.status(400).json({ error: "Service is required" });
    }
  
    const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${(
      process.env.DISCORD_REDIRECT_URI
    )}&response_type=code&scope=identify`;
  
    res.setHeader('Set-Cookie', `service=${service}; Path=/; HttpOnly`);
    res.redirect(discordAuthUrl);
  }
  