npm install

rm contents.xml
rm -r Files
rm -r Projects
rm -r OmniFocusContent

mkdir Files
mkdir Projects
mkdir OmniFocusContent
unzip OmniFocus.ofocus/*.zip -d OmniFocusContent
cp -r OmniFocusContent/data/*/* Files

node --trace-uncaught construct-html.js
