const rp = require('request-promise');
const saveCoinsAPI = 'https://api-savecoins.nznweb.com.br/v1/games?currency=USD&locale=en&filter[platform]=nintendo&filter[title]=';
const TeleBot = require('telebot');
const bot = new TeleBot(process.env.TELEGRAM_BOT_KEY);

// Greet users
bot.on(['/start', '/hello'], (msg) => msg.reply.text('Welcome! Please type \`/savecoins [game name]\` to search for your games on https://savecoins.app'));

// Search Games
bot.on(/^\/savecoins (.+)$/, (msg, props) => {
  return searchSaveCoins(msg, props);
});

bot.start();

const searchSaveCoins = (msg, props) => {
  const text = props.match[1];
  let queryURL = saveCoinsAPI + text.replace(/ /g, '+');
  rp({
    url:queryURL,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.92 Safari/537.36'
    },
    json:true
  })
    .then(function(savecoins){
      // console.log('success', html);
      let message = `Found ${savecoins.data.length} game${savecoins.data.length > 1 ? 's' : ''}!\n`
      savecoins.data.forEach(game => {
        message += (`\n${game.title} - ${game.price_info.currentPrice} - ${game.price_info.country.name}`);
      });
      msg.reply.text(message);
    })
    .catch(function(err){
      //handle error
      msg.reply('error!\n\n' + JSON.stringify(err));
    });
}
