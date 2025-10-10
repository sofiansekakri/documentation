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

var readerWriterDOM = `
<div class="chose">
  <div class="section">
    <a class="writer">
      <span class="wds-button" style="padding:40px;background-color:transparent;">
         <h2>I'm a writer</h2>
         <p></p>
      </span>
    </a>
  <div class="section">
    <a class="reader">
      <span class="wds-button" style="padding:40px;background-color:transparent;">
         <h2>I'm a reader</h2>
         <p></p>
      </span>
    </a>
  </div>
</div>
`;
var chosen;
function readerwriter(type)
{
   if(type === 'writer')
   {
      $('.page-reader').css({
                'opacity': '0',
                'pointer-events': 'none'
              });
      $('.page-writer').css({
                'opacity': '1',
                'pointer-events': 'auto'
              });
      $('.reader').attr('data-selected', 'no');
      $('.writer').attr('data-selected', yes);
   }
   if(type === 'reader')
   {
      $('.page-reader').css({
                'opacity': '1',
                'pointer-events': 'auto'
              });
      $('.page-writer').css({
                'opacity': '0',
                'pointer-events': 'none'
              });
      $('.writer').attr('data-selected', 'no');
      $('.reader').attr('data-selected', 'yes');
   }
   let enabled = $('[data-selected*="yes"]');
   let disabled = $('[data-selected*="no"]')
   disabled.css('pointer-events', 'auto');
   enabled.css('pointer-events', 'none');
   chosen = enabled.attr('class');
}
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

           [data-selected="yes"]
           {
              border-color:var(--theme-page-link-color);
border-width:3px;
background-color:var(--theme-page-background-color--secondary);
color:var(--theme-page-text-color);
           }
          </style>
        `);
        window.onboardingloaded = true;
      });
    });
  });
})();

});