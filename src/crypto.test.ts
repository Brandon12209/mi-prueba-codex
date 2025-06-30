import { describe, it, expect } from 'vitest';
import * as sodium from 'libsodium-wrappers-sumo';

function encrypt(plain: string, key: Uint8Array, nonce: Uint8Array) {
  return sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(
    sodium.from_string(plain),
    null,
    null,
    nonce,
    key
  );
}

describe('crypto', () => {
  it('encrypts and decrypts', async () => {
    await sodium.ready;
    const key = sodium.randombytes_buf(32);
    const nonce = sodium.randombytes_buf(sodium.crypto_aead_xchacha20poly1305_ietf_NPUBBYTES);
    const cipher = encrypt('hello', key, nonce);
    const plain = sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(null, cipher, null, nonce, key);
    expect(sodium.to_string(plain)).toBe('hello');
  });
});
