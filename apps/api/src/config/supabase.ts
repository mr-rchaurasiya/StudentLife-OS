// Supabase Cloud Connector
export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConfigured: boolean;
}

export const SUPABASE_CONFIG: SupabaseConfig = {
  url: process.env.SUPABASE_URL || 'https://mock-studentlife.supabase.co',
  anonKey: process.env.SUPABASE_ANON_KEY || 'mock-anon-key-studentlife',
  isConfigured: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY)
};

export const getSupabaseStatus = () => {
  return {
    configured: SUPABASE_CONFIG.isConfigured,
    url: SUPABASE_CONFIG.isConfigured ? SUPABASE_CONFIG.url : 'Using in-memory & local persistent storage engine'
  };
};
