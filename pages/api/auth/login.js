export default async function handler(req, res) {
  const { service } = req.query;

  // Vérification de la présence du service
  if (!service) {
    return res.status(400).json({ error: "Service is required" });
  }

  const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${process.env.DISCORD_REDIRECT_URI}&response_type=code&scope=identify`;

  // Stockage du service dans un cookie
  res.setHeader('Set-Cookie', `service=${service}; Path=/; HttpOnly`);
  
  // Redirection vers l'authentification Discord
  res.redirect(discordAuthUrl);
}
