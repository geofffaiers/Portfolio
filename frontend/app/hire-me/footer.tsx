"use client"

import { JSX, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"

export const Footer = ({ isLoggedIn }: { isLoggedIn: boolean }): JSX.Element => {
  const [nameError, setNameError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [messageError, setMessageError] = useState("")

  const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Handle form submission logic here
  }

  return (
    <footer className="sticky bottom-0 p-4 shadow-lg" style={{ backgroundColor: "hsl(var(--background))" }}>
      <div className="flex flex-col items-center p-6 gap-4">
        <h4 className="text-xl font-medium text-center">
          I am available for hire, let&#39;s work together!
        </h4>
        <div className="flex flex-wrap justify-center gap-4">
          {isLoggedIn && <Button asChild variant="secondary" size="lg">
            <Link target="_blank" href="/Geoffrey_Faiers.pdf" rel="noopener noreferrer">Download CV</Link>
          </Button>}
          {!isLoggedIn && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default" size="lg">
                  Contact me
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Contact Me</DialogTitle>
                  <DialogDescription>
                    Please enter your email and a message, I will aim to get back to you as soon as possible.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmitForm} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Full Name <span className="text-red-700 font-semibold">*</span>
                    </label>
                    <input type="text" name="name" required className="w-full p-2 border border-gray-300 rounded" />
                    {nameError && <p className="text-red-500 text-sm">{nameError}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Email <span className="text-red-700 font-semibold">*</span>
                    </label>
                    <input type="email" name="email" required className="w-full p-2 border border-gray-300 rounded" />
                    {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Message <span className="text-red-700 font-semibold">*</span>
                    </label>
                    <textarea name="message" required className="w-full p-2 border border-gray-300 rounded" rows={5}></textarea>
                    {messageError && <p className="text-red-500 text-sm">{messageError}</p>}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-red-700 text-sm font-semibold">* Required</span>
                    <Button type="submit">
                      Send
                      <FontAwesomeIcon icon={faPaperPlane} className="ml-2" />
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </footer>
  )
}
