#include <font_7x5.h>
#include <HT1632.h>
#include <SPI.h>
#include <SPIRead.h>

#define ACT_LED 6

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
    virtual Coordinate init();
    virtual Coordinate step(Coordinate start);
    virtual void sleep();
    boolean isFinished();
};

Animation::Animation(byte direction, byte speed) {
  this->direction = direction;
  this->speed = speed;
};

Coordinate Animation::init() {
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

class ScrollAnimation : public Animation {
  public:
    ScrollAnimation(byte direction, byte speed) : Animation(direction, speed) {};
    Coordinate init();
    Coordinate step(Coordinate start);
};

Coordinate ScrollAnimation::step(Coordinate start) {
  Coordinate result;
  result.x = start.x;
  result.y = start.y;
  switch (direction) {
    case 1:
      result.x--;
      if (result.x == 0) {
        finished = true;
      }
      break;
    default:
      finished = true;
  }
  return result;
}

Coordinate ScrollAnimation::init() {
  finished = false;
  Coordinate result = {0,0};
  switch (direction) {
    case 1:
      result.x = 128;
  }
  return result;
}

struct Screen {
  byte speed;
  char* message;
  byte animCount;
  Animation** animations;
};

byte screenCount;
Screen* screens;

void setup () {
  SPIReader.begin();
  HT1632.begin(A2, A0, A1, A3, A4, A5);
  
  screenCount = 1;
  screens = (Screen*) malloc(sizeof(Screen));
  screens[0].speed = 10;
  screens[0].message = "booting...";

  screens[0].animCount = 1;
  screens[0].animations = (Animation**) malloc(sizeof(Animation*));
  screens[0].animations[0] = new ScrollAnimation(1, 10);
  
  pinMode(ACT_LED, OUTPUT);
}

int i = 0;

void loop () {
  int pos = 0, wd = 0;
  i = -1;
  Coordinate p = { 0, 0 };
  Screen current;

  while (!SPIReader.available()) {
    if (i == -1) {
      digitalWrite(ACT_LED, LOW);
      current = screens[pos++];
      pos %= screenCount;
      wd = HT1632.getTextWidth(current.message, FONT_7X5_WIDTH, FONT_7X5_HEIGHT);
      i = 0;
      p = current.animations[i]->init();
    }

    p = current.animations[i]->step(p);

    //if (++i > wd + OUT_SIZE * 4) i = 0;
    
    for (int k = 0; k < 4; k++) {
      HT1632.drawTarget(BUFFER_BOARD(k + 1));
      HT1632.clear();
      HT1632.drawText(current.message, p.x - OUT_SIZE * k , p.y, FONT_7X5, FONT_7X5_WIDTH, FONT_7X5_HEIGHT, FONT_7X5_STEP_GLYPH);
      HT1632.render();
    }

    current.animations[i]->sleep();

    if (current.animations[i]->isFinished()) {
      if (++i >= current.animCount) {
        i = -1;
        digitalWrite(ACT_LED, HIGH);
      } else {
        p = current.animations[i]->init();
      }
    }
  }
  
  for (int k = 0; k < screenCount; k++) {
    free(screens[k].message);
    free(screens[k].animations);
  }
  free(screens);
  screenCount = SPIReader.read();
  
  screens = (Screen *) malloc(sizeof(Screen) * screenCount);
  for (int k = 0; k < screenCount; k++) {
    byte header[3];
    SPIReader.readBytes((char*)header, 3);
    screens[k].speed = header[1];
    screens[k].message = (char*) malloc(header[2] + 1);
    SPIReader.readBytes(screens[k].message, header[2]);
    screens[k].message[header[2]] = 0x00;

    screens[k].animCount = SPIReader.read();

    screens[k].animations = (Animation**) malloc(sizeof(Animation*) * screens[k].animCount);
    byte buf[3];
    for (int l = 0; l < screens[k].animCount; l++) {
        SPIReader.readBytes((char*) buf, 3);
        switch(buf[0]) {
          case 0:
            screens[k].animations[l] = new ScrollAnimation(buf[1], buf[2]);
            break;
          default:
            screens[k].animations[l] = new Animation(buf[1], buf[2]);
        }
     }
  }
}
