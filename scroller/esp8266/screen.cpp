#include "screen.h"

Screen::Screen(char* message, byte animCount, Animation** animations) {
  this->message = message;
  this->animCount = animCount;
  this->animations = animations;
}
