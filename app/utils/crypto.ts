export {
  generateSalt,
  hashPassword,
  signPassword,
  verifyPassword,
  getBearer,
  generateKeyPair,
  signData,
  verifySignature,
  exportKey,
  importKey,
  arrayBufferToBase64,
  base64ToArrayBuffer
}

import { generateRandomString } from 'lucia/utils'

async function generateSalt(): Promise<string> {
  const randomBuffer = new Uint8Array(32)
  crypto.getRandomValues(randomBuffer)
  return Array.from(randomBuffer)
    .map((bytes) => bytes.toString(16).padStart(2, '0'))
    .join('')
}

async function hashPassword(password: string, salt?: string): Promise<string> {
  salt = salt || (await generateSalt())
  const utf8 = new TextEncoder().encode(`${salt}:${password}`)

  const hashBuffer = await crypto.subtle.digest({ name: 'SHA-256' }, utf8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((bytes) => bytes.toString(16).padStart(2, '0')).join('')
}

async function signPassword(key: string, rawPassword: string, salt?: string): Promise<string> {
  salt = salt || (await generateSalt())
  const encoder = new TextEncoder()
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(key),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign(
    'HMAC',
    cryptoKey,
    encoder.encode(`${salt}/${rawPassword}`)
  )

  // Taken from https://bradyjoslin.com/blog/hmac-sig-webcrypto/
  return btoa(String.fromCharCode(...new Uint8Array(signature)))
}

function getBearer(request: Request): null | string {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader || authHeader.substring(0, 6) !== 'Bearer') {
    return null
  }
  return authHeader.substring(6).trim()
}

async function verifyPassword(
  key: string,
  rawPassword: string,
  signedPassword: string,
  salt?: string
): Promise<boolean> {
  salt = salt || (await generateSalt())
  const encoder = new TextEncoder()
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(key),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  )
  // Taken from https://bradyjoslin.com/blog/hmac-sig-webcrypto/
  const sigBuf = Uint8Array.from(atob(signedPassword), (c) => c.charCodeAt(0))

  return await crypto.subtle.verify(
    'HMAC',
    cryptoKey,
    sigBuf,
    encoder.encode(`${salt}/${rawPassword}`)
  )
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const byteArray = new Uint8Array(buffer)
  let binaryString = ''
  for (const byte of byteArray) {
    binaryString += String.fromCharCode(byte)
  }
  return btoa(binaryString) // Use btoa for base64 encoding
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64) // Use atob for base64 decoding
  const byteArray = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    byteArray[i] = binaryString.charCodeAt(i)
  }
  return byteArray.buffer
}

// You need to use an algorithm that supports signing. Here's an example using ECDSA with P-256.
type AlgoType = 'rsa' | 'ecdsa' | 'hmac'
type KeyPairAlgoType = 'rsa' | 'ecdsa'

const getAlgo = (algo: AlgoType, hashName = 'SHA-256') => {
  switch (algo) {
    case 'rsa':
      return {
        name: 'RSASSA-PKCS1-v1_5',
        modulusLength: 2048,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // Equivalent to 65537
        hash: { name: hashName }
      }
    case 'ecdsa':
      return {
        name: 'ECDSA',
        namedCurve: 'P-256', // This curve is associated with SHA-256
        hash: { name: hashName } // Specify hash for signing/verifying
      }
    case 'hmac':
      return {
        name: 'HMAC',
        hash: { name: hashName }
      }
    default:
      throw new Error(`[crypto] [g] [algo] -> Unknown algorithm: ${algo}`)
  }
}

type Algo = ReturnType<typeof getAlgo>

function ab2str(buf: ArrayBuffer): string {
  const bufView = new Uint8Array(buf)
  const chars: number[] = []
  bufView.forEach((byte) => {
    chars.push(byte)
  })
  return String.fromCharCode.apply(null, chars)
}

function str2ab(str: string): ArrayBuffer {
  const buf = new ArrayBuffer(str.length)
  const bufView = new Uint8Array(buf)
  for (let i = 0; i < str.length; i++) {
    bufView[i] = str.charCodeAt(i)
  }
  return buf
}
function generateKeyPair(algoType: 'ecdsa', hashName?: string): Promise<CryptoKeyPair>
function generateKeyPair(algoType: 'rsa', hashName?: string): Promise<CryptoKeyPair>
async function generateKeyPair(algoType = 'ecdsa' as KeyPairAlgoType, hashName = 'SHA-256') {
  try {
    const algo = getAlgo(algoType, hashName)
    // console.log(`[crypto] [generateKeyPair] [algo] -> `, algo)
    const usage: KeyUsage[] = ['sign', 'verify']
    const extractable = true
    const keyPair = await crypto.subtle.generateKey(algo, extractable, usage)
    return keyPair
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`Key generation failed: ${msg}`)
  }
}

