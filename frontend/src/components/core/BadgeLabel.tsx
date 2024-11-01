import React from 'react'
import { Badge } from "@/components/ui/badge"
const BadgeLabel = ({variant,label,className}) => {
  return (
     <Badge className={className} variant={variant}>{label}</Badge>
  )
}

export default BadgeLabel