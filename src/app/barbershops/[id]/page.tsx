import ServiceItem from "@/app/_components/serviceItem"
import { Button } from "@/app/_components/ui/button"
import { db } from "@/app/_lib/prisma"
import {
  ChevronLeftIcon,
  MapPinIcon,
  MenuIcon,
  SmartphoneIcon,
  StarIcon,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

interface BarbershopPageProps {
  params: {
    id: string
  }
}

const BarbershopPage = async ({ params }: BarbershopPageProps) => {
  const barbershop = await db.barbershop.findUnique({
    where: {
      id: params.id,
    },
    include: {
      services: true,
    },
  })

  if (!barbershop) {
    return notFound()
  }
  return (
    <div>
      {/* Cabeçalho */}
      <div className="relative h-[250px] w-full">
        <Image
          alt={barbershop.name}
          src={barbershop.imageUrl}
          fill
          className="object-cover"
        />
        <Button
          asChild
          size="icon"
          variant="secondary"
          className="absolute left-4 top-4 z-10"
        >
          <Link href="/">
            <ChevronLeftIcon />
          </Link>
        </Button>

        <Button
          size="icon"
          variant="secondary"
          className="absolute right-4 top-4 z-10"
        >
          <MenuIcon />
        </Button>
      </div>
      {/* Informações da Barbearia */}
      <div className="border-b border-solid p-5">
        <h1 className="mb-3 text-xl font-bold">{barbershop.name}</h1>

        <div className="mb-2 flex items-center gap-2">
          <MapPinIcon className="size-18 text-primary" />
          <p className="text-sm">{barbershop.address}</p>
        </div>

        <div className="flex items-center gap-2">
          <StarIcon className="size-18 fill-primary text-primary" />
          <p className="text-sm">5,0 (889 avaliações)</p>
        </div>
      </div>

      {/* Descrição */}
      <div className="space-y-2 border-b border-solid p-5">
        <h2 className="text-xs font-bold uppercase text-gray-400">Sobre nós</h2>
        <p className="text-justify text-sm">{barbershop.description}</p>
      </div>

      {/* Serviços */}
      <div className="space-y-3 border-b border-solid p-5">
        <h2 className="text-xs font-bold uppercase text-gray-400">Serviços</h2>
        <div className="space-y-3">
          {barbershop.services.map((service) => (
            <ServiceItem key={service.id} service={service} />
          ))}
        </div>
      </div>

      <div className="spcace-y-3 p-5">
        {barbershop.phones.map((phone) => (
          <div className="flex justify-between" key={phone}>
            <div className="flex items-center gap-2">
              <SmartphoneIcon />
              <p className="text-sm">{phone}</p>
            </div>

            <Button variant="outline" size="sm">
              Copiar
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BarbershopPage
