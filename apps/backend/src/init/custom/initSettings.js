import {createSettings, findSettingsByKey} from "@dracul/settings-backend";


const settings = [
    //{key:'',value: '',label: {en: '', es:'', pt:''} },
    /*  {
        key: 'xxxxx',
        value: '60',
        type: 'number',
        label: {en: 'ENENEN', es: 'ESESES', pt: 'PTPTPT'}
    },*/

]

export const initSettings = async function () {

    for (let i in settings) {
        let setting = await findSettingsByKey(settings[i].key)
        if (!setting) {
            await createSettings(null, settings[i])
        }
    }


}
