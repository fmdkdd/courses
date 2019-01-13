//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Helper functions
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// You'll need to use these, but you don't need to change them.

const pendingRequests = []

// AJAX helper.  Do a GET request for `url` with response type `type`, and call
// `cb` when complete.
function get(url, type = 'text', cb) {
  const xhr = new XMLHttpRequest()
  xhr.open('GET', url)
  xhr.responseType = type
  xhr.onload = function(e) { cb(this.response) }
  xhr.send()
  pendingRequests.push(xhr)
}

// Get the list of images and call `cb` with the list when complete.
function getIndex(cb) {
  return get('index.json', 'json', cb)
}

// Get the image at `url` and call `cb` with the result when complete.
function getImage(url, cb) {
  return get(url, 'blob', function(data) {
    cb(URL.createObjectURL(data))
  })
}

// We don't want to bother ourselves with creating HTML elements.  Let's get
// these out of the way.

// Add the image `img` (a result given by the `getImage` callback) to the page.
function addImage(img) {
  const el = document.createElement('img')
  el.src = img
  document.body.appendChild(el)
}

// Add the spinner to the page to indicate images are still loading.
function addSpinner() {
  const el = document.createElement('div')
  el.id = 'spinner'
  document.getElementById('gallery').appendChild(el)
}

// Remove the spinner from the page.
function removeSpinner() {
  const el = document.getElementById('spinner')
  if (el)
    el.remove()
}

