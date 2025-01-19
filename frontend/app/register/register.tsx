"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useMemo } from "react"
import { useRegister } from "./use-register"
import { PasswordStrength } from "@/components/ui/password-strength"

export function Register() {
  const { loading, passwordScore, handleRegister, setPasswordScore } = useRegister()

  const FormSchema = useMemo(() => z.object({
    username: z.string({
      required_error: "Username is required.",
    }).min(3, {
      message: "Username must be at least 3 characters.",
    }),
    email: z.string({
      required_error: "Email is required.",
    }).email({
      message: "Email is invalid.",
    }),
    password: z.string({
      required_error: "Password is required.",
    })
    .superRefine(async (_, ctx) => {
      if (passwordScore < 3) {
        return ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password is too weak.",
        })
      }
      return true
    }),
    confirmPassword: z.string({
      required_error: "Confirm Password is required.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  }), [passwordScore])

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    handleRegister(data)
  }

  return (
    <div className="flex flex-col gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} required />
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
                    <Input {...field} required />
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
                    <Input type="password" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <PasswordStrength password={form.watch("password")} setPasswordScore={setPasswordScore}/>
            <Button type="submit" className="w-full" disabled={loading}>
              Register
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
