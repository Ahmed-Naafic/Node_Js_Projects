const http = require('http');

let students = [
  { id: 1, name: "Ali", class: "10A" },
  { id: 2, name: "Amina", class: "11B" }
];

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');

  // GET all students
  if (req.url === "/students" && req.method === "GET") {
    res.end(JSON.stringify(students));
  }

  // POST new student
  else if (req.url === "/students" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const newStudent = JSON.parse(body);
      students.push(newStudent);
      res.end(JSON.stringify({ message: "Student added", students }));
    });
  }

  // UPDATE student (PUT)
  else if (req.url.startsWith("/students/") && req.method === "PUT") {
    const id = parseInt(req.url.split("/")[2]);
    let body = "";
    req.on("data", chunk => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const updateData = JSON.parse(body);
      students = students.map(s => (s.id === id ? { ...s, ...updateData } : s));
      res.end(JSON.stringify({ message: "Student updated", students }));
    });
  }

  // DELETE student
  else if (req.url.startsWith("/students/") && req.method === "DELETE") {
    const id = parseInt(req.url.split("/")[2]);
    students = students.filter(s => s.id !== id);
    res.end(JSON.stringify({ message: "Student deleted", students }));
  }

  else {
    res.statusCode = 404;
    res.end(JSON.stringify({ message: "Not Found" }));
  }
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
