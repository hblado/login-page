'use client'

import { FormEvent, useState } from "react";
import { z } from "zod";
import axios from 'axios';
import { redirect } from 'next/navigation'

const formSchema = z.object({
    name: z
        .string({ required_error: "Name is required" })
        .min(5, { message: "Name must be more than 5 characters" })
        .max(50, { message: "Name must be less than 50 characters" })
        .trim(),

    email: z
        .string()
        .min(1, { message: "Email must be filled" })
        .email("This is not a valid email")
        .trim(),

    password: z
        .string({ required_error: "Password is required" })
        .min(6, { message: "Choose a stronger password" }),

    passwordConfirm: z
        .string({ required_error: "Confirm the password" })
        .min(6, { message: "Choose a stronger password" }),
}).superRefine(({ passwordConfirm, password }, ctx) => {
    if (passwordConfirm !== password) {
    ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ['passwordConfirm']
    });
    }
});
type FormSchema = z.infer<typeof formSchema>;
 
const FormThree = () => {
const [formError, setFormError] = useState<z.ZodFormattedError<
    FormSchema,
    string
> | null>(null);

const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);

    const formDataValues = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    passwordConfirm: formData.get("passwordConfirm"),
    };
    try {
    const parsedFormValue = formSchema.safeParse(formDataValues);

    if (!parsedFormValue.success) {
        const err = parsedFormValue.error.format();
        console.log(err);
        setFormError(err);
        return;
    } else {
        setFormError(null);
    }

    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/create`, {
        name: formDataValues.name,
        email: formDataValues.email,
        password: formDataValues.password,
        passwordConfirm: formDataValues.passwordConfirm
        });
        //Redirect to /auth/login
        redirect('/auth/login')
    } catch (error) {
        console.log(error);
    }
    
    } catch (error) {
    console.log(error);
    }
};

return (
    <>
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-indigo-200">Register your account</h2>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={handleSubmit} >
                    <div>
                        <label className="block text-sm font-medium leading-6 text-indigo-200" htmlFor="name">Your name</label>
                        <div className="mt-2">
                        <input
                            className="pl-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            id="text"
                            min={0}
                            max={50}
                            name="name"
                            type="text"
                            required
                        />
                        </div>
                        {formError?.name && (
                            <>
                            {formError?.name?._errors.map((err) => (
                                <p className="text-red-500 mb-2" key={err}>
                                {err}
                                </p>
                            ))}
                            </>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium leading-6 text-indigo-200" htmlFor="email">Email address</label>
                        <div className="mt-2">
                            <input
                                className="pl-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                id="email"
                                name="email"
                                type="email"
                                required />
                        </div>
                        {formError?.name && (
                            <>
                            {formError?.email?._errors.map((err) => (
                                <p className="text-red-500 mb-2" key={err}>
                                {err}
                                </p>
                            ))}
                            </>
                        )}
                    </div>
                    <div>
                        <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium leading-6 text-indigo-200">Password</label>
                        </div>
                        <div className="mt-2">
                        <input
                            className="pl-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            id="password"
                            name="password"
                            type="password"
                            required />
                        </div>
                        {formError?.name && (
                            <>
                            {formError?.password?._errors.map((err) => (
                                <p className="text-red-500 mb-2" key={err}>
                                {err}
                                </p>
                            ))}
                            </>
                        )}
                    </div>
                    <div>
                        <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium leading-6 text-indigo-200">Confirm Password</label>
                        </div>
                        <div className="mt-2">
                        <input id="passwordConfirm" name="passwordConfirm" type="password" required className="pl-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                        </div>
                        {formError?.passwordConfirm && (
                            <>
                            {formError?.passwordConfirm?._errors.map((err) => (
                                <p className="text-red-500 mb-2" key={err}>
                                {err}
                                </p>
                            ))}
                            </>
                        )}
                    </div>
                    <div>
                        <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Register</button>
                    </div>
                </form>
                <a href="/auth/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Login</a>
            </div>
        </div>
    </>
    );
};
 
 export default FormThree;