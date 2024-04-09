//My ID: 1589218638
require("dotenv").config();
const {
  Bot,
  GrammyError,
  HTTPError,
  Keyboard,
  InlineKeyboard,
} = require("grammy");
//отдельно устанавливаемый плагин
const { hydrate } = require("@grammyjs/hydrate");
const bot = new Bot(process.env.BOT_API_KEY);
bot.use(hydrate());

// bot.on([":media", "::url"], async (ctx) => {
//   await ctx.reply("Получил MEDIA или URL");
// });

// bot.on("msg").filter(
//   (ctx) => {
//     return ctx.from.id === 1589218638; //если здесь возвращается true, то вторая функция ниже исполняется
//   },
//   async (ctx) => {
//     await ctx.reply("Привет, админ");
//   }
// );

bot.api.setMyCommands([
  {
    command: "start",
    description: "Запуск бота",
  },
  {
    command: "menu",
    description: "Получить меню",
  },
]);

//ctx - ConTeXt объект
//await - позволяет дождаться окончания работы перед вызовом
bot.command("start", async (ctx) => {
  await ctx.react("👌");
  await ctx.reply("Привет\\! Канал: [это ссылка](www.glav.su)", {
    parse_mode: "MarkdownV2",
  });
});

const menuKeyboard = new InlineKeyboard()
  .text("Узнать статус заказа", "order-status")
  .text("Обратиться в подддержку", "support");

const backKeyboard = new InlineKeyboard().text("< Назад в меню", "back");

bot.command("menu", async (ctx) => {
  await ctx.reply("Выберите пунскт меню", {
    reply_markup: menuKeyboard,
  });
});

//обработчик для кнопок
bot.callbackQuery("order-status", async (ctx) => {
  //editText добавляется из hydrate
  await ctx.callbackQuery.message.editText("Статус заказа: в пути", {
    reply_markup: backKeyboard,
  });
  await ctx.answerCallbackQuery();
});

bot.callbackQuery("support", async (ctx) => {
  //editText добавляется из hydrate
  await ctx.callbackQuery.message.editText("Ваш запрос", {
    reply_markup: backKeyboard,
  });
  await ctx.answerCallbackQuery();
});

//ползователь нажимает кнопку Back
bot.callbackQuery("back", async (ctx) => {
  //метод editText добавляется из плагина hydrate
  await ctx.callbackQuery.message.editText("Выберите пункт меню", {
    reply_markup: menuKeyboard,
  });
  await ctx.answerCallbackQuery();
});

//обработчик ошибок взят из документации
bot.catch((err) => {
  const ctx = err.ctx;
  console.log(`Error with handling update: ${ctx.update.update_id}:`);
  const e = err.error;

  if (e instanceof GrammyError) {
    console.log("Error in request: ", e.description);
  } else if (e instanceof HTTPError) {
    console.log("Could not contact Telegram: ", e);
  } else {
    console.log("Unknown error", e);
  }
});

bot.start();
