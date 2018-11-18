// Description:
//  Dette scriptet interagerer med newsapi for å gi oss de siste toppsakene i Norge
//
// Configuration:
//  Du må sette en gyldig NEWS_API_KEY gitt av newsapi.org for å kommunisere med newsapi sitt api.

import NewsApi from 'newsapi';
import { CronJob } from 'cron';
import config from './config';

require('dotenv').config();

const newsapi = new NewsApi(process.env.NEWS_API_KEY);

const henteNyheterFeilmelding = () => 'Kunne ikke hente nyheter :cry:';

export const nyheter = (bot) => {
  bot.respond(/nyheter/i, (res) => {
    hentNyheter();
  });

  const tz = 'Europe/Oslo';
  new CronJob('0 8 * * *', hentNyheter, null, true, tz); // Hver dag kl. 8.00

  const hentNyheter = (options = { language: 'no', country: 'no' }) => {
    const { informasjon } = config.slackrooms;
    newsapi.v2
      .topHeadlines(options)
      .then((response) => {
        const { status, totalResults, articles } = response;
        if (status === 'ok') {
          if (articles.length === 0) {
            bot.messageRoom(informasjon, 'Fant ingen nyheter');
            return;
          }

          bot.messageRoom(
            informasjon,
            `Hentet ${totalResults} av de siste toppsakene i Norge :newspaper:`,
          );
          bot.messageRoom(
            informasjon,
            articles
              .map(
                article => `*${article.title}* - publisert ${new Date(
                    article.publishedAt,
                  ).toString()}\n${
                    article.content !== null ? article.content : ''
                  }\nLes mer: ${article.url}`,
              )
              .join('\n\n'),
          );
        } else {
          bot.messageRoom(informasjon, henteNyheterFeilmelding());
        }
      })
      .catch(() => {
        bot.messageRoom(informasjon, henteNyheterFeilmelding());
      });
  };
};
