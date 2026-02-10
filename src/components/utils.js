export function parseHTML(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.cloneNode(true);
}
