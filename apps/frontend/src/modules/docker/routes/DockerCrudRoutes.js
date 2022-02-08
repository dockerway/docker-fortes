import AuditPage from '../pages/crud/AuditPage'

const routes = [
       
     {
        name: 'AuditPage', 
        path: '/crud/audit', 
        component: AuditPage,  
        meta: {
            requiresAuth: true,
            permission: "AUDIT_SHOW"
        }
     }
]

export default routes;
