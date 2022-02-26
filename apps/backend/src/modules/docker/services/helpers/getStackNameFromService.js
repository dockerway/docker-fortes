
export const getStackNameFromService = (service) => {
    return service?.Spec?.Labels["com.docker.stack.namespace"]
}

export default getStackNameFromService
