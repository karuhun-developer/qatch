import env from '#start/env'

const paywuzConfig = {
  apiKey: env.get('PAYWUZ_API_KEY') as string,
}

export default paywuzConfig
