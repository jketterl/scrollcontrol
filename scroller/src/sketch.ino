#include <font_7x5.h>
#include <HT1632.h>
#include <SPI.h>
#include <SPIRead.h>

#define ACT_LED 6

struct Screen {
  byte speed;
  char* message;
};

struct Animation {
  byte type;
  byte direction;
  byte speed;
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
  
  pinMode(ACT_LED, OUTPUT);
}

int i = 0;

void loop () {
  digitalWrite(ACT_LED, LOW);
  
  int pos = 0, /*i = 0,*/ wd = 0;
  i=0;
  Screen current;

  while (!SPIReader.available()) {
    if (i == 0) {
      current = screens[pos++];
      pos %= screenCount;
      wd = HT1632.getTextWidth(current.message, FONT_7X5_WIDTH, FONT_7X5_HEIGHT);
    }

    if (++i > wd + OUT_SIZE * 4) i = 0;
    
    for (int k = 0; k < 4; k++) {
      HT1632.drawTarget(BUFFER_BOARD(k + 1));
      HT1632.clear();
      HT1632.drawText(current.message, OUT_SIZE * (4 - k) - i , 0, FONT_7X5, FONT_7X5_WIDTH, FONT_7X5_HEIGHT, FONT_7X5_STEP_GLYPH);
      HT1632.render();
    }
    
    delay(100 / max(1, current.speed));
  }
  
  digitalWrite(ACT_LED, HIGH);
  
  for (int k = 0; k < screenCount; k++) free(screens[k].message);
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

    byte animCount = SPIReader.read();

    Animation anim[animCount];
    byte buf[3];
    for (int l = 0; l < animCount; l++) {
        SPIReader.readBytes((char*) buf, 3);
        anim[l].type = buf[0];
        anim[l].direction = buf[1];
        anim[l].speed = buf[2];
    }
  }
}
