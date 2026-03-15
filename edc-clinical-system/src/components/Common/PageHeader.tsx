import { Typography, Button, Space } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'

const { Title } = Typography

interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: ReactNode
  back?: boolean
  onBack?: () => void
}

export default function PageHeader({ title, subtitle, actions, back, onBack }: PageHeaderProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate(-1)
    }
  }

  return (
    <div
      style={{
        marginBottom: 24,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {back && (
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={handleBack}
              style={{ marginTop: 4 }}
            >
              返回
            </Button>
          )}
          <Title level={3} style={{ margin: 0, fontWeight: 600 }}>
            {title}
          </Title>
        </div>
        {subtitle && (
          <div style={{ marginTop: 4, color: '#6b7280', fontSize: 14 }}>
            {subtitle}
          </div>
        )}
      </div>
      {actions && (
        <Space>
          {actions}
        </Space>
      )}
    </div>
  )
}
