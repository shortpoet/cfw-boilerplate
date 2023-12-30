export {
  generateSalt,
  hashPassword,
  generateKeyPair,
  encrypt,
  decrypt,
  signCookie,
  verifyCookie,
  unsignCookie
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

async function generateKeyPair(
  hash: 'SHA-256' | 'SHA-384' | 'SHA-512' = 'SHA-256'
): Promise<CryptoKeyPair> {
  return crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash
    },
    true,
    ['encrypt', 'decrypt']
  )
}

async function encrypt(publicKey: CryptoKey, data: string): Promise<{ iv: string; data: string }> {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encoded = new TextEncoder().encode(data)
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, publicKey, encoded)
  return {
    iv: Array.from(iv)
      .map((bytes) => bytes.toString(16).padStart(2, '0'))
      .join(''),
    data: Array.from(new Uint8Array(encrypted))
      .map((bytes) => bytes.toString(16).padStart(2, '0'))
      .join('')
  }
}

async function decrypt(
  privateKey: CryptoKey,
  iv: string,
  data: string
): Promise<{ iv: string; data: string }> {
  const ivArray = new Uint8Array(iv.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)))
  const dataArray = new Uint8Array(data.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)))
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: ivArray },
    privateKey,
    dataArray
  )
  const decoded = new TextDecoder().decode(decrypted)
  return {
    iv,
    data: decoded
  }
}

async function signCookie(value: string, secretKey: string): Promise<string> {
  const keyBuffer = new TextEncoder().encode(secretKey)
  const dataBuffer = new TextEncoder().encode(value)
  const key = await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'HMAC', hash: { name: 'SHA-256' } },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, dataBuffer)

  // const signatureArray = new Uint8Array(signature);
  // return Array.from(signatureArray, byte => ('0' + (byte & 0xFF).toString(16)).slice(-2)).join('');

  // const signatureArray = Array.from(new Uint8Array(signature))
  // return signatureHex = signatureArray.map((b) => b.toString(16).padStart(2, '0')).join('')

  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

async function unsignCookie(value: string, secretKey: string): Promise<string | null> {
  try {
    const keyBuffer = new TextEncoder().encode(secretKey)
    const signatureBytes = value.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
    const signature = new Uint8Array(signatureBytes)

    const key = await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'HMAC', hash: { name: 'SHA-256' } },
      false,
      ['verify']
    )

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signature,
      new TextEncoder().encode(value)
    )
    if (!isValid) {
      throw new Error('Cookie verification failed.')
    }

    // Extracting the original value
    const originalValue = value.substring(64) // Assuming the signature is 64 characters long
    return originalValue
  } catch (error) {
    console.error('Unsigning cookie failed:', error)
    return null
  }
}

// Function to verify a signed cookie
async function verifyCookie(
  secretKey: string,
  signedValue: string,
  originalValue: string
): Promise<boolean> {
  const keyBuffer = new TextEncoder().encode(secretKey)
  const dataBuffer = new TextEncoder().encode(originalValue)
  const key = await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'HMAC', hash: { name: 'SHA-256' } },
    false,
    ['verify']
  )

  // const signature = await crypto.subtle.sign('HMAC', importedKey, data)
  // const signatureArray = Array.from(new Uint8Array(signature))
  // const signatureHex = signatureArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  // return signatureHex === signedValue

  const signature = new Uint8Array(signedValue.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)))
  const result = await crypto.subtle.verify('HMAC', key, signature, dataBuffer)
  return result
}

console.log(`^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^`)
console.log(`[crypto] [TEST]`)
const secretKey = 'mySecretKeyForSigning'
const cookieValue = 'user123'

// Sign a cookie value
const signedCookie = await signCookie(secretKey, cookieValue)
console.log('Signed Cookie:', signedCookie)
const unsignedCookie = await unsignCookie(signedCookie, secretKey)
console.log('Unsigned Cookie:', unsignedCookie)

// Verify a signed cookie
const isVerified = await verifyCookie(secretKey, signedCookie, cookieValue)
if (isVerified) {
  console.log('Cookie is verified.')
  console.log(`[crypto] [TEST] [isVerified] -> `, isVerified)
  console.log(`[crypto] [TEST] [signedCookie] -> `, signedCookie)
  console.log(`[crypto] [TEST] [unsignedCookie] -> `, unsignedCookie)
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
