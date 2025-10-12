function edit(title, content) {
    .postWithToken('csrf', {
      action: 'edit',
      title: titlee,
      text: content,
      summary: ''
    });
}
