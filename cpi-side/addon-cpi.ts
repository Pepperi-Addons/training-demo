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



    // pepperi.events.intercept('RecalculateUIObject', {
    //     UIObject: {
    //         context: {
    //             Name: 'UserHomePage'
    //         }
    //     }
    // }, async (context) => {
    //     console.log("Here is my event")
    //     const uiObject: UIObject = context.UIObject;

    //     for (const field of uiObject.fields) {
    //         field.visible = Math.random() > 0.5
    //     }
    // })

    pepperi.events.intercept('TasksEvent', {}, async (context) => {
        console.log('in interceptor')
        const service = new TasksService()
        const tasks = await service.getTasks();
        console.log(tasks)

        const client = context.client;
        
        console.log("sending first client action")
        await client?.alert("Hello", "We will start the task now")
        console.log("after first client action")

        await client?.showDialog({
            title: 'Trick Or Treat!',
            // content: "<html><img src='https://gray-weau-prod.cdn.arcpublishing.com/resizer/i24O6vVlm0PY8a571Tme_hiyFik=/1200x675/smart/filters:quality(85)/cloudfront-us-east-1.images.arcpublishing.com/gray/PPOT24VO3ZALPIIWSMKK6DQR5E.png'></img></html>",
            content: 'You have to choose one..',
            actions: [{
                title: 'Trick',
                value: false
            },{
                title: 'Treat',
                value: true
            }]
        })

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