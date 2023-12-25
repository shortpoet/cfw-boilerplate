import colors from 'kleur'
import { Config } from '../types'
import { getToml, writeToml } from '../util'
import * as log from '../log'
import { merge } from '#/utils'

export async function assertTomlEnv(
  conf: Pick<Config, 'env' | 'wranglerFile' | 'appName' | 'debug' | 'envVars' | 'goLive'>
) {
  const { env, wranglerFile, appName, debug, envVars, goLive } = conf
  if (debug)
    console.log(
      colors.green(`\n[wrangle] [toml]`),
      colors.white(`Asserting toml env`),
      colors.magenta(`${conf.env}`),
      colors.yellow(` in \n${conf.wranglerFile}`)
    )
  let config = await getToml(conf.wranglerFile)
  if (!config) {
    throw new Error('no config')
  }
  if (debug) {
    log.print('green', `[toml] [config] config:`)
    console.log(config)
  }
  const defaultConfig = {
    name: appName,
    compatibility_date: '2023-11-21',
    node_compat: true,
    workers_dev: true,
    main: '../build/worker.mjs',
    site: {
      bucket: '../../ui/build/client'
      // entry_point: 'index.html',
      // include: ['dist/*'],
    },
    build: {
      command: env === 'dev' ? 'npm run build:d' : 'npm run build'
    },
    dev: {
      port: 3000,
      ip: envVars.HOST
      // hot: true,
      // watch: {
      //   ignore: ['node_modules/**/*'],
      // },
    }
  }
  config = merge(config, defaultConfig)
  // config = { ...defaultConfig, ...config };
  const defaultEnvConfig = {
    name: appName
    // route: `https://${appName}.workers.dev/*`,
  }
  if (!config['env']) config['env'] = {}
  if (!config['env'][`${env}`]) {
    log.print('green', `[toml] [config] Creating env:`)
    config['env'][`${env}`] = defaultEnvConfig
  }
  // config['env'][`${env}`] =
  //   env != 'dev' ? { ...defaultEnvConfig, ...config['env'][`${env}`] } : config['env'][`${env}`];
  if (config['vars']) config['env'][`${env}`]['vars'] = config['vars']
  // if (debug) console.log(config);
  if (goLive) await writeToml(config, { wranglerFile, debug, env })
}
