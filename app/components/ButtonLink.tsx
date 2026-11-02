interface PropButton {
  variant: "PRINCIPAL" | "CANCEL" | "DESTRUCTIVE" | "ACCENT"
  size: "normal" | "big"
  href: string
  text: string
}

const principal = "bg-[linear-gradient(100deg,#ff5a00_0%,#ff006e_50%,#a51cfa_100%)] text-white"
const cancel = "border-3 border-gray-300 text-gray-700"
const big = "py-4 px-10 text-xl"
const normal = "py-2 px-4"

export function ButtonLink({ variant = "PRINCIPAL", size = "big", href, text }: PropButton) {
  return (
    <a href={href} className={`flex items-center gap-2 rounded-xl transition hover:brightness-125
        ${variant === "CANCEL" ? cancel : variant === "PRINCIPAL" ? principal : ""}
        ${size === "normal" ? normal : big}
      `}
    >
      {text}
    </a>
  )
}
