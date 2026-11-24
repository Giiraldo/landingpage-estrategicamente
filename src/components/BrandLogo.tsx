import type { ImgHTMLAttributes } from 'react'

export interface BrandLogoProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  variant?: 'full' | 'mark'
}

export function BrandLogo({ alt = 'Estrategica Mente', variant = 'full', ...props }: BrandLogoProps) {
  return <img alt={alt} src={variant === 'full' ? '/brand-logo.svg' : '/brand-mark.svg'} {...props} />
}
