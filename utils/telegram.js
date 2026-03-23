const TelegramBot = require('node-telegram-bot-api')

const bot = new TelegramBot('8737792132:AAE4v2rqzfoTKvPVceWrSoqs1zIWQ2b9uDE')

const chatId = '-5024489623'

async function sendAlert(message, type = 'info') {
  let icon = 'ℹ️'
  if (type === 'security') icon = '🛡️'
  if (type === 'warning') icon = '⚠️'
  if (type === 'critical') icon = '🚨'
  if (type === 'system') icon = '🤖'

  const formattedMsg = `${icon} *SmartAgri Notification*\n\n${message}\n\n_Time: ${new Date().toLocaleString()}_`

  await bot.sendMessage(chatId, formattedMsg, { parse_mode: 'Markdown' })
}

module.exports = sendAlert
