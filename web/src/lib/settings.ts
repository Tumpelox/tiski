import { Settings, SettingsDatabase } from '@/interfaces/settings.interface';
import { listDocumentsWithApi } from '@/services/databases';

const getSettings = async () => {
  const settings = await listDocumentsWithApi<Settings>(
    SettingsDatabase.DatabaseId,
    SettingsDatabase.CollectionId
  );

  return settings.data?.[0] ?? null;
};

export default getSettings;
