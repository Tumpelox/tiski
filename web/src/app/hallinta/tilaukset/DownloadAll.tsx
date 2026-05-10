'use client';

import { downloadOrders } from '@/actions/order';
import { CloudButton } from '@/components/CloudButton';
import { utils, write } from 'xlsx';

export const fieldOrder = [
  'numero',
  'nimi',
  'osoite',
  'kaupunki',
  'paketteja',
  'lisätiedot',
];

export enum FieldOrder {
  'numero' = 'Tilaus',
  'nimi' = 'Nimi',
  'osoite' = 'Osoite',
  'kaupunki' = 'Kaupunki',
  'paketteja' = 'Paketteja',
  'lisätiedot' = 'Lisätiedot',
}

const DownloadAll = () => {
  const handleDownload = async () => {
    const orders = await downloadOrders();

    if (orders) {
      const book = utils.book_new();

      const tilaukset = utils.json_to_sheet(
        [
          FieldOrder,
          ...orders.tilaukset.sort(
            (a, b) =>
              orders.tilastot.kaupungit[b.kaupunki ?? 'Ei kaupunkia'] -
              orders.tilastot.kaupungit[a.kaupunki ?? 'Ei kaupunkia']
          ),
        ],
        {
          header: fieldOrder,
          skipHeader: true,
        }
      );

      const kaupungitHeader = Object.keys(orders.tilastot.kaupungit);
      const kaupungitData = Object.values(orders.tilastot.kaupungit);

      const pakettejaHeader = Object.keys(orders.tilastot.paketteja);
      const pakettejaData = Object.values(orders.tilastot.paketteja);

      const kaupungit = utils.aoa_to_sheet([
        ['Kaupunki', ...kaupungitHeader],
        ['Tilauksia', ...kaupungitData],
      ]);

      const paketit = utils.aoa_to_sheet([
        ['Pakettia per tilaus', ...pakettejaHeader],
        ['kpl', ...pakettejaData],
      ]);

      utils.book_append_sheet(book, tilaukset, 'Tilaukset');

      utils.book_append_sheet(book, kaupungit, 'Kaupungit');

      utils.book_append_sheet(book, paketit, 'Paketteja');

      const buffer = write(book, { type: 'array', bookType: 'xlsx' });

      const url = URL.createObjectURL(
        new Blob([buffer], { type: 'application/octet-stream' })
      );

      const a = document.createElement('a');
      a.href = url;
      a.download = 'orders.xlsx';
      a.click();
    }
  };

  return (
    <div className="mt-4">
      <CloudButton onClick={handleDownload}>
        Lataa tilaukset Excelinä
      </CloudButton>
    </div>
  );
};

export default DownloadAll;
