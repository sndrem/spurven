// Description:
// 	Dette scriptet interagerer med newsapi for å gi oss de siste toppsakene i Norge
//
// Configuration:
// 	Du må sette en gyldig NEWS_API_KEY gitt av newsapi.org for å kommunisere med newsapi sitt api.
//
// Commands:
//    hubot nyheter - Returnerer toppsakene i Norge

import NewsApi from 'newsapi';

require('dotenv').config();

const newsapi = new NewsApi(process.env.NEWS_API_KEY);

export const nyheter = (bot) => {
  bot.respond(/nyheter/i, (res) => {
    newsapi.v2
      .topHeadlines({
        language: 'no',
        country: 'no',
      })
      .then((response) => {
        const { status, totalResults, articles } = response;
        if (status === 'ok') {
          res.send(
            `Hentet ${totalResults} av de siste toppsakene i Norge :newspaper:`,
          );
          res.send(
            articles
              .map(
                article => `*${article.title}* - publisert ${new Date(
                    article.publishedAt,
                  ).toString()}\n${article.content}\nLes mer: ${article.url}`,
              )
              .join('\n\n'),
          );
        } else {
          res.send('Kunne ikke hente nyheter :cry:');
        }
      });
  });
};
