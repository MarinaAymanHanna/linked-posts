import axios from "axios";

export async function sendRegisterData(values){
try{
const { data } = await axios.post(`https://route-posts.routemisr.com/users/signup`, values);
console.log(data);
return data;

}catch(error){
    console.log(error.response.data);
    return error.response.data;
}
}