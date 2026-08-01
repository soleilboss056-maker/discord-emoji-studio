import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  initDiscordBot,
  getBotStatus,
  getConnectedGuilds,
  addEmojiToGuild,
  DEFAULT_DISCORD_TOKEN,
} from './src/server/discordBot.js';
import {
  fetchFullEmojiCatalog,
  searchEmojiCatalog,
  findEmojiById,
} from './src/data/emojisData.js';
import { KeepAliveLog } from './src/types.js';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Keep-Alive internal memory log history
const keepAliveLogs: KeepAliveLog[] = [];
const MAX_LOGS = 30;

function addKeepAliveLog(status: 'ok' | 'reconnected' | 'ping', pingMs: number | null) {
  const log: KeepAliveLog = {
    id: Math.random().toString(36).slice(2, 9),
    timestamp: new Date().toISOString(),
    status,
    botPingMs: pingMs,
    memoryMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    activeGuilds: getBotStatus().guildsCount || 0,
  };
  keepAliveLogs.unshift(log);
  if (keepAliveLogs.length > MAX_LOGS) {
    keepAliveLogs.pop();
  }
}

// 1. Keep-Alive API Endpoint
app.get('/api/keep-alive', (req, res) => {
  const botState = getBotStatus();
  addKeepAliveLog('ping', botState.ping || null);

  res.json({
    status: 'ok',
    message: 'System Keep-Alive active',
    timestamp: new Date().toISOString(),
    botStatus: botState.status,
    botPingMs: botState.ping,
    uptimeSeconds: botState.uptime,
    keepAliveActive: true,
  });
});

// Get Keep-Alive history logs
app.get('/api/keep-alive/logs', (req, res) => {
  res.json({ logs: keepAliveLogs });
});

// 2. Bot Status API
app.get('/api/bot/status', (req, res) => {
  res.json(getBotStatus());
});

// 3. Update Token API
app.post('/api/bot/token', async (req, res) => {
  const { token } = req.body;
  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'Token Discord requis.' });
  }

  try {
    await initDiscordBot(token.trim());
    const status = getBotStatus();
    res.json({ success: true, botStatus: status });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Impossible de se connecter avec ce token.' });
  }
});

// 4. Connected Guilds API
app.get('/api/bot/guilds', (req, res) => {
  res.json({ guilds: getConnectedGuilds() });
});

// 5. Deploy Emoji to Guild API (Direct URL)
app.post('/api/bot/deploy-emoji', async (req, res) => {
  const { guildId, name, imageUrl } = req.body;
  if (!guildId || !name || !imageUrl) {
    return res.status(400).json({ error: 'Champs guildId, name et imageUrl requis.' });
  }

  try {
    const result = await addEmojiToGuild(guildId, name, imageUrl);
    res.json(result);
  } catch (err: any) {
    console.error('Erreur déploiement émoji:', err);
    res.status(500).json({ error: err.message || 'Échec de l\'ajout de l\'émoji sur le serveur.' });
  }
});

// 6. Deploy Emoji by Custom ID Endpoint (Requested Feature)
app.post('/api/bot/add-by-id', async (req, res) => {
  const { guildId, customId, emojiId } = req.body;
  const targetId = customId || emojiId;

  if (!guildId || !targetId) {
    return res.status(400).json({ error: 'Champs guildId et customId (ou emojiId) requis.' });
  }

  await fetchFullEmojiCatalog();
  const emoji = findEmojiById(targetId);

  if (!emoji) {
    return res.status(404).json({
      error: `Aucun émoji trouvé avec l'ID "${targetId}". Vérifiez le catalogue.`,
    });
  }

  try {
    const result = await addEmojiToGuild(guildId, emoji.title, emoji.imageUrl);
    res.json({
      success: true,
      message: `Émoji "${emoji.title}" (${emoji.customId}) ajouté avec succès sur le serveur !`,
      emoji,
      result,
    });
  } catch (err: any) {
    console.error('Erreur ajout émoji par ID:', err);
    res.status(500).json({ error: err.message || 'Échec de l\'ajout de l\'émoji via son ID.' });
  }
});

// 7. Lookup single emoji by Custom ID or Name
app.get('/api/emoji/:id', async (req, res) => {
  const targetId = req.params.id;
  await fetchFullEmojiCatalog();
  const emoji = findEmojiById(targetId);

  if (!emoji) {
    return res.status(404).json({
      status: 'error',
      found: false,
      message: `Émoji non trouvé avec l'ID "${targetId}".`,
    });
  }

  res.json({
    status: 'ok',
    found: true,
    message: 'Émoji trouvé dans la base de données !',
    emoji,
  });
});

// 8. Multi-Source Emoji Catalog Search API
app.get('/api/emojis', async (req, res) => {
  const query = (req.query.q as string) || '';
  const category = (req.query.category as string) || 'Tous';
  const page = parseInt((req.query.page as string) || '1', 10);
  const pageSize = parseInt((req.query.pageSize as string) || '28', 10);

  // Ensure full database is populated
  await fetchFullEmojiCatalog();

  const data = searchEmojiCatalog(query, category, page, pageSize);
  res.json(data);
});

// Initialize Background Keep-Alive Self-Ping Interval (Runs continuously every 25 seconds)
setInterval(async () => {
  try {
    const status = getBotStatus();
    if (status.status === 'offline' || status.status === 'error') {
      console.log('🔄 Keep-Alive Monitor: Tentative de reconnexion automatique du bot...');
      await initDiscordBot(status.currentToken || DEFAULT_DISCORD_TOKEN);
      addKeepAliveLog('reconnected', getBotStatus().ping || null);
    } else {
      addKeepAliveLog('ok', status.ping || null);
    }
  } catch (err) {
    console.error('Erreur Keep-Alive Monitor:', err);
  }
}, 25000);

// Initialize Discord Bot & Full Emoji catalog on startup
fetchFullEmojiCatalog()
  .then((items) => {
    console.log(`📦 Multi-source Emoji Database pre-loaded with ${items.length} emojis`);
  })
  .catch((err) => console.warn('Catalog pre-load deferred:', err.message));

initDiscordBot(DEFAULT_DISCORD_TOKEN).catch((err) => {
  console.warn('Init bot deferred:', err.message);
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Serveur Web & Bot Discord démarré sur http://0.0.0.0:${PORT}`);
  });
}

startServer();
