export enum Language {
  'en' = 'en',
  'ms' = 'ms',
  'zh-cn' = 'zh-cn',
}

export const LOCALIZATION = [
  {
    id: 1,
    title: 'English',
    code: 'en',
  },
  {
    id: 2,
    title: 'Malay',
    code: 'ms',
  },
  {
    id: 3,
    title: 'Chinese',
    code: 'zh-cn',
  },
];

export function extractValue<T extends object, U extends keyof T>(
  obj: T,
  key: U,
) {
  return obj[key];
}
