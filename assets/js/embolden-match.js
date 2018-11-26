export function emboldenMatch(string, query, tag = 'em') {
  query = query.toLowerCase().trim();

  if (string.toLowerCase().includes(query)) {
    const queryLength = query.length;
    const matchIndex = string.toLowerCase().indexOf(query);
    const matchEnd = matchIndex + queryLength;
    const before = string.substr(0, matchIndex);
    const match = string.substr(matchIndex, queryLength);
    const after = string.substr(matchEnd, string.length - matchEnd);

    return `${before}<${tag}>${match}</${tag}>${after}`;
  } else {
    return string;
  }
}
