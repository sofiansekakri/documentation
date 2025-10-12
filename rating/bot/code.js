import { CookieJar } from "tough-cookie";
import fetchCookie from "fetch-cookie";
const password = '';
const botname = '';
function edit(title, content) {
    .postWithToken('csrf', {
      action: 'edit',
      title: titlee,
      text: content,
      summary: ''
    });
}
