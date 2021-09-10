rm contents.xml
rm -r Files
rm -r Tasks
rm -r OmniFocusContent

mkdir Files
mkdir Tasks
mkdir OmniFocusContent
unzip OmniFocus.ofocus/*.zip -d OmniFocusContent

for file in `ls OmniFocus.ofocus/data/*.zip`; do
unzip ${file} -d Files
done

node --trace-uncaught construct-html.js
