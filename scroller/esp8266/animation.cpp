#include "animation.h"

Animation::Animation(byte direction, byte speed) {
  this->direction = direction;
  this->speed = speed;
};

Coordinate Animation::init(int width) {
  finished = false;
  Coordinate c = {0,0};
  return c;
}

Coordinate Animation::step(Coordinate start){
  finished = true;
  return start;
};

void Animation::sleep() {
  delay(100 / max(1, speed));
}

boolean Animation::isFinished(){
  return finished;
}

Coordinate ScrollInAnimation::step(Coordinate start) {
  Coordinate result;
  result.x = start.x;
  result.y = start.y;
  switch (direction) {
    case 1:
      result.x--;
      if (result.x == target) finished = true;
      break;
    case 0:
      result.x++;
      if (result.x == target) finished = true;
      break;
    case 2:
      result.y++;
      if (result.y == target) finished = true;
      break;
    case 3:
      result.y--;
      if (result.y == target) finished = true;
      break;
    default:
      finished = true;
  }
  return result;
}

Coordinate ScrollInAnimation::init(int width) {
  finished = false;
  Coordinate result = {0,0};
  int middle = (TOTAL_WIDTH - width) / 2;
  switch (direction) {
    case 0:
      result.x = -width;
      target = middle;
      break;
    case 1:
      result.x = TOTAL_WIDTH + 1;
      target = middle;
      break;
    case 2:
      result.x = middle;
      result.y = -TOTAL_HEIGHT;
      target = 0;
      break;
    case 3:
      result.x = middle;
      result.y = TOTAL_HEIGHT + 1;
      target = 0;
      break;
  }
  return result;
}

Coordinate ScrollOutAnimation::step(Coordinate start) {
  Coordinate result;
  result.x = start.x;
  result.y = start.y;
  switch (direction) {
    case 1:
      result.x++;
      if (result.x == target) finished = true;
      break;
    case 0:
      result.x--;
      if (result.x == target) finished = true;
      break;
    case 2:
      result.y--;
      if (result.y == target) finished = true;
      break;
    case 3:
      result.y++;
      if (result.y == target) finished = true;
      break;
    default:
      finished = true;
  }
  return result;
}

Coordinate ScrollOutAnimation::init(int width) {
  finished = false;
  int middle = (TOTAL_WIDTH - width) / 2;
  Coordinate result = {middle,0};
  target = 0;
  switch (direction) {
    case 0:
      target = -width;
      break;
    case 1:
      target = TOTAL_WIDTH + 1;
      break;
    case 2:
      target = -TOTAL_HEIGHT;
      break;
    case 3:
      target = TOTAL_HEIGHT + 1;
      break;
  }
  return result;
}

Coordinate HoldAnimation::init(int width) {
  steps = 0; finished = false;
  Coordinate result = { (TOTAL_WIDTH - width) / 2, 0 };
  return result;
}

Coordinate HoldAnimation::step(Coordinate start) {
  if (++steps >= speed) finished = true;
  return start;
}

void HoldAnimation::sleep() {
  delay(100);
}



