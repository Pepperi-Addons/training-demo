import '@pepperi-addons/cpi-node'
import { AddonUUID } from '../addon.config.json'

export class TasksService {

    async getTasks() {
        const myTasks = await pepperi.api.adal.getList({
            addon: AddonUUID,
            table: 'my_tasks'
        })
        return myTasks
    }
}