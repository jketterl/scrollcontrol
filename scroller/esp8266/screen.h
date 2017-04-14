#ifndef screen_h
#define screen_h

#include <Arduino.h>
#include "animation.h"

class Screen {
  public:
    Screen(char* message, byte animCount, Animation** animations);
    char *message;
    byte animCount;
    Animation** animations;
};

#endif
