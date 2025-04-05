import { 
  encodeContentHash, 
  detectCIDVersion, 
  simpleEncodeIPFS 
} from './cidEncode';

describe('IPFS CID to ENS Content Hash', () => {
  // テスト用のCID
  const cidv0 = 'QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB';
  const cidv1 = 'bafybeihkoviema7g3gxyt6la7v4mbgn2wh5qoxmkvqmv7k7n7qlomg4elu';

  describe('detectCIDVersion', () => {
    it('should detect CIDv0 correctly', () => {
      expect(detectCIDVersion(cidv0)).toBe('v0');
    });

    it('should detect CIDv1 correctly', () => {
      expect(detectCIDVersion(cidv1)).toBe('v1');
    });

    it('should return unknown for invalid CID', () => {
      expect(detectCIDVersion('')).toBe('unknown');
      expect(detectCIDVersion('invalid')).toBe('unknown');
    });
  });

  describe('encodeContentHash', () => {
    it('should return 0x for empty input', () => {
      expect(encodeContentHash('')).toBe('0x');
    });

    it('should encode CIDv0 with proper prefix', () => {
      const result = encodeContentHash(cidv0);
      // 0xe3 (IPFS) + 01 (CID version) + 01 (version code) + 70 (dag-pb) + 1220 (sha2-256 + length)
      expect(result.startsWith('0xe30101701220')).toBe(true);
    });

    it('should encode CIDv1 with IPFS protocol prefix', () => {
      const result = encodeContentHash(cidv1);
      // 0xe3 (IPFS) + 01 (CID version)
      expect(result.startsWith('0xe301')).toBe(true);
    });
  });

  describe('simpleEncodeIPFS', () => {
    it('should return 0x for empty input', () => {
      expect(simpleEncodeIPFS('')).toBe('0x');
    });

    it('should encode CIDv0 with proper prefix', () => {
      const result = simpleEncodeIPFS(cidv0);
      // 0xe3 (IPFS) + 01 (CID version) + 01 (version code) + 70 (dag-pb) + 1220 (sha2-256 + length)
      expect(result.startsWith('0xe30101701220')).toBe(true);
    });

    it('should encode CIDv1 with IPFS protocol prefix', () => {
      const result = simpleEncodeIPFS(cidv1);
      // 0xe3 (IPFS) + 01 (CID version)
      expect(result.startsWith('0xe301')).toBe(true);
    });
  });

  // EIP-1577の仕様に関するテスト
  describe('EIP-1577 compliance', () => {
    it('should follow EIP-1577 format for CIDv0', () => {
      // EIP-1577では、IPFSのプロトコルコードは0xe3、CIDv1は0x01、dag-pbは0x70、sha2-256は0x12
      const result = encodeContentHash(cidv0);
      expect(result.substring(0, 2)).toBe('0x'); // 0xプレフィックス
      expect(result.substring(2, 4)).toBe('e3'); // IPFSプロトコル
      expect(result.substring(4, 6)).toBe('01'); // CIDバージョン
    });
  });
});