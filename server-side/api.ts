import { Client, Request } from '@pepperi-addons/debug-server'
import { TasksService } from './services/tasks.service';

export async function test(client: Client, request: Request) {
    if (request.method === 'GET') {
        const name = request.query.name;
        console.log(`${name} was here`)
        return {
            Hello: request.query.name
        }
    }
    
    throw new Error(`${request.method} isn't supported`);
};

export async function my_tasks(client: Client, request: Request) {
    const tasksService = new TasksService(client);
    
    if (request.method === 'GET') {
        return tasksService.getTasks(request.query);
    }

    if (request.method === 'POST') {
        return tasksService.upsertTask(request.body);
    }

    throw new Error(`${request.method} isn't supported`);
}

export async function tasks_usage(client: Client, request: Request) {
    const tasksService = new TasksService(client);
    
    if (request.method === 'GET') {
        return tasksService.getTasksUsage();
    }

    throw new Error(`${request.method} isn't supported`);
}