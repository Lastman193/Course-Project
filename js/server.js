const http = require('http');
const fs = require('fs').promises;
const path = require('path');

const hostname = 'localhost';
const port = 3000;
const dataFilePath = path.join(__dirname, '../', 'data', 'form-data.json');

function generateId() {
  return Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/submit-application') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const applicationData = JSON.parse(body);
        const applicationId = generateId();
        const applicationType = applicationData.type || 'vacancy';

        const formDataWithIdAndType = {
          id: applicationId,
          type: applicationType,
          ...applicationData
        };

        const existingData = await fs.readFile(dataFilePath, 'utf8').catch(() => '[]');
        const allFormData = JSON.parse(existingData);

        // Проверка на дублирование по типу, имени, телефону и email
        const isDuplicate = allFormData.some(item =>
          item.type === formDataWithIdAndType.type &&
          item.name === formDataWithIdAndType.name &&
          item.phone === formDataWithIdAndType.phone &&
          item.email === formDataWithIdAndType.email
        );

        if (!isDuplicate) {
          allFormData.push(formDataWithIdAndType);
          await fs.writeFile(dataFilePath, JSON.stringify(allFormData, null, 2));
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Заявка успешно сохранена!', id: applicationId }));
        } else {
          res.writeHead(409, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: `Заявка (${applicationType}) с таким именем, телефоном и email уже существует.` }));
        }

      } catch (error) {
        console.error('Ошибка при обработке данных:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Не удалось сохранить заявку.' }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(port, hostname, () => {
  console.log(`Сервер запущен на http://${hostname}:${port}/`);
});