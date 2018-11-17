/* eslint-disable import/prefer-default-export */
export const home = (bot) => {
  bot.hear(/(vann(e)?|plant(er)?)/i, (res) => {
    res.send(`Lurer du på hvordan du skal vanne plantene? :leaves:
    * Husfred (liten, små blader) skal ha masse vann. Vannes fra undersiden. Settes i skål/vasken med vann i ca. 5 minutter.
    * Kaktus skal ha lite vann. Gis litt vann når den er er helt tørr.
    * Eføy ved iMac skal ha vann en gang i uken ca. Bladene skal sprayes med vann ca. hver 3 uke. 
    * Stor plante i stativ ved tv skal ha vann ca. en gang i uken, eller når den er helt tørket ut Kan fint sprayes med vann på bladene av og til.
    * Plante under tak skal ha vann en gang i uken ca. Kan med fordel settes i vinduskarm og få litt lys av og til.
    * Plante ved kjøkkenvindu skal ha vann ca. en gang i uken, eller når den er tørr.
    
    Takk for at du vanner plantene :sunflower:`);
  });

  bot.hear(/egg/i, (res) => {
    res.send(`Slik koker du egg :egg: :smiley_cat:
    **Hardkokt**: Legg x antall egg i kaldt vann i kjelen, og sett på komfyren på høyeste varme.
    Når det koker trekker du kjelen av platen, tar på lokket og venter 11 minutter. Etter 11 minuttene lar du eggene kjøle seg i rennende kaldt vann.`);
  });
};
