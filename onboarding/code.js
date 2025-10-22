// === [[Category:Internal]] ===

mw.loader.using(['mediawiki.api', 'mediawiki.util']).then(() => {



$.get('https://backrooms-freewriting.fandom.com/index.php?title=MediaWiki:Custom-onboarding.json', { action: 'raw' }).then(data => {

  try {

    window.onBoardingSettings = JSON.parse(data);

  } catch (err) {

    window.onBoardingSettings = { pages: [], options: [], header: '' };

  }

}).then(function() {



var readerWriterDOM = `

<div class="choose">

  <div class="section">

    <a class="writer wds-button" style="padding:40px;background-color:transparent;border-width:3px;">

      <span>

         <h2>I'm a writer</h2>

         <p></p>

      </span>

    </a>

  </div>

  <div class="section">

    <a class="reader wds-button" style="padding:40px;background-color:transparent;border-width:3px;">

      <span>

         <h2>I'm a reader</h2>

         <p></p>

      </span>

    </a>

  </div>

</div>

`;



var chosen;



function readerwriter(type) {

  if (type === 'writer') {

    $('.page-reader').css({ 'opacity': '0', 'pointer-events': 'none' });

    $('.page-writer').css({ 'opacity': '1', 'pointer-events': 'auto' });

    $('.reader').attr('data-selected', 'no');

    $('.writer').attr('data-selected', 'yes');

  }

  if (type === 'reader') {

    $('.page-reader').css({ 'opacity': '1', 'pointer-events': 'auto' });

    $('.page-writer').css({ 'opacity': '0', 'pointer-events': 'none' });

    $('.writer').attr('data-selected', 'no');

    $('.reader').attr('data-selected', 'yes');

  }

  let enabled = $('[data-selected="yes"]');

  let disabled = $('[data-selected="no"]');

  disabled.css('pointer-events', 'auto');

  enabled.css('pointer-events', 'none');

  chosen = enabled.attr('class');

}



(function() {

  const username = mw.config.get('wgUserName');



function page(titlee) {

    let api = new mw.Api();

    return api.get({

        action: 'query',

        prop: 'revisions',

        titles: titlee,

        rvslots: 'main',

        rvprop: 'content',

        format: 'json'

    }).then(data => {

        try {

            let pages = data.query.pages;

            let page = Object.values(pages)[0];

            let content = page.revisions[0].slots.main['*'];

            return content;

        } catch (e) {

            return { completed: false, options: [] };

        }

    }).catch(() => ({ completed: false, options: [] }));

}







  function pageHTML(titlee) {

    return new mw.Api().get({

      action: 'parse',

      page: titlee,

      prop: 'text',

      formatversion: 2

    }).then(data => data.error ? null : data.parse.text);

  }



  function edit(titlee, content) {

    return new mw.Api().postWithToken('csrf', {

      action: 'edit',

      title: titlee,

      text: content,

      summary: ''

    });

  }



  page('User:' + username + '/onboarding.json').then(json => {

    let loadjson;

    try {

      loadjson = json ? JSON.parse(json) : { completed: false, options: [] };

    } catch (e) {

      loadjson = { completed: false, options: [] };

    }

    const onboardingCompleted = loadjson.completed;



    if (window.onBoardingSettings && Array.isArray(window.onBoardingSettings.options)) {

      window.onBoardingSettings.options.forEach(opt => {

        try {

          if (loadjson.options && loadjson.options.includes(opt.id) && opt.enableFunction) {

            const fn = window[opt.enableFunction];

            if (typeof fn === 'function') fn();

          }

        } catch (e) {

          return;

        }

      });

    }



    if (window.onboardingloaded || !username || (onboardingCompleted &&

      !(window.location.search.includes('onboarding=1') || window.location.search.includes('onboarding=true')))&& (mw.config.get('wgPageName')!=='Special:Onboarding')) {

return;

}

else {



    $('body').prepend(`<div class="onboarding">

    <style>body {overflow-y:hidden;}</style>

    <div id="cont"><center><h1></h1></center></div></div>`);

    $('.onboarding h1').text(window.onBoardingSettings.header.replace(/\$1/g, username));



    page('MediaWiki:Mainpage').then(text => {

      const mainPage = text.replace(/ /g, '_');

      pageHTML(mainPage /*+ '/onboarding'*/).then(pageContent => {

        if (!pageContent) return;



        $('.onboarding>#cont').append('<div style="background-color: var(--theme-page-background-color--secondary);position:absolute;"></div>');



        for (let i = 0; i < window.onBoardingSettings.pages.length; i++) {

          pageHTML(window.onBoardingSettings.pages[i]).then(Content => {

            if (!Content) return;

            $('.onboarding>#cont').append('<div id="' + window.onBoardingSettings.pages[i] + '" style="position:absolute;z-index:' + (225 - i) + ';background-color: var(--theme-page-background-color--secondary);">' + Content + '<center><a class="' + window.onBoardingSettings.pages[i] + ' wds-button">Next</a></center><br></div>');

            $('.' + window.onBoardingSettings.pages[i]).click(function() {

              $('.'+window.onBoardingSettings.pages[i]).css({ 'opacity': '0', 'pointer-events': 'none' });

              $('#' + window.onBoardingSettings.pages[i]).css({ 'opacity': '0', 'pointer-events': 'none' });

              $('body').append('<style> #'+window.onBoardingSettings.pages[i]+' * {opacity:0;pointer-events:none;}<style>');

            });

          }).then(function() {

            if ($('.choose').length < 1 && $('.choosingparent').length === 1) {

              $('.choosingparent').append(readerWriterDOM);

              $('.reader').click(() => readerwriter('reader'));

              $('.writer').click(() => readerwriter('writer'));

            }

          });

        }

        



        if (window.onBoardingSettings.options.length > 0) {

          $('.onboarding>#cont').append('<div class="options"><h2>Options</h2></div>');

          window.onBoardingSettings.options.forEach(opt => {

            $('.options').append('<span id="' + opt.id + '"></span>');

            $('#' + opt.id).append('<input class="wds-button"/><span class="label"></span>');

            if (opt.checkedDefault || loadjson.options.includes(opt.id)) {

              $('#' + opt.id + ' > input').attr('checked', true);

            }

            $('#' + opt.id + ' > .label').text(opt.text);

            

          });

        }



        function submit() {

          const obj = { completed: true, options: [] };

          $('.options input').each((i, el) => {

            if ($(el).is(':checked')) obj.options.push(window.onBoardingSettings.options[i].id);

          });

          return edit('User:' + username + '/onboarding.json', JSON.stringify(obj));

        }

		$('.onboarding').append('<center><a class="wds-button onboardingbutton">Save</a></center>');

        $('.onboardingbutton').click(function(event) {

          event.preventDefault();

          submit().then(res => {

            if(!res.error) {

              $('.onboarding').remove();

            } else 

            {$('.onboarding>#cont').append('<center><br><span style="color:red;">An error occurred.</span></center>');}

          });

            

        });

        window.onboardingloaded = true;

      });

    });

  }});

})();



//css

	importArticle({

	  type: 'style',

	  article: 'MediaWiki:custom-onboarding.css'

	});





});

});
