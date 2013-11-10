#include <font_7x5.h>
#include <HT1632.h>
#include <SPI.h>
#include <SPIRead.h>

int i = 0;
int wd;

void setup () {
  //Serial.begin(9600);
  SPIReader.begin();
  HT1632.begin(A2, A0, A1, A3, A4, A5);
  HT1632.drawTarget(BUFFER_BOARD(1));
}

char* message = "ready";

void loop () {
  wd = HT1632.getTextWidth(message, FONT_7X5_WIDTH, FONT_7X5_HEIGHT);
  
  while (!SPIReader.available()) {
    if (wd > OUT_SIZE) {
      i = (i+1)%(wd + OUT_SIZE);
    } else {
      i = ((OUT_SIZE + wd) / 2) + 1;
    }

    HT1632.clear();
    HT1632.drawText(message, OUT_SIZE - i, 0, FONT_7X5, FONT_7X5_WIDTH, FONT_7X5_HEIGHT, FONT_7X5_STEP_GLYPH);
    HT1632.render();
    
    delay(100);
  }
  
  free(message);
  message = (char*) malloc(100);
  int len = SPIReader.readBytesUntil('\n', message, 100);
  message[len] = 0x00;
  //Serial.println(message);
}
