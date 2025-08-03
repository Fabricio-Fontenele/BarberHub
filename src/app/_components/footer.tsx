import { Card, CardFooter } from "./ui/card"

const Footer = () => {
  return (
    <footer>
      <Card>
        <CardFooter className="flex flex-col items-center justify-center px-5 py-6 text-center">
          <p className="text-sm text-gray-400">
            2025 © <span className="font-bold">BarberHub</span> - Todos os
            direitos reservados.
          </p>
        </CardFooter>
      </Card>
    </footer>
  )
}

export default Footer
