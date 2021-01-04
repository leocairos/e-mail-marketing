import jwt, { VerifyOptions } from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

function findKeysPath(currentPath: string): string {
  const KeysPath = path.join(currentPath, 'keys');
  if (fs.existsSync(KeysPath)) return KeysPath;
  else return findKeysPath(path.join(currentPath, '..'));
}

const publicKey = fs.readFileSync(path.join(findKeysPath(__dirname), 'public.key'), 'utf-8');
const jwtAlgorithm = 'RS256';

export type Token = { accountId: number, jwt?: string };

async function verify(token: string) {
  try {
    const decoded: Token = await jwt.verify(token, publicKey, { algorithm: [jwtAlgorithm] } as VerifyOptions) as Token;
    return { accountId: decoded.accountId, jwt: token }
  } catch (error) {
    console.log(`verify: ${error}`);
    return null;
  }
}

export default { verify, findKeysPath };