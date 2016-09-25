% JavaScript: Objects and Prototypes
% fmdkdd
% Mines Nantes ~ 2014/2015

# Objects

## Objects are bags of properties

No distinction between methods and fields

Not “instances” of a “class”

Just a bag, or dictionary

## Example of object
```
var an_object = {
  fruta: "frambuesa",
  a_number: 2,
  square: function(x) {
    return x * x;
  },
  another_object: {
    x: 3,
    y: 12,
  },
}
```

## Objects are dynamic
```
var o = { x: 2 };
o.x = 12;
o.y = function() { return 5; };
delete o.x;

o.x; // undefined
o.y; // [Function]
```

Unknown properties return undefined

# Objects and Prototypes

## Self-reference
<pre><code>var A = {
  x: 2,
  square: function() {
    return <span class="kw">this</span>.x * <span class="kw">this</span>.x;
  }
}

A.square(); // 4</code></pre>

<code class="kw">this</code> binds to <code>A</code>

<div role="note">
- Core OO concept
- Keyword is `this`, needs to be explicit
- `this` binds to A, the receiver
</div>

## Mental model of functions
<pre class="tiny">
                  +-----------------+
                  |  +-----------+  |
+----+            |  |  bindings |  |
|<span class="kw">this</span>|----------->|  +-----------+  |
+----+            |                 |
                  |    function     |
                  |                 |
+------------+    |   +--------+    |   +-------+
| arguments  |--->|   |  body  |    |-->|return |
+------------+    |   +--------+    |   |value  |
                  +-----------------+   +-------+</pre>

<code class="kw">this</code> is bound at **call-time** to the receiver

<div role="note">
- `this`: extra hidden argument
</div>

## Method stealing
```
var A = {
  x: 2,
  square: function() {
    return this.x * this.x;
  }
}

var B = { x: 10 };
B.square = A.square;
B.square(); // 100
```

`B` is the receiver, so `this` is bound to `B`

## Behavior duplication
<pre><code>var hare = { x: 0, speed: 2,
  <span class="alert">step: function() {
    this.x += this.speed;
  }</span>
};

var turtle = { x: 0, speed: 1,
  <span class="alert">step: function() {
    this.x += this.speed;
  }</span>
};</code></pre>

<div role="note">
- Share behavior between objects
- How to eliminate duplication of `step`?
</div>

## Forwarding to avoid duplication
<pre><code>var hare = { x: 0, speed: 2,
  step: function() {
    this.x += this.speed;
  }
};

var turtle = { x: 0, speed: 1,
  <span class="alert">step: hare.step</span>
}

hare.step(); hare.x; // 2
turtle.step(); turtle.x; // 1</code></pre>

## Forwarding does not scale
<pre><code>var hare = {
  step: ..., run: ...
  sleep: ..., eat: ...
  ...
}

var turtle = {
  step: hare.step, run: hare.run,
  sleep: hare.sleep, eat: hare.eat,
  ...
}</code></pre>

<div role="note">
- How to say it more directly?
</div>

## Delegation with *prototypes*
<pre><code class="eval preload">var hare = { x: 0, speed: 2,
  step: function() {
    this.x += this.speed;
  }
}

var turtle = {
  <span class="alert">__proto__: hare</span>, x: 0, speed: 1
}

turtle.step();
turtle.x; // 1</code></pre>

<div role="note">
- proto special property
</div>

## Using `Object.create`

To assign the prototype at creation time,
```
var turtle = Object.create(hare);
turtle.x = 0;
turtle.speed = 1;
```

is equivalent to,
```
var turtle = {
  __proto__: hare,
  x: 0,
  speed: 1,
};
```

## Mental model of prototypes
```
+--------+ __proto__  +--------+ __proto__
| B      |----------->| A      |----------->null
| y: 3   |            | x: 2   |
+--------+            | y: 5   |
                      +--------+
```

```
B.x; // 2
B.y; // 3
B.z; // undefined
```

Properties are looked up along the prototype chain

The chain should not contain cycles

# Constructing objects

