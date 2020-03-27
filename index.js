const express = require('express');

const server = express();

server.use(express.json());
server.use(countRequests);

var requestCount = 0;

const projects = [
  {
    id: '1',
    title: 'Novo projeto',
    tasks: []
  }
];

function countRequests(req, res, next) {
  console.count('Request counter');

  next();
}

function checkProjectExists(req, res, next) {
  if (!projects.find(obj => obj.id === req.params.id))
    return res.status(404).json({ error: 'Project does not exist' });

  return next();
}

server.post('/projects', (req, res) => {
  const { id, title, tasks } = req.body;
  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(projects);
});

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(obj => obj.id === id);
  project.title = title;

  return res.json(projects);
});

server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(obj => obj.id === id);

  projects.splice(projectIndex, 1);

  return res.send();
});

server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(obj => obj.id === id);
  project.tasks.push(title);

  return res.json(project);
});

server.listen(3333);
