import { useState, useMemo } from 'react'
import {
  Card,
  Table,
  Tabs,
  Tag,
  Input,
  DatePicker,
  Select,
  Space,
  Badge,
  Button,
} from 'antd'
import {
  SearchOutlined,
  DownloadOutlined,
  LoginOutlined,
  ProjectOutlined,
  ApartmentOutlined,
  DesktopOutlined,
  GlobalOutlined,
} from '@ant-design/icons'
import { mockLoginLogs, mockProjectLogs, mockCenterLogs } from '@/utils/mockData'
import PageHeader from '@/components/Common/PageHeader'
import { getTableRowClassName } from '@/constants/theme'
import styles from './styles.module.css'

const { RangePicker } = DatePicker
const { Option } = Select

// 操作类型标签
const ActionTypeTag = ({ type }: { type: string }) => {
  const colorMap: Record<string, string> = {
    create: 'blue',
    update: 'orange',
    delete: 'red',
    audit: 'purple',
    export: 'cyan',
    lock: 'magenta',
    assign: 'geekblue',
    other: 'default',
  }

  const textMap: Record<string, string> = {
    create: '创建',
    update: '修改',
    delete: '删除',
    audit: '审核',
    export: '导出',
    lock: '锁库',
    assign: '分配',
    other: '其他',
  }

  return <Tag color={colorMap[type] || 'default'}>{textMap[type] || type}</Tag>
}

// 登录状态标签
const LoginStatusTag = ({ status }: { status: string }) => {
  return status === 'success' ? (
    <Tag color="success">成功</Tag>
  ) : (
    <Tag color="error">失败</Tag>
  )
}