## Object literals encapsulate state
```
var point1d = {
  x: 0,
  move: function(dx) {
    point1d.x += dx;
  },
};

point1d.move(1);
point1d.x; // 1
```

This is great for singleton objects

## Tedious to create copies
```
var duck1 = {
  size: 12, swim: function() { ... }
}

var duck2 = {
  size: 2, swim: function() { ... }
}

var duck3 = {
  size: 5, swim: function() { ... }
}
```

## Cloning

There is no generic cloning facility in JavaScript

So you cannot do,
```
var duck2 = Object.clone(duck1);
var duck3 = Object.clone(duck1);
```

Contrarily to other prototypes languages like Self

Nothing prevents us from rolling our own

## *Factories* to the rescue
```
function duckMaker(size) {
  return {
    size: size,
    swim: function() { ... }
  };
}

var donald = duckMaker(12);
var scrooge = duckMaker(2);
var louie = duckMaker(5);
```

<div role="note">
- swim is still duplicated at runtime, not shared
- swim update needs to happen for each duck
</div>

## Factories duplicate methods at runtime
This is wasteful,
```
var donald = duckMaker(12);
var scrooge = duckMaker(2);

donald.swim === scrooge.swim; // false
```

Additionally, cannot update methods for all objects at once

## Shared behavior using prototypes
<pre><code>var <span class="alert">protoDuck</span> = { swim: function() { /* */ } };

function duckMaker(size) {
  return { <span class="alert">__proto__: protoDuck</span>, size: size };
}

var donald = duckMaker(12);
var scrooge = duckMaker(2);

donald.swim === scrooge.swim; // true

<span class="alert">protoDuck</span>.eat = function() { this.size += 1; }

donald.eat(); donald.size; // 13
scrooge.eat(); scrooge.size; // 3</code></pre>

<div role="note">
- Modifications to behavior is shared as well
</div>

## Abstracting factories
```
function createObject(proto, properties) {
  properties.__proto__ = proto;
  return properties;
}

function duckMaker(size) {
  return createObject(protoDuck, {
    size: size
  });
}

var donald = duckMaker(12);
```
equivalent to,
```
var donald = createObject(protoDuck, {size: 12});
```

## The “Java-like” way
<pre><code>function Duck(size) {
  <span class="kw">this</span>.size = size;
}

<span class="id">Duck.prototype</span>.swim = function(){...};
<span class="id">Duck.prototype</span>.eat = function(){...};

var donald = <span class="alert">new</span> Duck(12);</code></pre>

<code class="alert">new</code> creates an empty object, binds it to
<code class="kw">this</code>, and assigns its `__proto__`
to <code class="id">Duck.prototype</code>

<div role="note">
- `new` creates empty object
- binds `this`
- assigns proto to Duck.prototype
</div>

## All in one
<pre><code>var duck = {
  <span class="alert">new: function(size) {
    return {
      __proto__: this,
     size: size,
    };
  }</span>,
  eat: function() { this.size += 1; },
};

var donald = duck.new(12);
var scrooge = <span class="id">donald.new(5)</span>;</code></pre>

## Dynamic prototype switch
`__proto__` is just another property

It can be changed dynamically

But you should use `Object.setPrototypeOf` and `Object.getPrototypeOf`
rather than `__proto__` directly

It’s also **not recommended** for performance

<div role="note">
- Change class of instance at runtime in Java?
</div>

## Dynamic prototype switch
<pre><code>var duck = {
  swim: function() { ... }
}

var witch = {
  burn: function() { ... }
}

var donald = { __proto__: duck };
donald.swim();
<span class="alert">donald.__proto__ = witch;</span>
donald.burn();</code></pre>

## Motivation: the Pacman example
<img style="width: 500px; margin-left: 150px; image-rendering: -moz-crisp-edges;" src="img/pacman-logic.png">

<div role="note">
- Eats fruit, becomes fast, eats ghosts
- Ghosts flee in terror
</div>

