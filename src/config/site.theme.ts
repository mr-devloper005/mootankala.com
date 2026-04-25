import { defineSiteTheme } from '@/config/site.theme.defaults'

export const SITE_THEME = defineSiteTheme({
  shell: 'studio',
  hero: {
    variant: 'catalog-promo',
    eyebrow: 'PDF + Social Profile Platform',
  },
  home: {
    layout: 'studio-showcase',
    primaryTask: 'pdf',
    featuredTaskKeys: ['pdf', 'profile', 'article'],
  },
  navigation: {
    variant: 'minimal',
  },
  footer: {
    variant: 'columns',
  },
  cards: {
    listing: 'catalog-grid',
    article: 'editorial-feature',
    image: 'catalog-grid',
    profile: 'studio-panel',
    classified: 'catalog-grid',
    pdf: 'catalog-grid',
    sbm: 'studio-panel',
    social: 'studio-panel',
    org: 'catalog-grid',
    comment: 'editorial-feature',
  },
})
