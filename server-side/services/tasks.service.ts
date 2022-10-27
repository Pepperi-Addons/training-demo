import { Client } from "@pepperi-addons/debug-server/dist";
import { PapiClient } from "@pepperi-addons/papi-sdk";
import { v4 as uuid } from 'uuid'

const MY_TASKS_SCHEMA_NAME = 'my_tasks';

export interface Task {
    Key: string;
    Title: string;
    Description: string;
    EstimatedDuration: number;
    StartDateTime: string;
    EndDateTime: string;
}

export class TasksService {

    constructor(private client: Client) {
        this.papiClient = new PapiClient({
            baseURL: client.BaseURL,
            token: client.OAuthAccessToken,
            actionUUID: client.ActionUUID,
            addonSecretKey: client.AddonSecretKey,
            addonUUID: client.AddonUUID
        })
    }

    papiClient: PapiClient

    async createTaskSchema() {
        await this.papiClient.addons.data.schemes.post({
            Name: MY_TASKS_SCHEMA_NAME,
            Type: 'data',
            Fields: {
                Title: {
                    Type: 'String'
                },
                Description: {
                    Type: 'String'
                },
                EstimatedDuration: {
                    Type: 'Integer'
                },
                StartDateTime: {
                    Type: 'DateTime'
                },
                EndDateTime: {
                    Type: 'DateTime'
                },
            }
        })
    }

    async getTasks(query) {
        return this.papiClient.addons.data.uuid(this.client.AddonUUID).table(MY_TASKS_SCHEMA_NAME).iter(query).toArray()
    }

    async upsertTask(task: Task): Promise<Task> {
        // create a key if it doesn't exist yet
        if (!task.Key) {
            task.Key = uuid()
        }

        // default duration
        if (!task.StartDateTime && !task.StartDateTime && !task.EndDateTime) {
            task.EstimatedDuration = 30
            task.StartDateTime = new Date().toISOString()
            task.EndDateTime = new Date(new Date().getTime() + 30*24*60*60*1000).toISOString()
        }

        if (!task.Title) {
            throw new Error("Title is required")
        }

        return await this.papiClient.addons.data.uuid(this.client.AddonUUID).table(MY_TASKS_SCHEMA_NAME).upsert(task) as Task;
    }
}