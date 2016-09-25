function bind(f, self) {
  return function(/* args */) {
    return f.apply(self, arguments);
  };
}

function partial(f, /* args */) {

}
