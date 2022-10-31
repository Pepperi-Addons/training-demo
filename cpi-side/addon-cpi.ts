import '@pepperi-addons/cpi-node'
import { UIObject } from '@pepperi-addons/cpi-node';
import { AddonUUID } from '../addon.config.json'
import { TasksService } from './tasks.service';

export async function load() {
    console.log('Here i am loading')

    const myTasks = await pepperi.api.adal.getList({
        addon: AddonUUID,
        table: 'my_tasks'
    })
    console.log("My tasks: ",  myTasks)

    const t0 = performance.now();
    const accounts = await pepperi.api.accounts.search({
        fields: ['Name', 'UUID']
    })
    console.log("Accounts: ", JSON.stringify(accounts.objects))
    
    const t1 = performance.now();
    const otherAccounts = await pepperi.papiClient.accounts.iter({
        fields: ['Name', 'UUID']
    }).toArray();
    console.log("Other Accounts: ", JSON.stringify(otherAccounts))
    
    const t2 = performance.now()
    console.log("Getting local accounts took: ", (t1-t0).toFixed(4), "ms")
    console.log("Getting API accounts took: ", (t2-t1).toFixed(4), "ms")



    pepperi.events.intercept('RecalculateUIObject', {
        UIObject: {
            context: {
                Name: 'UserHomePage'
            }
        }
    }, async (context) => {
        console.log("Here is my event")
        const uiObject: UIObject = context.UIObject;

        for (const field of uiObject.fields) {
            field.visible = Math.random() > 0.5
        }
    })

    pepperi.events.intercept('TasksEvent', {}, async (context) => {
        const service = new TasksService()
        const tasks = await service.getTasks();

        return {
            currentTask: tasks[0]
        }
    })
}

export const router = Router()
router.get('/test', async (req, res) => {
    console.log(`${req.query.name} was here`)
    

    const tasks = await pepperi.addons.api.uuid(AddonUUID).get({
        url: 'addon-cpi/my_tasks',
    })

    res.json({
        hello: req.query.name,
        tasks: tasks.length
    })
})

router.get('/my_tasks', async (req, res) => {
    const myTasks = await pepperi.api.adal.getList({
        addon: AddonUUID,
        table: 'my_tasks'
    })
    res.json(myTasks.objects)
})