// Remove the spinner and all images from the page, also cancel any pending XHR
// requests.
function reset() {
  removeSpinner()
  for (let img of document.querySelectorAll('img')) {
    img.remove()
  }
  for (let xhr of pendingRequests) {
    xhr.abort()
  }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Loading functions
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// This is where the magic happens.  These functions are called by the buttons
// in `index.html`.  Your goal is to complete the code in these functions
// according to their specification.  They all need to add all the images from
// the index.json file to the page.  Before loading any image, they should add
// the spinner to the page.  After all the images have loaded, you should remove
// the spinner.
//
// To get the list of images, use `getIndex`.
// To get an individual image, use `getImage`.
// To add an image from the `getImage` callback to the page, use `addImage`.
// To add the spinner, call `addSpinner`.  To remove it, call `removeSpinner`.

//~~~~~~~~~~
// Parallel
//~~~~~~~~~~

// Start fetching all the images in parallel, and add them as soon as they
// arrive.
//
// This is fast, but the images are added out of order.
function parallel() {
  addSpinner()

  getIndex(images => {
    let count = 0
    for (let im of images) {
      getImage(im, function(img) {
        addImage(img)
        count++
        if (count === images.length) {
          removeSpinner()
        }
      })
    }
  })
}

//~~~~~~~~~~~~
// Sequential
//~~~~~~~~~~~~

// Fetch the first image then add it, then fetch the second one and add it, etc.
//
// The images are in order, but this is slow, since we parallelize network
// requests.
function sequential() {
  addSpinner()

  getIndex(images => {
    function getAndAdd(cur) {
      if (cur < images.length) {
        getImage(images[cur], function (img) {
          addImage(img)
          getAndAdd(cur+1)
        })
      } else {
        removeSpinner()
      }
    }
    getAndAdd(0)
  })
}

//~~~~~~~~~~~~~~~~~~~~~~~
// Parallel get, add all
//~~~~~~~~~~~~~~~~~~~~~~~

// Fetch all images in parallel, but wait until all have arrived before adding
// them in order.
//
// This is faster, but we have to wait for all images before we can even see
// one of them on the page.
function parallelGetAddAll() {
  addSpinner()

  getIndex(images => {
    const queue = []
    let received = 0

    for (let i in images) {
      getImage(images[i], function(img) {
        queue[i] = img
        received++
        if (received === images.length) {
          while (queue.length > 0) {
            addImage(queue.shift())
          }
          removeSpinner()
        }
      })
    }
  })
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Parallel get, streaming add
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Fetch all images in parallel, but add them in increasing order.  When image 1
// arrives, add it, and add continue adding 2, 3, and 4 if they have arrived,
// etc.  Otherwise don't do anything.
//
// This makes sure to launch all requests in parallel, and add images as soon as
// they arrive while maintaining their order.
function parallelGetStreamingAdd() {
  addSpinner()

  getIndex(images => {
    const queue = []
    let cur = 0

    for (let i in images) {
      getImage(images[i], function(img) {
        queue[i] = img

        while (queue[cur] != null) {
          addImage(queue[cur++])
          if (cur === images.length) {
            removeSpinner()
          }
        }
      })
    }
  })
}

//~~~~~~~~~~
// Fastest
//~~~~~~~~~~

// Add an <img> element for each image, the browser will take care of making the
// actual requests and put the image at the proper place when it is loaded.
//
// Probably the best way to do it when you are dealing with images.
function fastest() {
  getIndex(images => {
    for (let im of images) {
      addImage(im)
    }
  })
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// With Promises
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Now we rewrite the functions above using promises instead of callbacks.

// We need new helpers for AJAX requests that emit promises instead of
// callbacks.  We'll add the suffix `P` to distinguish them:

function getP(url, type = 'text') {
  return new Promise(function(resolve, reject) {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.responseType = type
    xhr.onload = function(e) { resolve(this.response) }
    xhr.onerror = reject
    xhr.send()
    pendingRequests.push(xhr)
  })
}

function getIndexP() {
  return getP('index.json', 'json')
}

function getImageP(url) {
  return getP(url, "blob").then(URL.createObjectURL)
}

//~~~~~~~~~~
// Parallel
//~~~~~~~~~~

// Start fetching all the images in parallel, and add them as soon as they
// arrive.
function promiseParallel() {
  addSpinner()

  getIndexP()
    .then(images => Promise.all(images.map(url => getImageP(url).then(addImage))))
    .then(removeSpinner)
}

//~~~~~~~~~~~~
// Sequential
//~~~~~~~~~~~~

// Fetch the first image then add it, then fetch the second one and add it, etc.
function promiseSequential() {
  addSpinner()

  getIndexP()
    .then(images => {
      let seq = Promise.resolve()

      for (let url of images) {
        seq = seq
          .then(_ => getImageP(url))
          .then(addImage)
      }

      seq.then(removeSpinner)
    })
}

//~~~~~~~~~~~~~~~~~~~~~~~
// Parallel get, add all
//~~~~~~~~~~~~~~~~~~~~~~~

// Fetch all images in parallel, but wait until all have arrived before adding
// them in order.
function promiseParallelGetAddAll() {
  addSpinner()

  getIndexP()
    .then(images => Promise.all(images.map(getImageP)))
    .then(images => images.map(addImage))
    .then(removeSpinner)
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Parallel get, streaming add
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Fetch all images in parallel, but add them in increasing order.  When image 1
// arrives, add it, and add continue adding 2, 3, and 4 if they have arrived,
// etc.  Otherwise don't do anything.
function promiseParallelGetStreamingAdd() {
  addSpinner()

  let queue = []
  let cur = 0

  getIndexP()
    .then(images => {
      for (let i in images) {
        getImageP(images[i])
          .then(img => {
            queue[i] = img
            while (queue[cur] != null) {
              addImage(queue[cur++])
            }
            if (cur === images.length) {
              removeSpinner()
            }
          })
      }
    })
}

//~~~~~~~~~~
// Fastest
//~~~~~~~~~~

// Add an <img> element for each image, the browser will take care of making the
// actual requests and put the image at the proper place when it is loaded.
function promiseFastest() {
  getIndexP().then(images => images.map(addImage))
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// With async/await
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// One last time.  We rewrite the functions above using async functions and the
// await keyword instead of promises.

// We don't need new AJAX helpers, since `await` works with promises.

//~~~~~~~~~~
// Parallel
//~~~~~~~~~~

// Start fetching all the images in parallel, and add them as soon as they
// arrive.
async function asyncParallel() {
  addSpinner()

  let urls = await getIndexP()
  await Promise.all(urls.map(async url => {
    let img = await getImageP(url)
    addImage(img)
  }))
  removeSpinner()
}

//~~~~~~~~~~~~
// Sequential
//~~~~~~~~~~~~

// Fetch the first image then add it, then fetch the second one and add it, etc.
async function asyncSequential() {
  addSpinner()

  let urls = await getIndexP()
  for (let url of urls) {
    let img = await getImageP(url)
    addImage(img)
  }

  removeSpinner()
}

//~~~~~~~~~~~~~~~~~~~~~~~
// Parallel get, add all
//~~~~~~~~~~~~~~~~~~~~~~~

// Fetch all images in parallel, but wait until all have arrived before adding
// them in order.
async function asyncParallelGetAddAll() {
  addSpinner()

  let urls = await getIndexP()
  let images = await Promise.all(urls.map(getImageP))
  images.forEach(addImage)

  removeSpinner()
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Parallel get, streaming add
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Fetch all images in parallel, but add them in increasing order.  When image 1
// arrives, add it, and add continue adding 2, 3, and 4 if they have arrived,
// etc.  Otherwise don't do anything.
async function asyncParallelGetStreamingAdd() {
  addSpinner()

  let queue = []
  let cur = 0

  let urls = await getIndexP()
  for (let i in urls) {
    getImageP(urls[i])
      .then(img => {
        queue[i] = img
        while (queue[cur] != null) {
          addImage(queue[cur++])
        }
        if (cur === urls.length) {
          removeSpinner()
        }
      })
  }
}

//~~~~~~~~~~
// Fastest
//~~~~~~~~~~

// Add an <img> element for each image, the browser will take care of making the
// actual requests and put the image at the proper place when it is loaded.
async function asyncFastest() {
  let urls = await getIndexP()
  urls.forEach(addImage)
}
