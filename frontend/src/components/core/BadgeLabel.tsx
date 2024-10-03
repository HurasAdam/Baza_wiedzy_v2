import React from 'react'
import { Badge } from "@/components/ui/badge"
const BadgeLabel = ({variant,label}) => {
  return (
     <Badge variant={variant}>{label}</Badge>
  )
}

export default BadgeLabel