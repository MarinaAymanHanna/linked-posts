import {Button, Input, Label, Spinner } from "@heroui/react";
import { ListBox, Select} from "@heroui/react";
import { useForm,Controller } from "react-hook-form";
import * as Zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendRegisterData } from "../Services/register";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { schema } from "../Schema/RegisterSchema.jsx";



export default function RegisterPage() {

        const [apiError, setApiError] = useState(null);
        const [loading, setLoading] = useState(false);
    

    const { register, control , handleSubmit , formState: { errors } } = useForm({
        defaultValues:{   
            name: "",
            username: "",
            email:"",
            password:"",
            rePassword:"",
            dateOfBirth:"",
            gender:""
            },
            resolver:zodResolver(schema) ,
            //mode : "all"
    })

    const navigate = useNavigate();


    async function signUp(values) {
        if (loading) return;

        setLoading(true);
        setApiError(null);

        try {
            const response = await sendRegisterData(values);

            if (!response.success) {
                setApiError(response.message);
                return;
            }

            navigate("/login");

        } catch (error) {
            setApiError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return<div className="min-h-screen flex justify-center items-center">
        <div className="min-w-md bg-white py-10 px-6 rounded-2xl shadow-2xl">
            <h2 className="text-2xl mb-4">Register Page</h2>

            <form onSubmit={handleSubmit(signUp)} className="flex flex-col gap-4" >

                <Label htmlFor="input-type-name">Name</Label>
                <Input {...register("name")} id="input-type-name" placeholder="Example" type="text" />
                {errors.name?.message && <p className="text-red-500">{errors.name.message}</p>}

                <Label htmlFor="input-type-username">Username</Label>
                <Input {...register("username")} id="input-type-username" placeholder="username" type="text"/>
                {errors.username?.message && (<p className="text-red-500">{errors.username.message}</p>)}
                
                <Label htmlFor="input-type-email">Email</Label>
                <Input {...register("email")} id="input-type-email" placeholder="user@example.com" type="email" />
                {errors.email?.message && <p className="text-red-500">{errors.email.message}</p>}

                <Label htmlFor="input-type-password">Password</Label>
                <Input {...register("password")} id="input-type-password" placeholder="Example@123" type="password" />
                {errors.password?.message && <p className="text-red-500">{errors.password.message}</p>}

                <Label htmlFor="input-type-repassword">RePassword</Label>
                <Input {...register("rePassword")} id="input-type-repassword" placeholder="Example@123" type="password" />
                {errors.rePassword?.message && <p className="text-red-500">{errors.rePassword.message}</p>}

                <div className="flex gap-10 items-center ">

                    <div className="w-50 flex flex-col ">
                <Label htmlFor="input-type-dob">dateOfBirth</Label>
                <Input  {...register("dateOfBirth")} id="input-type-dob" type="date" />
                {errors.dateOfBirth?.message && <p className="text-red-500">{errors.dateOfBirth.message}</p>}
                    </div>
                    
                
                
    <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                    <>
                    <Select
                        value={field.value || null}
                        onChange={(value) => {
                            field.onChange(value);
                        }}
                        className="w-50"
                        placeholder="Select one"
                    >
                    <Label>Select Your Gender</Label>

                    <Select.Trigger>
                        <Select.Value />
                        <Select.Indicator />
                    </Select.Trigger>

                    <Select.Popover>
                        <ListBox>
                            <ListBox.Item id="male" textValue="male">
                                male
                                <ListBox.ItemIndicator />
                            </ListBox.Item>

                            <ListBox.Item id="female" textValue="female">
                                female
                                <ListBox.ItemIndicator />
                            </ListBox.Item>
                        </ListBox>
                    </Select.Popover>
                                {errors.gender?.message && (
                    <p className="text-red-500">
                        {errors.gender.message}
                    </p>
                )}
                </Select>
            </>
        )}
    />

                </div>

                {apiError && <p className="text-red-500 text-center">{apiError}</p>}

                <Button isPending={loading} isDisabled={loading} type="submit" className="w-100 self-center" variant="primary">{loading ? <><Spinner size="sm" /> Registering...</> : "Register"}</Button>
                <p className="mt-1">If you already have an account please <Link to={"/login"} className="text-blue-500 hover:underline p-1">SignIn </Link></p>

            </form>
        </div>

    </div>
}
