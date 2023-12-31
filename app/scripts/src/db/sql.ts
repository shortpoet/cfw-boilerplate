import { Config } from '../types'
import { executeWranglerCommand } from '../util'

export async function executeD1Sql(
  opts: Pick<Config, 'env' | 'debug' | 'wranglerFile' | 'goLive' | 'databaseName'>,
  file?: string,
  sql?: string
) {
  let cmd
  let base = `d1 execute`
  // if (opts.env === 'qa' || opts.env === 'dev') {
  //   base = `${base} --local`;
  // }
  if (sql) {
    cmd = `${base} ${opts.databaseName} --command "${sql}"`
  }
  if (file) {
    cmd = `${base} ${opts.databaseName} --file ${file}`
  }
  if (!cmd) {
    throw new Error('no d1 execute command')
  }
  const res = executeWranglerCommand(cmd, opts)
  if (!res) {
    throw new Error('no response')
  }
  if (res.includes('error')) {
    throw new Error(res)
  }
  console.log(res)
  return res
}
