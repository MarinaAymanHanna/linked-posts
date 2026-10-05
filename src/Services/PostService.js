import axios from "axios";

export async function getPosts(token) {
    try {
        const { data } = await axios.get(
            "https://route-posts.routemisr.com/posts",
            {
                headers: {
                    token: token,
                },
            }
        );

        console.log(data);
        return data.data.posts;
    } catch (error) {
        console.error("Error fetching post:", error);
        throw error;
    }
}