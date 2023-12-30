export {
  generateSalt,
  hashPassword,
  generateKeyPair,
  signData,
  verifySignature
  // encrypt,
  // decrypt,
  // signCookie,
  // verifyCookie,
  // unsignCookie
}

async function hashPassword(password: string, salt: string): Promise<string> {
  const utf8 = new TextEncoder().encode(`${salt}:${password}`)

  const hashBuffer = await crypto.subtle.digest({ name: 'SHA-256' }, utf8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((bytes) => bytes.toString(16).padStart(2, '0')).join('')
}

async function generateSalt(): Promise<string> {
  const randomBuffer = new Uint8Array(32)
  crypto.getRandomValues(randomBuffer)
  return Array.from(randomBuffer)
    .map((bytes) => bytes.toString(16).padStart(2, '0'))
    .join('')
}

// async function generateKeyPair(
//   hash: 'SHA-256' | 'SHA-384' | 'SHA-512' = 'SHA-256'
// ): Promise<CryptoKeyPair> {
//   return crypto.subtle.generateKey(
//     {
//       name: 'RSA-OAEP',
//       modulusLength: 4096,
//       publicExponent: new Uint8Array([1, 0, 1]),
//       hash
//     },
//     true,
//     ['encrypt', 'decrypt']
//   )
// }

// You need to use an algorithm that supports signing. Here's an example using ECDSA with P-256.
const isRsa = false
const getAlgo = (hash: 'SHA-256' | 'SHA-384' | 'SHA-512' = 'SHA-256') =>
  isRsa
    ? {
        name: 'RSA-OAEP',
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash
      }
    : {
        name: 'ECDSA',
        namedCurve: 'P-256',
        hash
      }

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

async function generateKeyPair(): Promise<CryptoKeyPair> {
  try {
    const algo = getAlgo()
    console.log(`[crypto] [generateKeyPair] [algo] -> `, algo)
    const keyPair = await crypto.subtle.generateKey(algo, true, ['sign', 'verify'])
    return keyPair
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`Key generation failed: ${msg}`)
  }
}

async function signData(privateKey: CryptoKey, data: string): Promise<ArrayBuffer> {
  try {
    const algo = getAlgo()
    console.log(`[crypto] [generateKeyPair] [algo] -> `, algo)
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
    const verified = await crypto.subtle.verify(getAlgo(), publicKey, signature, str2ab(data))
    return verified
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`Signature verification failed: ${msg}`)
  }
}

async function signAndVerifyDemo(value: string): Promise<string> {
  try {
    const keyPair = await generateKeyPair()
    const signature = await signData(keyPair.privateKey, value)

    const isValid = await verifySignature(keyPair.publicKey, signature, value)

    if (isValid) {
      console.log('Signature is valid!')
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
console.log(`^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^`)
signAndVerifyDemo('session_cookie_value')
  .then((originalValue) => {
    console.log('Original value:', originalValue)
  })
  .catch((error) => {
    console.error(error)
  })
console.log(`[crypto] [TEST]`)
const secretKey = 'mySecretKeyForSigning'
const cookieValue = 'user123'

// Sign a cookie value
const keyPair = await generateKeyPair()
const signature = await signData(keyPair.privateKey, cookieValue)
const isValid = await verifySignature(keyPair.publicKey, signature, cookieValue)

// Verify a signed cookie
if (isValid) {
  console.log('Cookie is verified.')
  console.log(`[crypto] [TEST] [isValid] -> `, isValid)
  console.log(`[crypto] [TEST] [keyPair] -> `, keyPair)
  console.log(`[crypto] [TEST] [cookieValue] -> `, cookieValue)
  console.log(`[crypto] [TEST] [signature] -> `, signature)
} else {
  console.log('Cookie verification failed.')
}

console.log(`^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^`)

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
