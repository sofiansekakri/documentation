//get threads
async function getDiscussions(limit = 1000, sortKey = "creation_date") {
  const url = `https://backrooms.fandom.com/wikia.php?controller=DiscussionThread&method=getThreads&limit=${limit}&sortKey=${sortKey}`;
  const res = await fetch(url, { headers: { "Accept": "application/json", "User-Agent": "BackroomsBot/1.0" } });
  const data = await res.json();
  const threads = data._embedded?.threads || [];
  return threads.map(t => ({
    id: t.id,
    title: t.title,
    forum: t.forumName,
    author: t.createdBy?.name,
    upvotes: t.upvoteCount,
    comments: t.postCount
  }));
}
