"use client"

import { BarbershopService } from "@/generated/prisma"
import Image from "next/image"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet"
import { Calendar } from "./ui/calendar"
import { ptBR } from "date-fns/locale"
import { useState } from "react"
import { format } from "date-fns/format"
import { Barbershop } from "@prisma/client"
import { createBooking } from "../_actions/create-booking"
import { useSession } from "next-auth/react"
import { set } from "date-fns"
import { toast } from "sonner"

interface ServiceItemProps {
  service: BarbershopService
  barbershop: Pick<Barbershop, "name">
}

const timeList = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
]

const ServiceItem = ({ service, barbershop }: ServiceItemProps) => {
  const { data } = useSession()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined,
  )
  console.log({ data })

  const handleSelectDate = (date: Date | undefined) => {
    setSelectedDate(date)
  }

  const handleSelectTime = (time: string | undefined) => {
    setSelectedTime(time)
  }

  const handleCreateBooking = async () => {
    // 1. não exibir horários que já foram agendados
    // 2. não exibir botão de "reservar" se o usuario estar logado
    try {
      if (!selectedDate || !selectedTime || !data?.user) return
      const hour = selectedTime?.split(":")[0]
      const minute = selectedTime?.split(":")[1]
      const newDate = set(selectedDate, {
        hours: Number(hour),
        minutes: Number(minute),
      })
      await createBooking({
        serviceId: service.id,
        userId: (data?.user).id,
        date: newDate,
      })
      toast.success("Reserva criada com sucesso")
    } catch (error) {
      console.error(error)
      toast.error("Erro ao criar Reserva!")
    }
  }

  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-3">
        <div className="relative max-h-[110px] min-h-[110px] min-w-[110px] max-w-[110px]">
          <Image
            alt={service.name}
            src={service.imageUrl}
            fill
            className="rounded-lg object-cover"
          />
        </div>
        <div className="flex-1 space-y-2">
          <h3 className="text-sm font-semibold">{service.name}</h3>
          <p className="line-clamp-2 text-sm text-gray-400">
            {service.description}
          </p>
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-primary">
              {Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(Number(service.price))}
            </p>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="secondary" size="sm">
                  Reservar
                </Button>
              </SheetTrigger>
              <SheetContent className="px-0">
                <SheetHeader>
                  <SheetTitle>Fazer Reserva</SheetTitle>
                </SheetHeader>

                <div className="border-b border-solid py-5">
                  <Calendar
                    mode="single"
                    locale={ptBR}
                    selected={selectedDate}
                    onSelect={handleSelectDate}
                    fromDate={new Date()}
                    className="w-full"
                    styles={{
                      head_cell: {
                        width: "100%",
                        textTransform: "capitalize",
                      },
                      cell: {
                        width: "100%",
                      },
                      button: {
                        width: "100%",
                      },
                      nav_button_previous: {
                        width: "32px",
                        height: "32px",
                      },
                      nav_button_next: {
                        width: "32px",
                        height: "32px",
                      },
                      caption: {
                        textTransform: "capitalize",
                      },
                    }}
                  />
                </div>

                {selectedDate && (
                  <div className="flex gap-3 overflow-x-auto border-b border-solid p-5 [&::-webkit-scrollbar]:hidden">
                    {timeList.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        size="sm"
                        className="rounded-full"
                        onClick={() => handleSelectTime(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                )}

                {selectedTime && selectedDate && (
                  <div className="p-5">
                    <Card>
                      <CardContent className="space-y-3 p-3">
                        <div className="flex items-center justify-between">
                          <h2 className="font-bold">{service.name}</h2>
                          <p className="text-sm font-bold">
                            {Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(Number(service.price))}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <h2 className="font-sm text-gray-400">Data</h2>
                          <p className="text-sm">
                            {format(selectedDate, "d 'de' MMMM", {
                              locale: ptBR,
                            })}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <h2 className="font-sm text-gray-400">Horário</h2>
                          <p className="text-sm">{selectedTime}</p>
                        </div>

                        <div className="flex items-center justify-between">
                          <h2 className="font-sm text-gray-400">Barberaria</h2>
                          <p className="text-sm">{barbershop.name}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                <SheetFooter className="mt-5 px-5">
                  <SheetClose asChild>
                    <Button
                      onClick={handleCreateBooking}
                      disabled={!selectedTime || !selectedTime}
                    >
                      Confirmar
                    </Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ServiceItem
