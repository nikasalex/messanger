import * as crypto from 'crypto';

export class HashAndVerify {
  async Hash(string: string, salt: string): Promise<string> {
    const saltInUse: string = salt || crypto.randomBytes(16).toString('hex');

    return new Promise((res, rej) => {
      crypto.scrypt(string, saltInUse, 32, (err, hash) => {
        if (err) {
          return rej(err);
        }
        res(`${hash.toString('hex')}:${saltInUse}`);
      });
    });
  }

  async Verify(testString: string, hashAndSalt: string) {
    const [, salt] = hashAndSalt.split(':');
    return (await this.Hash(testString, salt)) === hashAndSalt;
  }
}
