import { importKey, arrayBufferToBase64, signData } from '#/utils'
import { generateRandomString } from 'lucia/utils'

export const withCrypto = () => async (req: Request, res: Response, env: Env) => {
  req.logger.info(`[api] [middlware] [withCrypto] ->`)
  console.log(`[api] [middlware] [withCrypto] ->`)
  const isRsa = false
  const privateKey = env.PRIVATE_KEY

  res.cryptoSign = async (data: string) => {
    // console.log(`[api] [auth] [getSessionId] [password] -> privateKey:`)
    // console.log(privateKey)
    // const decodedKeyCheck = base64ToArrayBuffer(privateKey)
    // console.log(`[api] [auth] [getSessionId] [password] -> decodedKeyCheck:`)
    // console.log(decodedKeyCheck)
    const importedPrivateKey = await importKey(privateKey, isRsa, 'private')
    // console.log(`[api] [auth] [getSessionId] [password] -> rando:`)
    // console.log(rando)
    const signed = arrayBufferToBase64(await signData(importedPrivateKey, data))
    // console.log(`[api] [auth] [getSessionId] [password] -> sessionId:`)
    // console.log(sessionId)
    // const urlEncodedSessionId = encodeURIComponent(sessionId)
    // console.log(`[api] [auth] [getSessionId] [password] -> urlEncodedSessionId:`)
    // console.log(urlEncodedSessionId)
    return signed
  }
  // res.cryptoVerify = async (data: string, signature: string) {
  //   const importedPrivateKey = await importKey(privateKey, isRsa, 'private')
  //   const signed = arrayBufferToBase64(await signData(importedPrivateKey, data))
  //   return signed
  // }
}
