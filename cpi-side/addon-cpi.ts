import '@pepperi-addons/cpi-node'
import { UIObject } from '@pepperi-addons/cpi-node';
import { AddonUUID } from '../addon.config.json'

export async function load() {
    console.log('Here i am loading')


    const myTasks = await pepperi.api.adal.getList({
        addon: AddonUUID,
        table: 'my_tasks'
    })
    console.log("My tasks: ",  myTasks)


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
}

export const router = Router()
router.get('/test', (req, res) => {
    console.log(`${req.query.name} was here`)
    res.json({
        hello: req.query.name
    })
})