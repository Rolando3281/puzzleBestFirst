'use strict';

var endTime,
    startTime,
    counted = 0,
    counter = 1000,
    allSuc = [],
    hash = {},
    values = new Array(1000000),
    size = 0;

var goalState = [1, 2, 3, 4, 5, 6, 7, 8, 0];

function move(state, successors, pos, steps) {
  var newState;
  newState = state.slice();
  swap(newState, pos, pos + steps);
  return newState;
}

function hashState(state) {
    var stateLength = state.length;
    var hash = 0;
    for(var i = 0; i < stateLength; i++) {
        hash += state[i] * Math.pow(stateLength, i);
    }
    return hash;
}

function getSuccessors(state) {
  var newState, _state;
  var successors = [];
  var pos = state.indexOf(0);
  var row = Math.floor(pos / 3);
  var col = pos % 3;
  if (row > 0) {
    //move up
    newState = move(state, successors, pos, -3);
    if (!compare(newState, state.prev)) {
      _state = hashState(newState);
      if (typeof hash[_state] === 'undefined') {
        hash[_state] = newState;
        newState.prev = state;
        successors.push(newState);
      }
    }
  }
  if (col > 0) {
    //move left
    newState = move(state, successors, pos, -1);
    if (!compare(newState, state.prev)) {
      _state = hashState(newState);
      if (typeof hash[_state] === 'undefined') {
        hash[_state] = newState;
        newState.prev = state;
        successors.push(newState);
      }
    }
  }
  if (row < 2) {
    //move down
    newState = move(state, successors, pos, 3);
    if (!compare(newState, state.prev)) {
      _state = hashState(newState);
      if (typeof hash[_state] === 'undefined') {
        hash[_state] = newState;
        newState.prev = state;
        successors.push(newState);
      }
    }
  }
  if (col < 2) {
    //move right
    newState = move(state, successors, pos, 1);
    if (!compare(newState, state.prev)) {
      _state = hashState(newState);
      if (typeof hash[_state] === 'undefined') {
        hash[_state] = newState;
        newState.prev = state;
        successors.push(newState);
      }
    }
  }



  return successors;
}

function swap(state, from, to) {
  var _ = state[from];
  state[from] = state[to];
  state[to] = _;
}

function statesPerSecond() {
  var now = new Date();
  if (now.getTime() - startTime.getTime() >= counter) {
    console.log('counted', counter, allSuc.length - counted);   

    counted = allSuc.length;
    counter += 1000;
  }
}

function collateStates(i) {
  var _ = values[i].prev;
  var result = [values[i]];
  while (_) {
    for (var j = 0; j < size; j++) {
      if (compare(_, values[j])) {
        _ = values[j].prev;
        result.push(values[j]);
        break;
      }
    }
  }
  console.log(size);
  return result.reverse();
}

function breadthFirstSearch(state, goalState) {
  values = new Array(1000000);
  // size = 0;
  state.prev = null;
  values[0] = state;
  size++;
  for (var i = 0; i < size; i++) {
    statesPerSecond();
    if (compare(goalState, values[i])) {
      return collateStates(i);
    } else {
      var _successors = getSuccessors(values[i]);

      //document.getElementById("logStates").innerHTML+="<br> contador=".concat(_successors);

      for (var k = 0; k < _successors.length; k++) {
        values[size] = _successors[k];
        size++;
      }
    }
  }
}

function compare(arr1, arr2) {
  if (!arr1 || !arr2) {
    return false;
  }

  for (var i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}

function checkSolvable(state) {
  var pos = state.indexOf(0);
  var _state = state.slice();
  _state.splice(pos,1);
  var count = 0;
  for (var i = 0; i < _state.length; i++) {
    for (var j = i + 1; j < _state.length; j++) {
      if (_state[i] > _state[j]) {
        count++;
      }
    }
  }
  return count % 2 === 0;
}

function shuffle(array) {
  var size = array.length;
  var rand;
  for (var i = 1; i < size; i += 1) {
    rand = Math.round(Math.random() * i);
    swap(array, rand, i);
  }
  return array;
}

function generatePuzzle(state) {
  var firstElement, secondElement;
  var _state = state.slice();
  shuffle(_state);
  if (!checkSolvable(_state)) {
    firstElement = _state[0] !== 0 ? 0 : 3;
    secondElement = _state[1] !== 0 ? 1 : 3;
    swap(_state, firstElement, secondElement);
  }
   //_state = [1, 0, 2, 3, 4, 5, 6, 7, 8];
  _state = [0,7,4,8,2,1,5,3,6];
  // _state = [6,3,1,4,7,2,0,5,8];
  // _state = [8,0,1,3,4,7,2,6,5];
  //_state = [8, 6, 7, 2, 5, 4, 3, 0, 1]; //32 steps
  // _state = [0,8,7,6,3,5,1,4,2]; //29 steps
  console.log('Puzzle a resolver: [' + _state + ']');

 

  return _state;
}

function time() {
  var puzzle = generatePuzzle(goalState);
  startTime = new Date();
  var result = breadthFirstSearch(puzzle, goalState);
  console.log(result.length);
  console.log(result);
  endTime = new Date();
  console.log('Operation took ' + (endTime.getTime() - startTime.getTime()) + ' msec');

  document.getElementById("logStates").innerHTML="";

  document.getElementById("logStates").innerHTML+="<br> PUZZLE A RESOLVER: [".concat(puzzle).concat("]");
  document.getElementById("logStates").innerHTML+="<br>";

  for (var i = 0; i<result.length; i++){
    document.getElementById("logStates").innerHTML+="<br>Movimiento".concat(i).concat(" : &emsp; Mejor Hijo =  <b>[").concat(result[i]).concat("]</b>");
  }
  document.getElementById("logStates").innerHTML+="<br>";
  document.getElementById("logStates").innerHTML+="<br>SOLUCION : &emsp;  <b>[".concat(result[result.length-1]).concat("]</b>");


  //document.getElementById("logStates").innerHTML+="<br>Movimiento: &emsp;  <b>".concat(result).concat("</b>");
}

time();
