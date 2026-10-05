    import * as Zod from "zod";
    
    export const schema =  Zod.object({
        name: Zod.string().nonempty("Name is required")
        .min(3, "Name must be at least 3 characters")
        .max(15, "Name must be less than 15 characters"),

        username: Zod.string()
        .trim()
        .nonempty("Username is required"),

        email: Zod.string().trim().nonempty("Email is required")
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"),

        password: Zod.string().nonempty("Password is required")
        .min(8, "Password must be at least 8 characters")
        .max(20, "Password must be less than 20 characters")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),

        rePassword: Zod.string()
        .nonempty("Confirm password is required")
        .min(8)
        .max(20),

        dateOfBirth: Zod.coerce.date("Date of birth is required").refine((value) => {
            const today = new Date();
            const birthDate = new Date(value);

            let age = today.getFullYear() - birthDate.getFullYear();

            const hasHadBirthdayThisYear =
                today.getMonth() > birthDate.getMonth() ||
                (today.getMonth() === birthDate.getMonth() &&
                    today.getDate() >= birthDate.getDate());

            if (!hasHadBirthdayThisYear) {
                age--;
            }

            return age >= 18 && age <= 100;
        }, {
            message: "Your age must be between 18 and 100 years"
        }),
        
        gender: Zod.string().nonempty("Gender is required")

    }).refine((data) => data.password === data.rePassword, {
        path: ["rePassword"],
        message: "Passwords do not match",
    });
