import { Button, Input, Label, Spinner } from "@heroui/react";
import { useForm } from "react-hook-form";
import * as Zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendLoginData } from "../Services/login";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";


const schema = Zod.object({
    email: Zod.string()
        .trim()
        .nonempty("Email is required")
        .regex(
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Invalid email format"
        ),

    password: Zod.string()
        .nonempty("Password is required")
        .min(8, "Password must be at least 8 characters")
        .max(20, "Password must be less than 20 characters"),
});


export default function LoginPage() {

    const [apiError, setApiError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { setIsLoggedin } = useContext(AuthContext);

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            email: "",
            password: ""
        },
        resolver: zodResolver(schema)
    });


    async function login(values) {

        if (loading) return;

        setLoading(true);
        setApiError(null);

        try {

            const response = await sendLoginData(values);

            if (!response.success) {
                setApiError("Incorrect email or password");
                return;
            }else{
                
                localStorage.setItem("token", response.data.token);
                setIsLoggedin(true);
                navigate("/");
            }


        } catch (error) {

            setApiError("Something went wrong. Please try again.");

        } finally {

            setLoading(false);

        }
    }


    return (
        <div className="min-h-screen flex justify-center items-center">

            <div className="min-w-md bg-white py-10 px-6 rounded-2xl shadow-2xl">

                <h2 className="text-2xl mb-4"> Login Page </h2>

                <form
                    onSubmit={handleSubmit(login)}
                    className="flex flex-col gap-4"
                >

                    <Label htmlFor="input-type-email">
                        Email
                    </Label>

                    <Input
                        {...register("email")}
                        id="input-type-email"
                        placeholder="user@example.com"
                        type="email"
                    />

                    {errors.email?.message && (
                        <p className="text-red-500">
                            {errors.email.message}
                        </p>
                    )}


                    <Label htmlFor="input-type-password">
                        Password
                    </Label>

                    <Input
                        {...register("password")}
                        id="input-type-password"
                        placeholder="Example@123"
                        type="password"
                    />

                    {errors.password?.message && (
                        <p className="text-red-500">
                            {errors.password.message}
                        </p>
                    )}


                    {apiError && (
                        <p className="text-red-500 text-center">
                            {apiError}
                        </p>
                    )}


                    <Button
                        isPending={loading}
                        isDisabled={loading}
                        type="submit"
                        className="w-100 self-center"
                        variant="primary"
                    >
                        {loading ? (
                            <>
                                <Spinner size="sm" />
                                Logging in...
                            </>
                        ) : (
                            "Login"
                        )}
                    </Button>


                    <p className="mt-1">
                        Don't have an account?
                        <Link
                            to="/register"
                            className="text-blue-500 hover:underline p-1"
                        >
                            Register
                        </Link>
                    </p>

                </form>

            </div>

        </div>
    );
}