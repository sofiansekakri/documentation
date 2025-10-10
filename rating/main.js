// === [[Category:Internal]] ===
mw.loader.using('mediawiki.api').then(() => {
  function edit(title, content) {
    return new mw.Api().postWithToken('csrf', {
      action: 'edit',
      title,
      text: content,
      summary: ''
    });
  }
});
