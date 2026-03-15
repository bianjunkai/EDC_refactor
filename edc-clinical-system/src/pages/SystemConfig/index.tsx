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
  Checkbox,
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
            <Card style={{ marginBottom: 16 }}>
              <Table
                columns={[
                  { title: '角色名称', dataIndex: 'name', key: 'name' },
                  { title: '角色描述', dataIndex: 'description', key: 'description' },
                  { title: '用户数', dataIndex: 'userCount', key: 'userCount' },
                  { title: '状态', dataIndex: 'status', key: 'status', render: () => <Tag color="success">启用中</Tag> },
                  { title: '操作', key: 'action', render: () => <Button type="link" size="small">配置权限</Button> },
                ]}
                dataSource={[
                  { id: '1', name: '系统管理员', description: '系统最高权限', userCount: 2 },
                  { id: '2', name: '项目管理员', description: '项目配置、用户管理权限', userCount: 5 },
                  { id: '3', name: '研究者', description: '项目数据录入、质疑回复权限', userCount: 20 },
                  { id: '4', name: '研究护士', description: '受试者管理、数据录入权限', userCount: 15 },
                  { id: '5', name: '数据管理员', description: '数据核查、质疑发起权限', userCount: 8 },
                  { id: '6', name: '医学专员', description: '医学审核、方案偏离审查权限', userCount: 6 },
                ]}
                rowKey="id"
                rowClassName={getTableRowClassName}
                pagination={false}
              />
            </Card>
            <Card title="权限配置矩阵">
              <Table
                columns={[
                  { title: '模块', dataIndex: 'module', key: 'module' },
                  { title: '权限项', dataIndex: 'permission', key: 'permission' },
                  { title: '系统管理员', dataIndex: 'admin', key: 'admin', render: () => <Checkbox checked disabled /> },
                  { title: '项目管理员', dataIndex: 'pm', key: 'pm', render: () => <Checkbox checked /> },
                  { title: '研究者', dataIndex: 'researcher', key: 'researcher', render: () => <Checkbox checked /> },
                  { title: '研究护士', dataIndex: 'nurse', key: 'nurse', render: () => <Checkbox checked /> },
                ]}
                dataSource={[
                  { id: '1', module: '项目管理', permission: '查看项目' },
                  { id: '2', module: '项目管理', permission: '创建项目' },
                  { id: '3', module: '项目管理', permission: '编辑项目' },
                  { id: '4', module: '项目管理', permission: '删除项目' },
                  { id: '5', module: '受试者管理', permission: '查看受试者' },
                  { id: '6', module: '受试者管理', permission: '入组操作' },
                  { id: '7', module: '受试者管理', permission: '编辑受试者' },
                  { id: '8', module: 'CRF管理', permission: '设计CRF' },
                  { id: '9', module: 'CRF管理', permission: '发布CRF' },
                  { id: '10', module: '质疑管理', permission: '发起质疑' },
                  { id: '11', module: '质疑管理', permission: '回复质疑' },
                  { id: '12', module: '数据导出', permission: '申请导出' },
                  { id: '13', module: '数据导出', permission: '审核导出' },
                ]}
                rowKey="id"
                pagination={false}
                size="small"
              />
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
