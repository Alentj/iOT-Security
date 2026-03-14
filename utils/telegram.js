const TelegramBot = require("node-telegram-bot-api")

const bot = new TelegramBot("8737792132:AAE4v2rqzfoTKvPVceWrSoqs1zIWQ2b9uDE")

const chatId = "-5024489623"

async function sendAlert(message){
 await bot.sendMessage(chatId,message)
}

module.exports = sendAlert