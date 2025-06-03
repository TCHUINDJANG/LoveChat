// src/common/qr-code.generator.ts
import * as QRCode from 'qrcode';

export class QrCodeGenerator {
  static async generateQR(data: string): Promise<string> {
    // Génère une image base64
    return await QRCode.toDataURL(data);
  }
}
