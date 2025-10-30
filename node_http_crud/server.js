// server.js
const http = require('http');
const { MongoClient, ObjectId } = require('mongodb');

const url = 'mongodb://localhost:27017/';
const client = new MongoClient(url);
const dbName = 'schoolDB';

let db, students;

async function connectDB() {
  await client.connect();
  db = client.db(dbName);
  students = db.collection('students');
  console.log(' MongoDB connected');
}
connectDB();


//Create HTTP Server and CRUD Routes


const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.url === '/students' && req.method === 'GET') {
    const data = await students.find().toArray();
    res.end(JSON.stringify(data));
  }

  else if (req.url === '/students' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      const student = JSON.parse(body);
      const result = await students.insertOne(student);
      res.end(JSON.stringify(result));
    });
  }

  else if (req.url.startsWith('/students/') && req.method === 'PUT') {
    const id = req.url.split('/')[2];
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      const updated = JSON.parse(body);
      const result = await students.updateOne({ _id: new ObjectId(id) }, { $set: updated });
      res.end(JSON.stringify(result));
    });
  }

  else if (req.url.startsWith('/students/') && req.method === 'DELETE') {
    const id = req.url.split('/')[2];
    const result = await students.deleteOne({ _id: new ObjectId(id) });
    res.end(JSON.stringify(result));
  }

  else {
    res.statusCode = 404;
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
});

server.listen(3000, () => console.log('🚀 Server running on port 3000'));
