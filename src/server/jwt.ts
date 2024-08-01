import { SignJWT, jwtVerify } from 'jose';

export async function sign(
  payload: Record<string, any>,
  secret: string
): Promise<string> {
  const iat = Math.floor(Date.now() / 1000);

  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt(iat)
    .setNotBefore(iat)
    .sign(new TextEncoder().encode(secret));
}

export async function verify(
  token: string,
  secret: string
): Promise<Record<string, any>> {
  const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
  return payload;
}
