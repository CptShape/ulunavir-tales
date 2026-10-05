export const ADMIN_EMAIL = "yaslantr123@gmail.com";

export function isAdminEmail(email) {
  return String(email ?? "").trim().toLowerCase() === ADMIN_EMAIL;
}

export function isAdminToken(token) {
  return token?.email_verified === true && isAdminEmail(token.email);
}
