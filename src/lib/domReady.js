export function whenDocumentReady(doc, callback) {
  if (!doc || typeof callback !== 'function') {
    return;
  }

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', callback, { once: true });
    return;
  }

  callback();
}
