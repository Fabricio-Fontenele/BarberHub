import Header from "./_components/Header"
import Image from "next/image"
import { Input } from "./_components/ui/input"
import { Button } from "./_components/ui/button"
import { SearchIcon } from "lucide-react"
import { Card, CardFooter } from "./_components/ui/card"
import { db } from "./_lib/prisma"
import BarbershopItem from "./_components/barbershop-item"
import { quickSearchButtons } from "./_constants/search"
import BookingItem from "./_components/bookingItem"

const Home = async () => {
  const barbershops = await db.barbershop.findMany({})
  const popularBarbershops = await db.barbershop.findMany({
    orderBy: {
      name: "desc",
    },
  })
  return (
    <div>
      <Header />
      <div className="p-5">
        {/* Cabeçalho */}
        <h2 className="text-xl font-bold">Olá, Felipe!</h2>
        <p>Segunda-feira 01 de agosto</p>

        {/* Busca */}
        <div className="mt-6 flex items-center gap-2">
          <Input placeholder="Faça sua busca..." />
          <Button>
            <SearchIcon />
          </Button>
        </div>

        {/* Busca Rápida */}

        <div className="mt-6 flex gap-3 overflow-x-scroll [&::-webkit-scrollbar]:hidden">
          {quickSearchButtons.map((button) => (
            <Button key={button.title} variant="secondary" className="gap-2">
              <Image
                alt={button.title}
                src={button.imageUrl}
                width={16}
                height={16}
              />
              {button.title}
            </Button>
          ))}
        </div>

        {/* Banner */}
        <div className="relative mt-6 h-[150px] w-full">
          <Image
            alt="Agende nos melhores com BarberHub"
            src="/baner01.svg"
            fill
            className="rounded-xl object-cover"
          />
        </div>
        {/* agendamentos */}
        <BookingItem />

        {/* Recomendados */}
        <h2 className="mb-2 mt-6 text-xs font-bold uppercase text-gray-400">
          Recomendados
        </h2>
        <div className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
          {barbershops.map((barbershop) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>

        <h2 className="mb-2 mt-6 text-xs font-bold uppercase text-gray-400">
          Populares
        </h2>
        <div className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
          {popularBarbershops.map((barbershop) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>
      </div>

      {/* rodapé */}
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
    </div>
  )
}

export default Home
