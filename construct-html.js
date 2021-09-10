const fs = require('fs')
const convert = require('xml-js')
const path = require('path')
const util = require('util')

fs.mkdir(path.join(__dirname, 'Projects'), err => {
  if (err) throw err
})

fs.mkdir(path.join(__dirname, 'Files'), err => {
  if (err) throw err
})

const data = fs.readFileSync('contents.xml')
const jsonString = convert.xml2json(data)
const json = JSON.parse(jsonString)
const tasks = json.elements[0].elements.filter(t => t.name === 'task')
const projects = tasks.filter(t => {
  const item = t.elements.find(e => e.name === 'task' && !e.attributes)
  if (item) {
    return true
  }
})

const ammendTaskFiles = (html) => { }

const ammendTask = (html, task) => {
  const nameObj = task.elements.find(e => {
    return e.name === 'name' && e.elements && e.elements.length === 1
  })
  if (!nameObj) return
  const name = nameObj.elements[0].text
  const checked = task.elements.find(e => {
    return e.name === 'completed' && e.elements && e.elements.length === 1
  })
  html += `<p style="font-family: Georgia; font-size: 14px; margin: 0px; font-stretch: normal; line-height: normal; color: rgb(20, 20, 20); min-height: 16px;"><input type="checkbox" id="0753B386-29EC-49BB-90A2-2BE45BE5CF16" ${checked ? 'checked="checked"' : ''}"><span class="Apple-tab-span" style="white-space: pre;"></span><b>${name}</b></p><p style="font-family: Georgia; font-size: 14px; margin: 0px; font-stretch: normal; line-height: normal; color: rgb(20, 20, 20); min-height: 16px;"><br></p>`
  return html
}

const ammendHeader = (html) => {
  return html += '<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="DT:isEditableNote" content="Yes"><style></style></head>'
}
const ammendProject = (html, project, name) => {
  html += `<body style="margin: 1.5em; word-wrap: break-word; -webkit-nbsp-mode: space; line-break: after-white-space;"><p style="font-family: Georgia; font-size: 28px; margin: 0px 0px 16px; font-stretch: normal; line-height: normal;">${name}&nbsp;</p>`

  const topLevelTasks = tasks.filter(t => {
    const item = t.elements.find(e => {
      return e.name === 'task' && e.attributes && e.attributes.idref === project.attributes.id
    })
    if (item) {
      return true
    }
  })

  // console.log(util.inspect(topLevelTasks, { depth: null }));
  topLevelTasks.forEach(t => {
    html = ammendTask(html, t)
  })

  return html
}

const closeTask = html => html += '</body>'

const constructHTML = () => {
  projects.forEach(project => {
    let html = ''
    const name = project.elements.find(e => e.name === 'name' && e.elements.length === 1).elements[0].text
    html = ammendHeader(html)
    html = ammendProject(html, project, name)
    html = closeTask(html)
    fs.writeFile(`Projects/${name}.html`, html, (err) => {
      if (err) throw err;
      console.log('Yerrrrr!');
    })
  });
}

constructHTML()
