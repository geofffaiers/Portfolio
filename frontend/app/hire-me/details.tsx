import { Button } from "@/components/ui/button"
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons"
import { faEnvelope } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { JSX } from "react"

export const Details = ({ isLoggedIn }: { isLoggedIn: boolean }): JSX.Element => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Geoff Faiers</h1>
        <div className="flex gap-2">
          <Button asChild variant="ghost" size="icon">
            <Link href="https://www.linkedin.com/in/gfaiers/" target="_blank" aria-label="LinkedIn">
              <FontAwesomeIcon icon={faLinkedin} />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon">
            <Link href="https://github.com/geofffaiers" target="_blank" aria-label="GitHub">
              <FontAwesomeIcon icon={faGithub} />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon">
            <Link href={`mailto:${isLoggedIn ? "geoff" : "info"}@gfaiers.com`} aria-label="Email">
              <FontAwesomeIcon icon={faEnvelope} />
            </Link>
          </Button>
        </div>
      </div>
      <h4 className="text-xl font-medium mt-4">
        {isLoggedIn
          ? "8 Segrave Walk, York, YO26 4UD / 07795102820 / geoff@gfaiers.com"
          : "York, United Kingdom / info@gfaiers.com"}
      </h4>
    </div>
  )
}
