const fs = require('fs')
const convert = require('xml-js')
const path = require('path')
const util = require('util')

const data = fs.readFileSync('OmniFocusContent/contents.xml')
const jsonString = convert.xml2json(data)
const json = JSON.parse(jsonString)
const tasks = json.elements[0].elements.filter(t => t.name === 'task')
const projects = tasks.filter(t => {
  const item = t.elements.find(e => e.name === 'task' && !e.attributes)
  if (item) {
    return true
  }
})

const ammendTaskFiles = (html, task) => {
  let files = []

  const noteObj = task.elements.find(e => {
    return e.name === 'note' && e.elements && e.elements.length > 0
  })
  if (!noteObj) return
  const textObj = noteObj.elements.find(e => {
    return e.name === 'text' && e.elements && e.elements.length > 0
  })
  const pObjs = textObj.elements.filter(e => {
    return e.name === 'p' && e.elements && e.elements.length > 0
  })
  const getLitObjs = () => {
    let runObjs = []
    let litObjs = []
    // console.log('pObjs', pObjs)
    pObjs.forEach(pObj => {
      const run = pObj.elements.find(e => {
        return e.name === 'run' && e.elements && e.elements.length > 0
      })
      if (run) runObjs.push(run)
    })
    // console.log('runObjs', runObjs)
    runObjs.forEach(runObj => {
      // console.log(util.inspect(runObj, { depth: null }));
      const lit = runObj.elements.find(e => {
        return e.name === 'lit'
      })
      if (lit) litObjs.push(lit)
    })
    return litObjs
  }

  // Populate files
  const litObjs = getLitObjs()
  litObjs.forEach(o => {
    const file = o.elements.find(e => {
      return e.name === 'cell'
    })
    if (file) files.push(file)
  })

  if (files) {
    files.forEach(f => {
      html += `<p style="font-family: Georgia; font-size: 14px; margin: 0px; font-stretch: normal; line-height: normal; color: rgb(20, 20, 20); min-height: 16px;">📄&nbsp;<a href="./files/${f.attributes.name}">${f.attributes.name}</a></p>`
    })
  }

  return html
}

const ammendTask = (html, task) => {
  const nameObj = task.elements.find(e => {
    return e.name === 'name' && e.elements && e.elements.length === 1
  })
  if (!nameObj) return html
  const name = nameObj.elements[0].text
  const checked = task.elements.find(e => {
    return e.name === 'completed' && e.elements && e.elements.length === 1
  })

  // add task
  html += `<p style="font-family: Georgia; font-size: 14px; margin: 0px; font-stretch: normal; line-height: normal; color: rgb(20, 20, 20); min-height: 16px;"><input type="checkbox" id="0753B386-29EC-49BB-90A2-2BE45BE5CF16" ${checked ? 'checked="checked"' : ''}"><span class="Apple-tab-span" style="white-space: pre;"></span><b>${name}</b></p>`

  // html = ammendTaskFiles(html, task)

  // close task
  html += '<p style="font-family: Georgia; font-size: 14px; margin: 0px; font-stretch: normal; line-height: normal; color: rgb(20, 20, 20); min-height: 16px;"><br></p>'

  return html
}

const ammendHeader = (html) => {
  return html += '<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="DT:isEditableNote" content="Yes"><style></style></head>'
}
const closeTask = html => html += '</body>'
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

  topLevelTasks.forEach(t => {
    ammendTask(html, t)
  })

  return html
}

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
