// What's a web framework?

// 0. An entry point

document.addEventListener('DOMContentLoaded', function() {
  var model = TodoList.new();
  var view = View.new(document.getElementById('todoapp'));
  Controller.new(model, view);

  // A router
  window.addEventListener('hashchange', function() {
    Controller.setView(document.location.hash);
  });
});

// 1. A Model

var TodoList = {
  new: function() {
    return {
      __proto__: this,
      todos: new window.Map(),
      ids: 0,
    };
  },

  add: function(text) {
    var t = Todo.new(text);
    t.id = this.ids++;
    this.todos.set(t.id, t);
    return t;
  },

  get: function(id) {
    return this.todos.get(id);
  },

  filter: function(pred) {
    var ts = [];
    this.todos.forEach(function(t, id) {
      if (pred(t))
        ts.push(t);
    });
    return ts;
  },

  getAll: function() {
    return this.filter(function() { return true; });
  },

  getCompleted: function() {
    return this.filter(function(t) {
      return t.completed;
    });
  },

  getActive: function() {
    return this.filter(function(t) {
      return !t.completed;
    });
  },

  getActiveCount: function() {
    return this.getActive().length;
  },

  getCompletedCount: function() {
    return this.getCompleted().length;
  },

  delete: function(id) {
    this.todos.delete(id);
  },
};

var Todo = {
  new: function(text) {
    return {
      __proto__: this,
      completed: false,
      text: text,
    };
  },

  markCompleted: function() { this.completed = true; },
  markUncompleted: function() { this.completed = false; },
  toggle: function() { this.completed = !this.completed; },
};

// 2. Views
// Abstracts away the DOM representation of the model.
// Captures DOM events and releases logical events for the controller.

var View = {
  new: function($root) {
    return {
      __proto__: this,
      $root: $root,
    };
  },

  init: function() {
    var $new = this.$root.querySelector('#new-todo');

    $new.addEventListener('keypress', function(event) {
      var text = $new.value.trim();
      if (event.which === ENTER_KEY && text.length > 0) {
        $new.value = '';
        this.trigger('command.add-todo', {detail: text});
      }
    }.bind(this));

    this.$todoList = this.$root.querySelector('#todo-list');

    this.$root.addEventListener('click', function(event) {
      var $el = event.target;

      if ($el.classList.contains('toggle')) {
        var id = parseInt($el.parentNode.parentNode.getAttribute('data-id'), 10);
        this.trigger('command.toggle-todo', {detail: id});
      }

      else if ($el.id === 'toggle-all') {
        this.trigger('command.toggle-all', {detail: $el.checked});
      }

      else if ($el.classList.contains('destroy')) {
        var id = parseInt($el.parentNode.parentNode.getAttribute('data-id'), 10);
        this.trigger('command.remove-todo', {detail: id});
      }

      else if ($el.id === 'clear-completed') {
        this.trigger('command.clear-completed');
      }
    }.bind(this));
  },

  showList: function(todos) {
    this.$todoList.innerHTML = '';
    this.$todoList.appendChild(render.todoList(todos));
  },

  updateFilters: function(filter) {
    var $filters = this.$root.querySelectorAll('#filters a');

    for (var i = 0; i < $filters.length; i++) {
      var active = $filters[i].getAttribute('href') === '#/' + filter;
      $filters[i].classList.toggle('selected', active);
    }
  },

  add: function(todo) {
    this.$todoList.appendChild(render.todo(todo));
  },

  toggle: function(id) {
    var $t = this.$todoList.querySelector('[data-id="' + id + '"]');
    $t.classList.toggle('completed');

    // Ensure checkbox is coherent with list state
    var isCompleted = $t.classList.contains('completed');
    $t.querySelector('input').checked = isCompleted;
  },

  setCompleted: function(id, completed) {
    var $t = this.$todoList.querySelector('[data-id="' + id + '"]');
    $t.classList.toggle('completed', completed);
    $t.querySelector('input').checked = completed;
  },

  delete: function(id) {
    var $t = this.$todoList.querySelector('[data-id="' + id + '"]');
    $t.parentNode.removeChild($t);
  },

  updateActiveCount: function(count) {
    var $count = this.$root.querySelector('#todo-count');
    var plural = count !== 1 ? 's' : '';
    $count.innerHTML = '<strong>' + count + '</strong> item' + plural + ' left';
  },

  updateCompletedCount: function(count) {
    var $footer = this.$root.querySelector('#footer');
    var $clearCompleted = this.$root.querySelector('#clear-completed');

    if (count === 0) {
      if ($clearCompleted != null)
        $footer.removeChild($clearCompleted);
    }

    else if (count > 0) {
      if ($clearCompleted == null) {
        $footer.appendChild(render.clearCompletedButton(count));
      } else {
        $clearCompleted.textContent = 'Clear completed (' + count + ')';
      }
    }
  },

  trigger: function(name, detail) {
    this.$root.dispatchEvent(new window.CustomEvent(name, detail));
  },
};

