const http=require('http');

const server=http.createServer((req,res)=>{
    res.setHeader('content-type','application/json')

    // get all students
    if(req.url('/students') && req.method('get')){
        res.end(students)
    }
})

server.listen(3000,()=>{
    console.log('the server is running on port 3000')
})