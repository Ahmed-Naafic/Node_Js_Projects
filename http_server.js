// server.js
const http = require("http");
const { MongoClient, ObjectId } = require("mongodb");

const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);
const dbName = "school";

async function startServer() {
  await client.connect();
  console.log(" MongoDB connected");

  const db = client.db(dbName);
  const students = db.collection("students");
  const courses = db.collection("courses");

  const server = http.createServer(async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    const { method, url } = req;

    // Helper: read JSON body
    const getRequestBody = async () =>
      new Promise((resolve, reject) => {
        let body = "";
        req.on("data", (chunk) => (body += chunk.toString()));
        req.on("end", () => {
          try {
            resolve(body ? JSON.parse(body) : {});
          } catch {
            reject();
          }
        });
      });

    // -------------------- STUDENTS --------------------
    if (url === "/students" && method === "GET") {
      const data = await students.find().toArray();
      res.writeHead(200);
      return res.end(JSON.stringify(data));
    }

    if (url === "/students" && method === "POST") {
      try {
        const body = await getRequestBody();
        if (!body.name || !body.age) {
          res.writeHead(400);
          return res.end(JSON.stringify({ error: "Missing fields" }));
        }
        const result = await students.insertOne({
          name: body.name,
          age: body.age,
          courseIds: [],
        });
        res.writeHead(201);
        return res.end(JSON.stringify(result));
      } catch {
        res.writeHead(500);
        return res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    }

    if (url.startsWith("/students/") && method === "PUT") {
      const id = url.split("/")[2];
      const body = await getRequestBody();
      try {
        const result = await students.updateOne(
          { _id: new ObjectId(id) },
          { $set: body }
        );
        res.writeHead(200);
        return res.end(JSON.stringify(result));
      } catch {
        res.writeHead(404);
        return res.end(JSON.stringify({ error: "Student not found" }));
      }
    }

    if (url.startsWith("/students/") && method === "DELETE") {
      const id = url.split("/")[2];
      try {
        const result = await students.deleteOne({ _id: new ObjectId(id) });
        res.writeHead(200);
        return res.end(JSON.stringify(result));
      } catch {
        res.writeHead(404);
        return res.end(JSON.stringify({ error: "Student not found" }));
      }
    }

    // -------------------- COURSES --------------------
    if (url === "/courses" && method === "GET") {
      const data = await courses.find().toArray();
      res.writeHead(200);
      return res.end(JSON.stringify(data));
    }

    if (url === "/courses" && method === "POST") {
      try {
        const body = await getRequestBody();
        if (!body.title || !body.instructor || !body.credits) {
          res.writeHead(400);
          return res.end(JSON.stringify({ error: "Missing fields" }));
        }
        const result = await courses.insertOne(body);
        res.writeHead(201);
        return res.end(JSON.stringify(result));
      } catch {
        res.writeHead(500);
        return res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    }

    if (url.startsWith("/courses/") && method === "PUT") {
      const id = url.split("/")[2];
      const body = await getRequestBody();
      try {
        const result = await courses.updateOne(
          { _id: new ObjectId(id) },
          { $set: body }
        );
        res.writeHead(200);
        return res.end(JSON.stringify(result));
      } catch {
        res.writeHead(404);
        return res.end(JSON.stringify({ error: "Course not found" }));
      }
    }

    if (url.startsWith("/courses/") && method === "DELETE") {
      const id = url.split("/")[2];
      try {
        const result = await courses.deleteOne({ _id: new ObjectId(id) });
        res.writeHead(200);
        return res.end(JSON.stringify(result));
      } catch {
        res.writeHead(404);
        return res.end(JSON.stringify({ error: "Course not found" }));
      }
    }

    // -------------------- 404 --------------------
    res.writeHead(404);
    res.end(JSON.stringify({ error: "Route not found" }));
  });

  const PORT = 3000;
  server.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
  });
}

startServer().catch((err) => console.error(err));
