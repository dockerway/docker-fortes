import getImageObject from "./getImageObject";
import getStackNameFromService from "./getStackNameFromService";


export const mapInspectToServiceModel = (item) => {
    return {
        id: item?.ID,
        name: item?.Spec?.Name,
        stack: getStackNameFromService(item),
        image: getImageObject(item.Spec.TaskTemplate.ContainerSpec.Image),
        createdAt: item?.CreatedAt,
        updatedAt: item?.UpdatedAt,
        ports: item?.Spec?.EndpointSpec?.Ports?.map(p => ({
            containerPort: p?.TargetPort,
            hostPort: p?.PublishedPort,
            protocol: p?.Protocol
        })),
        volumes: item?.Spec?.TaskTemplate?.ContainerSpec?.Mounts?.map(m => ({
            containerVolume: m?.Target,
            hostVolume: m?.Source,
            type: m?.Type
        })),
        labels: (item?.Spec?.TaskTemplate?.ContainerSpec?.Labels) ? Object.entries(item?.Spec?.TaskTemplate?.ContainerSpec?.Labels).map(l => ({
            name: l[0],
            value: l[1],
        })) : [],
        envs: item?.Spec?.TaskTemplate?.ContainerSpec?.Env?.map(e => ({
            name: e.split("=")[0],
            value: e.split("=")[1],
        })),
    }
}

export default mapInspectToServiceModel
