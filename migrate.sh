rm -r Files
rm -r Projects
rm contents.xml
unzip OmniFocus.ofocus/*.zip
node --trace-uncaught construct-html.js
