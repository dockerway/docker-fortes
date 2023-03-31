import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.set('useCreateIndex', true)

import { InitService } from '@dracul/user-backend'
import { initPermissionsCustomization } from '@dracul/customize-backend'
import { customizationInit } from './custom/initCustomization'
import implementacionesRole from './custom/initImplementacionesRole'
import sudoRole from './custom/initSudoRole'
import infraestructuraRole from './custom/initInfraestructuraRole'
import desarrolloRole from './custom/initDesarrolloRole'
import direccionRole from './custom/initDireccionRole'
import pmRole from './custom/initPMRole'
import qaRole from './custom/initQARole'
import soporteRole from './custom/initSoporteRole'

import {
    permissions as notiPermissions
} from "@dracul/notification-backend"

import {
    permissions as settingsPermissions
} from '@dracul/settings-backend'

import { permissions as AuditPermissions } from "@dracul/audit-backend"

import { initSettings } from './custom/initSettings'

import modulesPermissions from './custom/modulesPermissions'


const initService = async () => {

    //Default user Permissions
    await InitService.initPermissions()

    //Notification permissions
    await InitService.initPermissions([
        notiPermissions.NOTIFICATION_SHOW,
        notiPermissions.NOTIFICATION_CREATE,
        notiPermissions.NOTIFICATION_UPDATE
    ])

    //Settings Permissions
    await InitService.initPermissions([
        settingsPermissions.SETTINGS_CREATE,
        settingsPermissions.SETTINGS_UPDATE,
        settingsPermissions.SETTINGS_DELETE,
        settingsPermissions.SETTINGS_SHOW,
    ])

    await InitService.initPermissions([AuditPermissions.AUDIT_SHOW])

    //Init settings
    await initSettings()
    await InitService.initLdapSettings()

    //Dracul Customization module Permissions
    await initPermissionsCustomization()

    //Custom Module permissions
    await InitService.initPermissions(modulesPermissions)

    await InitService.initAdminRole()

    await InitService.initRoles([sudoRole, implementacionesRole, infraestructuraRole, desarrolloRole, direccionRole, pmRole, qaRole, soporteRole])

    await InitService.initRootUser()

    await customizationInit()
}

export { initService }

export default initService
