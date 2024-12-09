"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createTask = zod_1.z.object({
    title: zod_1.z.string().min(1, 'coloca o titulo').max(255, 'titulo muito grande'),
    desc: zod_1.z.string()
});
const updateTask = zod_1.z.object({
    title: zod_1.z.string().min(1, 'coloca o titulo').max(255, 'titulo muito grande').optional(),
    desc: zod_1.z.string().optional(),
    completed: zod_1.z.boolean().optional(),
});
function userRoutes(server) {
    return __awaiter(this, void 0, void 0, function* () {
        //POST
        server.post('/tarefa', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const body = createTask.parse(request.body);
                const newTask = yield prisma.tarefas.create({
                    data: {
                        title: body.title,
                        description: body.desc
                    },
                });
                reply.status(201).send(newTask);
            }
            catch (e) {
                if (e instanceof zod_1.z.ZodError) {
                    reply.status(400).send({ error: e.errors });
                }
                else {
                    reply.status(500).send({ error: 'Erro ao criar a tarefa' });
                }
            }
        }));
        //GET
        server.get("/tarefa", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const tarefas = yield prisma.tarefas.findMany();
                reply.status(202).send(tarefas);
            }
            catch (e) {
                reply.status(500).send({ error: "Erro ao buscar as tarefas" });
            }
        }));
        //PUT
        server.put("/tarefa/:id", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = request.params;
                const body = updateTask.parse(request.body);
                const updatedTask = yield prisma.tarefas.update({
                    where: { id: Number(id) },
                    data: {
                        title: body.title,
                        description: body.desc,
                        completedAt: body.completed
                    },
                });
                reply.status(203).send(updatedTask);
            }
            catch (e) {
                if (e instanceof zod_1.z.ZodError) {
                    reply.status(400).send({ error: e.errors });
                }
                else if (e.code === 'P2025') {
                    reply.status(404).send({ error: 'Tarefa não encontrada' });
                }
                else {
                    reply.status(500).send({ error: 'Erro ao atualizar a tarefa' });
                }
            }
        }));
        //DELETE
        server.delete("/tarefa/:id", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = request.params;
                const deleteTask = yield prisma.tarefas.delete({
                    where: { id: Number(id) },
                });
                reply.status(204).send({ message: 'Tarefa deletada com sucesso', tarefas: deleteTask });
            }
            catch (e) {
                if (e.code === 'P2025') {
                    reply.status(404).send({ error: 'Tarefa não encontrada' });
                }
                else {
                    reply.status(500).send({ error: 'Erro ao deletar a tarefa' });
                }
            }
        }));
    });
}
exports.default = userRoutes;
