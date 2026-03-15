import { useState } from 'react'
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Modal,
  Form,
  Tabs,
  Descriptions,
  message,
  Popconfirm,
  Tooltip,
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  DownloadOutlined,
  DatabaseOutlined,
  BookOutlined,
  MedicineBoxOutlined,
  HistoryOutlined,
} from '@ant-design/icons'
import PageHeader from '@/components/Common/PageHeader'
import { getTableRowClassName } from '@/constants/theme'

const { Option } = Select
const { Search } = Input

// 标准字典类型
interface Dictionary {
  id: string
  name: string
  code: string
  type: 'CDISC' | 'WHODrug' | 'MedDRA' | '自定义'
  version: string
  recordCount: number
  status: '已发布' | '草稿' | '停用'
  updateDate: string
}

// 字典项目
interface DictionaryItem {
  id: string
  code: string
  name: string
  description?: string
  status: 'active' | 'inactive'
}

// 模拟数据
const mockDictionaries: Dictionary[] = [
  {
    id: '1',
    name: 'CDISC SDTM',
    code: 'CDISC_SDTM',
    type: 'CDISC',
    version: '2024-03',
    recordCount: 2850,
    status: '已发布',
    updateDate: '2024-03-15',
  },
  {
    id: '2',
    name: 'CDISC ADaM',
    code: 'CDISC_ADAM',
    type: 'CDISC',
    version: '2024-03',
    recordCount: 1230,
    status: '已发布',
    updateDate: '2024-03-15',
  },
  {
    id: '3',
    name: 'WHODrug Global',
    code: 'WHO_DRUG',
    type: 'WHODrug',
    version: '2024-Mar',
    recordCount: 15800,
    status: '已发布',
    updateDate: '2024-03-01',
  },
  {
    id: '4',
    name: 'MedDRA',
    code: 'MEDDRA',
    type: 'MedDRA',
    version: '27.0',
    recordCount: 72500,
    status: '已发布',
    updateDate: '2024-03-01',
  },
  {
    id: '5',
    name: '项目自定义字典',
    code: 'PROJECT_DICT_001',
    type: '自定义',
    version: 'V1.2',
    recordCount: 156,
    status: '已发布',
    updateDate: '2024-02-28',
  },
  {
    id: '6',
    name: '实验室检查项目',
    code: 'LAB_TESTS',
    type: '自定义',
    version: 'V1.0',
    recordCount: 89,
    status: '草稿',
    updateDate: '2024-03-10',
  },
]

// 字典项目模拟数据
const mockDictionaryItems: DictionaryItem[] = [
  { id: '1', code: 'AGE', name: '年龄', description: '受试者年龄', status: 'active' },
  { id: '2', code: 'SEX', name: '性别', description: '受试者性别', status: 'active' },
  { id: '3', code: 'RACE', name: '种族', description: '受试者种族', status: 'active' },
  { id: '4', code: 'ETHNIC', name: '民族', description: '受试者民族', status: 'inactive' },
  { id: '5', code: 'HEIGHT', name: '身高', description: '身高测量值(cm)', status: 'active' },
  { id: '6', code: 'WEIGHT', name: '体重', description: '体重测量值(kg)', status: 'active' },
]

// 字典类型标签颜色
const typeColors: Record<string, string> = {
  CDISC: '#5CB8A6',
  WHODrug: '#2196F3',
  MedDRA: '#9C27B0',
  自定义: '#F39C12',
}

// 状态标签颜色
const statusColors: Record<string, { bg: string; text: string }> = {
  '已发布': { bg: '#E8F5E9', text: '#27AE60' },
  '草稿': { bg: '#FFF3E0', text: '#F39C12' },
  '停用': { bg: '#FFEBEE', text: '#E74C3C' },
}

