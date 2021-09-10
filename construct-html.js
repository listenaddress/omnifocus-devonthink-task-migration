const fs = require('fs')
const convert = require('xml-js')
const util = require('util')

let html = ''
const data = fs.readFileSync('contents.xml')
const jsonString = convert.xml2json(data)
const json = JSON.parse(jsonString)
const tasks = json.elements[0].elements.filter(t => t.name === 'task')
const topLevelTasks = tasks.filter(t => {
  const item = t.elements.find(e => e.name === 'task' && !e.attributes)
  if (item) {
    return true
  }
})

const ammendHeader = () => {
  html += '<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="DT:isEditableNote" content="Yes"><style></style></head>'
}
const ammendTopLevelTask = (task) => {
  const name = task.elements.find(e => e.name === 'name' && e.elements.length === 1)
  html += `<body style="margin: 1.5em; word-wrap: break-word; -webkit-nbsp-mode: space; line-break: after-white-space;"><p style="font-family: Georgia; font-size: 28px; margin: 0px 0px 16px; font-stretch: normal; line-height: normal;">${name.elements[0].text}&nbsp;</p>`
}
const ammendSubTasks = () => { }
const ammendTaskFiles = () => { }
const closeTask = () => { html += '</body>' }

const constructHTML = () => {
  ammendHeader()

  let firstDone = false
  topLevelTasks.forEach(e => {
    if (firstDone === true) return
    firstDone = true
    ammendTopLevelTask(e)
    closeTask()
  });

  html += '</html>'
  fs.writeFile('constructed.html', html, (err) => {
    if (err) throw err;
    console.log('Yerrrrr!');
  })
}

constructHTML()
