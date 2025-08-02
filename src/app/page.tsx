import Header from "./_components/Header"
import Image from "next/image"
import { Input } from "./_components/ui/input"
import { Button } from "./_components/ui/button"
import { SearchIcon } from "lucide-react"
import { Card, CardContent, CardFooter } from "./_components/ui/card"
import { Badge } from "./_components/ui/badge"
import { Avatar, AvatarImage } from "./_components/ui/avatar"
import { db } from "./_lib/prisma"
import BarbershopItem from "./_components/barbershop-item"

const Home = async () => {
  const barbershops = await db.barbershop.findMany({})
  const popularBarbershops = await db.barbershop.findMany({
    orderBy: {
      name: "desc",
    },
  })
  console.log(barbershops)
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
          <Button variant="secondary" className="gap-2">
            <Image alt="Barba" src="/barba.svg" width={16} height={16} />
            Barba
          </Button>
          <Button variant="secondary" className="gap-2">
            <Image alt="Cabelo" src="/cabelo.svg" width={16} height={16} />
            Cabelo
          </Button>
          <Button variant="secondary" className="gap-2">
            <Image
              alt="acabamento"
              src="/acabamento.svg"
              width={16}
              height={16}
            />
            Acabamento
          </Button>
          <Button variant="secondary" className="gap-2">
            <Image alt="Maasagem" src="/massagem.svg" width={16} height={16} />
            Massagem
          </Button>
          <Button variant="secondary" className="gap-2">
            <Image
              alt="sobrancelha"
              src="/sobrancelha.svg"
              width={16}
              height={16}
            />
            Sobrancelha
          </Button>
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
        <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
          Agendamentos
        </h2>
        <Card>
          <CardContent className="flex justify-between p-0">
            <div className="flex flex-col gap-2 py-5 pl-5">
              <Badge className="h-7 w-24 justify-center">Confirmado</Badge>
              <h3 className="font-semibold">Corte de Cabelo</h3>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="https://utfs.io/f/988646ea-dcb6-4f47-8a03-8d4586b7bc21-16v.png" />
                </Avatar>
                <p className="text-sm">BarberHub</p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center border-l-2 border-solid px-5">
              <p className="text-sm">Agosto</p>
              <p className="text-2xl">01</p>
              <p className="text-sm">20:00</p>
            </div>
          </CardContent>

          {/* Recomendados */}
        </Card>
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
