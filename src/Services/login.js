import axios from "axios";

export async function sendLoginData(values) {

    try {

        const { data } = await axios.post(
            "https://route-posts.routemisr.com/users/signin",
            values
        );

        return data;

    } catch (error) {

        return error.response?.data;

    }
}