async function signData(privateKey: CryptoKey, data: string): Promise<ArrayBuffer> {
  try {
    const isRsa = privateKey.algorithm.name === 'RSASSA-PKCS1-v1_5'
    const algo = getAlgo(isRsa ? 'rsa' : 'ecdsa')
    // Hashing is implied in the algorithm for ECDSA. For RSA, we need to provide it.
    if (isRsa) {
      // This tells TypeScript that privateKey.algorithm is RsaHashedKeyAlgorithm, which has the hash property
      algo.hash = (privateKey.algorithm as RsaHashedKeyAlgorithm).hash
    }
    // console.log(`[crypto] [signData] [algo] -> `, algo)
    const signature = await crypto.subtle.sign(algo, privateKey, str2ab(data))
    return signature
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`Signing failed: ${msg}`)
  }
}

async function verifySignature(
  publicKey: CryptoKey,
  signature: ArrayBuffer,
  data: string
): Promise<boolean> {
  try {
    const isRsa = publicKey.algorithm.name === 'RSASSA-PKCS1-v1_5'
    const algo = getAlgo(isRsa ? 'rsa' : 'ecdsa')
    // Hashing is implied in the algorithm for ECDSA. For RSA, we need to provide it.
    if (isRsa) {
      // This tells TypeScript that privateKey.algorithm is RsaHashedKeyAlgorithm, which has the hash property
      algo.hash = (publicKey.algorithm as RsaHashedKeyAlgorithm).hash
    }
    // console.log(`[crypto] [signData] [verifySignature] -> `, algo)

    const verified = await crypto.subtle.verify(algo, publicKey, signature, str2ab(data))
    return verified
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`Signature verification failed: ${msg}`)
  }
}

async function exportKey(
  key: CryptoKey,
  isRsa: boolean,
  keyType: 'public' | 'private'
): Promise<ArrayBuffer> {
  if (!key.extractable) {
    throw new Error('Key is not extractable')
  }

  // Determine the key format based on the key type
  const format = keyType === 'public' ? 'spki' : 'pkcs8'

  // Export the key
  try {
    const exportedKey = await crypto.subtle.exportKey(format, key)
    return exportedKey
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`Key export failed: ${msg}`)
  }
}

async function importKey(
  base64Key: string,
  isRsa: boolean,
  keyType: 'public' | 'private',
  hashName: 'SHA-256' | 'SHA-384' | 'SHA-512' = 'SHA-256'
): Promise<CryptoKey> {
  // Convert the Base64 string back to an ArrayBuffer
  const keyBuffer = base64ToArrayBuffer(base64Key)
  const isPrivateKey = keyType === 'private'

  // Define the import algorithm based on the key type
  const algo = getAlgo(isRsa ? 'rsa' : 'ecdsa', hashName)

  // Define the format and the usage for the key being imported
  const format = isPrivateKey ? 'pkcs8' : 'spki'
  const usage: KeyUsage[] = isPrivateKey
    ? ['sign'] // Private keys are typically used for signing
    : ['verify'] // Public keys are typically used for verifying signatures

  // Import the key
  const cryptoKey = await crypto.subtle.importKey(
    format,
    keyBuffer,
    algo,
    true, // Set extractable to true if you expect to export the key again
    usage
  )
  return cryptoKey
}

