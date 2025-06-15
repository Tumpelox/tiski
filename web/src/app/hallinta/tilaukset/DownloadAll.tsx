'use client';

import { downloadOrders } from '@/actions/order';
import { CloudButton } from '@/components/CloudButton';
import formExcelData from '@/services/formExcelData';

export const fieldOrder = [
  'numero',
  'nimi',
  'osoite',
  'puhelin',
  'paketteja',
  'lisätiedot',
];

export enum FieldOrder {
  'numero' = 'Numero',
  'nimi' = 'Nimi',
  'osoite' = 'Osoite',
  'puhelin' = 'Puhelin',
  'paketteja' = 'Paketteja',
  'lisätiedot' = 'Lisätiedot',
}

const DownloadAll = () => {
  const handleDownload = async () => {
    const orders = await downloadOrders();

    if (orders) {
      const excelData = formExcelData(orders, fieldOrder);

      if (excelData) {
        const a = document.createElement('a');
        a.href = excelData;
        a.download = 'orders.xlsx';
        a.click();
      }
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
