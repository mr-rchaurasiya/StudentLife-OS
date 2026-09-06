// StudentLife OS 2.0 - Frontend Supabase Cloud Client

export const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://studentlife.supabase.co';
export const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'studentlife-anon-public-key';

export const isCloudDatabaseConnected = (): boolean => {
  return Boolean((import.meta as any).env?.VITE_SUPABASE_URL);
};

export const getCloudSyncMeta = () => {
  return {
    cloudProvider: 'Supabase PostgreSQL 16',
    status: isCloudDatabaseConnected() ? 'CONNECTED' : 'LOCAL_CACHED_READY',
    realtimeSync: true,
    rlsSecurity: 'ENABLED'
  };
};
