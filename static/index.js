fetch('/show', {
  method: 'GET'
}).then(res => {
  return res.json()
}).then(res => {
  res = JSON.parse(res)
  console.log(res.length)
  document.body.innerHTML = res.map((page, index) => {
    return page.items.map((item, itemIndex) => {
      return `<img src="${item.thumbSrc}" width="200" height="200"/>`
    }).join('')
  }).join('')
  
})