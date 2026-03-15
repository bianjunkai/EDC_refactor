import { useState } from 'react'
import {
  Card,
  Table,
  Button,
  Input,
  Space,
  Tag,
  Modal,
  message,
} from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  EyeOutlined,
  CopyOutlined,
  FileTextOutlined,
} from '@ant-design/icons'
import PageHeader from '@/components/Common/PageHeader'
import { getTableRowClassName } from '@/constants/theme'

// 模板类型
interface CRFTemplate {
  id: string
  name: string
  category: string
  description: string
  version: string
  usageCount: number
  createDate: string
  status: '已发布' | '草稿'
}

// 模拟模板数据
const mockTemplates: CRFTemplate[] = [
  {
    id: '1',
    name: '人口学资料模板',
    category: '基础信息',
    description: '包含姓名、性别、年龄、身高、体重等基本信息字段',
    version: 'V1.2',
    usageCount: 156,
    createDate: '2024-01-15',
    status: '已发布',
  },
  {
    id: '2',
    name: '既往病史模板',
    category: '病史信息',
    description: '包含既往病史、手术史、家族病史等字段',
    version: 'V1.0',
    usageCount: 89,
    createDate: '2024-02-01',
    status: '已发布',
  },
  {
    id: '3',
    name: '体格检查模板',
    category: '检查信息',
    description: '包含一般检查、心肺检查、腹部检查等字段',
    version: 'V1.1',
    usageCount: 124,
    createDate: '2024-02-10',
    status: '已发布',
  },
  {
    id: '4',
    name: '实验室检查模板',
    category: '检查信息',
    description: '包含血常规、尿常规、生化检查等字段',
    version: 'V1.0',
    usageCount: 67,
    createDate: '2024-02-20',
    status: '草稿',
  },
  {
    id: '5',
    name: '不良事件模板',
    category: '安全性信息',
    description: '包含不良事件名称、严重程度、开始日期、结束日期等字段',
    version: 'V2.0',
    usageCount: 203,
    createDate: '2024-03-01',
    status: '已发布',
  },
]

// 分类标签颜色
const categoryColors: Record<string, string> = {
  '基础信息': '#5CB8A6',
  '病史信息': '#2196F3',
  '检查信息': '#9C27B0',
  '安全性信息': '#F39C12',
  '疗效信息': '#27AE60',
}

export default function CRFTemplates() {
  const [templates] = useState<CRFTemplate[]>(mockTemplates)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<CRFTemplate | null>(null)

  // 表格列定义
  const columns = [
    {
      title: '模板名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: CRFTemplate) => (
        <Space>
          <FileTextOutlined style={{ color: categoryColors[record.category] }} />
          <span style={{ fontWeight: 500 }}>{text}</span>
        </Space>
      ),
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => (
        <Tag color={categoryColors[category]}>{category}</Tag>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
    },
    {
      title: '使用次数',
      dataIndex: 'usageCount',
      key: 'usageCount',
    },
    {
      title: '创建日期',
      dataIndex: 'createDate',
      key: 'createDate',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === '已发布' ? 'success' : 'default'}>
          {status}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: CRFTemplate) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedTemplate(record)
              setIsModalVisible(true)
            }}
          >
            预览
          </Button>
          <Button
            type="link"
            size="small"
            icon={<CopyOutlined />}
            onClick={() => message.success('模板已复制到我的模板')}
          >
            复制
          </Button>
          <Button type="link" size="small" icon={<EditOutlined />}>
            编辑
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="CRF模板市场"
        subtitle="浏览和使用系统中共享的标准CRF模板"
      />

      <Card style={{ borderRadius: 12 }}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <Input
              placeholder="搜索模板..."
              prefix={<SearchOutlined />}
              style={{ width: 240 }}
            />
          </Space>
          <Button type="primary" icon={<PlusOutlined />}>
            创建模板
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={templates}
          rowKey="id"
          rowClassName={getTableRowClassName}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 个模板`,
          }}
        />
      </Card>

      {/* 预览弹窗 */}
      <Modal
        title="模板预览"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={
          <Space>
            <Button onClick={() => setIsModalVisible(false)}>关闭</Button>
            <Button
              type="primary"
              icon={<CopyOutlined />}
              onClick={() => {
                message.success('模板已复制到我的模板')
                setIsModalVisible(false)
              }}
            >
              复制到我的模板
            </Button>
          </Space>
        }
        width={700}
      >
        {selectedTemplate && (
          <div>
            <h3>{selectedTemplate.name}</h3>
            <p><strong>分类：</strong>{selectedTemplate.category}</p>
            <p><strong>描述：</strong>{selectedTemplate.description}</p>
            <p><strong>版本：</strong>{selectedTemplate.version}</p>
            <p><strong>使用次数：</strong>{selectedTemplate.usageCount}</p>
          </div>
        )}
      </Modal>
    </div>
  )
}
