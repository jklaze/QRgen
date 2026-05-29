export function parseHTML(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html.trim(), 'text/html');
  const fragment = document.createDocumentFragment();
  while (doc.body.firstChild) {
    fragment.appendChild(doc.body.firstChild);
  }
  return fragment;
}
