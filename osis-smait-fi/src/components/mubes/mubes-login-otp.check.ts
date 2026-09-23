/** ponytail: Clerk factor picker — upgrade when Clerk types export EmailCodeFactor in our pin. */
export function pickEmailCodeFactor(
  factors?: Array<{ strategy?: string; emailAddressId?: string }>
) {
  return factors?.find((f) => f.strategy === 'email_code' && Boolean(f.emailAddressId));
}

const sample = pickEmailCodeFactor([
  { strategy: 'password' },
  { strategy: 'email_code', emailAddressId: 'idn_1' },
]);
if (sample?.emailAddressId !== 'idn_1') throw new Error('pickEmailCodeFactor missed email_code');
if (pickEmailCodeFactor([{ strategy: 'password' }])) throw new Error('password must not count as OTP');
