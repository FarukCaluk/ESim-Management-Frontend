import api from '../../utils/api-client';
import { Collection } from '../../types/collection.types';

export const getCollections = async (): Promise<Collection[]> => {
  const res = await api.get('/collections');
  return res.data;
};