async function signAndVerifyDemo(value: string): Promise<string> {
  try {
    const keyPair = await generateKeyPair('ecdsa')
    const signature = await signData(keyPair.privateKey, value)
    const signedData = arrayBufferToBase64(signature)

    const isValid = await verifySignature(keyPair.publicKey, signature, value)

    console.log(`[crypto] [signAndVerifyDemo] [isValid] -> `, isValid)

    const exportedPublicKeyBuffer = await exportKey(keyPair.publicKey, false, 'public')
    const exportedPrivateKeyBuffer = await exportKey(keyPair.privateKey, false, 'private')
    const exportedPublicKey = arrayBufferToBase64(exportedPublicKeyBuffer)
    const exportedPrivateKey = arrayBufferToBase64(exportedPrivateKeyBuffer)
    console.log(`[crypto] [signAndVerifyDemo] [exportedPublicKey] -> `, exportedPublicKey)
    console.log(`[crypto] [signAndVerifyDemo] [exportedPrivateKey] -> `, exportedPrivateKey)

    const isRsa = keyPair.privateKey.algorithm.name === 'RSASSA-PKCS1-v1_5'
    const importedPublicKey = await importKey(exportedPublicKey, isRsa, 'public')
    const importedPrivateKey = await importKey(exportedPrivateKey, isRsa, 'private')

    console.log(`[crypto] [signAndVerifyDemo] [importedPublicKey] -> `, importedPublicKey)
    console.log(`[crypto] [signAndVerifyDemo] [importedPrivateKey] -> `, importedPrivateKey)

    const newSignature = await signData(importedPrivateKey, value)

    const isValid2 = await verifySignature(importedPublicKey, newSignature, value)
    console.log(`[crypto] [signAndVerifyDemo] [isValid2] -> `, isValid2)

    const password = 'P@ssw0rd'
    const generated = await signPassword('SuperSecret', password)
    console.log(`[crypto] [signAndVerifyDemo] [generated] -> `, generated)
    const isValidGenerated = await verifyPassword('SuperSecret', password, generated)
    console.log(`[crypto] [signAndVerifyDemo] [isValidGenerated] -> `, isValidGenerated)

    if (isValid && isValid2) {
      console.log('Signatures are valid!')
      return value
    } else {
      throw new Error('Signature verification failed!')
    }
  } catch (e) {
    console.error('Error during signing and verification:', e)
    throw e
  }
}

// Example usage:
const testMe = async () => {
  console.log(`^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^`)
  const rando = generateRandomString(40)
  console.log(`[crypto] [TEST] [rando] -> `, rando)
  signAndVerifyDemo(rando)
    .then(async (originalValue) => {
      console.log('Original value:', originalValue)
      const secretKey = 'mySecretKeyForSigning'
      const cookieValue = 'user123'
      const keyPair = await generateKeyPair('ecdsa')
      const signature = await signData(keyPair.privateKey, cookieValue)
      const isValid3 = await verifySignature(keyPair.publicKey, signature, cookieValue)
      if (isValid3) {
        console.log('[crypto] [TEST] [isValid3] Cookie is verified.')
        console.log(`[crypto] [TEST] [isValid3] -> `, isValid3)
        console.log(`[crypto] [TEST] [keyPair] -> `, keyPair)
        console.log(`[crypto] [TEST] [cookieValue] -> `, cookieValue)
        console.log(`[crypto] [TEST] [signature] -> `, signature)
      } else {
        console.log('Cookie verification failed.')
      }
    })
    .catch((error) => {
      console.error(error)
    })

  console.log(`^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^`)
}

;(() => testMe())()

/* 
// Usage
const password = 'userPassword';
const salt = await generateSalt();
const hashedPassword = await hashPassword(password, salt);
// Store `hashedPassword` and `salt` securely in your database

// Retrieve `hashedPassword` and `salt` from the database for a user
const enteredPassword = 'userEnteredPassword';
const isPasswordCorrect = await hashPassword(enteredPassword, salt) === hashedPassword;
// Compare `isPasswordCorrect` to authenticate the user

const keyPair = await generateKeyPair();
const encrypted = await encrypt(keyPair.publicKey, 'Hello World!');
const decrypted = await decrypt(keyPair.privateKey, encrypted.iv, encrypted.data);
console.log(decrypted.data); // Hello World!

const keyPair = await generateKeyPair('SHA-256');
// Store the `keyPair` securely for future encryption/decryption

// Encryption
const publicKey = keyPair.publicKey;
const dataToEncrypt = 'sensitiveData';
const encryptedData = await encrypt(publicKey, dataToEncrypt);
// Store `encryptedData.iv` and `encryptedData.data` securely

// Decryption
const privateKey = keyPair.privateKey;
const decryptedData = await decrypt(privateKey, encryptedData.iv, encryptedData.data);
// `decryptedData.data` will contain the decrypted information


// Example usage
const secretKey = 'mySecretKeyForSigning';
const cookieValue = 'user123';

// Sign a cookie value
const signedCookie = await signCookie(secretKey, cookieValue);
console.log('Signed Cookie:', signedCookie);

// Verify a signed cookie
const isVerified = await verifyCookie(secretKey, signedCookie, cookieValue);
if (isVerified) {
  console.log('Cookie is verified.');
} else {
  console.log('Cookie verification failed.');
}

// Example usage
const secretKey = 'mySecretKeyForSigning';
const cookieValue = 'user123';

*/
