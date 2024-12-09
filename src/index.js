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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const task_routes_1 = __importDefault(require("./tasks/task.routes"));
const server = (0, fastify_1.default)();
server.get("/healthcheck", function () {
    return __awaiter(this, void 0, void 0, function* () {
        return ("OK");
    });
});
server.register(task_routes_1.default, { prefix: "/api" });
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            server.listen({ port: 3001 }, () => {
                console.log("Server ready at  http://localhost:3001 ");
            });
        }
        catch (e) {
            console.error(e);
            process.exit(1);
        }
    });
}
main();
