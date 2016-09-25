/* eslint-env mocha */
/* eslint no-unused-expressions: 0 */

var should = require('should');

suite('1 ~ adder', function() {
  var add2 = adder(2);

  test('function', function() {
    should.exist(add2);
    add2.should.be.type('function');
  });

  test('add2(8)', function() {
    should.exist(add2);
    add2(8).should.equal(10);
  });

  test('add2(-2)', function() {
    should.exist(add2);
    add2(-2).should.equal(0);
  });

});

suite('2 ~ counter', function() {
  var c1 = counter();
  var c2 = counter();

  test('function', function() {
    should.exist(c1);
    should.exist(c2);
    c1.should.be.type('function');
    c2.should.be.type('function');
  });

  test('inc', function() {
    should.exist(c1);
    should.exist(c2);
    c1().should.equal(1);
    c1().should.equal(2);

    c2().should.equal(1);
    c2().should.equal(2);
  });

  test('!==', function() {
    should.exist(c1);
    should.exist(c2);
    c1.should.not.equal(c2);
  });

});

suite('3 ~ bidiCounter', function() {
  var c1 = bidiCounter();
  var c2 = bidiCounter();

  test('function', function() {
    c1.should.be.type('function');
    c2.should.be.type('function');
  });

  test('inc/dec', function() {
    c1('inc').should.equal(1);
    c1('inc').should.equal(2);
    c1('dec').should.equal(1);

    c2('dec').should.equal(-1);
    c2('inc').should.equal(0);
  });

  test('!==', function() {
    c1.should.not.equal(c2);
  });

});

suite('4 ~ stack', function() {
  var s = stack();
  var s2 = stack();

  test('function', function() {
    s.should.be.type('function');
    s2.should.be.type('function');
  });

  test('push/size/peek', function() {
    s('push', 1);
    s('push', 2);
    s('push', 3);
    s('size').should.equal(3);
    s('pop').should.equal(3);
    s('peek').should.equal(2);
    s('size').should.equal(2);

    s2('size').should.equal(0);
  });

  test('not understood', function() {
    should.exist(s);
    s.should.not.throw();
    should.exist(s());
    s().should.equal("Message not understood");
  });

  test('!==', function() {
    s.should.not.equal(s2);
  });
});

suite('5 ~ queue', function() {
  var q = queue();
  var q2 = queue();

  test('function', function() {
    q.should.be.type('function');
    q2.should.be.type('function');
  });

  test('enqueue/size/dequeue', function() {
    q('enqueue', 1);
    q('enqueue', 2);
    q('enqueue', 3);
    q('size').should.equal(3);
    q('dequeue').should.equal(1);
    q('dequeue').should.equal(2);

    q2('size').should.equal(0);
  });

  test('not understood', function() {
    should.exist(q);
    q.should.not.throw();
    should.exist(q());
    q().should.equal("Message not understood");
  });

  test('!==', function() {
    q.should.not.equal(q2);
  });
});

suite('6 ~ collectionSize', function() {

  test('stack', function() {
    var s = stack();
    s('push', 1);
    s('push', 2);
    collectionSize(s).should.equal(2);

    collectionSize(stack()) === 0;
  });

  test('queue', function() {
    var q = queue();
    q('enqueue', 1);
    q('enqueue', 2);
    q('enqueue', 3);
    collectionSize(q).should.equal(3);

    collectionSize(queue()).should.equal(0);
  });
});

suite('7 ~ point', function() {
  var p1 = point(0);
  var p2 = point(1);

  test('function', function() {
    p1.should.be.type('function');
    p2.should.be.type('function');
  });

  test('!==', function() {
    p1.should.not.equal(p2);
  });

  test('getX/setX/equals', function() {
    p1('getX').should.equal(0);
    p2('getX').should.equal(1);
    p1('equals', p2).should.equal(false);
    p1('setX', 1);
    p1('equals', p2).should.equal(true);
  });

  test('not understood', function() {
    should.exist(p1);
    p1.should.not.throw();
    should.exist(p1());
    p1().should.equal('Message not understood');
  });
});

