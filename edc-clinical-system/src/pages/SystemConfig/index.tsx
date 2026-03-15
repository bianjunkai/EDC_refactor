import { useState, useMemo } from 'react'
import {
  Card,
  Button,
  Table,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Descriptions,
  Tabs,
  Badge,
} from 'antd'
import {
  UserOutlined,
  TeamOutlined,
  MedicineBoxOutlined,
  BookOutlined,
  AuditOutlined,
  PlusOutlined,
  EditOutlined,
  LockOutlined,
  UnlockOutlined,
  DatabaseOutlined,
  CloudServerOutlined,
  UploadOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { mockUsers } from '@/utils/mockData'
import StatusTag from '@/components/Common/StatusTag'
import PageHeader from '@/components/Common/PageHeader'
import { getTableRowClassName } from '@/constants/theme'
import type { User } from '@/types'

const { Option } = Select

export default function SystemConfig() {
  const [activeTab, setActiveTab] = useState('users')
  const [users] = useState<User[]>(mockUsers)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [dictSearchText, setDictSearchText] = useState('')

  // 标准字典数据
  const standardDicts = useMemo(() => [
    { id: '1', name: 'MedDRA 25.0', type: 'MedDRA', version: '25.0', count: 89234, updatedAt: '2024-01-15' },
    { id: '2', name: 'WHODrug 24Q1', type: 'WHODrug', version: '2024Q1', count: 45678, updatedAt: '2024-03-01' },
    { id: '3', name: 'CDISC SDTM 3.3', type: 'CDISC', version: '3.3', count: 1234, updatedAt: '2023-12-10' },
    { id: '4', name: 'CDISC CDASH', type: 'CDISC', version: '1.2', count: 567, updatedAt: '2023-11-20' },
    { id: '5', name: '不良事件字典', type: '自定义', version: '1.0', count: 156, updatedAt: '2024-02-28' },
  ], [])

  // 数据视图数据
  const dataViews = useMemo(() => [
    { id: '1', name: 'HIS检验数据', type: 'API接口', status: '启用', lastSync: '2小时前' },
    { id: '2', name: 'LIS实验室数据', type: '数据库', status: '启用', lastSync: '1天前' },
    { id: '3', name: '心电图数据', type: 'API接口', status: '禁用', lastSync: '-' },
    { id: '4', name: '影像检查数据', type: '文件', status: '启用', lastSync: '3天前' },
  ], [])

  // 用户表格列
  const userColumns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '科室',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: '所属中心',
      dataIndex: 'center',
      key: 'center',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => <Tag color="blue">{role}</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusTag status={status} />,
    },
    {
      title: '最后登录',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (text: string) => text || '-',
    },
    {
      title: '操作',
      key: 'action',
      render: (record: User) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            icon={record.status === '已启用' ? <LockOutlined /> : <UnlockOutlined />}
            danger={record.status === '已启用'}
          >
            {record.status === '已启用' ? '禁用' : '启用'}
          </Button>
          <Button type="link" size="small">
            重置密码
          </Button>
        </Space>
      ),
    },
  ]

  // 标准字典表格列
  const dictColumns = [
    { title: '字典名称', dataIndex: 'name', key: 'name' },
    { title: '类型', dataIndex: 'type', key: 'type', render: (type: string) => {
      const colorMap: Record<string, string> = { MedDRA: 'purple', WHODrug: 'blue', CDISC: 'green', '自定义': 'orange' }
      return <Tag color={colorMap[type]}>{type}</Tag>
    }},
    { title: '版本', dataIndex: 'version', key: 'version' },
    { title: '记录数', dataIndex: 'count', key: 'count', render: (count: number) => count.toLocaleString() },
    { title: '更新时间', dataIndex: 'updatedAt', key: 'updatedAt' },
    { title: '操作', key: 'action', render: () => (
      <Space>
        <Button type="link" size="small">查看</Button>
        <Button type="link" size="small">导出</Button>
      </Space>
    )},
  ]

  // 数据视图表格列
  const viewColumns = [
    { title: '视图名称', dataIndex: 'name', key: 'name' },
    { title: '数据源类型', dataIndex: 'type', key: 'type' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (status: string) => (
      <Badge status={status === '启用' ? 'success' : 'default'} text={status} />
    )},
    { title: '最后同步', dataIndex: 'lastSync', key: 'lastSync' },
    { title: '操作', key: 'action', render: () => (
      <Space>
        <Button type="link" size="small">配置</Button>
        <Button type="link" size="small">测试</Button>
      </Space>
    )},
  ]

  // 编辑用户
  const handleEdit = (user: User) => {
    setEditingUser(user)
    setIsModalOpen(true)
  }

  // 新建用户
  const handleCreate = () => {
    setEditingUser(null)
    setIsModalOpen(true)
  }

  // 渲染内容
  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                新增用户
              </Button>
            </div>
            <Table columns={userColumns} dataSource={users} rowKey="id" rowClassName={getTableRowClassName} pagination={{ pageSize: 10 }} />
          </div>
        )
      case 'roles':
        return (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Button type="primary" icon={<PlusOutlined />}>
                新增角色
              </Button>
            </div>
            <Card>
              <Descriptions title="系统角色" bordered column={1}>
                <Descriptions.Item label="研究者">拥有项目数据录入、质疑回复权限</Descriptions.Item>
                <Descriptions.Item label="研究护士">拥有受试者管理、数据录入权限</Descriptions.Item>
                <Descriptions.Item label="数据管理员">拥有数据核查、质疑发起权限</Descriptions.Item>
                <Descriptions.Item label="医学专员">拥有医学审核、方案偏离审查权限</Descriptions.Item>
                <Descriptions.Item label="项目管理员">拥有项目配置、用户管理权限</Descriptions.Item>
              </Descriptions>
            </Card>
          </div>
        )
      case 'centers':
        return (
          <Card>
            <Descriptions title="研究中心列表" bordered>
              <Descriptions.Item label="北京协和医院" span={3}>
                地址：北京市东城区帅府园1号<br />
                PI：张教授<br />
                状态：<Tag color="success">已启用</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="上海华山医院" span={3}>
                地址：上海市静安区乌鲁木齐中路12号<br />
                PI：李教授<br />
                状态：<Tag color="success">已启用</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="广州中山医院" span={3}>
                地址：广州市越秀区中山二路58号<br />
                PI：王教授<br />
                状态：<Tag color="success">已启用</Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )
      case 'dictionaries':
        return (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Input
                placeholder="搜索字典..."
                prefix={<SearchOutlined />}
                value={dictSearchText}
                onChange={(e) => setDictSearchText(e.target.value)}
                style={{ width: 240, marginRight: 16 }}
              />
              <Button type="primary" icon={<UploadOutlined />}>
                导入字典
              </Button>
            </div>
            <Table columns={dictColumns} dataSource={standardDicts} rowKey="id" rowClassName={getTableRowClassName} pagination={{ pageSize: 10 }} />
          </div>
        )
      case 'dataviews':
        return (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Button type="primary" icon={<PlusOutlined />}>
                新建视图
              </Button>
            </div>
            <Table columns={viewColumns} dataSource={dataViews} rowKey="id" rowClassName={getTableRowClassName} pagination={{ pageSize: 10 }} />
          </div>
        )
      case 'localdict':
        return (
          <Card>
            <Descriptions title="项目数据字典" bordered column={1}>
              <Descriptions.Item label="民族">汉族、满族、回族、蒙古族、藏族、维吾尔族、其他</Descriptions.Item>
              <Descriptions.Item label="性别">男、女</Descriptions.Item>
              <Descriptions.Item label="婚姻状况">未婚、已婚、离异、丧偶</Descriptions.Item>
              <Descriptions.Item label="教育程度">小学、初中、高中、大专、本科、硕士、博士</Descriptions.Item>
              <Descriptions.Item label="不良事件严重程度">轻度、中度、重度</Descriptions.Item>
              <Descriptions.Item label="与药物相关性">肯定有关、很可能有关、可能有关、可能无关、无关</Descriptions.Item>
            </Descriptions>
          </Card>
        )
      case 'audit':
        return (
          <Card>
            <Descriptions title="审核流程配置" bordered column={1}>
              <Descriptions.Item label="新建项目">
                研究者提交 → 项目负责人审核 → 伦理委员会审批 → 系统管理员开通
              </Descriptions.Item>
              <Descriptions.Item label="CRF发布">
                数据管理员设计 → 医学专员审核 → 项目负责人审批 → 正式发布
              </Descriptions.Item>
              <Descriptions.Item label="数据导出">
                研究者申请 → 数据管理员审核 → 项目负责人审批 → 系统管理员执行
              </Descriptions.Item>
              <Descriptions.Item label="质疑关闭">
                研究者回复 → 数据管理员核实 → 自动关闭
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )
      default:
        return null
    }
  }

  const tabItems = [
    { key: 'users', label: '用户管理', icon: <UserOutlined /> },
    { key: 'roles', label: '角色权限', icon: <TeamOutlined /> },
    { key: 'centers', label: '中心管理', icon: <MedicineBoxOutlined /> },
    { key: 'dictionaries', label: '标准字典库', icon: <BookOutlined /> },
    { key: 'localdict', label: '数据字典', icon: <DatabaseOutlined /> },
    { key: 'dataviews', label: '数据视图', icon: <CloudServerOutlined /> },
    { key: 'audit', label: '审核流程', icon: <AuditOutlined /> },
  ]

  return (
    <div>
      {/* 页面标题 */}
      <PageHeader title="系统配置" />

      {/* 内容区 */}
      <Card style={{ borderRadius: 12 }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems.map(item => ({
            key: item.key,
            label: (
              <span>
                {item.icon}
                {item.label}
              </span>
            ),
            children: renderContent(),
          }))}
        />
      </Card>

      {/* 用户编辑弹窗 */}
      <Modal
        title={editingUser ? '编辑用户' : '新增用户'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary">
            保存
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="姓名" required>
            <Input defaultValue={editingUser?.name} />
          </Form.Item>
          <Form.Item label="用户名" required>
            <Input defaultValue={editingUser?.username} />
          </Form.Item>
          <Form.Item label="邮箱">
            <Input defaultValue={editingUser?.email} />
          </Form.Item>
          <Form.Item label="电话">
            <Input defaultValue={editingUser?.phone} />
          </Form.Item>
          <Form.Item label="所属中心" required>
            <Select defaultValue={editingUser?.center}>
              <Option value="北京协和医院">北京协和医院</Option>
              <Option value="上海华山医院">上海华山医院</Option>
              <Option value="广州中山医院">广州中山医院</Option>
            </Select>
          </Form.Item>
          <Form.Item label="角色" required>
            <Select defaultValue={editingUser?.role}>
              <Option value="研究者">研究者</Option>
              <Option value="研究护士">研究护士</Option>
              <Option value="数据管理员">数据管理员</Option>
              <Option value="医学专员">医学专员</Option>
              <Option value="项目管理员">项目管理员</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
