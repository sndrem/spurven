import kolonialService from './services/kolonialService';

const specifyProductError = () => 'Du må spesifisere hvilket produkt du ønsker oppskrift for. Feks. oppskrifter <pølse>';
const getProduct = (res, matchNumber = 1) => (res.match.length > 0 ? res.match[matchNumber] : null);

const transformRecipeToString = recipe => `ID: ${recipe.id} - ${recipe.title}, ${recipe.cooking_duration_string} - ${
  recipe.difficulty_string
  }\nLes mer: ${recipe.front_url}`;

const transformProductToString = product => `ID: ${product.id} - ${product.full_name}, ${product.gross_price} kr.\nLes mer: ${
  product.front_url
  }\nBilde: ${product.images[0].thumbnail.url}`;

export const kolonial = (bot) => {
  bot.respond(/oppskrifter (.*)/i, (res) => {
    const product = getProduct(res);
    if (!product) {
      res.send(specifyProductError());
      return null;
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
      res.send(data.results.map(transformRecipeToString).join('\n\n'));
    });
  });

  bot.respond(/søk (.*)/i, (res) => {
    const product = getProduct(res);
    if (!product) {
      res.send(specifyProductError());
      return;
    }
    res.send(`Søker etter ${product} for deg`);
    kolonialService.search(product, (err, data) => {
      if (err) {
        console.log("Feil ved søk", err);
        res.send(`Jeg fant dessverre ingen treff for ${product}`);
        return;
      }
      const availableItems = data.products.filter(item => item.availability.is_available);
      res.send(`Jeg fant ${availableItems.length} treff for ${product}`);
      res.send(availableItems.map(transformProductToString).join('\n\n'));
    });
  });

  bot.respond(/(handlekurv|hk)/i, (res) => {
    res.send('Henter handlekurven for deg');
    kolonialService.getCart((err, data) => {
      if (err) {
        if (err.statusCode === 401) {
          res.send(err.message);
          return;
        }
        res.send('Kunne ikke hente handlekurven for deg.');
        return;
      }
      if (data.items.length === 0) {
        res.send(data.label_text);
        return;
      }
      res.send(
        `Handlekurven inneholder ${data.items.length} produkter til en verdi av kr ${
        data.total_gross_amount
        } NOK.\n\n${data.extra_lines
          .map(line => `${line.description}: ${line.gross_amount} NOK`)
          .join('\n')}`,
      );
      res.send('\n\nHer er varene du har i handlekurven nå');
      res.send(data.items.map(item => transformProductToString(item.product)).join('\n\n'));
    });
  });

  bot.respond(/legg til (\d+) av (\d+)/i, (res) => {
    const antall = getProduct(res, 1);
    const produktId = getProduct(res, 2);
    const items = {
      "items": [
        {
          "product_id": produktId,
          "quantity": antall
        }
      ]
    }
    kolonialService.leggTilICart(items, (err, data) => {
      if (err) {
        res.send(`Klarte ikke legge til ${antall} av vare med id ${produktId}... Prøv på nytt eller gå til www.kolonial.no og prøv der.`);
      }

      if (data && data.items) {
        const produktLagttil = data.items.find(p => p.product.id === parseInt(produktId));
        res.send(`La til ${produktLagttil.product.full_name} i handlekurven.`);
        res.send(`Handlekurven består nå av\n${data.items.map(p => {
          return `* ${p.product.full_name} (${p.product.quantity}) - ${p.product.display_price_total} NOK`
        }).join("\n")}`);

        res.send(`Totalt antall varer i handlekurven er: ${data.product_quantity_count} til en pris av ${data.total_gross_amount} NOK`);
      }
    });

  });

  bot.respond(/(login|logg inn)/i, (res) => {
    res.send('Logger inn...');
    kolonialService.login((err, data) => {
      if (err) {
        res.send(
          'Det var dessverre problemer med å logge inn. Sjekk med Sindre at brukernavn og passord er korrekt',
        );
        return;
      }
      res.send(`Du er nå logget inn med ${data.user.first_name} ${data.user.last_name} sin bruker.`);
    });
  });

  bot.respond(/(logout|logg ut)/i, (res) => {
    res.send('Logger ut...');
    kolonialService.logout((err, data) => {
      if (err) {
        res.send('Klarte ikke logge ut akkurat nå. Prøv igjen senere');
        return;
      }
      res.send('Du er nå logget ut.');
    });
  });
};
