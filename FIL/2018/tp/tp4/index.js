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
  getIndex(images => {
    for (let im of images) {
      getImage(im, addImage)
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
  getIndexP()
    .then(images => /* ... */)
}

//~~~~~~~~~~~~
// Sequential
//~~~~~~~~~~~~

// Fetch the first image then add it, then fetch the second one and add it, etc.
function promiseSequential() {

}

//~~~~~~~~~~~~~~~~~~~~~~~
// Parallel get, add all
//~~~~~~~~~~~~~~~~~~~~~~~

// Fetch all images in parallel, but wait until all have arrived before adding
// them in order.
function promiseParallelGetAddAll() {

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Parallel get, streaming add
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Fetch all images in parallel, but add them in increasing order.  When image 1
// arrives, add it, and add continue adding 2, 3, and 4 if they have arrived,
// etc.  Otherwise don't do anything.
function promiseParallelGetStreamingAdd() {

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
function asyncParallel() {
  let urls = await getIndexP()

  /* ... */
}

//~~~~~~~~~~~~
// Sequential
//~~~~~~~~~~~~

// Fetch the first image then add it, then fetch the second one and add it, etc.
function asyncSequential() {

}

//~~~~~~~~~~~~~~~~~~~~~~~
// Parallel get, add all
//~~~~~~~~~~~~~~~~~~~~~~~

// Fetch all images in parallel, but wait until all have arrived before adding
// them in order.
function asyncParallelGetAddAll() {

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Parallel get, streaming add
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Fetch all images in parallel, but add them in increasing order.  When image 1
// arrives, add it, and add continue adding 2, 3, and 4 if they have arrived,
// etc.  Otherwise don't do anything.
function asyncParallelGetStreamingAdd() {

}
