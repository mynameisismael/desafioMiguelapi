import fastify from "fastify";
import userRoutes from "./tasks/task.routes";

const server = fastify();

server.get("/healthcheck", async function() {
    return("OK")
})

server.register(userRoutes, {prefix: "/api"});

async function main() {
    try{
        server.listen({port:3001}, () => {
            console.log("Server ready at  http://localhost:3001 ");
        })
    }catch(e){
        console.error(e);
        process.exit(1);
    }
}

main();