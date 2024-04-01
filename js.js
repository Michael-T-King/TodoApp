let arr = [];

let counter = arr.length;
let doneCounter = 0;
let reverseCounter = 0;
let ul = document.querySelector(".tasks");
let form = document.querySelector("form");
let delAll = document.querySelector(".clear__all");
let doneTask = document.querySelector(".donetask");
let allTask = document.querySelector(".alltask");
let menu = document.querySelectorAll(".menu");
let loadProgress = document.querySelector(".loading__progress");
let percent = document.querySelector(".percent");
let favNum = document.querySelector(".fav__num");

let state = "all";
let doneNum = 0;
let value = 0;
let star = "grade";
let favoriteNum = 0;

function saveTodoList() {
  localStorage.setItem('box', JSON.stringify(arr));
}

function loadTodoList() {
  let savedList = localStorage.getItem('box');
  if (savedList) {
    arr = JSON.parse(savedList);
  }
}

let showTasks = () => {
  allTask.textContent = arr.length;
  doneNum = arr.filter((el) => {
    return el.isDone === true;
  }).length; // счетчик выполненных заданий
  doneTask.textContent = doneNum;

  favoriteNum = arr.filter((el) => el.isImp === true).length; // счетчик избранных
  favNum.textContent = favoriteNum;

  value = arr.length > 0 ? (doneNum / arr.length) * 100 : 0; // счетчик прогресса
  percent.textContent = `${Math.floor(value)}%`;
  loadProgress.style.width = value + "%";
  ul.innerHTML = "";

  /*****окрашиваем первый элемент меню  **********/
  let allBtn = document.querySelector(".all");
  if (state === "all") {
    allBtn.style.backgroundColor = "#8C4BE7";
    allBtn.style.color = "#fff";
  } else {
    allBtn.style.backgroundColor = "transparent";
    allBtn.style.color = "#8C4BE7";
  }

  //------------------------------------------------------
  /*******определяем на какой элемент меню кликнули ******/
  arr.filter((el) => {
      if (state === "all") {
        return el;
      } else if (state === "done") {
        return el.isDone === true;
      } else if (state === "favorites") {
        return el.isImp === true;
      } else return;
      //--------------------------------------------------
    })
    .forEach((el, idx) => {
      ul.innerHTML += `
      <li class="li__items" style="background: ${
        el.isDone ? "#0bf671" : el.isImp ? "#FFF7D1" : "#F3F1F4"
      };">
          <p class="text__li" style="width: 100%;">${idx + 1}. ${el.text}</p>
          <div class="buttons">
              <button class="favorite" data-id="${
                el.id}" title="add to favorites">
                  <span class="material-symbols-outlined">
                      ${el.isImp ? "stars" : "grade"}
                  </span>
              </button>
              <button class="done" data-id="${el.id}" title="add to done">
                  <span class="material-symbols-outlined">
                      done
                  </span>
              </button>
              <button class="delete" data-id="${
                el.id
              }" title="delete your todo">
                  <span class="material-symbols-outlined">
                      delete
                  </span>
              </button>
          </div>
          <span class="material-symbols-outlined  fav__marks">
          ${el.isImp ? "stars" : ""}
          </span>
      </li>`;
    });

  /******* логика кнопки добавиьт в избранное ***************/
  let stars = document.querySelector(".material-symbols-outlined");
  let favorite = document.querySelectorAll(".favorite");
  favorite.forEach((el, idx) => {
    el.addEventListener("click", () => {
      arr = arr.map((item) => {
        if (item.id === +el.dataset.id) {
          if (item.isImp) star = "stars";
          else star = "grade";
          return { ...item, isImp: !item.isImp };
        }
        return item;
      });
      saveTodoList();
      showTasks();
    });
  });

  /***** логика кнопки удалить элемент ******/
  let delOne = document.querySelectorAll(".delete");
  delOne.forEach((el, idx) => {
    el.addEventListener("click", () => {
      arr = arr.filter((item) => {
        return item.id !== +el.dataset.id;
      });
      saveTodoList();
      showTasks();
    });
  });

  /***** логика кнопки выполненно *****/
  let btnDone = document.querySelectorAll(".done");
  btnDone.forEach((el, idx) => {
    el.addEventListener("click", () => {
      arr = arr.map((item) => {
        if (item.id === +el.dataset.id) {
          return { ...item, isDone: !item.isDone };
        }
        return item;
      });
      saveTodoList();
      showTasks();
    });
  });

  /**** отображение кнопок при наведении курсора  ******/
  let liItems = document.querySelectorAll(".li__items");
  liItems.forEach((item) => {
    let buttons = item.querySelector(".buttons");
    // let buttonDone = item.querySelector(".done");
    // let buttonDelete = item.querySelector(".delete");
    // let buttonFavorite = document.querySelector(".favorite");

    item.addEventListener("mouseover", () => {
      buttons.style.display = "flex";
    });

    item.addEventListener("mouseout", () => {
      buttons.style.display = "none";
    });
  });

  /*****  удалить все  ********/
  delAll.addEventListener("click", () => {
    arr = [];
    saveTodoList();
    showTasks();
  });
};

form[1].addEventListener("click", (e) => {
  e.preventDefault();
  let inputValue = form[0].value.trim(); // Определение переменной inputValue

  if (inputValue !== '') {
    arr = [...arr,{ id: arr.length + 1, text: inputValue, isDone: false, isImp: false },
    ];
    saveTodoList();
    showTasks();
    form[0].value = '';
  }
});

/****** при клике на элеменнты меню окрашиваются *******/
menu.forEach((el) => {
  el.addEventListener("click", () => {
    state = el.textContent;
   // console.log(state);
    menu.forEach((item) => {
      if (item === el) {
        item.style.backgroundColor = "#8C4BE7";
        item.style.color = "#fff";
      } else {
        item.style.backgroundColor = "transparent";
        item.style.color = "#8C4BE7";
      }
    });
    saveTodoList();
    showTasks();
  });
});
loadTodoList();
showTasks();
