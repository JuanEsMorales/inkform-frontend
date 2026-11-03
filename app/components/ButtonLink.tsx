import { PropButtonLink } from "../types"

const principal = "bg-[linear-gradient(100deg,#ff5a00_0%,#ff006e_50%,#a51cfa_100%)] text-white"
const cancel = "border-3 border-gray-300 text-gray-700"
const accent = "border-3 border-accent text-accent"
const destructive = "border-3 border-red-300 text-red-700 bg-red-100"
const big = "py-4 px-10 text-xl"
const normal = "py-2 px-4"

export function ButtonLink({ variant = "PRINCIPAL", size = "big", href, text, icon }: PropButtonLink) {
  return (
    <a href={href} className={`flex items-center gap-2 rounded-xl transition hover:brightness-125 cursor-pointer
        ${variant === "CANCEL" ? cancel : variant === "PRINCIPAL" ? principal : variant === "ACCENT" ? accent : variant === "DESTRUCTIVE" ? destructive : ""}
        ${size === "normal" ? normal : big}
      `}
    >
      {icon === "BACK" && <img src="/back.svg" />}
      {text}
    </a>
  )
}
