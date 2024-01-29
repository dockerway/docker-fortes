
const messages = {
   en: {
      docker: {
         servicesPage: {
            title: "Services",
            refresh: 'refresh',
            restart: 'restart',
            remove: 'remove',
         },
         stack: {
            name: "StackName",
            services: "Services"
         },
         service: {
            name: "ServiceName",
            image: "Image",
            ports: "Ports"
         },
         node: {
            id: "ID",
            hostname: "Hostname",
            ip: "IP",
            role: "Role",
            leader: "Leader",
            state: "State",
            engine: "Engine"
         },
         common: {
            createdAt: "Created",
            updatedAt: "Updated",
            logs: "Logs"
         },
         logs: {
            numberOfLines: "Number of filter lines:"
         },
         networks:{
            name: "Name",
            stack: "Stack",
            driver: "Driver",
            attachable: "Attachable",
            ipamdriver: "IPAM driver",
            ipv4ipamsubnet: "Ipv4 IPAM subnet",
            ipv4ipamgateway: "Ipv4 IPAM gateway",
         }
      }
   },
   es: {
      docker: {
         servicesPage: {
            title: 'Servicios',
            refresh: 'Recargar',
            restart: 'Reiniciar',
            remove: 'Eliminar',
         },
         stack: {
            name: "StackName",
            services: "Services"
         },
         service: {
            name: "ServiceName",
            image: "Image",
            ports: "Ports"
         },
         node: {
            id: "ID",
            hostname: "Hostname",
            ip: "IP",
            role: "Role",
            leader: "Leader",
            state: "State",
            engine: "Engine"
         },
         common: {
            createdAt: "Created",
            updatedAt: "Updated",
            logs: "Logs"
         },
         logs: {
            numberOfLines: "Cantidad de lineas filtradas:"
         },
         networks:{
            name: "Nombre",
            dateOfCreation: "Fecha de creacion",
            stack: "Stack",
            driver: "Driver",
            attachable: "Enlazable",
            ipamdriver: "Driver IPAM",
            ipv4ipamsubnet: "Subnet IPAM Ipv4",
            ipv4ipamgateway: "Gateway IPAM Ipv4",
         }
      }
   },
   pt: {
      docker: {
         servicesPage: {
            title: 'Services',
            refresh: 'refresh',
            restart: 'restart',
            remove: 'Remove',
         },
         stack: {
            name: "StackName",
            services: "Services"
         },
         service: {
            name: "ServiceName",
            image: "Image",
            ports: "Ports"
         },
         node: {
            id: "ID",
            hostname: "Hostname",
            ip: "IP",
            role: "Role",
            leader: "Leader",
            state: "State",
            engine: "Engine"
         },
         common: {
            createdAt: "Created",
            updatedAt: "Updated",
            logs: "Logs"
         },
         logs: {
            numberOfLines: "Number of filter lines:"
         },
         networks:{
            name: "Name",
            stack: "Stack",
            driver: "Driver",
            attachable: "Attachable",
            ipamdriver: "IPAM driver",
            ipv4ipamsubnet: "Ipv4 IPAM subnet",
            ipv4ipamgateway: "Ipv4 IPAM gateway",
         }
      }
   }
}

export default messages
