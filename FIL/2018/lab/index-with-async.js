// Not much callbacks, but we didn't handle errors yet.

// TODO: Add error handling with callbacks

document.addEventListener('DOMContentLoaded', init);

function get(url, type = "text") {
  return new Promise(function executor(resolve, reject) {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.responseType = type
    xhr.onload = function(e) { resolve(this.response) }
    xhr.onerror = reject
    xhr.send()
  })
}

function getImage(url) {
  return get(url, "blob").then(URL.createObjectURL)
}

function init() {
  parallelGetSequentialAdd()
  //sequential()
  //parallel()
  //parallelGetWaitAndAddAll()
  //fastest()
}

// Add an <img> element for each image, the browser will take care of making the
// actual requests and put the image at the right place.
async function fastest() {
  let index = await get('index.json', 'json')
  index.images.forEach(addImage)
}

// Start fetching all the images in parallel, and add them in the order they
// arrive.  Which is the wrong order.
async function parallel() {
  addSpinner()

  let index = await get('index.json', 'json')
  await Promise.all(index.images.map(async url => {
    let img = await getImage(url)
    addImage(img)
  }))
  removeSpinner()
}

// Fetch the first image then add it, then fetch the second one, etc.
async function sequential() {
  addSpinner()

  let index = await get('index.json', 'json')
  for (let url of index.images) {
    let img = await getImage(url)
    addImage(img)
  }

  removeSpinner()
}

// Fetch all images in parallel, but add them in increasing order as soon as
// they arrive.
async function parallelGetSequentialAdd() {
  addSpinner()

  let queue = []
  let cur = 0

  let index = await get('index.json', 'json')
  for (let i in index.images) {
    getImage(index.images[i])
      .then(img => {
        queue[i] = img
        while (queue[cur] != null) {
          addImage(queue[cur++])
        }
        if (cur === index.images.length) {
          removeSpinner()
        }
      })
  }
}

// Fetch all images in parallel, but wait until all have arrived before adding
// them in order.
async function parallelGetWaitAndAddAll() {
  addSpinner()

  let index = await get('index.json', 'json')
  let images = await Promise.all(index.images.map(getImage))
  for (let img of images) {
    addImage(img)
  }

  removeSpinner()
}

function addImage(img) {
  const el = document.createElement('img')
  el.src = img
  document.body.appendChild(el)
}

function addSpinner() {
  const el = document.createElement('div')
  el.id = 'spinner'
  document.body.appendChild(el)
}

function removeSpinner() {
  const el = document.getElementById('spinner')
  el.remove()
}
