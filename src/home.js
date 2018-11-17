/* eslint-disable import/prefer-default-export */
export const home = (bot) => {
  bot.hear(/hello/i, (res) => {
    res.send('Hello World');
  });

  bot.hear(/vanne/i, (res) => {
    res.send('Vanne planter');
  });
};