export default function SystemLogs() {
  const [activeTab, setActiveTab] = useState('login')
  const [searchText, setSearchText] = useState('')
  const [actionType, setActionType] = useState<string>('all')

  // 登录日志列定义
  const loginColumns = [
    {
      title: '用户姓名',
      dataIndex: 'name',
      key: 'name',
      width: 100,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      width: 120,
    },
    {
      title: '登录IP',
      dataIndex: 'ip',
      key: 'ip',
      width: 130,
      render: (ip: string) => (
        <Space>
          <GlobalOutlined style={{ color: '#5CB8A6' }} />
          {ip}
        </Space>
      ),
    },
    {
      title: '浏览器',
      dataIndex: 'browser',
      key: 'browser',
      width: 150,
      render: (browser: string) => (
        <Space>
          <DesktopOutlined style={{ color: '#666' }} />
          {browser}
        </Space>
      ),
    },
    {
      title: '操作系统',
      dataIndex: 'os',
      key: 'os',
      width: 120,
    },
    {
      title: '登录时间',
      dataIndex: 'loginTime',
      key: 'loginTime',
      width: 180,
    },
    {
      title: '登出时间',
      dataIndex: 'logoutTime',
      key: 'logoutTime',
      width: 180,
      render: (time: string | undefined) => time || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => <LoginStatusTag status={status} />,
    },
    {
      title: '失败原因',
      dataIndex: 'failReason',
      key: 'failReason',
      width: 150,
      render: (reason: string | undefined) => reason || '-',
    },
  ]

  // 项目留痕列定义
  const projectColumns = [
    {
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
      width: 200,
      render: (text: string) => (
        <Space>
          <ProjectOutlined style={{ color: '#5CB8A6' }} />
          <span style={{ color: '#5CB8A6', fontWeight: 500 }}>{text}</span>
        </Space>
      ),
    },
    {
      title: '操作类型',
      dataIndex: 'actionType',
      key: 'actionType',
      width: 100,
      render: (type: string) => <ActionTypeTag type={type} />,
    },
    {
      title: '操作内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
    },
    {
      title: '操作人',
      dataIndex: 'username',
      key: 'username',
      width: 100,
    },
    {
      title: '变更前',
      dataIndex: 'oldValue',
      key: 'oldValue',
      width: 150,
      render: (value: string | undefined) =>
        value ? (
          <Tag color="orange">{value}</Tag>
        ) : (
          '-'
        ),
    },
    {
      title: '变更后',
      dataIndex: 'newValue',
      key: 'newValue',
      width: 150,
      render: (value: string | undefined) =>
        value ? (
          <Tag color="green">{value}</Tag>
        ) : (
          '-'
        ),
    },
    {
      title: '操作时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
    },
  ]

  // 中心留痕列定义
  const centerColumns = [
    {
      title: '中心名称',
      dataIndex: 'centerName',
      key: 'centerName',
      width: 200,
      render: (text: string) => (
        <Space>
          <ApartmentOutlined style={{ color: '#5CB8A6' }} />
          <span style={{ fontWeight: 500 }}>{text}</span>
        </Space>
      ),
    },
    {
      title: '操作类型',
      dataIndex: 'actionType',
      key: 'actionType',
      width: 100,
      render: (type: string) => <ActionTypeTag type={type} />,
    },
    {
      title: '操作内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
    },
    {
      title: '操作人',
      dataIndex: 'username',
      key: 'username',
      width: 100,
    },
    {
      title: '操作时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
    },
  ]

  // 筛选数据
  const filteredLoginLogs = useMemo(() => {
    return mockLoginLogs.filter((log) => {
      if (searchText && !log.name.includes(searchText) && !log.username.includes(searchText)) {
        return false
      }
      return true
    })
  }, [searchText])

  const filteredProjectLogs = useMemo(() => {
    return mockProjectLogs.filter((log) => {
      if (searchText && !log.projectName.includes(searchText) && !log.content.includes(searchText)) {
        return false
      }
      if (actionType !== 'all' && log.actionType !== actionType) {
        return false
      }
      return true
    })
  }, [searchText, actionType])

  const filteredCenterLogs = useMemo(() => {
    return mockCenterLogs.filter((log) => {
      if (searchText && !log.centerName.includes(searchText) && !log.content.includes(searchText)) {
        return false
      }
      if (actionType !== 'all' && log.actionType !== actionType) {
        return false
      }
      return true
    })
  }, [searchText, actionType])

  // 标签页配置
  const tabItems = [
    {
      key: 'login',
      label: (
        <span>
          <LoginOutlined style={{ marginRight: 8 }} />
          登录日志
          <Badge
            count={filteredLoginLogs.length}
            style={{ marginLeft: 8, backgroundColor: '#5CB8A6' }}
          />
        </span>
      ),
      children: (
        <Table
          columns={loginColumns}
          dataSource={filteredLoginLogs}
          rowKey="id"
          rowClassName={getTableRowClassName}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          scroll={{ x: 1200 }}
          bordered
        />
      ),
    },
    {
      key: 'project',
      label: (
        <span>
          <ProjectOutlined style={{ marginRight: 8 }} />
          项目留痕
          <Badge
            count={filteredProjectLogs.length}
            style={{ marginLeft: 8, backgroundColor: '#5CB8A6' }}
          />
        </span>
      ),
      children: (
        <Table
          columns={projectColumns}
          dataSource={filteredProjectLogs}
          rowKey="id"
          rowClassName={getTableRowClassName}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          scroll={{ x: 1200 }}
          bordered
        />
      ),
    },
    {
      key: 'center',
      label: (
        <span>
          <ApartmentOutlined style={{ marginRight: 8 }} />
          中心留痕
          <Badge
            count={filteredCenterLogs.length}
            style={{ marginLeft: 8, backgroundColor: '#5CB8A6' }}
          />
        </span>
      ),
      children: (
        <Table
          columns={centerColumns}
          dataSource={filteredCenterLogs}
          rowKey="id"
          rowClassName={getTableRowClassName}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          scroll={{ x: 1000 }}
          bordered
        />
      ),
    },
  ]

  return (
    <div className={styles.container}>
      {/* 页面标题 */}
      <PageHeader
        title="系统日志"
        actions={
          <Button icon={<DownloadOutlined />}>导出日志</Button>
        }
      />

      {/* 筛选栏 */}
      <Card style={{ marginBottom: 16, borderRadius: 'var(--radius-lg)' }}>
        <Space size="middle" wrap>
          <Input
            placeholder="搜索关键词..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 240 }}
            allowClear
          />
          <RangePicker
            placeholder={['开始日期', '结束日期']}
            style={{ width: 280 }}
          />
          {(activeTab === 'project' || activeTab === 'center') && (
            <Select
              style={{ width: 140 }}
              placeholder="操作类型"
              value={actionType}
              onChange={setActionType}
              allowClear
            >
              <Option value="all">全部类型</Option>
              <Option value="create">创建</Option>
              <Option value="update">修改</Option>
              <Option value="delete">删除</Option>
              <Option value="audit">审核</Option>
              <Option value="export">导出</Option>
              <Option value="lock">锁库</Option>
              <Option value="assign">分配</Option>
              <Option value="other">其他</Option>
            </Select>
          )}
        </Space>
      </Card>

      {/* 日志标签页 */}
      <Card style={{ borderRadius: 'var(--radius-lg)' }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          type="card"
        />
      </Card>

      {/* 说明 */}
      <div className={styles.note}>
        <p>
          <strong>说明：</strong>
          系统日志用于记录用户的重要操作行为，便于审计和追溯。日志保留期限为180天，超过期限的日志将自动归档。
        </p>
      </div>
    </div>
  )
}
