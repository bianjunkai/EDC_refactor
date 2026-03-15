import { useState } from 'react'
import {
  Card,
  Button,
  Table,
  Tag,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Tabs,
  Descriptions,
} from 'antd'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  FileSearchOutlined,
} from '@ant-design/icons'
import PageHeader from '@/components/Common/PageHeader'
import { getTableRowClassName } from '@/constants/theme'

const { Option } = Select

// 项目审核记录
interface AuditRecord {
  id: string
  projectId: string
  projectName: string
  submitter: string
  submitDate: string
  status: '待审核' | '已通过' | '已驳回'
  reviewer?: string
  reviewDate?: string
  comment?: string
}

// 模拟审核数据
const mockAuditRecords: AuditRecord[] = [
  {
    id: '1',
    projectId: '1',
    projectName: '肿瘤药物临床试验A',
    submitter: '张医生',
    submitDate: '2026-03-10',
    status: '待审核',
  },
  {
    id: '2',
    projectId: '2',
    projectName: '心血管药物临床试验B',
    submitter: '李医生',
    submitDate: '2026-03-08',
    status: '已通过',
    reviewer: '王主任',
    reviewDate: '2026-03-09',
    comment: '材料齐全，符合规范',
  },
  {
    id: '3',
    projectId: '3',
    projectName: '神经系统药物试验C',
    submitter: '赵医生',
    submitDate: '2026-03-05',
    status: '已驳回',
    reviewer: '王主任',
    reviewDate: '2026-03-06',
    comment: '方案设计需要补充安全性评估内容',
  },
]

export default function ProjectAudit() {
  const [auditRecords] = useState<AuditRecord[]>(mockAuditRecords)
  const [selectedRecord, setSelectedRecord] = useState<AuditRecord | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [auditForm] = Form.useForm()

  // 审核操作
  const handleAudit = (record: AuditRecord, action: 'approve' | 'reject') => {
    setSelectedRecord(record)
    auditForm.setFieldsValue({ action })
    setIsModalVisible(true)
  }

  const handleAuditSubmit = () => {
    auditForm.validateFields().then((values) => {
      console.log('审核结果:', values)
      message.success(values.action === 'approve' ? '审核已通过' : '已驳回')
      setIsModalVisible(false)
    })
  }

  // 表格列定义
  const columns = [
    {
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
    },
    {
      title: '申请人',
      dataIndex: 'submitter',
      key: 'submitter',
    },
    {
      title: '申请日期',
      dataIndex: 'submitDate',
      key: 'submitDate',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colorMap: Record<string, { bg: string; text: string }> = {
          '待审核': { bg: '#FFF3E0', text: '#F39C12' },
          '已通过': { bg: '#E8F5E9', text: '#27AE60' },
          '已驳回': { bg: '#FFEBEE', text: '#E74C3C' },
        }
        const color = colorMap[status]
        return (
          <Tag style={{ backgroundColor: color.bg, color: color.text, border: 'none' }}>
            {status}
          </Tag>
        )
      },
    },
    {
      title: '审核人',
      dataIndex: 'reviewer',
      key: 'reviewer',
      render: (reviewer: string) => reviewer || '-',
    },
    {
      title: '审核日期',
      dataIndex: 'reviewDate',
      key: 'reviewDate',
      render: (date: string) => date || '-',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: AuditRecord) => (
        <Space>
          {record.status === '待审核' && (
            <>
              <Button
                type="primary"
                size="small"
                icon={<CheckCircleOutlined />}
                onClick={() => handleAudit(record, 'approve')}
              >
                通过
              </Button>
              <Button
                danger
                size="small"
                icon={<CloseCircleOutlined />}
                onClick={() => handleAudit(record, 'reject')}
              >
                驳回
              </Button>
            </>
          )}
          <Button
            type="link"
            size="small"
            icon={<FileSearchOutlined />}
            onClick={() => {
              setSelectedRecord(record)
              setIsModalVisible(true)
            }}
          >
            查看
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="项目审核"
        subtitle="审批临床试验项目的立项申请"
      />

      <Card style={{ borderRadius: 12 }}>
        <Tabs
          items={[
            {
              key: 'pending',
              label: (
                <span>
                  待审核 ({auditRecords.filter((r) => r.status === '待审核').length})
                </span>
              ),
              children: (
                <Table
                  columns={columns}
                  dataSource={auditRecords.filter((r) => r.status === '待审核')}
                  rowKey="id"
                  rowClassName={getTableRowClassName}
                  pagination={false}
                />
              ),
            },
            {
              key: 'approved',
              label: '已通过',
              children: (
                <Table
                  columns={columns}
                  dataSource={auditRecords.filter((r) => r.status === '已通过')}
                  rowKey="id"
                  rowClassName={getTableRowClassName}
                  pagination={false}
                />
              ),
            },
            {
              key: 'rejected',
              label: '已驳回',
              children: (
                <Table
                  columns={columns}
                  dataSource={auditRecords.filter((r) => r.status === '已驳回')}
                  rowKey="id"
                  rowClassName={getTableRowClassName}
                  pagination={false}
                />
              ),
            },
          ]}
        />
      </Card>

      {/* 审核弹窗 */}
      <Modal
        title={selectedRecord?.status === '待审核' ? '项目审核' : '审核详情'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={
          selectedRecord?.status === '待审核' ? (
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>取消</Button>
              <Button danger onClick={() => handleAudit(selectedRecord!, 'reject')}>
                驳回
              </Button>
              <Button type="primary" onClick={handleAuditSubmit}>
                通过
              </Button>
            </Space>
          ) : (
            <Button onClick={() => setIsModalVisible(false)}>关闭</Button>
          )
        }
        width={600}
      >
        {selectedRecord && (
          <Form form={auditForm} layout="vertical">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="项目名称">{selectedRecord.projectName}</Descriptions.Item>
              <Descriptions.Item label="申请人">{selectedRecord.submitter}</Descriptions.Item>
              <Descriptions.Item label="申请日期">{selectedRecord.submitDate}</Descriptions.Item>
              <Descriptions.Item label="当前状态">
                <Tag color={selectedRecord.status === '待审核' ? 'orange' : selectedRecord.status === '已通过' ? 'green' : 'red'}>
                  {selectedRecord.status}
                </Tag>
              </Descriptions.Item>
              {selectedRecord.reviewer && (
                <>
                  <Descriptions.Item label="审核人">{selectedRecord.reviewer}</Descriptions.Item>
                  <Descriptions.Item label="审核日期">{selectedRecord.reviewDate}</Descriptions.Item>
                  <Descriptions.Item label="审核意见">{selectedRecord.comment}</Descriptions.Item>
                </>
              )}
            </Descriptions>

            {selectedRecord.status === '待审核' && (
              <>
                <Form.Item
                  name="action"
                  label="审核决定"
                  rules={[{ required: true, message: '请选择审核决定' }]}
                >
                  <Select placeholder="请选择审核决定">
                    <Option value="approve">通过</Option>
                    <Option value="reject">驳回</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="comment"
                  label="审核意见"
                  rules={[{ required: true, message: '请输入审核意见' }]}
                >
                  <Input.TextArea rows={3} placeholder="请输入审核意见" />
                </Form.Item>
              </>
            )}
          </Form>
        )}
      </Modal>
    </div>
  )
}
