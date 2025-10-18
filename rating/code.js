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
  function fetchpage(titlee) {
      return $.get(mw.util.getUrl(titlee), { action: 'raw' });
  }
  function getpageratings() {
    fetchpage("MediaWiki:custom-ratingstorage.json").then(rating => {
      let userupvoted, userdownvoted = false;
      for(let i = 0; rating.users.length; i++) 
      {
          if (rating.users[i].username === mw.config.get('wgUserName'))
          {
            userdownvoted = rating.users[i].down.includes(page);
            userupvoted = rating.users[i].up.includes(page);
            break;
          }
      }
   });
  }
});

