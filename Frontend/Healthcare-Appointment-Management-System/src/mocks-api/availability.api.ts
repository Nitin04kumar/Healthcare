import axiosInstance from "../utils/axios";


const getDoctorAvalability = async (id: number | string) => {
    const accessToken = localStorage.getItem('token');
    const response = await axiosInstance.get(`/doctor/avalability/${id}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    console.log("aval hit", response)
    return response.data;
}


export {getDoctorAvalability}