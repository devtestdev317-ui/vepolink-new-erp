
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/context/AuthContext"
import { useState } from "react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"


const FormSchema = z.object({
    firstName: z.string().min(3, "First name atleast 3 characters"),
    lastName: z.string().min(3, "Last name atleast 3 characters"),
    email: z.email().min(1, 'require'),
    password: z.string().min(1, 'Require').min(8, "Password atleast 8 characters")

})
export default function MasterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: ""
        },
    });
    async function onSubmit(values: z.infer<typeof FormSchema>) {
        setIsLoading(true);
        try {
            await register(values.email, values.password, values.firstName, values.lastName );
            toast.success("Successful", {
                description: "User Registration Successful",
                action: {
                    label: "Success",
                    onClick: () => console.log("Success"),
                },
            })
            navigate("/");
        } catch (err: any) {
            toast.error("Registration Failed", {
                description: err?.message,
                action: {
                    label: "Close",
                    onClick: () => console.log("Close"),
                },
            })
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <Card className="p-6 max-w-[450px]">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter First Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Last Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Email-id" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isLoading}>{isLoading ? "...Wait" : "Submit "}</Button>
                </form>
            </Form>
        </Card>
    )
}