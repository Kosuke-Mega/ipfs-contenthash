# IPFS CID to ENS Content Hash Encoder

このリポジトリでは、IPFS CID（コンテンツ識別子）をENSのコンテンツハッシュ形式にエンコードするためのTypeScriptライブラリを提供します。[EIP-1577](https://eips.ethereum.org/EIPS/eip-1577)仕様に準拠しています。

## EIP-1577について

EIP-1577は、Ethereum Name Service（ENS）のリゾルバに対して「contenthash」フィールドを導入し、分散型ネットワーク上のコンテンツアドレスを標準的な方法で格納することを目的としています。

このEIPは以下の内容を規定しています：
- コンテンツハッシュはマルチコーデック形式で表現される
- IPFSのプロトコルコードは「0xe3」
- CIDバージョン1は「0x01」
- コンテンツタイプdag-pbは「0x70」
- ハッシュ関数sha2-256は「0x12」

## 主な機能

このライブラリは、次の機能を提供します：

1. `encodeContentHash(cid: string)`: IPFSのCIDをENSコンテンツハッシュ形式にエンコードします
2. `detectCIDVersion(cid: string)`: CIDのバージョン（v0またはv1）を検出します
3. `eip1577CompliantEncode(cid: string, web3: any)`: Web3.jsを使用したEIP-1577準拠のエンコーディング
4. `simpleEncodeIPFS(cid: string)`: ライブラリに依存しないシンプルな実装

## 使用例

```typescript
import { encodeContentHash, detectCIDVersion } from './cidEncode';

// CIDv0の例（Qmで始まる）
const cidv0 = 'QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB';
console.log(`CID Version: ${detectCIDVersion(cidv0)}`);
console.log(`Encoded Content Hash: ${encodeContentHash(cidv0)}`);

// CIDv1の例（bafyで始まる）
const cidv1 = 'bafybeihkoviema7g3gxyt6la7v4mbgn2wh5qoxmkvqmv7k7n7qlomg4elu';
console.log(`CID Version: ${detectCIDVersion(cidv1)}`);
console.log(`Encoded Content Hash: ${encodeContentHash(cidv1)}`);
```

## 推奨ライブラリ

実際の本番環境では、以下のライブラリの使用を推奨します：

1. [@ensdomains/content-hash](https://github.com/ensdomains/content-hash): ENS公式のコンテンツハッシュエンコーディングライブラリ
2. [multiformats](https://github.com/multiformats/js-multiformats): CIDの処理とBase58エンコード/デコードのためのライブラリ

## 実装の注意点

1. **CID v0**: 
   - Qmで始まるCIDはBase58エンコードされています
   - 適切に処理するには、Base58デコードが必要です

2. **CID v1**:
   - より複雑な構造を持っており、適切な処理には専用ライブラリが必要です
   - CIDv1は通常、bafyなどで始まる文字列です

## ENS公式ライブラリを使用した例

この実装のみでなく、ENS公式ライブラリを使用することで、より堅牢な実装が可能です：

```typescript
import contentHash from '@ensdomains/content-hash';

function encodeWithOfficialLibrary(cid: string): string {
  if (!cid) return '0x';
  
  try {
    return '0x' + contentHash.encode('ipfs', cid);
  } catch (error) {
    console.error('CIDエンコードエラー:', error);
    return '0x';
  }
}
```

## ライセンス

MIT