suite('8 ~ point2', function() {
  var p1 = point2(1);
  var p2 = point2(0);

  test('function', function() {
    p1.should.be.type('function');
    p2.should.be.type('function');
  });

  test('!==', function() {
    p1.should.not.equal(p2);
  });

  test('getX/setX/equals', function() {
    var p1 = point2(0);
    var p2 = point2(1);

    p1('getX').should.equal(0);
    p2('getX').should.equal(1);
    p1('equals', p2).should.equal(false);
    p1('setX', 1);
    p1('equals', p2).should.equal(true);
  });

  test('rightmost', function() {
    p1('rightmost', p2).should.equal(p1);
    p2('rightmost', p1).should.equal(p1);
    p2('setX', 2);
    p1('rightmost', p2).should.equal(p2);
    p2('rightmost', p1).should.equal(p2);
  });

  test('not understood', function() {
    should.exist(p1);
    p1.should.not.throw();
    should.exist(p1());
    p1().should.equal('Message not understood');
  });
});

suite('9 ~ makeCounter', function() {
  function makeCounter() {
    var i = 0;

    return object({
      inc: function() {
        i += 1;
        return i;
      },

      dec: function() {
        i -= 1;
        return i;
      },
    });
  }

  var c1 = makeCounter();
  var c2 = makeCounter();

  test('function', function() {
    c1.should.be.type('function');
    c2.should.be.type('function');
  });

  test('inc/dec', function() {
    c1('inc').should.equal(1);
    c1('inc').should.equal(2);
    c1('dec').should.equal(1);

    c2('dec').should.equal(-1);
    c2('inc').should.equal(0);

  });

  test('!==', function() {
    c1.should.not.equal(c2);
  });

  test('not understood', function() {
    should.exist(c1);
    c1.should.not.throw();
    should.exist(c1());
    c1().should.equal('Message not understood');
    c2('ee').should.equal('Message not understood');
  });
});

suite('10 ~ makePoint', function() {
  function makePoint(x) {
    return objectWithSelf({
      getX: function() {
        return x;
      },

      setX: function(self, v) {
        x = v;
      },

      equals: function(self, p) {
        return p('getX') === self('getX');
      },

      rightmost: function(self, p) {
        return self('getX') > p('getX') ? self : p;
      },
    });
  }

  test('function', function() {
    var p1 = makePoint(1);
    var p2 = makePoint(0);
    p1.should.be.type('function');
    p2.should.be.type('function');
  });

  test('!==', function() {
    var p1 = makePoint(1);
    var p2 = makePoint(0);
    p1.should.not.be.equal(p2);
  });

  test('getX/setX/equals', function() {
    var p1 = makePoint(0);
    var p2 = makePoint(1);

    p1('getX').should.equal(0);
    p2('getX').should.equal(1);
    p1('equals', p2).should.equal(false);
    p1('setX', 1);
    p1('equals', p2).should.equal(true);
  });

  test('rightmost', function() {
    var p1 = makePoint(1);
    var p2 = makePoint(0);
    p1('rightmost', p2).should.be.equal(p1);
    p2('rightmost', p1).should.be.equal(p1);
    p2('setX', 2);
    p1('rightmost', p2).should.be.equal(p2);
    p2('rightmost', p1).should.be.equal(p2);
  });

  test('not understood', function() {
    var p1 = makePoint(1);
    should.exist(p1);
    p1.should.not.throw();
    should.exist(p1());
    p1().should.equal('Message not understood');
  });
});

