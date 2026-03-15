import { Row, Col } from 'antd'
import type { ReactNode } from 'react'

interface ToolbarProps {
  filters?: ReactNode
  actions?: ReactNode
}

export default function Toolbar({ filters, actions }: ToolbarProps) {
  return (
    <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
      <Col>{filters}</Col>
      <Col>{actions}</Col>
    </Row>
  )
}
