## FIL JavaScript 2018--2019

### Reading

- [Eloquent JavaScript](http://eloquentjavascript.net/) is a good book for
  beginners, covering not only JavaScript but also a bit of web programming and
  Node.js, with fun exercises and mini-projects.
- [MDN JavaScript
  Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide) is a
  great reference on the JavaScript language, with articles aimed at different
  skill levels: beginner/intermediate/advanced.
- [JavaScript. The
  Core](http://dmitrysoshnikov.com/ecmascript/javascript-the-core-2nd-edition/)
  is an excellent digest of some of the more important parts of the ECMAScript
  specification.  The author also has [more in-depth
  chapters](http://dmitrysoshnikov.com/) on specific topics.

### Lectures

- Lecture 0: [JavaScript Overview](slides/js-intro/)
- Lecture 1: [Closures](slides/closures/) ([recommended reading](http://dmitrysoshnikov.com/ecmascript/javascript-the-core-2nd-edition/#closure))
- Lecture 2: [Prototypes](slides/proto/) ([recommended reading](http://dmitrysoshnikov.com/ecmascript/javascript-the-core-2nd-edition/#prototype))
- Lecture 3: [Concurrency](slides/async/) ([event loop simulator](http://latentflip.com/loupe/),
  [intro to promises](https://developers.google.com/web/fundamentals/primers/promises),
  [about tasks and queues](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/))

### Labs
TP0, TP1, TP2 and TP3 are written for [s3c](/s3c).

- [TP0 – Basics](/tp/tp0.js) ([solution](tp/tp0.solution.js))
- [TP1 – Higher-Order Functions](../2017/tp1.js) ([solution](../2017/tp1.solution.js))
- [TP2 – Creating Objects](tp/tp2.js) ([solution](tp/tp2.solution.js))
- [TP3 – Implementing Objects and Prototypes](tp/tp3.js)

For TP4, you'll need to unzip the archive and run your own web server.  With
Python 3, in the folder containing the `index.html` file:

```
$ python -m http.server
```

Then edit the `index.js` file in your editor of choice and follow its instructions.

- [TP4 - Callbacks, Promises and Async](tp/tp4.zip)
