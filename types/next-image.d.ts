import type { DetailedHTMLProps, ImgHTMLAttributes, JSX } from "react"

declare module "next/image" {
  export default function Image(
    props: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> & {
      src: string
      alt: string
      layout?: "fixed" | "intrinsic" | "responsive" | "fill"
      objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down"
    },
  ): JSX.Element
}

