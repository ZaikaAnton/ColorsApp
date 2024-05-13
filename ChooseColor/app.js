// Слушатель событий, который по нажатию на пробел генерит новые цвета для карточек.
document.addEventListener("keydown", (event) => {
  if (event.code.toLowerCase() === "space") {
    setRandomColors();
  }
});

// Это написал сам. Проблема была, когда кликал на замок и пробелом менял цвет, то пробел захватывал нажатый замок и изменял его обратно, при этом меняв цвет, как и требуется
// Но замок он не должен был захватывать. Написал такую штуку.
document.addEventListener("keydown", (event) => {
  const type = event.target.dataset.type;
  if (type === "lock") {
    event.preventDefault(); // Это свойство отменяет стандартное действие события в браузере
  }
});

// Этот слушатель меняет иконку замка с открытой, на закрытую
// А еще тут реализовано копирование по клику на текст, который обозначает цвет
document.addEventListener("click", (event) => {
  const type = event.target.dataset.type;

  if (type === "lock") {
    const node =
      event.target.tagName.toLowerCase() === "i"
        ? event.target
        : event.target.children[0];

    // node.classList.toggle("fa-unlock-alt");
    node.classList.toggle("fa-lock");
  } else if (type === "copy") {
    copyToClickboard(event.target.textContent);
  }
});

// Функция, которая возвращает Promise, где у объекта браузерного JS (navigator)
// в буфер обмена (clipboard) при помощи метода, writeText() программно записывает
// переданный текс в (). Метод возвращает PROMISE
function copyToClickboard(text) {
  return navigator.clipboard.writeText(text);
}

// Функция, которая генерит рандомный цвет. Цвета измеряются в 16-тиричной системе 0-F.
// При вызове функции генерит рандомный цвет
function generateRandomColor() {
  const hexCodes = "0123456789ABCDEF";
  let color = "";
  //   До 6, потому что сам цвет в 16-тиричной системе стостоит из № и 6 символов
  for (let i = 0; i < 6; i += 1) {
    color += hexCodes[Math.floor(Math.random() * hexCodes.length)];
  }
  return "#" + color;
}

// Это константа, которая принимает элемент div с классов col из HTML файла
const cols = document.querySelectorAll(".col");

// Функцию, которая итерирует по списку cols и меняет цвет background у каждого col из cols при помощи функции generateRandomColor
// Если замок закрыт, то она не меняет у него цвет. Это проверяется в isLocked
function setRandomColors(isInitial) {
  const colors = isInitial ? getColorsFromHash() : [];
  cols.forEach((col, index) => {
    const isLocked = col.querySelector("i").classList.contains("fa-lock");

    const text = col.querySelector("h2");
    const button = col.querySelector("button");

    if (isLocked) {
      colors.push(text.textContent);
      return;
    }

    const color = isInitial
      ? colors[index]
        ? colors[index]
        : generateRandomColor()
      : generateRandomColor();

    if (!isInitial) {
      colors.push(color);
    }

    text.textContent = color;
    col.style.background = color;

    setTextColor(text, button, color);
  });
  updateColorHash(colors);
}

// Функция, которая определяет оттенок. И меняет цвет надписи и замка
function setTextColor(text, button, color) {
  // chroma - это библиотека, которую мы подключили в head в HTML. Она помогает работать с оттенками и яркостью
  const luminance = chroma(color).luminance();
  text.style.color = luminance > 0.5 ? "black" : "white";
  button.style.color = luminance > 0.5 ? "black" : "white";
}

// Функция для работы с хешом
// Добавляет в URL адрес цвета, которые отображены на данный момент.
function updateColorHash(colors = []) {
  document.location.hash = colors
    .map((col) => {
      return col.toString().substring(1);
    })
    .join("-");
}

//
function getColorsFromHash() {
  if (document.location.hash.length > 1) {
    return document.location.hash
      .substring(1)
      .split("-")
      .map((color) => "#" + color);
  }
  return [];
}

setRandomColors(true);