export default function DictionaryManager() {
  const [dictionaries] = useState<Dictionary[]>(mockDictionaries)
  const [dictionaryItems] = useState<DictionaryItem[]>(mockDictionaryItems)
  const [activeTab, setActiveTab] = useState('standard')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingDictionary, setEditingDictionary] = useState<Dictionary | null>(null)
  const [form] = Form.useForm()

  // 表格列定义
  const columns = [
    {
      title: '字典名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Dictionary) => (
        <Space>
          <DatabaseOutlined style={{ color: typeColors[record.type] }} />
          <span style={{ fontWeight: 500 }}>{text}</span>
        </Space>
      ),
    },
    {
      title: '字典代码',
      dataIndex: 'code',
      key: 'code',
      render: (code: string) => <Tag>{code}</Tag>,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={typeColors[type]}>{type}</Tag>
      ),
    },
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
    },
    {
      title: '记录数',
      dataIndex: 'recordCount',
      key: 'recordCount',
      render: (count: number) => count.toLocaleString(),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = statusColors[status]
        return (
          <Tag style={{ backgroundColor: color.bg, color: color.text, border: 'none' }}>
            {status}
          </Tag>
        )
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updateDate',
      key: 'updateDate',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: Dictionary) => (
        <Space>
          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="查看版本历史">
            <Button type="text" icon={<HistoryOutlined />} />
          </Tooltip>
          <Popconfirm
            title="确认删除此字典?"
            onConfirm={() => message.success('字典已删除')}
          >
            <Tooltip title="删除">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  // 字典项目列定义
  const itemColumns = [
    {
      title: '项目代码',
      dataIndex: 'code',
      key: 'code',
      render: (code: string) => <Tag>{code}</Tag>,
    },
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status === 'active' ? '启用' : '停用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space>
          <Button type="link" size="small">编辑</Button>
          <Button type="link" size="small" danger>停用</Button>
        </Space>
      ),
    },
  ]

  // 处理编辑
  const handleEdit = (record: Dictionary) => {
    setEditingDictionary(record)
    form.setFieldsValue(record)
    setIsModalVisible(true)
  }

  // 处理新增
  const handleAdd = () => {
    setEditingDictionary(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  // 处理模态框确认
  const handleModalOk = () => {
    form.validateFields().then((values) => {
      console.log('表单值:', values)
      message.success(editingDictionary ? '字典已更新' : '字典已创建')
      setIsModalVisible(false)
    })
  }

  // 标签页配置
  const tabItems = [
    {
      key: 'standard',
      label: (
        <span>
          <BookOutlined /> 标准字典
        </span>
      ),
      children: (
        <Card style={{ borderRadius: 12 }}>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
            <Space>
              <Search
                placeholder="搜索字典名称或代码"
                allowClear
                style={{ width: 260 }}
                onSearch={(value) => console.log('搜索:', value)}
              />
              <Select defaultValue="all" style={{ width: 120 }}>
                <Option value="all">全部类型</Option>
                <Option value="CDISC">CDISC</Option>
                <Option value="WHODrug">WHODrug</Option>
                <Option value="MedDRA">MedDRA</Option>
                <Option value="自定义">自定义</Option>
              </Select>
            </Space>
            <Space>
              <Button icon={<UploadOutlined />}>导入</Button>
              <Button icon={<DownloadOutlined />}>导出</Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                新增字典
              </Button>
            </Space>
          </div>
          <Table
            columns={columns}
            dataSource={dictionaries}
            rowKey="id"
            rowClassName={getTableRowClassName}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `共 ${total} 个字典`,
            }}
          />
        </Card>
      ),
    },
    {
      key: 'custom',
      label: (
        <span>
          <MedicineBoxOutlined /> 自定义字典
        </span>
      ),
      children: (
        <Card style={{ borderRadius: 12 }}>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
            <Space>
              <Search
                placeholder="搜索字典项目"
                allowClear
                style={{ width: 260 }}
              />
            </Space>
            <Button type="primary" icon={<PlusOutlined />}>
              新增项目
            </Button>
          </div>
          <Table
            columns={itemColumns}
            dataSource={dictionaryItems}
            rowKey="id"
            rowClassName={getTableRowClassName}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `共 ${total} 个项目`,
            }}
          />
        </Card>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="标准字典管理"
        subtitle="维护CDISC、WHODrug、MedDRA等标准字典及自定义字典"
      />

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
      />

      {/* 字典编辑模态框 */}
      <Modal
        title={editingDictionary ? '编辑字典' : '新增字典'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ type: '自定义', status: '草稿' }}
        >
          <Form.Item
            name="name"
            label="字典名称"
            rules={[{ required: true, message: '请输入字典名称' }]}
          >
            <Input placeholder="请输入字典名称" />
          </Form.Item>
          <Form.Item
            name="code"
            label="字典代码"
            rules={[{ required: true, message: '请输入字典代码' }]}
          >
            <Input placeholder="请输入字典代码" disabled={!!editingDictionary} />
          </Form.Item>
          <Form.Item
            name="type"
            label="字典类型"
            rules={[{ required: true, message: '请选择字典类型' }]}
          >
            <Select placeholder="请选择字典类型">
              <Option value="CDISC">CDISC</Option>
              <Option value="WHODrug">WHODrug</Option>
              <Option value="MedDRA">MedDRA</Option>
              <Option value="自定义">自定义</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="version"
            label="版本号"
            rules={[{ required: true, message: '请输入版本号' }]}
          >
            <Input placeholder="例如: V1.0 或 2024-03" />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
          >
            <Select>
              <Option value="草稿">草稿</Option>
              <Option value="已发布">已发布</Option>
              <Option value="停用">停用</Option>
            </Select>
          </Form.Item>
          <Descriptions title="字典信息" column={2} size="small">
            <Descriptions.Item label="记录数">
              {editingDictionary?.recordCount || 0}
            </Descriptions.Item>
            <Descriptions.Item label="更新时间">
              {editingDictionary?.updateDate || '-'}
            </Descriptions.Item>
          </Descriptions>
        </Form>
      </Modal>
    </div>
  )
}