suite('11 ~ makePoint2d', function() {
  function makePoint2d(x,y) {
    var point1d = makePoint(x);

    return objectWithSelf({
      getX: function() {
        return point1d('getX');
      },

      setX: function(self, v) {
        point1d('setX', v);
      },

      getY: function() {
        return y;
      },

      setY: function(self, v) {
        y = v;
      },

      equals: function(self, p) {
        return point1d('equals', p) && p('getY') === self('getY');
      },
    });
  }

  var p1 = makePoint2d(1,2);
  var p2 = makePoint2d(3,5);

  test('function', function() {
    p1.should.be.type('function');
    p2.should.be.type('function');
  });

  test('!==', function() {
    p1.should.not.equal(p2);
  });

  test('getX/getX/setX/setY/equals', function() {
    p1('getX').should.equal(1);
    p1('getY').should.equal(2);
    p2('getX').should.equal(3);
    p2('getY').should.equal(5);
    p1('equals', p2).should.equal(false);
    p2('equals', p1).should.equal(false);
    p1('setX', 3);
    p1('setY', 5);
    p1('equals', p2).should.equal(true);
    p2('equals', p1).should.equal(true);
    p1('equals', p1).should.equal(true);
    p2('equals', p2).should.equal(true);
  });
});

suite('12 ~ makePoint2dDelegated', function() {
  function makePoint2dDelegated(x, y) {
    return objectWithDelegate({
      getY: function() {
        return y;
      },

      setY: function(self, v) {
        y = v;
      },

      equals: function(self, p) {
        return self.delegate('equals', p) && p('getY') === self('getY');
      },
    }, makePoint(x));
  }

  test('function', function() {
    var p1 = makePoint2dDelegated(1,2);
    var p2 = makePoint2dDelegated(3,5);
    p1.should.be.type('function');
    p2.should.be.type('function');
  });

  test('!==', function() {
    var p1 = makePoint2dDelegated(1,2);
    var p2 = makePoint2dDelegated(3,5);
    p1.should.not.equal(p2);
  });

  test('getX/getX/setX/setY/equals', function() {
    var p1 = makePoint2dDelegated(1,2);
    var p2 = makePoint2dDelegated(3,5);
    p1('getX').should.equal(1);
    p1('getY').should.equal(2);
    p2('getX').should.equal(3);
    p2('getY').should.equal(5);
    p1('equals', p2).should.equal(false);
    p2('equals', p1).should.equal(false);
    p1('setX', 3);
    p1('setY', 5);
    p1('equals', p2).should.equal(true);
    p2('equals', p1).should.equal(true);
    p1('equals', p1).should.equal(true);
    p2('equals', p2).should.equal(true);
  });

  test('delegate property set', function() {
    var p1 = makePoint2dDelegated(1,2);
    var p2 = makePoint2dDelegated(3,5);
    should.exist(p1.delegate);
    p1.delegate.should.be.type('function');
    should.exist(p2.delegate);
    p2.delegate.should.be.type('function');
  });

  test('no shortcut equals', function() {
    var p1 = makePoint2dDelegated(1,2);
    var p2 = makePoint2dDelegated(3,5);
    p1('setX', 3);
    p1('equals', p2).should.be.false;
    p2('equals', p1).should.be.false;
  });

  test('broken self', function() {
    var p1 = makePoint2dDelegated(1,2);
    var p2 = makePoint2dDelegated(3,5);
    p2('rightmost', p1).should.not.be.equal(p2);
    p1('rightmost', p2).should.be.equal(p2);
  });
});

suite('13 ~ makePointDelegated', function() {
  function makePointWithReceiver(x) {
    return objectWithSelf2({
      getX: function() { return x; },
      setX: function(self, v) { x = v; },
      rightmost: function(self, p) { return self(self, 'getX') > p(p, 'getX') ? self : p; },
    });
  }

  function makePointDelegated(x) {
    return objectWithDelegate2({}, makePointWithReceiver(x));
  }

  test('setX', function() {
    var p1 = makePointDelegated(1);
    should.exist(p1);
    p1(p1, 'setX', 2);
    p1(p1, 'getX').should.equal(2);
  });

  test('fixed self', function() {
    var p1 = makePointDelegated(1);
    var p2 = makePointDelegated(3);
    should.exist(p1);
    should.exist(p2);
    p2(p2, 'rightmost', p1).should.equal(p2);
    p1(p1, 'rightmost', p2).should.equal(p2);
  });

  test('not understood', function() {
    var p1 = makePointDelegated(1);
    should.exist(p1);
    p1.should.not.throw();
    should.exist(p1());
    p1().should.equal('Message not understood');
  });
});
