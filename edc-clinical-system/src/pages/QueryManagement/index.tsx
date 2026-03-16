import { useState } from 'react'
import {
  Card,
  Button,
  Input,
  Select,
  Table,
  Drawer,
  Space,
  Tooltip,
  Popconfirm,
  message,
} from 'antd'
import {
  PlusOutlined,
  ExportOutlined,
  SearchOutlined,
  EyeOutlined,
  MessageOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { mockQueries, mockProjects } from '@/utils/mockData'
import StatusTag from '@/components/Common/StatusTag'
import PageHeader from '@/components/Common/PageHeader'
import Toolbar from '@/components/Common/Toolbar'
import { getTableRowClassName } from '@/constants/theme'
import type { Query } from '@/types'

const { Option } = Select

export default function QueryManagement() {
  const navigate = useNavigate()
  const [queries] = useState<Query[]>(mockQueries)
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('全部')
  const [filterProject, setFilterProject] = useState<string>('全部')
  const [searchText, setSearchText] = useState('')
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  // 筛选质疑
  const filteredQueries = queries.filter((query) => {
    if (filterStatus !== '全部' && query.status !== filterStatus) return false
    if (filterProject !== '全部' && query.projectId !== filterProject) return false
    if (searchText && !query.content.toLowerCase().includes(searchText.toLowerCase())) return false
    return true
  })

  // 打开详情
  const openDetail = (query: Query) => {
    navigate(`/queries/${query.id}`)
  }

  // 打开抽屉
  const openDrawer = (query: Query) => {
    setSelectedQuery(query)
    setDrawerVisible(true)
  }

  // 批量关闭质疑
  const handleBatchClose = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要关闭的质疑')
      return
    }
    console.log('关闭质疑IDs:', selectedRowKeys)
    message.success(`已关闭 ${selectedRowKeys.length} 条质疑`)
    setSelectedRowKeys([])
  }

  // 表格行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
  }

  // 表格列
  const columns = [
    {
      title: '编号',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '项目',
      dataIndex: 'projectName',
      key: 'projectName',
    },
    {
      title: '受试者',
      dataIndex: 'subjectName',
      key: 'subjectName',
      render: (text: string, record: Query) => (
        <div>
          <div>{text}</div>
          <div style={{ fontSize: 12, color: 'var(--color-text-placeholder)' }}>{record.subjectId}</div>
        </div>
      ),
    },
    {
      title: 'CRF',
      dataIndex: 'crfName',
      key: 'crfName',
      render: (text: string, record: Query) => (
        <div>
          <div>{text}</div>
          <div style={{ fontSize: 12, color: 'var(--color-text-placeholder)' }}>{record.fieldName}</div>
        </div>
      ),
    },
    {
      title: '质疑内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
    },
    {
      title: '发起人',
      dataIndex: 'creator',
      key: 'creator',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: (status: string) => <StatusTag status={status} />,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (record: Query) => (
        <Space>
          <Tooltip title="查看">
            <Button
              type="text"
              icon={<EyeOutlined />}
              aria-label={`查看质疑 ${record.id}`}
              style={{ minWidth: 44, minHeight: 44 }}
              onClick={(e) => {
                e.stopPropagation()
                openDetail(record)
              }}
            />
          </Tooltip>
          <Tooltip title="回复">
            <Button
              type="text"
              icon={<MessageOutlined />}
              aria-label={`回复质疑 ${record.id}`}
              style={{ minWidth: 44, minHeight: 44 }}
              onClick={(e) => {
                e.stopPropagation()
                openDrawer(record)
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ]

  return (
    <div>
      {/* 页面标题 */}
      <PageHeader
        title="质疑管理"
        actions={
          <Button type="primary" icon={<PlusOutlined />}>
            新建质疑
          </Button>
        }
      />

      {/* 工具栏 */}
      <Toolbar
        filters={
          <Space>
            <Select
              value={filterStatus}
              onChange={setFilterStatus}
              style={{ width: 140 }}
              placeholder="状态筛选"
            >
              <Option value="全部">全部状态</Option>
              <Option value="待处理">待处理</Option>
              <Option value="处理中">处理中</Option>
              <Option value="待确认">待确认</Option>
              <Option value="已解决">已解决</Option>
              <Option value="已撤销">已撤销</Option>
            </Select>

            <Select
              value={filterProject}
              onChange={setFilterProject}
              style={{ width: 180 }}
              placeholder="项目筛选"
            >
              <Option value="全部">全部项目</Option>
              {mockProjects.map((p) => (
                <Option key={p.id} value={p.id}>
                  {p.name}
                </Option>
              ))}
            </Select>

            <Input
              placeholder="搜索质疑内容..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 240 }}
            />
          </Space>
        }
        actions={
          <Button icon={<ExportOutlined />}>导出</Button>
        }
      />

      {/* 质疑表格 */}
      <Card style={{ borderRadius: 12 }}>
        {/* 批量操作栏 */}
        {selectedRowKeys.length > 0 && (
          <div style={{ marginBottom: 16, padding: 12, background: 'var(--color-primary-light)', borderRadius: 8 }}>
            <Space>
              <span style={{ marginRight: 8 }}>已选择 <strong>{selectedRowKeys.length}</strong> 条质疑</span>
              <Button size="small" onClick={() => setSelectedRowKeys([])}>取消选择</Button>
              <Popconfirm
                title="确定要关闭选中的质疑吗？"
                description="关闭后将标记为已解决"
                onConfirm={handleBatchClose}
                okText="确定"
                cancelText="取消"
              >
                <Button size="small" type="primary" icon={<CloseCircleOutlined />}>批量关闭</Button>
              </Popconfirm>
            </Space>
          </div>
        )}
        <Table
          columns={columns}
          dataSource={filteredQueries}
          rowKey="id"
          rowClassName={getTableRowClassName}
          rowSelection={rowSelection}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条质疑`,
          }}
          onRow={(record) => ({
            onClick: () => openDetail(record),
            onKeyDown: (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                openDetail(record)
              }
            },
            tabIndex: 0,
            role: 'button',
            'aria-label': `查看质疑详情: ${record.content.slice(0, 50)}`,
            style: { cursor: 'pointer' },
          })}
        />
      </Card>

      {/* 快速回复抽屉 */}
      <Drawer
        title="质疑回复"
        width={400}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      >
        {selectedQuery && (
          <div>
            <Card size="small" style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 500, marginBottom: 8 }}>{selectedQuery.content}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                {selectedQuery.crfName} {'>'} {selectedQuery.fieldName}
              </div>
            </Card>

            <Input.TextArea rows={6} placeholder="请输入回复内容..." />

            <Space style={{ marginTop: 16, width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setDrawerVisible(false)}>取消</Button>
              <Button type="primary">提交回复</Button>
            </Space>
          </div>
        )}
      </Drawer>
    </div>
  )
}
