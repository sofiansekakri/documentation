mw.loader.using('mediawiki.api').then(() => {

window.onBoardingSettings = {
  header: 'Welcome, $1',
  pages: [
    'Backrooms_Wiki:Rules',
    'MediaWiki:custom-writer',
    'MediaWiki:custom-reader'
  ],
  options: [
    {
      text: 'enable discussion page redirect',
      checkedDefault: false,
      enableFunction: redirect,
      id: 'redirect'
    },
    {
      text: 'sandbox tab',
      checkedDefault: false,
      enableFunction: sandboxtab,
      id: 'sandboxtab'
    }
  ]
};

(function() {
  const username = mw.config.get('wgUserName');
  function page(title) {
    return new mw.Api().get({ action: 'raw', title }).then(data => data);
  }
  function pageHTML(title) {
    return new mw.Api().get({
      action: 'parse',
      page: title,
      prop: 'text',
      formatversion: 2
    }).then(data => data.error ? null : data.parse.text);
  }
  function edit(title, content) {
    return new mw.Api().postWithToken('csrf', {
      action: 'edit',
      title,
      text: content,
      summary: ''
    });
  }
  page('User:' + username + '/onboarding.json').then(json => {
    let loadjson = json ? JSON.parse(json) : { completed: false, options: [] };
    const onboardingCompleted = loadjson.completed;
    if (window.onboardingloaded || !username || (onboardingCompleted &&
      !(window.location.search.includes('onboarding=1') || window.location.search.includes('onboarding=true')))) return;
    $('body').prepend('<div class="onboarding"><h1>' +
      window.onBoardingSettings.header.replace(/\$1/g, username) +
      '</h1></div>');
    page('MediaWiki:Mainpage').then(text => {
      const mainPage = text.replace(/ /g, '_');
      pageHTML(mainPage + '/onboarding').then(pageContent => {
        if (!pageContent) return;
        $('.onboarding').append(pageContent);
        for (let i = 0; i < window.onBoardingSettings.pages.length; i++) {
          pageHTML(window.onBoardingSettings.pages[i]).then(pageContent => {
            if (!pageContent) return;
            $('.onboarding').append('<div id="' + window.onBoardingSettings.pages[i] + '" style="position:absolute;z-index:' + (225 - i) + ';">' + pageContent + '<br><a class="' + window.onBoardingSettings.pages[i] + ' wds-button">Next</a></div>');
            $('.' + window.onBoardingSettings.pages[i]).click(function() {
              $('#' + window.onBoardingSettings.pages[i]).css({
                'opacity': '0',
                'pointer-events': 'none'
              });
            });
          });
        }
        if (window.onBoardingSettings.options.length > 0) {
          $('.onboarding').append('<div class="options"><h2>Options</h2></div>');
          window.onBoardingSettings.options.forEach(opt => {
            $('.options').append('<span id="' + opt.id + '"></span>');
            $('#' + opt.id).append('<input class="wds-checkbox" type="checkbox"/><span class="label"></span>');
            if (opt.checkedDefault || loadjson.options.includes(opt.id)) {
              $('#' + opt.id + ' > input').attr('checked', true);
            }
            $('#' + opt.id + ' > .label').text(opt.text);
            if (loadjson.options.includes(opt.id)) {
              opt.enableFunction();
            }
          });
        }
        function submit() {
          const obj = { completed: true, options: [] };
          $('.options input').each((i, el) => {
            if ($(el).is(':checked')) obj.options.push(window.onBoardingSettings.options[i].id);
          });
          return edit('User:' + username + '/onboarding.json', JSON.stringify(obj));
        }
        $('.onboarding').append('<a class="wds-button onboardingbutton">Save</a>');
        $('.onboardingbutton').click(function(event) {
          event.preventDefault();
          submit().then(() => $('.onboarding').remove());
        });
        $('body').append(`
          <style>
            .onboarding {
              z-index: 201;
              position: sticky;
              left: 10px;
              top: 10px;
              width: 95vw;
              height: 95vh;
              max-height: 95vh;
              background-color: var(--theme-page-background-color);
              color: var(--theme-page-text-color);
              padding: 3%;
              overflow-y: scroll;
              overflow-x: hidden;
            }
          </style>
        `);
        window.onboardingloaded = true;
      });
    });
  });
})();

});