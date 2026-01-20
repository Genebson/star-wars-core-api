import { Injectable } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import { IEncryptService } from './interface/encrypt.service.interface';

@Injectable()
export class EncryptService implements IEncryptService {
  async encrypt(value: string): Promise<string> {
    const rounds = 10;
    return await bcryptjs.hash(value, rounds);
  }

  async compare(value: string, encryptedValue: string): Promise<boolean> {
    return await bcryptjs.compare(value, encryptedValue);
  }
}
