import { Test, TestingModule } from '@nestjs/testing';
import { EncryptService } from '../encrypt.service';
import * as bcryptjs from 'bcryptjs';
import { ConfigService } from '@nestjs/config';

jest.mock('bcryptjs', () => ({
  ...jest.requireActual('bcryptjs'),
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('Encrypt Service', () => {
  let encryptService: EncryptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService, EncryptService],
    }).compile();

    encryptService = module.get<EncryptService>(EncryptService);
  });
  describe('Encrypt', () => {
    it('Should encrypt a given string correctly', async () => {
      const textEncryptedMock = 'encrypted-mock';
      jest
        .spyOn(bcryptjs, 'hash')
        .mockResolvedValue(textEncryptedMock as never);

      const textToEncrypt = 'text-to-encrypt';
      const encryptedText = await encryptService.encrypt(textToEncrypt);

      expect(encryptedText).toEqual(textEncryptedMock);
      expect(bcryptjs.hash).toHaveBeenCalledWith(textToEncrypt, 10);
    });

    it("Should return 'true' if the text comparision is correct", async () => {
      jest.spyOn(bcryptjs, 'compare').mockResolvedValue(true as never);

      const text = 'text';
      const encryptedText = 'encrypted-text';

      const compareResult = await encryptService.compare(text, encryptedText);

      expect(compareResult).toEqual(true);
      expect(bcryptjs.compare).toHaveBeenCalledWith(text, encryptedText);
    });

    it("Should return 'true' if the text comparision is correct", async () => {
      jest.spyOn(bcryptjs, 'compare').mockResolvedValue(false as never);

      const text = 'text';
      const encryptedText = 'encrypted-text';

      const compareResult = await encryptService.compare(text, encryptedText);

      expect(compareResult).toEqual(false);
      expect(bcryptjs.compare).toHaveBeenCalledWith(text, encryptedText);
    });
  });
});
