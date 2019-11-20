"use strict";

const letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let allFloorsOfAllShipsWithDistance = [];
const hits = 20;
let shots = 0;
const startTimer = new Date();

const randomField = () => {
  let combo = [
    letters[Math.floor(Math.random() * 10)],
    numbers[Math.floor(Math.random() * 10)]
  ];

  let check = allFloorsOfAllShipsWithDistance.includes(
    `${combo[0]}${combo[1]}`
  );

  if (check) {
    return randomField();
  }
  return combo;
};

const createShip = (floor, id) => {
  let position = [];
  let distance = [];

  let firstFloor = randomField();
  let verticalOrHorizontal = +Math.random().toFixed(); // 0-горизонт (одинак цифра), 1-вертикал (одинак буква)
  let matchIndex = letters.indexOf(firstFloor[0]); //на каком месте та буква

  //  проверка влезает ли в поле корабль
  if (verticalOrHorizontal == true) {
    let outFieldCountVerical = firstFloor[1] + floor - 11; //на сколько клеток вылез по верттикали
    if (outFieldCountVerical > 0) {
      firstFloor[1] -= outFieldCountVerical;
    }
  } else {
    let outFieldCountHorizont = matchIndex + floor - 10; //на сколько клеток вылез по горизонту
    if (outFieldCountHorizont > 0) {
      matchIndex = matchIndex - outFieldCountHorizont;
      firstFloor[0] = letters[matchIndex];
    }
  }

  //  добавление первой палубы
  position.push(`${firstFloor[0]}${firstFloor[1]}`);

  //  добавление остальных палуб
  if (verticalOrHorizontal == true) {
    for (let i = 1; i < floor; i++) {
      position.push(`${firstFloor[0]}${firstFloor[1] + i}`); //  вертикальный
    }
  } else {
    for (let i = 1; i < floor; i++) {
      position.push(`${letters[matchIndex + i]}${firstFloor[1]}`); //  горизонтальный
    }
  }

  // createDistance (verticalOrHorizontal, firstFloor, floor, matchIndex);

  //  добавление дистанции между кораблями
  if (verticalOrHorizontal == true) {
    //  вертикальный
    //поле ВЫШЕ
    if (firstFloor[1] !== 1) {
      distance.push(`${firstFloor[0]}${firstFloor[1] - 1}`);
    }
    //поле НИЖЕ
    if (firstFloor[1] + floor - 1 < 10)
      distance.push(`${firstFloor[0]}${firstFloor[1] + floor}`);
    //колонна СЛЕВА
    if (firstFloor[0] !== "a") {
      if (firstFloor[1] === 1) {
        for (let i = 0; i < floor + 1; i++) {
          distance.push(`${letters[matchIndex - 1]}${firstFloor[1] + i}`);
        }
      } else if (firstFloor[1] + floor - 1 === 10) {
        for (let i = -1; i < floor; i++) {
          distance.push(`${letters[matchIndex - 1]}${firstFloor[1] + i}`);
        }
      } else {
        for (let i = -1; i < floor + 1; i++) {
          distance.push(`${letters[matchIndex - 1]}${firstFloor[1] + i}`);
        }
      }
    }

    //колонна СПРАВА
    if (firstFloor[0] !== "j") {
      if (firstFloor[1] === 1) {
        for (let i = 0; i < floor + 1; i++) {
          distance.push(`${letters[matchIndex + 1]}${firstFloor[1] + i}`);
        }
      } else if (firstFloor[1] + floor - 1 === 10) {
        for (let i = -1; i < floor; i++) {
          distance.push(`${letters[matchIndex + 1]}${firstFloor[1] + i}`);
        }
      } else {
        for (let i = -1; i < floor + 1; i++) {
          distance.push(`${letters[matchIndex + 1]}${firstFloor[1] + i}`);
        }
      }
    }
  } else {
    //  горизонтальный
    //поле ДО
    if (firstFloor[0] !== "a") {
      distance.push(`${letters[matchIndex - 1]}${firstFloor[1]}`);
    }
    //поле ПОСЛЕ
    if (matchIndex + floor < 10) {
      distance.push(`${letters[matchIndex + floor]}${firstFloor[1]}`);
    }
    //ряд ВЫШЕ
    if (firstFloor[1] !== 1) {
      if (firstFloor[0] === "a") {
        for (let i = 0; i < floor + 1; i++) {
          distance.push(`${letters[matchIndex + i]}${firstFloor[1] - 1}`);
        }
      } else if (matchIndex + floor === 10) {
        for (let i = -1; i < floor; i++) {
          distance.push(`${letters[matchIndex + i]}${firstFloor[1] - 1}`);
        }
      } else {
        for (let i = -1; i < floor + 1; i++) {
          distance.push(`${letters[matchIndex + i]}${firstFloor[1] - 1}`);
        }
      }
    }
    //ряд НИЖЕ
    if (firstFloor[1] !== 10) {
      if (firstFloor[0] === "a") {
        for (let i = 0; i < floor + 1; i++) {
          distance.push(`${letters[matchIndex + i]}${firstFloor[1] + 1}`);
        }
      } else if (matchIndex + floor === 10) {
        for (let i = -1; i < floor; i++) {
          distance.push(`${letters[matchIndex + i]}${firstFloor[1] + 1}`);
        }
      } else {
        for (let i = -1; i < floor + 1; i++) {
          distance.push(`${letters[matchIndex + i]}${firstFloor[1] + 1}`);
        }
      }
    }
  }

  //  проверка на пересечение кораблей и соприкосновение
  let intersection = position.some(el => {
    return allFloorsOfAllShipsWithDistance.includes(el);
  });

  if (intersection) {
    return createShip(floor, id);
  } else {
    allFloorsOfAllShipsWithDistance = [
      ...allFloorsOfAllShipsWithDistance,
      ...position,
      ...distance
    ];
    return {
      id: id,
      position: position,
      damageCount: 0
    };
  }
};

