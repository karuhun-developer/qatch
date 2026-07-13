import env from '#start/env'
import { defineConfig, services } from '@adonisjs/ally'

const allyConfig = defineConfig({
  github: services.github({
    clientId: env.get('GITHUB_CLIENT_ID') as string,
    clientSecret: env.get('GITHUB_CLIENT_SECRET') as string,
    callbackUrl: env.get('APP_URL') + '/auth/github/callback',
  }),
  google: services.google({
    clientId: env.get('GOOGLE_CLIENT_ID') as string,
    clientSecret: env.get('GOOGLE_CLIENT_SECRET') as string,
    callbackUrl: env.get('APP_URL') + '/auth/google/callback',
  }),
})

export default allyConfig

declare module '@adonisjs/ally/types' {
  interface SocialProviders extends InferSocialProviders<typeof allyConfig> {}
}
