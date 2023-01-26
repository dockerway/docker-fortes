import {createSettings, findSettingsByKey} from "@dracul/settings-backend";


const settings = [
    //{key:'',value: '',label: {en: '', es:'', pt:''} },
    /*  {
        key: 'xxxxx',
        value: '60',
        type: 'number',
        label: {en: 'ENENEN', es: 'ESESES', pt: 'PTPTPT'}
    },*/
    {
        key: 'maxLogsLines',
        value: 10000,
        type: 'number',
        label: {en: 'Maximum quantity log lines', es: 'Cantidad máxima de lineas de logs', pt: 'máximo de linhas de logs'}   
    }
]

export const initSettings = async function () {

    for (let i in settings) {
        let setting = await findSettingsByKey(settings[i].key)
        if (!setting) {
            await createSettings(null, settings[i])
        }
    }


}
