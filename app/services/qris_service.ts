import { parseQRIS, parseTLV } from './qris/parser.js'
import { convertQRIS } from './qris/converter.js'
import { validateQRIS } from './qris/validator.js'
import { calculateCRC16 } from './qris/crc16.js'
import type { ConvertOptions, QRISData } from './qris/types.js'

export default class QrisService {
  /**
   * Parse a raw QRIS string into a structured data object.
   */
  parse(rawQris: string): QRISData {
    return parseQRIS(rawQris)
  }

  /**
   * Parse a raw TLV (Tag-Length-Value) string.
   */
  parseTLV(tlvString: string) {
    return parseTLV(tlvString)
  }

  /**
   * Convert an existing QRIS data into dynamic or static format.
   */
  convert(rawQris: string, options: ConvertOptions): string {
    return convertQRIS(rawQris, options)
  }

  /**
   * Validate if the given string is a valid QRIS code.
   */
  validate(rawQris: string) {
    return validateQRIS(rawQris)
  }

  /**
   * Calculate CRC16 checksum for a given payload.
   */
  calculateCRC(payload: string): string {
    return calculateCRC16(payload)
  }
}
