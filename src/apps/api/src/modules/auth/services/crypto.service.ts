import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;
const SALT = 'salt';

@Injectable()
export class CryptoService {
  private readonly algorithm = ALGORITHM;
  private readonly ivLength = IV_LENGTH;
  private readonly tagLength = TAG_LENGTH;
  private readonly keyLength = KEY_LENGTH;
  private readonly salt = SALT;

  /**
   * Формирует ключ шифрования из CRYPTO_PASS и соли (scrypt).
   * @returns буфер ключа
   */
  private getKey(): Buffer {
    const pass = process.env.CRYPTO_PASS;
    if (!pass) {
      throw new InternalServerErrorException(
        'Encryption password is not set in environment variables',
      );
    }

    return crypto.scryptSync(pass, this.salt, this.keyLength);
  }

  /**
   * Шифрует строку AES-256-GCM, возвращает base64 (iv + tag + ciphertext).
   * @param text — строка для шифрования
   * @returns зашифрованная строка в base64
   */
  encrypt(text: string): string {
    const iv = crypto.randomBytes(this.ivLength);
    const key = this.getKey();
    const cipher = crypto.createCipheriv(this.algorithm, key, iv);

    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();

    const encryptedBuffer = Buffer.concat([iv, tag, encrypted]);

    return encryptedBuffer.toString('base64');
  }

  /**
   * Расшифровывает строку из base64, ожидает формат iv + tag + ciphertext.
   * @param data — зашифрованная строка в base64
   * @returns расшифрованная строка
   */
  decrypt(data: string): string {
    const bData = Buffer.from(data, 'base64');

    const iv = bData.subarray(0, this.ivLength);
    const tag = bData.subarray(this.ivLength, this.ivLength + this.tagLength);
    const encrypted = bData.subarray(this.ivLength + this.tagLength);

    const key = this.getKey();
    const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString('utf8');
  }
}
