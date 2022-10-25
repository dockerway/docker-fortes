import {mergeTypes, mergeResolvers} from 'merge-graphql-schemas';
import {securityResolvers,securityTypes} from '@dracul/user-backend'

import {commonTypes} from '@dracul/common-backend'
import {types as customTypes,resolvers as customResolvers} from '@dracul/customize-backend'
import {types as notificationTypes,resolvers as notificationResolvers} from '@dracul/notification-backend'
import {types as settingsTypes,resolvers as settingsResolvers} from '@dracul/settings-backend'
import {types as auditTypes, resolvers as auditResolvers} from '@dracul/audit-backend'

//BASE RESOLVERS
import {resolvers as baseResolvers } from './modules/base/graphql'
import {resolvers as dockerResolvers } from './modules/docker/graphql'
import {resolvers as gitlabResolvers } from './modules/gitlab/graphql'
import {resolvers as registryResolvers } from './modules/registry/graphql'
//BASE TYPEDEFS
import {types as baseTypes} from './modules/base/graphql'
import {types as dockerTypes} from './modules/docker/graphql'
import {types as gitlabTypes} from './modules/gitlab/graphql'
import {types as registryTypes} from './modules/registry/graphql'


export const resolvers = mergeResolvers([
    baseResolvers,
    securityResolvers,
    notificationResolvers,
    customResolvers,
    settingsResolvers,
    dockerResolvers,
    gitlabResolvers,
    registryResolvers,
    auditResolvers
])

export const typeDefs = mergeTypes([
    commonTypes,
    baseTypes,
    securityTypes,
    notificationTypes,
    customTypes,
    settingsTypes,
    dockerTypes,
    gitlabTypes,
    registryTypes,
    auditTypes
])
