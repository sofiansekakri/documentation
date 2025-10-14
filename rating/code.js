// === [[Category:Internal]] ===
mw.loader.using('mediawiki.api').then(() => {
  const page = mw.config.get('wgArticleId'); 
  
  function edit(content) {
    return new mw.Api().postWithToken('csrf', {
      action: 'edit',
      title:'User:' + mw.config.get('wgUserName') + '/pageratings.json',
      text: content,
      summary: ''
    });
  }
  function fetchpage() {
      
  }
  function getpageratings() {
    fetchpage("MediaWiki:custom-ratingstorage.json").then(rating => {
      let userupvoted, userdownvoted;
      for(let i = 0; rating.users.length; i++) 
      {
          if (rating.users[i].username === mw.config.get('wgUserName')&&(rating.users[i].up.includes(page)||rating.users[i].down.includes(page)))
          {
            
          }
      }
   });
  }
});

