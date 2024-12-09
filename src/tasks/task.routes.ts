import { tarefas } from './../../node_modules/.prisma/client/index.d';
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {z} from "zod";
import { PrismaClient } from "@prisma/client";
import { error } from "console";
import { request } from "http";

const prisma = new PrismaClient();

const createTask = z.object({
    title: z.string().min(1, 'coloca o titulo').max(255, 'titulo muito grande'),
    desc: z.string()
})

const updateTask= z.object({
    title: z.string().min(1, 'coloca o titulo').max(255, 'titulo muito grande').optional(),
    desc: z.string().optional(),
    completed: z.boolean().optional(),
})


async function userRoutes(server: FastifyInstance) {
    //POST
    server.post('/tarefa', async (request: FastifyRequest, reply: FastifyReply) =>{
        try{
            const body = createTask.parse(request.body);

            const newTask = await prisma.tarefas.create({
                data:{
                    title: body.title,
                    description: body.desc
                },
                
            })
            reply.status(201).send(newTask);
        }catch(e){
           if(e instanceof z.ZodError){
            reply.status(400).send({ error: e.errors});
           }else{
            reply.status(500).send({error: 'Erro ao criar a tarefa'});
           }
        }
    })
    
    //GET
    server.get("/tarefa", async (request: FastifyRequest, reply: FastifyReply) =>{
        try{
           const tarefas = await prisma.tarefas.findMany();

           reply.status(202).send(tarefas)
        }catch(e){
            reply.status(500).send({error: "Erro ao buscar as tarefas"})
        }
    })

    //PUT
    server.put("/tarefa/:id", async (request: FastifyRequest, reply: FastifyReply) => {
        try{
             const {id} = request.params as {id: string};
             const body = updateTask.parse(request.body);
             const updatedTask = await prisma.tarefas.update({
                where: { id: Number(id) },
                data: {
                    title: body.title,
                    description: body.desc,
                    completedAt: body.completed
                },
              });
        
              reply.status(203).send(updatedTask);
        }catch(e: any){
            if (e instanceof z.ZodError) {
                reply.status(400).send({ error: e.errors });
              } else if (e.code === 'P2025') {
                reply.status(404).send({ error: 'Tarefa não encontrada' });
              } else {
                reply.status(500).send({ error: 'Erro ao atualizar a tarefa'});
              }
        }
    })

    //DELETE
    server.delete("/tarefa/:id", async (request: FastifyRequest, reply: FastifyReply) =>{
          try{
            const {id} = request.params as {id: string};
            const deleteTask = await prisma.tarefas.delete({
                where: { id: Number(id) },
            })

            reply.status(204).send({ message: 'Tarefa deletada com sucesso', tarefas: deleteTask});
          }catch(e: any){
            if (e.code === 'P2025') {
                reply.status(404).send({ error: 'Tarefa não encontrada' });
              } else {
                reply.status(500).send({ error: 'Erro ao deletar a tarefa' });
              }
          }
    })
}

export default userRoutes;