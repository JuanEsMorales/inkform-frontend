interface PropButton {
  variant: "PRINCIPAL" | "CANCEL" | "DESTRUCTIVE" | "ACCENT"
  size: "normal" | "big"
  text: string
}

const principal = "bg-[linear-gradient(100deg,#ff5a00_0%,#ff006e_50%,#a51cfa_100%)] text-white"
const cancel = "border-3 border-gray-300 text-gray-700"
const big = "py-4 px-10 text-xl"
const normal = "py-2 px-4"

export function Button({ variant = "PRINCIPAL", size = "big", text }: PropButton) {
  return (
    <button className={`flex items-center gap-2 rounded-xl transition hover:brightness-125 cursor-pointer
        ${variant === "CANCEL" ? cancel : variant === "PRINCIPAL" ? principal : ""}
        ${size === "normal" ? normal : big}
      `}
    >
      {text}
    </button>
  )
}
