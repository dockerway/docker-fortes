#!/bin/sh
echo "BUILD START"

#PM2 CONFIG BASE
FILE=./dist/pm2.config.js
if test -f "$FILE"; then
    echo "$FILE exists. Making bkp..."
    cp $FILE pm2.config.bkp.js
else
    echo "$FILE does not exist. Coping example..."
    cp pm2.config.example.js $FILE
fi

#BACKEND
echo "BUILDING BACKEND"
cd apps/backend/
echo "Backend npm install..."
npm install
echo "Backend buildpm2..."
npm run buildpm2

#FRONTEND
echo "BUILDING FRONTEND"
cd ../frontend/
echo "Frontend npm install..."
npm install
echo "Frontend buildpm2..."
npm run buildpm2


#DIST
echo "PREPARING dist"
cd ../../dist
npm install --only=production

#PM2 CONFIG DIST
BKP=../pm2.config.bkp.js
if test -f "$BKP"; then
    mv $BKP pm2.config.js
    echo "BKP exists. Moving..."
fi

echo "BUILD ENDED"
