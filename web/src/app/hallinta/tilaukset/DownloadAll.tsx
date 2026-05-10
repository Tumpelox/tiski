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
  'osoiteTulostus',
];

export enum FieldOrder {
  'numero' = 'Tilaus',
  'nimi' = 'Nimi',
  'osoite' = 'Osoite',
  'kaupunki' = 'Kaupunki',
  'paketteja' = 'Paketteja',
  'lisätiedot' = 'Lisätiedot',
  'osoiteTulostus' = 'Osoitteen tulostus',
}

const DownloadAll = () => {
  const handleDownload = async () => {
    const orders = await downloadOrders();

    if (orders) {
      const book = utils.book_new();

      const tilaukset = utils.json_to_sheet(
        [
          FieldOrder,
          ...orders.tilaukset
            .sort(
              (a, b) =>
                orders.tilastot.kaupungit[b.kaupunki ?? 'Ei kaupunkia'] -
                orders.tilastot.kaupungit[a.kaupunki ?? 'Ei kaupunkia']
            )
            .map((order) => ({
              ...order,
              osoiteTulostus: order.nimi + '\n' + order.osoite,
            })),
        ],
        {
          header: fieldOrder,
          skipHeader: true,
        }
      );

      if (tilaukset['!ref']) {
        const range = utils.decode_range(tilaukset['!ref']);

        for (let R = range.s.r; R <= range.e.r; ++R) {
          const cellAddress = utils.encode_cell({ r: R, c: 6 });

          if (!tilaukset[cellAddress]) continue;

          tilaukset[cellAddress].s = {
            alignment: {
              wrapText: true,
              vertical: 'top',
            },
          };
        }
      }

      tilaukset['!cols'] = [
        { wch: 20 },
        { wch: 20 },
        { wch: 35 },
        { wch: 12 },
        { wch: 10 },
        { wch: 30 },
        { wch: 40 },
      ];

      const kaupungitHeader = Object.keys(orders.tilastot.kaupungit);
      const kaupungitData = Object.values(orders.tilastot.kaupungit);

      const pakettejaHeader = Object.keys(orders.tilastot.paketteja);
      const pakettejaData = Object.values(orders.tilastot.paketteja);

      const kaupungit = utils.aoa_to_sheet([
        ['Kaupunki', ...kaupungitHeader],
        ['Tilauksia', ...kaupungitData],
      ]);

      kaupungit['!cols'] = [{ wch: 10 }];

      const paketit = utils.aoa_to_sheet([
        ['Pakettia per tilaus', ...pakettejaHeader],
        ['kpl', ...pakettejaData],
      ]);

      paketit['!cols'] = [{ wch: 20 }];

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
