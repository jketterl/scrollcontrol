#include <Adafruit_HT1632.h>
#include <ESP8266WiFi.h>

#include "coordinate.h"
#include "animation.h"
#include "screen.h"

#define ACT_LED LED_BUILTIN

const char* ssid     = "djmacgyver.net";
const char* password = "password";

Adafruit_HT1632LEDMatrix display = Adafruit_HT1632LEDMatrix(D2, D3, D4, D5, D6, D7);
WiFiClient client;

byte screenCount;
Screen** screens;

void setup() {
  Serial.begin(115200);
  
  pinMode(ACT_LED, OUTPUT);
  
  Serial.println("connecting to wifi...");

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) delay(500);

  Serial.println("connected. starting loop!");

  display.begin(ADA_HT1632_COMMON_8NMOS);
  display.setTextSize(1);
  display.setTextColor(1);

  screenCount = 1;
  screens = new Screen*[1];
  Animation** animations = new Animation*[2];
  animations[0] = new ScrollOutAnimation(2, 1);
  animations[1] = new ScrollInAnimation(3, 1);
  char* message = (char*) malloc(11);
  strcpy(message, "connecting...");
  message[10] = 0;
  screens[0] = new Screen(message, 2, animations);

}

int i, pos;
uint16_t wd;
Coordinate p;
Screen* current;

void loop() {
  pos = 0; wd = 0; i = -1;

  digitalWrite(ACT_LED, HIGH);

  while (!client.available()) {
    if (i == -1) {
      current = screens[pos++];
      pos %= screenCount;
      
      // not needed, but need to pass pointers
      int16_t x1, y1;
      
      uint16_t h;
      display.getTextBounds(current->message, 0, 0, &x1, &y1, &wd, &h);
      i = 0;
      p = current->animations[i]->init(wd);
    }

    p = current->animations[i]->step(p);

    //if (++i > wd + OUT_SIZE * 4) i = 0;

    display.clearScreen();
    display.setCursor(p.x, p.y);
    display.print(current->message);
    display.writeScreen();

    current->animations[i]->sleep();

    if (current->animations[i]->isFinished()) {
      if (++i >= current->animCount) {
        Serial.print("connecting...");
        if (!client.connected()) client.connect({192, 168, 99, 1}, 1337);
        Serial.println(" done");
        i = -1;
      } else {
        p = current->animations[i]->init(wd);
      }
    }
  }

  Serial.println("client got something... starting to parse...");

  digitalWrite(ACT_LED, LOW);

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

  Serial.println("parsing complete.");

}
