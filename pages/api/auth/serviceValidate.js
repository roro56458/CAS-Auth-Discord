import redis from '../../../lib/redis';

export default async function handler(req, res) {
  // Configuration des en-têtes CORS
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    // Répondre aux pré-requêtes CORS
    return res.status(200).end();
  }

  const { ticket } = req.query;

  if (!ticket) {
    return res
      .status(400)
      .send(
        `<cas:serviceResponse xmlns:cas="http://www.yale.edu/tp/cas">
          <cas:authenticationFailure code="INVALID_REQUEST">
            Ticket manquant.
          </cas:authenticationFailure>
        </cas:serviceResponse>`
      );
  }

  try {
    // Récupérer les informations du ticket dans Redis
    const data = await redis.get(`ticket:${ticket}`);
    if (!data) {
      return res
        .status(400)
        .send(
          `<cas:serviceResponse xmlns:cas="http://www.yale.edu/tp/cas">
            <cas:authenticationFailure code="INVALID_TICKET">
              Ticket invalide ou expiré.
            </cas:authenticationFailure>
          </cas:serviceResponse>`
        );
    }

    // Parse des données du ticket
    const { username } = JSON.parse(data);

    // Réponse en cas de succès
    return res.status(200).send(
      `<cas:serviceResponse xmlns:cas="http://www.yale.edu/tp/cas">
        <cas:authenticationSuccess>
          <cas:user>${username}</cas:user>
        </cas:authenticationSuccess>
      </cas:serviceResponse>`
    );
  } catch (error) {
    console.error("Erreur lors de la validation :", error);
    return res.status(500).send("Erreur interne du serveur.");
  }
}
