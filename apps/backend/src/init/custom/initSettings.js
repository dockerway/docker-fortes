import {createOrUpdateSettings} from "@dracul/settings-backend";


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
        group: 'Fortes',
        label: {en: 'Maximum quantity log lines', es: 'Cantidad máxima de lineas de logs', pt: 'máximo de linhas de logs'}   
    },
    {
        key: 'volumes',
        valueList: ['/logs', '/localdata', '/storage', '/var'],
        type: 'stringList',
        group: 'Fortes',
        label: {en: 'List of volumes to mount', es: 'Lista de volumenes a montar'}   
    },
]

export const initSettings = async function () {

    for (let i in settings) {
        await createOrUpdateSettings(null, settings[i])
    }

}
