import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-background">
            <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
            <p className="my-4 text-lg">
                Sorry, we couldn&apos;t find the page you&apos;re looking for.
            </p>
            <Button
                asChild
                variant="default"
                size="lg"
            >
                <Link href="/">Go home</Link>
            </Button>
        </div>
    );
}