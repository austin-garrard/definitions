
header() {
    echo "\033[38;5;165m\n$1\n\033[m"
}

header 'Installing server dependencies...'
yarn install

header "Installing client dependencies..."
cd client
yarn install
cd ..

header "Configuring postgres..." 
yarn db:init

header "Checking if it works..."
yarn test

header "Starting app..."
yarn client:build
yarn start

