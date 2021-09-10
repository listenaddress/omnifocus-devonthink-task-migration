const fs = require('fs')
const convert = require('xml-js')
const path = require('path')

fs.mkdir(path.join(__dirname, 'Tasks'), err => {
  if (err) throw err
})

fs.mkdir(path.join(__dirname, 'Files'), err => {
  if (err) throw err
})

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

const ammendHeader = (html) => {
  return html += '<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="DT:isEditableNote" content="Yes"><style></style></head>'
}
const ammendTopLevelTask = (name, html) => {
  return html += `<body style="margin: 1.5em; word-wrap: break-word; -webkit-nbsp-mode: space; line-break: after-white-space;"><p style="font-family: Georgia; font-size: 28px; margin: 0px 0px 16px; font-stretch: normal; line-height: normal;">${name}&nbsp;</p>`
}
const ammendSubTasks = () => { }
const ammendTaskFiles = () => { }
const closeTask = html => html += '</body>'

const constructHTML = () => {
  let firstDone = false
  topLevelTasks.forEach(e => {
    // temporary
    if (firstDone === true) return
    firstDone = true

    let html = ''
    const name = e.elements.find(e => e.name === 'name' && e.elements.length === 1).elements[0].text
    html = ammendHeader(html)
    html = ammendTopLevelTask(name, html)
    html = closeTask(html)
    fs.writeFile(`Tasks/${name}.html`, html, (err) => {
      if (err) throw err;
      console.log('Yerrrrr!');
    })
  });
}

constructHTML()
