import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.set('useCreateIndex', true)

import { InitService } from '@dracul/user-backend'
import { initPermissionsCustomization } from '@dracul/customize-backend'
import { customizationInit } from './custom/initCustomization'
import implementacionesRole from './custom/roles/initImplementacionesRole'
import sudoRole from './custom/roles/initSudoRole'
import infraestructuraRole from './custom/roles/initInfraestructuraRole'
import desarrolloRole from './custom/roles/initDesarrolloRole'
import direccionRole from './custom/roles/initDireccionRole'
import pmRole from './custom/roles/initPMRole'
import qaRole from './custom/roles/initQARole'
import soporteRole from './custom/roles/initSoporteRole'

import {
    permissions as settingsPermissions
} from '@dracul/settings-backend'

import { permissions as AuditPermissions } from "@dracul/audit-backend"

import { initSettings } from './custom/initSettings'

import modulesPermissions from './custom/modulesPermissions'


export const initService = async () => {

    //Default user Permissions
    await InitService.initPermissions()

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