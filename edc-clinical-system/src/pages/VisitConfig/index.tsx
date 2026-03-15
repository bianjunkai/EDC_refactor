import { useState } from 'react'
import {
  Card,
  Button,
  Radio,
  Table,
  Tag,
  Checkbox,
  Space,
  Typography,
  Badge,
} from 'antd'
import {
  PlusOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
  SyncOutlined,
  CheckSquareOutlined,
} from '@ant-design/icons'
import { mockVisits, mockCRFs, visitCRFMatrix } from '@/utils/mockData'
import PageHeader from '@/components/Common/PageHeader'
import { getTableRowClassName } from '@/constants/theme'

const { Text } = Typography

// 访视类型标签
const VisitTypeTag = ({ type }: { type: string }) => {
  const colors: Record<string, string> = {
    '循环': 'blue',
    '单次': 'green',
    '计划外': 'orange',
  }
  return <Tag color={colors[type] || 'default'}>{type}</Tag>
}

export default function VisitConfig() {
  const [viewMode, setViewMode] = useState<'list' | 'matrix'>('matrix')

  // 列表视图列
  const listColumns = [
    {
      title: '访视名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '访视期',
      dataIndex: 'phase',
      key: 'phase',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <VisitTypeTag type={type} />,
    },
    {
      title: '窗口期(天)',
      dataIndex: 'windowDays',
      key: 'windowDays',
      render: (days: number) => days || '-',
    },
    {
      title: '关联CRF',
      dataIndex: 'crfs',
      key: 'crfs',
      render: (crfs: string[]) => (
        <Space size="small" wrap>
          {crfs.map((crf) => (
            <Tag key={crf}>{crf}</Tag>
          ))}
        </Space>
      ),
    },
  ]

  // 矩阵表格列
  const matrixColumns = [
    {
      title: 'CRF / 访视',
      dataIndex: 'crf',
      key: 'crf',
      fixed: 'left' as const,
      width: 150,
    },
    ...mockVisits.map((visit) => ({
      title: (
        <div style={{ textAlign: 'center' }}>
          <div>{visit.name}</div>
          <VisitTypeTag type={visit.type} />
        </div>
      ),
      key: visit.id,
      width: 120,
      align: 'center' as const,
      render: (_: unknown, record: { crf: string }) => {
        const isLinked = visitCRFMatrix[record.crf]?.includes(visit.id)
        return (
          <Checkbox checked={isLinked}>
            {isLinked && <CheckSquareOutlined style={{ color: '#5CB8A6' }} />}
          </Checkbox>
        )
      },
    })),
  ]

  // 矩阵数据源
  const matrixData = mockCRFs.map((crf) => ({
    key: crf,
    crf,
  }))

  return (
    <div>
      {/* 页面标题 */}
      <PageHeader
        title="访视配置"
        subtitle="肿瘤药物临床试验A"
        actions={
          <Button type="primary" icon={<PlusOutlined />}>
            新增阶段
          </Button>
        }
      />

      {/* 视图切换 */}
      <Card style={{ marginBottom: 24, borderRadius: 12 }} bodyStyle={{ padding: 16 }}>
        <Radio.Group value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
          <Radio.Button value="list">
            <UnorderedListOutlined /> 列表视图
          </Radio.Button>
          <Radio.Button value="matrix">
            <AppstoreOutlined /> 矩阵图
          </Radio.Button>
        </Radio.Group>
      </Card>

      {/* 内容区 */}
      {viewMode === 'list' ? (
        <Card style={{ borderRadius: 12 }}>
          <Table
            columns={listColumns}
            dataSource={mockVisits}
            rowKey="id"
            rowClassName={getTableRowClassName}
            pagination={false}
          />
        </Card>
      ) : (
        <Card style={{ borderRadius: 12 }}>
          {/* 访视阶段标签 */}
          <div style={{ marginBottom: 16 }}>
            <Space size="large">
              <Badge color="#5CB8A6" text="筛选期" />
              <Badge color="#27AE60" text="治疗期" />
              <Badge color="#9C27B0" text="随访期" />
            </Space>
          </div>

          {/* 矩阵表格 */}
          <Table
            columns={matrixColumns}
            dataSource={matrixData}
            rowKey="crf"
            rowClassName={getTableRowClassName}
            pagination={false}
            scroll={{ x: 'max-content' }}
            bordered
            size="small"
          />

          {/* 图例 */}
          <div style={{ marginTop: 16, padding: 12, background: '#f5f7fa', borderRadius: 8 }}>
            <Text type="secondary">
              <Space>
                <span>图例：</span>
                <CheckSquareOutlined style={{ color: '#5CB8A6' }} />
                <span>表示该CRF在当前访视需要填写</span>
                <span style={{ marginLeft: 16 }}>
                  <SyncOutlined style={{ color: '#5CB8A6' }} /> 循环访视
                </span>
                <span>
                  <CheckSquareOutlined style={{ color: '#27AE60' }} /> 单次访视
                </span>
              </Space>
            </Text>
          </div>
        </Card>
      )}

      {/* 访视流程示意 */}
      <Card title="访视流程" style={{ marginTop: 24, borderRadius: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 0' }}>
          {mockVisits.map((visit, index) => (
            <div key={visit.id} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background:
                    visit.phase === '筛选期'
                      ? '#E8F5F2'
                      : visit.phase === '治疗期'
                      ? '#E8F5E9'
                      : '#F3E5F5',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `2px solid ${
                    visit.phase === '筛选期'
                      ? '#5CB8A6'
                      : visit.phase === '治疗期'
                      ? '#27AE60'
                      : '#9C27B0'
                  }`,
                }}
              >
                <Text strong style={{ fontSize: 12, textAlign: 'center' }}>
                  {visit.name.slice(0, 4)}
                </Text>
                <VisitTypeTag type={visit.type} />
              </div>
              {index < mockVisits.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    background: '#e5e7eb',
                    margin: '0 8px',
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
