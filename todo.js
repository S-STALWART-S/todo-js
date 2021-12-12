let dialogBox,
  dialogEmptyTodo,
  dialogNewTodo,
  spreadedTodos,
  inputList,
  editingId,
  filteredNames,
  inputNewData;

class todoMaker {
  constructor(name) {
    this.name = name;
    this.completed = false;
    this.id = (Math.random() * Math.random()) / 165421;
    this.date = Date.now();
  }
  complete() {
    this.completed = true;
  }
  undo() {
    this.completed = false;
  }
}
class TodoListJobs {
  constructor() {
    this.todos = [];
    spreadedTodos = this.todos;
  }
  add(name) {
    const todo = new todoMaker(name);
    this.todos.push(todo);
  }
  remove(id) {
    // this.tasks = this.tasks.filter((t) => t.id !== id );
    const index = this.todos.findIndex((t) => t.id === id);
    if (index !== -1) {
      this.todos.splice(index, 1);
    }
  }
}
function builderMachine(targetName) {
  this.elem = document.createElement(targetName);
  this.value = function (value) {
    this.elem.value = value;
    return this;
  };
  this.text = function (text) {
    this.elem.textContent = text;
    return this;
  };
  this.style = function (style) {
    this.elem.style = style;
    return this;
  };
  this.type = function (type) {
    this.elem.type = type;
    return this;
  };
  this.innerHTML = function (innerHTML) {
    this.elem.innerHTML = innerHTML;
    return this;
  };
  this.append = function (parent) {
    if (parent instanceof builderMachine) {
      parent.build().appendChild(this.elem);
      return this;
    } else parent.appendChild(this.elem);
    return this;
  };
  this.build = function () {
    return this.elem;
  };
  this.placeHolder = function (placeholder) {
    this.elem.placeholder = placeholder;
    return this;
  };
  this.id = function (id) {
    this.elem.id = id;
    return this;
  };
  this.disable = function (disable) {
    this.elem.disabled = disable;
    return this;
  };
  this.enable = function (enable) {
    this.elem.enabled = true;
    return this;
  };

  this.hider = function () {
    this.elem.style = "display:none";
    return this;
  };
  this.shower = function () {
    this.elem.style = "display:block";
    return this;
  };
  this.class = function (className) {
    this.elem.className = className;
    return this;
  };
  this.checked = function (classChecked) {
    this.elem.className = classChecked;
    return this;
  };
  this.onClick = function (func) {
    this.elem.onclick = func;
    return this;
  };
}
let builder = {
  create: function (targetName) {
    return new builderMachine(targetName);
  },
};
class TodoListApp {
  constructor(
    searchInput,
    confirmButton,
    addInput,
    addButton,
    addPanel,
    searchPanel,
    sortName,
    sortDate,
    list
  ) {
    this.todoList = new TodoListJobs();
    this.searchInput = searchInput;
    this.confirmButton = confirmButton;
    this.addInput = addInput;
    this.addButton = addButton;
    this.addPanel = addPanel;
    this.searchPanel = searchPanel;
    this.sortName = sortName;
    this.sortDate = sortDate;
    this.list = list;
    {
      // this.input = document.getElementById("myInput");
      // this.addButton = document.getElementById("addBtn");
      // this.list = document.getElementById("myUL");}
    }
  }

  /*************************initStart******************************/
  init() {
    //
    /********************modalCheck & Elements & Events ***********************/
    let paintCaller = () => {
      this.paint();
    };
    dialogEmptyTodo = document.getElementById("dialogEmptyTodo");
    dialogNewTodo = document.getElementById("dialogNewTodo");
    dialogBox = document.querySelector("dialog");
    inputNewData = document.getElementById("inputNewData");
    if (!dialogBox.showModal) {
      dialogPolyfill.registerDialog(dialogBox);
    }
    document.getElementById("okClose").addEventListener("click", function (e) {
      dialogBox.close();
      e.stopPropagation();
    });

    document.getElementById("okSave").addEventListener("click", function (e) {
      let inputNewData = document.getElementById("inputNewData").value;
      let findEditing = spreadedTodos;
      findEditing = findEditing.find((value) => {
        return value.id === editingId;
      });
      findEditing.name = inputNewData;
      findEditing.date = Date.now();
      dialogBox.close();
      e.stopPropagation();
      console.log(findEditing); // => its true
      // paint(findEditing); // => ?! =___=
      paintCaller(findEditing);
    });

    /*************************addButton******************************/
    this.addButton.addEventListener("click", () => {
      this.searchPanel.style = "display:none";
      this.addPanel.style = "display:block";
    });

    /*************************confirmButton******************************/
    this.confirmButton.addEventListener("click", () => {
      const name = this.addInput.value;
      if (name === "") {
        dialogEmptyTodo.style = "display:visible";
        dialogNewTodo.style = "display:none";
        dialogBox.showModal();
      } else {
        this.todoList.add(name);
        this.searchPanel.style = "display:block";
        this.addPanel.style = "display:none";
        this.addInput.value = "";
        this.searchInput.value = "";
        this.paint();
      }
    });

    /*************************sortName******************************/
    this.sortName.addEventListener("click", () => {
      let sortContainer = spreadedTodos;
      let sortedByName = sortContainer.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
      this.paint(sortedByName);
    });

    /*************************sortDate******************************/
    this.sortDate.addEventListener("click", () => {
      let sortContainer = spreadedTodos;
      let sortedByDate = sortContainer.sort((a, b) => {
        return b.date - a.date;
      });
      this.paint(sortedByDate);
    });
    /*************************search******************************/
    this.searchInput.addEventListener("input", () => {
      const name = this.searchInput.value;
      filteredNames = spreadedTodos;
      filteredNames = filteredNames.filter((task) => {
        return task.name.toLowerCase().includes(name.toLowerCase());
      });
      this.paint(filteredNames);
    });

    /*************************initEnd******************************/
  }
  /*************************paintStart******************************/
  paint(items = this.todoList.todos) {
    this.list.innerHTML = "";
    items.forEach((task) => {
      const li = builder
        .create("li")
        .class("")
        .text(task.name)
        .onClick(() => {
          if (task.completed) {
            task.undo();
          } else {
            task.complete();
          }
          this.paint();
        })
        .append(this.list);
      if (task.completed) {
        li.class("checked");
      }
      builder
        .create("span")
        .text("delete")
        .class("close material-icons")
        .onClick(() => {
          this.todoList.remove(task.id);
          this.paint();
        })
        .append(li);
      builder
        .create("span")
        .text("edit")
        .class("close material-icons")
        .onClick(() => {
          dialogBox.showModal();
          dialogEmptyTodo.style = "display:none";
          dialogNewTodo.style = "display:visible";
          inputNewData.value = task.name;
          inputNewData.focus();
          inputNewData.select();

          editingId = task.id;
          if (task.completed) {
            task.undo();
          } else {
            task.complete();
          }
        })
        .append(li);
    });
  }
  /*************************paintEnd******************************/
}

const app = new TodoListApp(
  (this.searchInput = document.getElementById("searchInput")),
  (this.confirmButton = document.getElementById("confirmButton")),
  (this.addInput = document.getElementById("addInput")),
  (this.addButton = document.getElementById("addButton")),
  (this.addPanel = document.getElementById("addPanel")),
  (this.searchPanel = document.getElementById("searchPanel")),
  (this.sortName = document.getElementById("sortName")),
  (this.sortDate = document.getElementById("sortDate")),
  (this.list = document.getElementById("contentUL"))
);
app.init();
