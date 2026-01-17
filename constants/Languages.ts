export const SUPPORTED_LANGUAGES = [
  { code: 'en-US', label: 'English (US)' },
  { code: 'en-GB', label: 'English (UK)' },
  { code: 'zh-Hans', label: '简体中文' },
  { code: 'zh-Hant', label: '繁體中文' },
  { code: 'es', label: 'Español' },
  { code: 'de', label: 'Deutsch' },
  { code: 'fr', label: 'Français' },
  { code: 'pt', label: 'Português' },
  { code: 'tr', label: 'Türkçe' },
  { code: 'th', label: 'ไทย' },
  { code: 'ko', label: '한국어' },
  { code: 'ja', label: '日本語' },
];

export const REGION_TO_LANGUAGE: Record<string, string> = {
  'US': 'en-US',
  'GB': 'en-GB',
  'CN': 'zh-Hans',
  'TW': 'zh-Hant', 'HK': 'zh-Hant',
  'ES': 'es', 'MX': 'es', // and others
  'DE': 'de',
  'FR': 'fr',
  'PT': 'pt', 'BR': 'pt',
  'TR': 'tr',
  'TH': 'th',
  'KR': 'ko',
  'JP': 'ja',
};

// Helper to determine language from Country Code
export const getLanguageFromRegion = (regionCode: string | null | undefined): string => {
  if (!regionCode) return 'en-US';
  return REGION_TO_LANGUAGE[regionCode] || 'en-US';
};
