// Not much callbacks, but we didn't handle errors yet.

// TODO: Add spinner removed at the end
// TODO: Add error handling with callbacks
// TODO: Do the same with promises
// TODO: Do the same with async functions

document.addEventListener('DOMContentLoaded', init);

function get(url, cb) {
  const xhr = new XMLHttpRequest()
  xhr.open('GET', url)
  xhr.onload = function(e) { cb(this.response) }
  xhr.send()
}

function getImage(url, cb) {
  const xhr = new XMLHttpRequest()
  xhr.open('GET', url)
  xhr.responseType = 'blob'
  xhr.onload = function(e) { cb(URL.createObjectURL(this.response)) }
  xhr.send()
}

function init() {
  //parallelGetSequentialAdd()
  //sequential()
  parallel()
  //parallelGetWaitAndAddAll()
  //fastest()
}

// Add an <img> element for each image, the browser will take care of making the
// actual requests and put the image at the right place.
function fastest() {
  get('index.json', data => {
    const index = JSON.parse(data)
    setTitle(index.title)
    for (let im of index.images) {
      addImage(im)
    }
  })
}

// Start fetching all the images in parallel, and add them in the order they
// arrive.
function parallel() {
  get('index.json', data => {
    const index = JSON.parse(data)
    setTitle(index.title)
    for (let im of index.images) {
      getImage(im, addImage)
    }
  })
}

// Fetch the first image then add it, then fetch the second one, etc.
function sequential() {
  get('index.json', data => {
    const index = JSON.parse(data)
    setTitle(index.title)
    function getAndAdd(cur) {
      if (cur < 100) {
        getImage(index.images[cur], function (img) {
          addImage(img)
          getAndAdd(cur+1)
        })
      }
    }
    getAndAdd(0)
  })
}

// Fetch all images in parallel, but add them in increasing order.
function parallelGetSequentialAdd() {
  get('index.json', data => {
    const index = JSON.parse(data)
    setTitle(index.title)

    const queue = []
    let cur = 0

    for (let i in index.images) {
      getImage(index.images[i], function(img) {
        queue[i] = img

        while (queue[cur] != null) {
          addImage(queue[cur++])
        }
      })
    }
  })
}

// Fetch all images in parallel, but wait until all have arrived before adding
// them in order.
function parallelGetWaitAndAddAll() {
  get('index.json', data => {
    const index = JSON.parse(data)
    setTitle(index.title)

    const queue = []
    let total = 0

    for (let i in index.images) {
      getImage(index.images[i], function(img) {
        queue[i] = img
        total++

        if (total === index.images.length) {
         while (queue.length > 0) {
           addImage(queue.shift())
         }
        }
      })
    }
  })
}

function setTitle(m) {
  const title = document.createElement('h1')
  title.innerText = m
  document.body.appendChild(title)
}

function addImage(img) {
  const el = document.createElement('img')
  el.src = img
  document.body.appendChild(el)
}
