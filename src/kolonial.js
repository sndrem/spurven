import kolonialService from './services/kolonialService';

const specifyProductError = () => 'Du må spesifisere hvilket produkt du ønsker oppskrift for. Feks. oppskrifter <pølse>';

export const kolonial = (bot) => {
  bot.respond(/oppskrifter (.*)/i, (res) => {
    const product = res.match.length > 0 ? res.match[1] : null;
    if (!product) {
      res.send(specifyProductError());
      return;
    }
    res.send(`Henter oppskrifter for ${product} for deg. Vennligst vent...`);
    kolonialService.getRecipes(product, (err, data) => {
      if (err) {
        res.send(
          `Fant dessverre ingen oppskrifter for ${product}. Prøv igjen med noen andre produkter.`,
        );
        return;
      }
      res.send(`Jeg fant ${data.results.length} oppskrifter for ${product}`);
      res.send(
        data.results
          .map(
            recipe => `${recipe.title}, ${recipe.cooking_duration_string} - ${
                recipe.difficulty_string
              }\nLes mer: ${recipe.front_url}`,
          )
          .join('\n\n'),
      );
    });
  });

  bot.respond(/søk (.*)/i, (res) => {
    const product = res.match.length > 0 ? res.match[1] : null;
    if (!product) {
      res.send(specifyProductError());
      return;
    }
    res.send(`Søker etter ${product} for deg`);
    kolonialService.search(product, (err, data) => {
      if (err) {
        res.send(`Jeg fant dessverre ingen treff for ${product}`);
        return;
      }
      const availableItems = data.products.filter(
        item => item.availability.is_available,
      );
      res.send(`Jeg fant ${availableItems.length} treff for ${product}`);
      res.send(
        availableItems
          .map(
            item => `ID: ${item.id} - ${item.full_name}, ${
                item.gross_price
              } kr.\nLes mer: ${item.front_url}\nBilde: ${
                item.images[0].thumbnail.url
              }`,
          )
          .join('\n\n'),
      );
    });
  });
};
