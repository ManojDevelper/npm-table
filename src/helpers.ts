export function isStringEmpty(str: string | undefined | null) {
  return !str || str.trim() === "";
}
