#!/bin/bash
sudo /opt/mongo/bin/mongod -f /etc/mongodb.conf --dbpath /var/lib/mongodb/ --repair
sudo chown mongodb.mongodb /var/lib/mongodb/* -R
sudo /etc/init.d/mongodb start
