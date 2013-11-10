#include <font_7x5.h>
#include <HT1632.h>
#include <SPI.h>
#include <SPIRead.h>

byte screenCount;

struct Screen {
  byte speed;
  char* message;
};

Screen* screens;

void setup () {
  SPIReader.begin();
  HT1632.begin(A2, A0, A1, A3, A4, A5);
  HT1632.drawTarget(BUFFER_BOARD(1));
  
  screenCount = 1;
  screens = (Screen*) malloc(sizeof(Screen));
  screens[0].speed = 10;
  screens[0].message = "booting";
}

void loop () {
  int pos = 0, i = 0, wd = 0;
  Screen current;

  while (!SPIReader.available()) {
    if (i == 0) {
      current = screens[pos++];
      pos %= screenCount;
    }
    
    wd = HT1632.getTextWidth(current.message, FONT_7X5_WIDTH, FONT_7X5_HEIGHT);

    if (++i > wd + OUT_SIZE) i = 0;
    
    HT1632.clear();
    HT1632.drawText(current.message, OUT_SIZE - i, 0, FONT_7X5, FONT_7X5_WIDTH, FONT_7X5_HEIGHT, FONT_7X5_STEP_GLYPH);
    HT1632.render();
    
    delay(1000 / max(1, current.speed));
  }
  
  for (int i = 0; i < screenCount; i++) free(screens[i].message);
  free(screens);
  screenCount = SPIReader.read();
  
  screens = (Screen *) malloc(sizeof(Screen) * screenCount);
  for (int i = 0; i < screenCount; i++) {
    byte header[3];
    SPIReader.readBytes((char*)header, 3);
    screens[i].speed = header[1];
    screens[i].message = (char*) malloc(header[2] + 1);
    SPIReader.readBytes(screens[i].message, header[2]);
    screens[i].message[header[2]] = 0x00;
  }
}
