import { utils, write } from 'xlsx';

const sortData = <Type>(
  data: Type,
  header: string[],
  finaltext: { [key: string]: string }
) => {
  const sortedData = (data as { [key: string]: unknown }[]).map((item) => {
    const sortedItem: { [key: string]: unknown } = {};
    header.forEach((key) => {
      sortedItem[key] = item[key];
    });
    return sortedItem;
  });
  const titles = header.map((key) => finaltext[key]);
  return { sortedData, titles };
};

export { sortData };

const formExcelData = (array: unknown[], header: string[]) => {
  try {
    const ws = utils.json_to_sheet(array);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Data');
    utils.sheet_add_aoa(ws, [header], { origin: 'A1' });

    const buffer = write(wb, { type: 'array', bookType: 'xlsx' });

    const url = URL.createObjectURL(
      new Blob([buffer], { type: 'application/octet-stream' })
    );

    return url;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export default formExcelData;
