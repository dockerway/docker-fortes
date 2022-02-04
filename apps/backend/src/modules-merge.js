import {mergeTypes, mergeResolvers} from 'merge-graphql-schemas';
import {securityResolvers,securityTypes} from '@dracul/user-backend'

import {commonTypes} from '@dracul/common-backend'
import {types as customTypes,resolvers as customResolvers} from '@dracul/customize-backend'
import {types as notificationTypes,resolvers as notificationResolvers} from '@dracul/notification-backend'
import {types as settingsTypes,resolvers as settingsResolvers} from '@dracul/settings-backend'

//BASE RESOLVERS
import {resolvers as baseResolvers } from './modules/base/graphql'
import {resolvers as dockerResolvers } from './modules/docker/graphql'
//BASE TYPEDEFS
import {types as baseTypes} from './modules/base/graphql'
import {types as dockerTypes} from './modules/docker/graphql'


export const resolvers = mergeResolvers([
    baseResolvers,
    securityResolvers,
    notificationResolvers,
    customResolvers,
    settingsResolvers,
    dockerResolvers
])

export const typeDefs = mergeTypes([
    commonTypes,
    baseTypes,
    securityTypes,
    notificationTypes,
    customTypes,
    settingsTypes,
    dockerTypes
])
