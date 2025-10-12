// === [[Category:Internal]] ===
mw.loader.using('mediawiki.api').then(() => {
  const page = mw.config.get('wgArticleId'); 
  function edit(content) {
    return new mw.Api().postWithToken('csrf', {
      action: 'edit',
      'User:'+mw.config.get('wgUserName')+'/pageratings.json',
      text: content,
      summary: ''
    });
  }
});
