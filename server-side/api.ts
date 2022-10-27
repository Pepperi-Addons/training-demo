import { Client, Request } from '@pepperi-addons/debug-server'

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

