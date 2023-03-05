export function matchesSearchQuery(user, searchString) {
  const userValues = Object.values(user).join(" ").toLowerCase();
  const searchStringInLowerCase = searchString.toLowerCase();
  if (userValues.includes(searchStringInLowerCase)) {
    return true;
  }
  return false;
}
