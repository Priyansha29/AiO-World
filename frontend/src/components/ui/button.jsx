import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

const buttonVariants = {
  default:
    'bg-foreground text-background hover:bg-foreground/90 transition-colors duration-300',
  outline:
    'border border-foreground/30 text-foreground hover:bg-foreground/10 hover:border-foreground/50 transition-colors duration-300',
  secondary:
    'bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors duration-300',
  ghost: 'hover:bg-accent hover:text-accent-foreground transition-colors duration-300',
  link: 'text-foreground underline-offset-4 hover:underline',
}

const sizes = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 rounded-md px-3 text-sm',
  lg: 'h-14 rounded-lg px-8 text-lg font-semibold',
  icon: 'h-10 w-10',
}

function Button({ className, variant = 'default', size = 'default', asChild = false, ...props }) {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants[variant], sizes[size], 'inline-flex items-center justify-center rounded-md text-sm font-medium whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50', className)} {...props} />
}

export { Button, buttonVariants }