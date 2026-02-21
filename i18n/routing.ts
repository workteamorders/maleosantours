import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['id', 'en', 'zh', 'zh-CN'],
  defaultLocale: 'id',
});
