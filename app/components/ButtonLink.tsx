import Link from "next/link"
import { PropButtonLink } from "../types"
import { Check } from "../icons/Check"
import { CircleX } from "../icons/CircleX"
import { Edit } from "../icons/Edit"
import { Plus } from "../icons/Plus"

const principal = "bg-[linear-gradient(100deg,#ff5a00_0%,#ff006e_50%,#a51cfa_100%)] text-white"
const cancel = "border-3 border-gray-500 bg-gray-100 text-gray-700"
const accent = "border-3 border-accent text-accent"
const destructive = "border-3 border-red-300 text-red-700 bg-red-100"
const ghost = "hover:text-accent text-gray-500"
const big = "py-4 px-10 text-xl"
const normal = "py-2 px-4"

export function ButtonLink({ variant = "PRINCIPAL", size = "big", href, text, icon }: PropButtonLink) {
  return (
    <Link href={href} className={`flex items-center gap-2 rounded-xl transition hover:brightness-125 cursor-pointer
        ${variant === "CANCEL" ? cancel : variant === "PRINCIPAL" ? principal : variant === "ACCENT" ? accent : variant === "DESTRUCTIVE" ? destructive : variant === "GHOST" ? ghost : ""}
        ${size === "normal" ? normal : big}
      `}
    >
      {icon === "BACK" && <img src="/back.svg" />}
      {icon === "EDIT" && <Edit />}
      {icon === "OPTDEL" && <CircleX />}
      {icon === "PLUS" && <Plus />}
      {icon === "CHECK" && <Check />}
      {text}
    </Link>
  )
}
