// src/common/utils/password.generator.ts

export function genererMotDePasse(longueur = 10): string {
  const lettresMinuscules = 'abcdefghijklmnopqrstuvwxyz';
  const lettresMajuscules = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const chiffres = '0123456789';
  const tous = lettresMinuscules + lettresMajuscules + chiffres;

  let motDePasse = '';
  motDePasse +=
    lettresMajuscules[Math.floor(Math.random() * lettresMajuscules.length)];
  motDePasse +=
    lettresMinuscules[Math.floor(Math.random() * lettresMinuscules.length)];
  motDePasse += chiffres[Math.floor(Math.random() * chiffres.length)];

  for (let i = 3; i < longueur; i++) {
    motDePasse += tous[Math.floor(Math.random() * tous.length)];
  }

  return motDePasse
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
}
