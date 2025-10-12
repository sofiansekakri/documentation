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
  function fetchpage() {
      
  }
  function getpageratings {
    fetchpage("MediaWiki:custom-ratingstorage.json").then(ratings => {
      for(let i = 0; ratings.users.length; i++) 
      {
          if (rating.users[i].username === mw.config.get('wgUserName'))
          {
            
          }
      }
    });
});
