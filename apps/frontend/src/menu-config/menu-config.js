
export default [
    {
        icon: 'home',
        text:'base.home',
        link: { name: "home" },
        galleryHide: true
    },

    {
        icon: 'takeout_dining',
        text: 'menu.docker',
        permission: 'DOCKER_VIEW',
        children: [
            {
                icon: 'view_agenda',
                text: 'menu.stacks',
                link: {name: "StacksPage"},
                permission: 'DOCKER_VIEW'
            },
            {
                icon: 'settings_suggest',
                text: 'menu.services',
                link: {name: "ServicesPage"},
                permission: 'DOCKER_VIEW'
            },
            {
                icon: 'scatter_plot',
                text: 'menu.nodes',
                link: {name: "NodesPage"},
                permission: 'DOCKER_VIEW'
            },
            {
                icon: 'lan',
                text: 'menu.networks',
                link: {name: "NetworksPage"},
                permission: 'DOCKER_VIEW'
            },
            {
                icon: 'mdi-information-box',
                text: 'menu.clusterInformation',
                link: {name: "ClusterInformationPage"},
                permission: 'DOCKER_VIEW'
            }
        ]
    },

    {
        icon: 'person',
        text: 'menu.administration',
        panel: false,
        permission: 'SECURITY_ADMIN_MENU',
        children: [
            {
                icon: 'policy',
                text: 'menu.audit',
                link: { name: "AuditPage" },
                panel: false,
                permission: 'AUDIT_SHOW'
            },
            {
                icon: 'assignment_ind',
                text: 'menu.userdashboard',
                link: { name: "userDashboard" },
                panel: false,
                permission: 'SECURITY_DASHBOARD_SHOW'
            },
            {
                icon: 'settings_applications',
                text: 'menu.customization',
                link: { name: "customization" },
                panel: false,
                permission: 'CUSTOMIZATION_SHOW'
            },
            {
                icon: 'settings',
                text: 'settings.settings.title',
                link: { name: "SettingsPage" },
                panel: false,
                permission: 'SETTINGS_UPDATE'
            },
            {
                icon: 'assignment_ind',
                text: 'user.title',
                link: { name: "userManagement" },
                panel: false,
                permission: 'SECURITY_USER_SHOW'
            },
            {
                icon: 'verified_user',
                text: 'role.title',
                link: { name: "roleManagement" },
                panel: false,
                permission: 'SECURITY_ROLE_SHOW'
            },
            {
                icon: 'group',
                text: 'group.title',
                link: { name: "groupManagement" },
                panel: false,
                permission: 'SECURITY_GROUP_SHOW'
            },

        ]
    },


]
