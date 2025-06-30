import * as sodium from 'libsodium-wrappers-sumo';
import { hash } from 'argon2-browser';

async function deriveKey(password: string, salt: Uint8Array): Promise<Uint8Array> {
  const { hash: key } = await hash({ pass: password, salt, type: 2 });
  return key; // Uint8Array 32 bytes
}

async function encryptMessage(key: Uint8Array, message: string) {
  await sodium.ready;
  const nonce = sodium.randombytes_buf(sodium.crypto_aead_xchacha20poly1305_ietf_NPUBBYTES);
  const cipher = sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(
    sodium.from_string(message),
    null,
    null,
    nonce,
    key
  );
  return { cipher, nonce };
}

async function decryptMessage(key: Uint8Array, nonce: Uint8Array, cipher: Uint8Array) {
  await sodium.ready;
  const plain = sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(
    null,
    cipher,
    null,
    nonce,
    key
  );
  return sodium.to_string(plain);
}

const passwordInput = document.querySelector<HTMLInputElement>('#password')!;
const textInput = document.querySelector<HTMLTextAreaElement>('#plaintext')!;
const output = document.querySelector<HTMLPreElement>('#output')!;
let currentCipher: Uint8Array | null = null;
let currentNonce: Uint8Array | null = null;

(document.getElementById('encrypt') as HTMLButtonElement).onclick = async () => {
  const password = passwordInput.value;
  const salt = sodium.randombytes_buf(16);
  const key = await deriveKey(password, salt);
  const { cipher, nonce } = await encryptMessage(key, textInput.value);
  currentCipher = cipher;
  currentNonce = nonce;
  output.textContent = `nonce:${sodium.to_base64(nonce)}\ncipher:${sodium.to_base64(cipher)}`;
};

(document.getElementById('decrypt') as HTMLButtonElement).onclick = async () => {
  if (!currentCipher || !currentNonce) return;
  const password = passwordInput.value;
  const salt = new Uint8Array(16); // In real use, store salt
  const key = await deriveKey(password, salt);
  try {
    const plain = await decryptMessage(key, currentNonce, currentCipher);
    output.textContent = `decrypted: ${plain}`;
  } catch (err) {
    output.textContent = 'Error al descifrar';
  }
};
