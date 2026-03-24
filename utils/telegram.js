const TelegramBot = require('node-telegram-bot-api')

// 🔐 Secure Token & Chat ID
const botToken = '8737792132:AAE4v2rqzfoTKvPVceWrSoqs1zIWQ2b9uDE'
const chatId = '-5024489623'

const bot = new TelegramBot(botToken)

async function sendAlert(message, type = 'info') {
  let icon = 'ℹ️'
  if (type === 'security') icon = '🛡️'
  if (type === 'warning') icon = '⚠️'
  if (type === 'critical') icon = '🚨'
  if (type === 'system') icon = '🤖'

  // 📝 HTML Formatting (More robust than Markdown for symbols like '_')
  const formattedMsg = `${icon} <b>SmartAgri Notification</b>\n\n${message}\n\n<i>Time: ${new Date().toLocaleString()}</i>`

  try {
    await bot.sendMessage(chatId, formattedMsg, { parse_mode: 'HTML' })
  } catch (err) {
    console.error('Telegram Send Error (HTML):', err.message)
    // Fallback to plain text if HTML fails
    await bot.sendMessage(chatId, `[${icon} SmartAgri] ${message}`).catch(e => console.error('Final Telegram Fallback Failed:', e.message))
  }
}

module.exports = sendAlert
