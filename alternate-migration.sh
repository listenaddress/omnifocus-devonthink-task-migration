npm install

rm contents.xml
rm -r Files
rm -r Projects
rm -r OmniFocusContent

mkdir Files
mkdir Projects
mkdir OmniFocusContent
unzip OmniFocus.ofocus/*.zip -d OmniFocusContent

for file in `ls OmniFocus.ofocus/data/*.zip`; do
unzip ${file} -d Files
done

node --trace-uncaught construct-html.js
