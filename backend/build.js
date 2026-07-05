const fs = require('fs');
const path = require('path');

const entitiesDir = path.join(__dirname, 'src', 'entities');
const servicesDir = path.join(__dirname, 'src', 'services');
const controllersDir = path.join(__dirname, 'src', 'controllers');

if (!fs.existsSync(entitiesDir)) fs.mkdirSync(entitiesDir, { recursive: true });
if (!fs.existsSync(servicesDir)) fs.mkdirSync(servicesDir, { recursive: true });
if (!fs.existsSync(controllersDir)) fs.mkdirSync(controllersDir, { recursive: true });

console.log('Backend directory structure initialized');
