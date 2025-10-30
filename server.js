import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Validate Telegram init data
function validateTelegramData(initData, botToken) {
  try {
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    urlParams.delete('hash');
    
    const dataCheckString = Array.from(urlParams.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();
    
    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');
    
    return calculatedHash === hash;
  } catch (error) {
    console.error('Validation error:', error);
    return false;
  }
}

// Create invoice endpoint
app.post('/create-invoice', async (req, res) => {
  try {
    const { amount, initData } = req.body;
    const botToken = process.env.BOT_TOKEN;

    if (!botToken) {
      console.error('BOT_TOKEN not configured');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Validate the request
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    if (!initData) {
      return res.status(400).json({ error: 'Missing initData' });
    }

    // Validate Telegram data
    if (!validateTelegramData(initData, botToken)) {
      return res.status(401).json({ error: 'Invalid Telegram data' });
    }

    // Extract user ID from initData
    const urlParams = new URLSearchParams(initData);
    const userDataStr = urlParams.get('user');
    if (!userDataStr) {
      return res.status(400).json({ error: 'User data not found' });
    }

    const userData = JSON.parse(userDataStr);
    const userId = userData.id;

    // Create invoice using Telegram Bot API
    const invoicePayload = {
      title: 'Support Decision Spinner',
      description: `Thank you for supporting the app with ${amount} stars!`,
      payload: JSON.stringify({ userId, amount, timestamp: Date.now() }),
      currency: 'XTR', // Telegram Stars currency
      prices: [{ label: 'Donation', amount }],
    };

    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/createInvoiceLink`;
    
    const response = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoicePayload),
    });

    const result = await response.json();

    if (!result.ok) {
      console.error('Telegram API error:', result);
      return res.status(500).json({ 
        error: 'Failed to create invoice',
        details: result.description 
      });
    }

    res.json({ invoiceUrl: result.result });
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Bot token configured: ${!!process.env.BOT_TOKEN}`);
});
