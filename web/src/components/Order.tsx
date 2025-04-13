'use client';

const Order = () => {
  // Tässä komponentissa käyttäjä tekee tilauksen.
  // Tuotteet haetaan local storagesta ja
  // tilatessa tuotteet poistetaan sieltä ja
  // tilauksen tiedot yhteystietoineen lähetetään server actionin avulla palvelimelle.

  return (
    <ul>
      <li>Renderöidään clientillä</li>
      <li>Tilauksen tuotteet</li>
      <li>Käytettävä tilauskoodi</li>
      <li>Postitustietojen syöttö</li>
    </ul>
  );
};

export default Order;