## The stateful Pacman object
<pre class="smaller"><code>var pacman = {
  x: 0, speed: 1,
  <span class="alert">hasEatenFruit</span>: false,

  move: function() { this.x += this.speed; },

  collideWithGhost: function() {
    <span class="kw">if</span> (this.<span class="alert">hasEatenFruit</span>) ghost.die();
    <span class="kw">else</span> this.die();
  },

  eatFruit: function() {
    this.<span class="alert">hasEatenFruit</span> = true;
    this.<span class="alert">speed</span> = 2;
    ghost.<span class="alert">flee</span> = true;
  }
}
</code></pre>

<div role="note">
- flags for state, have to use if/else
- scattered behavior
</div>

## The stateful ghost
<pre><code>
var ghost = {
  move: function() {
    <span class="kw">if</span> (this.<span class="alert">flee</span>)
      fleePacman();
    <span class="kw">else</span>
      huntPacman();
  }
}</code></pre>

<div role="note">
- Same thing
</div>

## Prototypes to hide the state
<pre class="smaller"><code>var protoPacman = {
  speed: 1,
  move: function() { this.x += this.speed; },
  collideWithGhost: function() { this.die(); },
  eatFruit: function() {
    this.<span class="alert">__proto__ = superPacman</span>;
    ghost.<span class="alert">__proto__ = fleeingGhost</span>; } }

var pacman = { <span class="alert">__proto__: protoPacman</span>, x: 0 };

var superPacman = {
  <span class="alert">__proto__: protoPacman</span>,
  speed: 2,
  collideWithGhost: function() { ghost.die(); } }</code></pre>

  <div role="note">
    <ul>
      <li>One object per state</li>
      <li>State pattern by inheritance instead of composition</li>
    </ul>
  </div>

## One object per state
<pre class="smaller"><code>
var protoGhost = {
  move: function() { huntPacman(); }
}

var ghost = {
  <span class="alert">__proto__: protoGhost</span>
}

var fleeingGhost = {
  move: function() { fleePacman(); }
}</code></pre>

# Conclusion

## Takeaway
- Dynamic binding of `this` for delegation
- Prototypes for shared behavior and state
- Factories for creating similar objects
- Dynamic inheritance for state pattern

## Further reading
[Organizing Programs without Classes](http://selflanguage.org/documentation/published/organizing-programs.html)

[JS Objects: De“construct”ion](http://davidwalsh.name/javascript-objects-deconstruction)

[JavaScript.  The core.](http://dmitrysoshnikov.com/ecmascript/javascript-the-core/)

# FIN

## Extending built-in objects
Objects literals have `Object.prototype` as their `__proto__`

```
var o = {};
o.toString(); // "{}"

Object.prototype.x = 12;
o.x; // 12
```

Modifying `Object.prototype` adds properties to **all** objects

## Functions inherit from `Function.prototype`
```
var f = function() { return 2; }
f.call; // [Function]
f.call(); // 2
```

## The “global” object
```
var x = 12;
this.x; // 12
```
The top level is another object

```
function f() { return this.x; }
f(); // 12
```

`this` binds to it for calls without an explicit receiver


## This explains...
```
var A = {
  x: 2,
  square: function() {
    return this.x * this.x;
  }
}

var square = A.square;
square(); // undefined
this.x = 8;
square(); // 64
```

## Specifying `this` to a function
You can **override** the value of `this` with `call` and `apply`

<pre><code>var A = {
  x: 2,
  square: function() {
    return this.x * this.x;
  }
}

var square = A.square;
square.call(<span class="alert">A</span>); // 4
square.call(<span class="alert">{x:12}</span>); // 144</code></pre>
</section>

## Binding `this` to an object
You can also **bind** `this` to a specific object

<pre><code>var A = {
  x: 2,
  square: function() {
    return this.x * this.x;
  }
}

var square = A.square.<span class="alert">bind</span>(A);
square(); // 4
square.call({x:42}); // 4</code></pre>

## And that leads to...
And that leads to...

<pre class="smaller"><code>var bind = Function.prototype
  .call.bind(Function.prototype.bind);

bind({x:12}, square)(); // 144
bind({x:8}, square)(); // 64

// bind(Obj, func) <=> func.bind(Obj)</code></pre>
