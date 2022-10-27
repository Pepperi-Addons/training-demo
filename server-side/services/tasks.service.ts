import { Client } from "@pepperi-addons/debug-server/dist";
import { PapiClient } from "@pepperi-addons/papi-sdk";

export class TasksService {

    constructor(client: Client) {
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
            Name: 'my_tasks',
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
}