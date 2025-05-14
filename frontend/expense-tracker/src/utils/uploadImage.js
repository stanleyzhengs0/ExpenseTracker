import axiosInstance from "./axiosInstance"
import { API_PATHS } from "./apiPaths"


const uploadImage = async (imageFile) => {
    const formData = new FormData()
    // Append image file to form data
    formData.append('image', imageFile)

    try{

        const response = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData, {
            headers: {
                'Content-Type': 'multipart/form-data' //Set header for file upload
            }
        })

        return response.data //Return response data

    }catch(error){
        console.log("Error uploading the image: ", error)
        throw error //Rethrow error for handling
    }
}

export default uploadImage