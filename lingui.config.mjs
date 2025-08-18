import { defineConfig } from '@lingui/cli'

export default defineConfig({
  locales: ['en', 'zh-CN'],
  sourceLocale: 'en',
  catalogs: [
    {
      path: '<rootDir>/src/locales/{locale}/messages',
      include: ['src'],
    },
  ],
  format: 'po',
})