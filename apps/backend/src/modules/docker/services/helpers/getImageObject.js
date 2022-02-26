export const getImageObject = (inputImage = '') => {
    //console.log(inputImage)

    let fullname = /@/.test(inputImage) ? inputImage.split("@")[0] : inputImage
    let imageSplited = fullname.split("/")

    let id = /@/.test(inputImage) ? inputImage.split("@")[1].split(":")[1] : ''
    let name = ''
    let nameWithTag = ''
    let namespace = ''
    let domain = ''
    let tag = ''

    switch (imageSplited.length) {
        case 1:
            nameWithTag = imageSplited[0]
            name = nameWithTag.split(":")[0]
            tag = nameWithTag.split(":")[1]
            break;
        case 2:
            nameWithTag = imageSplited[1]
            name = nameWithTag.split(":")[0]
            tag = nameWithTag.split(":")[1]
            domain = imageSplited[0]
            break;
        case 3:
            nameWithTag = imageSplited[2]
            name = nameWithTag.split(":")[0]
            tag = nameWithTag.split(":")[1]
            namespace = imageSplited[1]
            domain = imageSplited[0]
            break;

    }

    //tag = /:/.test(name) ? name.split(":")[1] : ""


    let obj = {
        id: id,
        fullname: fullname,
        domain: domain,
        namespace: namespace,
        name: name,
        tag: tag,
        nameWithTag: nameWithTag
    }

    return obj
}

export default getImageObject
