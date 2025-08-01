import Image from "next/image"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Menu } from "lucide-react"

const Header = () => {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-5">
        <Image src="/logo.png" alt="BarberHub Logo" height={18} width={120} />
        <Button variant="outline" className="ml-auto">
          <Menu />
        </Button>
      </CardContent>
    </Card>
  )
}

export default Header
