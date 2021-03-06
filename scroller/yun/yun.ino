#include <font_7x5.h>
#include <HT1632.h>
#include <Bridge.h>
#include <YunClient.h>

#define ACT_LED 13
#define DISPLAY_WIDTH 32
#define DISPLAY_COUNT 4
#define TOTAL_WIDTH DISPLAY_WIDTH * DISPLAY_COUNT
#define TOTAL_HEIGHT 8

struct Coordinate {
  int x;
  int y;
};

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

class ScrollInAnimation : public Animation {
  private:
    int target;
  public:
    ScrollInAnimation(byte direction, byte speed) : Animation(direction, speed) {};
    Coordinate init(int width);
    Coordinate step(Coordinate start);
};

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

class ScrollOutAnimation : public Animation {
  private:
    int target;
  public:
    ScrollOutAnimation(byte direction, byte speed) : Animation(direction, speed) {};
    Coordinate init(int width);
    Coordinate step(Coordinate start);
};

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

class HoldAnimation : public Animation {
  private:
    int steps;
  public:
    HoldAnimation(byte direction, byte speed) : Animation(direction, speed) {};
    Coordinate init(int width);
    Coordinate step(Coordinate start);
    void sleep();
};

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

class Screen {
  public:
    Screen(char* message, byte animCount, Animation** animations);
    char *message;
    byte animCount;
    Animation** animations;
};

Screen::Screen(char* message, byte animCount, Animation** animations) {
  this->message = message;
  this->animCount = animCount;
  this->animations = animations;
}

byte screenCount;
Screen** screens;
YunClient client;

void setup () {
  Bridge.begin();
  
  //HT1632.begin(A2, A0, A1, A3, A4, A5);
  HT1632.begin(A1, A0, A4, A5, A2, A3);
  
  screenCount = 1;
  screens = new Screen*[1];
  Animation** animations = new Animation*[3];
  animations[0] = new ScrollInAnimation(3, 1);
  animations[1] = new HoldAnimation(0, 50);
  animations[2] = new ScrollOutAnimation(2, 1);
  char* message = (char*) malloc(11);
  strcpy(message, "booting...");
  message[10] = 0;
  screens[0] = new Screen(message, 3, animations);
  
  pinMode(ACT_LED, OUTPUT);
}

int i, pos, wd;
Coordinate p;
Screen* current;

void loop () {
  pos = 0; wd = 0; i = -1;

  digitalWrite(ACT_LED, LOW);
  

  while (!client.available()) {
    if (i == -1) {
      current = screens[pos++];
      pos %= screenCount;
      wd = HT1632.getTextWidth(current->message, FONT_7X5_WIDTH, FONT_7X5_HEIGHT);
      i = 0;
      p = current->animations[i]->init(wd);
    }

    p = current->animations[i]->step(p);

    //if (++i > wd + OUT_SIZE * 4) i = 0;
    
    for (int k = 0; k < 4; k++) {
      HT1632.drawTarget(BUFFER_BOARD(k + 1));
      HT1632.clear();
      HT1632.drawText(current->message, p.x - OUT_SIZE * k , p.y, FONT_7X5, FONT_7X5_WIDTH, FONT_7X5_HEIGHT, FONT_7X5_STEP_GLYPH);
      HT1632.render();
    }

    current->animations[i]->sleep();

    if (current->animations[i]->isFinished()) {
      if (++i >= current->animCount) {
        if (!client.connected()) client.connect({192, 168, 99, 1}, 1337);
        i = -1;
      } else {
        p = current->animations[i]->init(wd);
      }
    }
  }
  
  digitalWrite(ACT_LED, HIGH);

  for (int k = 0; k < screenCount; k++) {
    for (int l = 0; l < screens[k]->animCount; l++) {
      delete screens[k]->animations[l];
    }
    free(screens[k]->message);
    delete[] screens[k]->animations;
    delete screens[k];
  }
  delete[] screens;
  
  screenCount = client.read();

  screens = new Screen*[screenCount];
  for (int k = 0; k < screenCount; k++) {
    
    byte header[2];
    client.readBytes((char*)header, 2);
    
    byte len = header[1];
    char* copy = (char*) malloc(len + 1);
    client.readBytes(copy, len);
    copy[len] = 0;
    
    int animCount = client.read();

    Animation** animations = new Animation*[animCount];
    byte buf[3];
    for (int l = 0; l < animCount; l++) {
        client.readBytes((char*) buf, 3);
        switch(buf[0]) {
          case 0:
            animations[l] = new ScrollInAnimation(buf[1], buf[2]);
            break;
          case 1:
            animations[l] = new ScrollOutAnimation(buf[1], buf[2]);
            break;
          case 2:
            animations[l] = new HoldAnimation(buf[1], buf[2]);
            break;
          default:
            animations[l] = new Animation(buf[1], buf[2]);
        }
     }
     
     screens[k] = new Screen(copy, animCount, animations);
     
  }
  
}
