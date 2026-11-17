import { resolve } from 'node:path'
import { generateApi } from 'swagger-typescript-api'

await generateApi({
  name: 'Api.ts',
  output: resolve('src/shared/api'),
  url: 'http://localhost:3000/api-json',
  httpClientType: 'axios',
  hooks: {
    onPreBuildRoutePath: (routePath) =>
      routePath.replace(/^\/api(?=\/)/, ''),
  },
})
