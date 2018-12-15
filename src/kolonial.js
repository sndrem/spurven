import kolonialService from './services/kolonialService';

export const kolonial = (bot) => {
  bot.respond(/oppskrifter (.*)/i, (res) => {
    const product = res.match.length > 0 ? res.match[1] : null;
    if (!product) {
      res.send(
        'Du må spesifisere hvilket produkt du ønsker oppskrift for. Feks. oppskrifter <pølse>',
      );
      return;
    }
    res.send('Henter oppskrifter for deg. Vennligst vent...');
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
};
