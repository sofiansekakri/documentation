import { CookieJar } from "tough-cookie";
import fetchCookie from "fetch-cookie";
const password = '';
const botname = '';
const api = "https://backrooms.fandom.com/api.php";
function edit(title, content) {
    .postWithToken('csrf', {
      action: 'edit',
      title: titlee,
      text: content,
      summary: ''
    });
}
