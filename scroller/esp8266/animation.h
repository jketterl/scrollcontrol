#ifndef animation_h
#define animation_h

#include <Arduino.h>
#include "coordinate.h"

#define DISPLAY_WIDTH 32
#define DISPLAY_COUNT 4
#define TOTAL_WIDTH DISPLAY_WIDTH * DISPLAY_COUNT
#define TOTAL_HEIGHT 8

class Animation {
  protected:
    byte direction;
    byte speed;
    boolean finished = false;
  public:
    Animation(byte direction, byte speed);
    virtual Coordinate init(int width);
    virtual Coordinate step(Coordinate start);
    virtual void sleep();
    boolean isFinished();
};

class ScrollInAnimation : public Animation {
  private:
    int target;
  public:
    ScrollInAnimation(byte direction, byte speed) : Animation(direction, speed) {};
    Coordinate init(int width);
    Coordinate step(Coordinate start);
};

class ScrollOutAnimation : public Animation {
  private:
    int target;
  public:
    ScrollOutAnimation(byte direction, byte speed) : Animation(direction, speed) {};
    Coordinate init(int width);
    Coordinate step(Coordinate start);
};

class HoldAnimation : public Animation {
  private:
    int steps;
  public:
    HoldAnimation(byte direction, byte speed) : Animation(direction, speed) {};
    Coordinate init(int width);
    Coordinate step(Coordinate start);
    void sleep();
};

#endif