const floorsForAllShips = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
let allShipsArr = [];
//  создание всех кораблей
floorsForAllShips.map((el, i) => {
  allShipsArr.push(createShip(el, i));
});

// console.log(allShipsArr);

const checkIsKilled = el => {
  if (el.position.length === el.damageCount) {
    el.position.forEach(el => {
      document.querySelector(`#${el}`).classList = "killed";
    });
    for (let i = 0; i < allShipsArr.length; i++) {
      if (el.id === allShipsArr[i].id) {
        allShipsArr.splice(i, 1); // удаляет из массива убитый корабль
      }
    }

    //  проверка все ли убиты - конец игры !
    if (!allShipsArr.length) {
      // стоп таймер
      const endTimer = new Date();
      const duration = Math.floor((+endTimer - +startTimer) / 1000); // в сек
      const h = Math.floor(duration / 3600);
      const m = Math.floor((duration - h * 3600) / 60);
      const s = duration - h * 3600 - m * 60;
      document.querySelector("#timer").innerHTML = `${h} ч.${m} мин.${s} сек.`;

      // показать статистику
      document.querySelector("#shots").innerHTML = shots;
      document.querySelector("#percent").innerHTML = ((hits / shots) * 100) ^ 0;

      document.querySelector(".statistic").style.display = "block";
      sea.style.display = "none";
    }
  }
};

const sea = document.querySelector("#sea");

const handleClick = e => {
  for (let el of allShipsArr) {
    for (let i = 0; i < el.position.length; i++) {
      if (el.position[i] === e.target.id) {
        el.damageCount++;
        e.target.classList = "damage";
        e.target.disabled = "true";
        checkIsKilled(el);
      }
      if (
        e.target.classList.value !== "damage" &&
        e.target.classList.value !== "killed" &&
        e.target.tagName === "BUTTON"
      ) {
        e.target.classList = "miss";
      }
    }
  }
  shots++;
};

sea.addEventListener("click", handleClick);
