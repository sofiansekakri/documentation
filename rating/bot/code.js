import { CookieJar } from "tough-cookie";
import fetchCookie from "fetch-cookie";
const password = '';
const botname = '';
const api = "https://backrooms.fandom.com/api.php";


async function getToken() {
  const res = await fetch(API+`?action=query&meta=tokens&type=csrf&format=json`, {
    headers: { Authorization: "Basic " + btoa(`${botname}:${password}`) }
  })
  const logintoken = await res.json()
  return logintoken.query.tokens.csrftoken
}
