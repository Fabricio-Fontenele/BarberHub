"use client"

import { SmartphoneIcon } from "lucide-react"
import { Button } from "./ui/button"
import { toast } from "sonner"

interface PhoneItemProps {
  phone: string
}

const PhoneItem = ({ phone }: PhoneItemProps) => {
  const HandleCopyPhoneClick = async (phone: string) => {
    try {
      await navigator.clipboard.writeText(phone)
      toast.success("Telefone copiado para a área de transferência")
    } catch (error) {
      console.error("Erro ao copiar telefone:", error)
      toast.error("Erro ao copiar telefone")
    }
  }
  // Renderiza o item do telefone
  return (
    <div className="flex justify-between" key={phone}>
      <div className="flex items-center gap-2">
        <SmartphoneIcon />
        <p className="text-sm">{phone}</p>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => HandleCopyPhoneClick(phone)}
      >
        Copiar
      </Button>
    </div>
  )
}

export default PhoneItem
