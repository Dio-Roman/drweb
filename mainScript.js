"use strict";

const letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let allFloorsOfAllShips = [];
const hits = 20;
let shots = 0;
const startTimer = new Date();

const randomField = () => {
  let randomIndex = Math.floor(Math.random() * 10);
  let combo = [letters[randomIndex], numbers[randomIndex]];
  return combo;
};

const createShip = (floor, id) => {
  let position = [];
  let firstFloor = randomField();
  let verticalOrHorizontal = Math.random().toFixed(); // 0-горизонт (одинак цифра), 1-вертикал (одинак буква)
  let matchIndex = letters.indexOf(firstFloor[0]); //на каком месте та буква

  //  проверка влезает ли в поле корабль
  if (verticalOrHorizontal == true) {
    let outFieldCountVerical = firstFloor[1] + floor-11;  //на сколько клеток вылез по верттикали
      if (outFieldCountVerical > 0) {
        firstFloor[1] -= outFieldCountVerical;
      }
  } else {
    let outFieldCountHorizont = matchIndex + floor-10;  //на сколько клеток вылез по горизонту
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
      position.push(`${firstFloor[0]}${firstFloor[1] + i}`);
    }
  } else {
    for (let i = 1; i < floor; i++) {
      position.push(`${letters[matchIndex + i]}${firstFloor[1]}`);
    }
  }

//  проверка на пересечение кораблей
  let intersection = position.some(el => {
    return allFloorsOfAllShips.includes(el)
  });

  if (intersection) {
    return createShip(floor, id)
  } else {
    allFloorsOfAllShips = [...allFloorsOfAllShips, ...position];
    return {
      id: id,
      position: position,
      damageCount: 0
    }
  }
};

const floorsForAllShips = [4,3,3,2,2,2,1,1,1,1];
let allShipsArr = [];

//  создание всех кораблей
floorsForAllShips.map((el, i)=> {
  allShipsArr.push(createShip(el, i)) ;
})

// console.log(allShipsArr);

const checkIsKilled = (el) => {
  if (el.position.length === el.damageCount) {
    el.position.forEach(el => {
      document.querySelector(`#${el}`).classList = "killed";
    });
    allShipsArr.splice(el.id, 1);  // удаляет из массива убитый корабль
    // console.log(allShipsArr);

    //  проверка все ли убиты - конец игры !
    if (!allShipsArr.length) {
      // стоп таймер
      const endTimer = new Date();
      const duration = Math.floor((+endTimer - + startTimer)/1000);  // в сек
      const h = Math.floor(duration/3600);
      const m = Math.floor((duration-h*3600)/60);
      const s = duration-h*3600-m*60;
      document.querySelector("#timer").innerHTML = `${h}ч.${m}мин.${s}сек.`;

      // показать статистику
      document.querySelector("#shots").innerHTML = shots;
      document.querySelector("#percent").innerHTML = hits/shots*100;

      document.querySelector(".statistic").style.display ='block';
      sea.style.display ='none';
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
        e.target.disabled = 'true';
        checkIsKilled(el);
      } else {
        e.target.classList = "miss";
      }
    }
  }
  shots++
};

sea.addEventListener("click", handleClick);
