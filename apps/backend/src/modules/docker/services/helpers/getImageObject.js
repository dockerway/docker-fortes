export const getImageObject = (inputImage = '') => {
    //console.log(inputImage)

    let fullname = /@/.test(inputImage) ? inputImage.split("@")[0] : inputImage
    let imageSplited = fullname.split("/")

    let id = /@/.test(inputImage) ? inputImage.split("@")[1].split(":")[1] : ''
    let name = ''
    let namespace = ''
    let domain = ''
    let tag = ''

    switch (imageSplited.length) {
        case 1:
            name = imageSplited[0]
            break;
        case 2:
            name = imageSplited[1]
            domain = imageSplited[0]
            break;
        case 3:
            name = imageSplited[2]
            namespace = imageSplited[1]
            domain = imageSplited[0]
            break;

    }

    tag = /:/.test(name) ? name.split(":")[1] : ""


    let obj = {
        id: id,
        fullname: fullname,
        name: name,
        namespace: '',
        domain: domain,
        tag: tag
    }

    return obj
}

export default getImageObject
