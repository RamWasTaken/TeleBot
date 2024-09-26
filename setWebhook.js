const axios = require('axios');

const TELEGRAM_TOKEN = '7555110905:AAFMMPJpNc3px9qEuLurmgFuZJ53r2tTTBQ'; // Replace with your bot's API token
const WEBHOOK_URL = 'https://my-telegram-bot-puce.vercel.app/new-message'; // Replace with your deployed Vercel URL

const setWebhook = async () => {
  try {
    const response = await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/setWebhook`,
      { url: WEBHOOK_URL }
    );
    console.log('Webhook set successfully:', response.data);
  } catch (error) {
    console.error('Error setting webhook:', error);
  }
};

setWebhook();
