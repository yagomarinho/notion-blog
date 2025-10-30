export default {
  gtm: {
    id: process.env.NEXT_PUBLIC_GTM_ID,
    consent: {
      cookieName: 'gtm_consent_status',
    },
  },
  api: {
    baseUrl: process.env.API_BASE_URL,
  },
}
