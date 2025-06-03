// src/common/utils/password.hash.ts
import * as bcrypt from 'bcryptjs';


export async function hasherMotDePasse(motDePasse: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(motDePasse, saltRounds);
}

export async function comparerMotDePasse(
  motDePasse: string,
  hash: string,
): Promise<boolean> {
  return await bcrypt.compare(motDePasse, hash);
}
