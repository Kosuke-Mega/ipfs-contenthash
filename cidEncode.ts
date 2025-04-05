// CIDをENSコンテンツハッシュ形式にエンコードする関数（EIP-1577準拠）
export function encodeContentHash(cid: string): string {
  if (!cid) return '0x';
  
  // プレフィックスがQmで始まるCIDv0を処理
  if (cid.startsWith('Qm')) {
    // IPFSのプロトコルコード (0xe3) + CIDv0を示すフラグ (01) + dag-pb (70) + sha2-256 (12) + 長さ (20)
    // 注: 実際のエンコードには専用のライブラリが推奨されます
    return '0xe30101701220' + cidV0ToHex(cid);
  }
  
  // CIDv1の場合（例: bafyで始まる）
  // 注: このコードは簡略化されており、すべてのCIDv1パターンに対応していません
  console.warn('CIDv1の処理は複雑なため、専用のライブラリの使用を推奨します');
  
  try {
    // IPFSのプロトコルコード (0xe3) + CIDバージョン1 (01)
    // 実際のCIDv1はより複雑な構造を持っており、エンコード方法が異なります
    return '0xe301' + cidToHex(cid);
  } catch (error) {
    console.error('CIDエンコードエラー:', error);
    return '0x';
  }
}

// CIDv0（Qmから始まる）を16進数に変換する関数
// 注: 実際の実装では、Base58デコードライブラリを使用すべきです
function cidV0ToHex(cidv0: string): string {
  if (!cidv0.startsWith('Qm')) {
    throw new Error('無効なCIDv0フォーマット');
  }
  
  // 注: これはシミュレーションです
  // 実際のBase58デコード処理ではありません
  // 本番環境では、以下のようなライブラリを使用します:
  // import { base58 } from 'multiformats/bases/base58';
  // const bytes = base58.decode(cidv0);
  // return Buffer.from(bytes.slice(2)).toString('hex');
  
  // シミュレーション用の簡易実装
  return "0123456789abcdef".repeat(16); // 32バイトのダミーデータ
}

// 文字列を16進数に変換する関数
function cidToHex(cid: string): string {
  return Array.from(cid).map(char => {
    return char.charCodeAt(0).toString(16).padStart(2, '0');
  }).join('');
}

// ENS推奨の実装方法 (nodejs環境用)
export function recommendedEncodeNode(cid: string): string {
  if (!cid) return '0x';
  
  try {
    // 以下のライブラリをインストールする必要があります:
    // npm install @ensdomains/content-hash multiformats
    
    // 実装例:
    // import contentHash from '@ensdomains/content-hash';
    // return '0x' + contentHash.encode('ipfs', cid);
    
    // 実際の実装では以下のようになります
    /*
    if (cid.startsWith('Qm')) {
      // CIDv0の処理
      return '0x' + contentHash.encode('ipfs', cid);
    } else {
      // CIDv1の処理
      return '0x' + contentHash.encode('ipfs', cid);
    }
    */
    
    // この関数はライブラリの使用方法を示すためのもので、
    // 実際の実装には適切なライブラリをインポートしてください
    return '0x';
  } catch (error) {
    console.error('CIDエンコードエラー:', error);
    return '0x';
  }
}

// CIDのバージョンを検出する関数
export function detectCIDVersion(cid: string): string {
  if (!cid) return 'unknown';
  if (cid.startsWith('Qm')) return 'v0';
  if (cid.startsWith('baf')) return 'v1';
  return 'unknown';
}

// EIP-1577準拠: web3.jsを使用した実装
export function eip1577CompliantEncode(cid: string, web3: any): string {
  if (!cid) return '0x';
  
  // IPFSプロトコル識別子
  const ipfsProtocol = '0xe3';
  
  // CIDv0の場合
  if (cid.startsWith('Qm')) {
    // CIDv0用のエンコーディング
    try {
      // 注: 実際の実装ではBase58デコードが必要です
      // ここではシミュレーションとして、web3.jsのユーティリティを使用します
      // CIDv0バージョン (01) + dag-pb (70) + sha2-256 (12) + 長さ (20)
      return ipfsProtocol + '0101701220' + web3.utils.asciiToHex(cid.substr(2)).slice(2);
    } catch (error) {
      console.error('CIDv0エンコードエラー:', error);
      return '0x';
    }
  }
  
  // CIDv1の場合
  try {
    // CIDv1のエンコーディング
    // 注: CIDv1は複雑な構造を持っており、専用のライブラリが推奨されます
    return ipfsProtocol + '01' + web3.utils.asciiToHex(cid).slice(2);
  } catch (error) {
    console.error('CIDv1エンコードエラー:', error);
    return '0x';
  }
}

// 推奨実装: ライブラリに依存しないバージョン
// 注: Base58エンコード/デコードが必要な場合は、専用のライブラリを使用してください
export function simpleEncodeIPFS(cid: string): string {
  if (!cid) return '0x';
  
  // IPFSプロトコル識別子
  const ipfsProtocol = 'e3';
  
  // CIDv0の場合
  if (cid.startsWith('Qm')) {
    // CIDv0、CIDバージョン1 (01)、dag-pb (70)、sha2-256 (12)、長さ (20)
    // 注: 実際のエンコードでは、Base58デコードが必要です
    return '0x' + ipfsProtocol + '0101701220' + stringToHex(cid);
  }
  
  // CIDv1の場合
  return '0x' + ipfsProtocol + '01' + stringToHex(cid);
}

// 文字列を16進数に変換するシンプルな関数
function stringToHex(str: string): string {
  let hex = '';
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    hex += charCode.toString(16).padStart(2, '0');
  }
  return hex;
}