export const SITE = {
  title: 'Trustack Docs',
  description: 'Trustack docs.',
  defaultLanguage: 'en-us',
} as const;

export const KNOWN_LANGUAGES = {
  English: 'en',
  简体中文: 'zh-cn',
} as const;
export const KNOWN_LANGUAGE_CODES = Object.values(KNOWN_LANGUAGES);

export const GITHUB_EDIT_URL = `https://github.com/chain-web/trustack`;

// See "Algolia" section of the README for more information.
export const ALGOLIA = {
  indexName: 'docs',
  appId: '',
  apiKey: '',
};

export type Sidebar = Record<
  (typeof KNOWN_LANGUAGE_CODES)[number],
  Record<string, { text: string; link: string }[]>
>;

export const linkPrefix = 'trustack';

export const SIDEBAR: Sidebar = {
  en: {
    Nav: [
      { text: 'Introduction', link: `${linkPrefix}/en/intro/introduction` },
    ],
  },
  'zh-cn': {
    导航: [{ text: '导航', link: `${linkPrefix}/zh-cn/intro/introduction` }],
  },
};
