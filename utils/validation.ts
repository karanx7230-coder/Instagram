export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidUsername(username: string): boolean {
  return /^[a-zA-Z0-9._]{3,30}$/.test(username.trim());
}

export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}