var render = {
  todoList: function(todos) {
    var f = document.createDocumentFragment();

    todos.forEach(function(t) {
      f.appendChild(render.todo(t));
    });

    return f;
  },

  todo: function(todo) {
    var li = document.createElement('li');
    li.setAttribute('data-id', todo.id);
    if (todo.completed) li.classList.add('completed');

    var div = document.createElement('div');
    div.classList.add('view');

    var input = document.createElement('input');
    input.classList.add('toggle');
    input.setAttribute('type', 'checkbox');
    if (todo.completed) input.setAttribute('checked', true);
    div.appendChild(input);

    var label = document.createElement('label');
    label.textContent = todo.text;
    div.appendChild(label);

    var button = document.createElement('button');
    button.classList.add('destroy');
    div.appendChild(button);

    li.appendChild(div);

    return li;
  },

  clearCompletedButton: function(count) {
    var button = document.createElement('button');
    button.id = 'clear-completed';
    button.textContent = 'Clear completed (' + count + ')';
    return button;
  }
};

// 3. A Controller
// Binds the model and view together.
// Should not deal with the DOM at all.

const ENTER_KEY = 13;

var Controller = {
  new: function(todoList, view) {
    this.todoList = todoList;
    this.view = view;

    var $app = document.querySelector('#todoapp');

    view.init();

    $app.addEventListener('command.add-todo', function(e) {
      var label = e.detail;
      var t = todoList.add(label);
      view.add(t);
      view.updateActiveCount(todoList.getActiveCount());
    });

    $app.addEventListener('command.toggle-todo', function(e) {
      var id = e.detail;
      todoList.get(id).toggle();
      view.toggle(id);
      view.updateActiveCount(todoList.getActiveCount());
      view.updateCompletedCount(todoList.getCompletedCount());
    });

    $app.addEventListener('command.toggle-all', function(e) {
      var completed = e.detail;
      todoList.getAll().forEach(function(t) {
        t.completed = completed;
        view.setCompleted(t.id, completed);
      });
      view.updateActiveCount(todoList.getActiveCount());
      view.updateCompletedCount(todoList.getCompletedCount());
    });

    $app.addEventListener('command.remove-todo', function(e) {
      var id = e.detail;
      todoList.delete(id);
      view.delete(id);
      view.updateActiveCount(todoList.getActiveCount());
      view.updateCompletedCount(todoList.getCompletedCount());
    });

    $app.addEventListener('command.clear-completed', function() {
      todoList.getCompleted().forEach(function(t) {
        todoList.delete(t.id);
        view.delete(t.id);
      });
      view.updateCompletedCount(todoList.getCompletedCount());
    });
  },

  setView: function(hash) {
    var filter = hash.split('/')[1];
    var ts;

    switch (filter) {
      case '': ts = this.todoList.getAll(); break;
      case 'completed': ts = this.todoList.getCompleted(); break;
      case 'active': ts = this.todoList.getActive(); break;
    }

    this.view.updateFilters(filter);
    this.view.showList(ts);
  },
};


// 1. A router

// var routes = {
//   '/': views.index,
//   '/active': views.active,
//   '/completed/': views.completed,
// };

// Return the first matching path pattern, or null
// function matchingRoute(path) {
//   var r = Object.keys(routes);

//   for (var i = 0; i < r.length; i++) {
//     var pattern = r[i];
//     if (path.match(pattern))
//       return routes[pattern];
//   }

//   return null;
// }

// function router() {
//   var path = document.location.pathname;

//   var fn = matchingRoute(path);

//   if (fn)
//     fn();
// }

// Data binding

// Templates

// Data access
