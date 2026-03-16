import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  Row,
  Col,
  Button,
  Input,
  Select,
  Table,
  Progress,
  Space,
  Tooltip,
  Tabs,
  Badge,
  Popconfirm,
  message,
} from 'antd'
import {
  PlusOutlined,
  ExportOutlined,
  SearchOutlined,
  EditOutlined,
  FilterOutlined,
  CalendarOutlined,
  ApartmentOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import { mockProjects } from '@/utils/mockData'
import StatusTag from '@/components/Common/StatusTag'
import PageHeader from '@/components/Common/PageHeader'
import { getTableRowClassName } from '@/constants/theme'
import type { Project } from '@/types'

const { Option } = Select

export default function ProjectList() {
  const navigate = useNavigate()
  const [projects] = useState<Project[]>(mockProjects)
  const [activeTab, setActiveTab] = useState<string>('all')
  const [searchText, setSearchText] = useState('')
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  // 状态统计
  const statusCounts = useMemo(() => {
    return {
      all: projects.length,
      inProgress: projects.filter(p => p.status === '进行中').length,
      inReview: projects.filter(p => p.status === '审批中').length,
      locked: projects.filter(p => p.status === '已锁库').length,
      pending: projects.filter(p => p.status === '立项中' || p.status === '已驳回').length,
    }
  }, [projects])

  // 筛选项目
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // 根据标签筛选
      if (activeTab === 'inProgress' && project.status !== '进行中') return false
      if (activeTab === 'inReview' && project.status !== '审批中') return false
      if (activeTab === 'locked' && project.status !== '已锁库') return false
      if (activeTab === 'pending' && project.status !== '立项中' && project.status !== '已驳回') return false
      // 搜索筛选
      if (searchText && !project.name.toLowerCase().includes(searchText.toLowerCase())) return false
      return true
    })
  }, [projects, activeTab, searchText])

  // 查看项目详情
  const viewProjectDetail = (project: Project) => {
    navigate(`/projects/${project.id}`)
  }

  // 批量导出
  const handleBatchExport = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要导出的项目')
      return
    }
    console.log('批量导出项目IDs:', selectedRowKeys)
    message.success(`已选择 ${selectedRowKeys.length} 个项目，开始导出`)
  }

  // 批量删除
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要删除的项目')
      return
    }
    console.log('删除项目IDs:', selectedRowKeys)
    message.success(`已删除 ${selectedRowKeys.length} 个项目`)
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
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Project) => (
        <div>
          <div style={{ fontWeight: 500, color: 'var(--color-primary-500)' }}>{text}</div>
          <div style={{ fontSize: 12, color: 'var(--color-text-placeholder)', marginTop: 4 }}>{record.description.slice(0, 30)}...</div>
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => <StatusTag status={status} />,
    },
    {
      title: '中心',
      dataIndex: 'centerCount',
      key: 'centerCount',
      width: 80,
      align: 'center' as const,
      render: (count: number) => `${count}个`,
    },
    {
      title: '受试者',
      key: 'subjects',
      width: 120,
      render: (record: Project) => (
        <Tooltip title={`入组 ${record.enrolledCount} / 目标 ${record.targetCount}`}>
          <div>
            <Progress
              percent={Math.round(record.progress)}
              size="small"
              strokeColor="#5CB8A6"
              showInfo={false}
              style={{ width: 60, marginRight: 8 }}
            />
            <span style={{ fontSize: 12 }}>
              {record.enrolledCount}/{record.targetCount}
            </span>
          </div>
        </Tooltip>
      ),
    },
    {
      title: '质疑',
      dataIndex: 'queryCount',
      key: 'queryCount',
      width: 80,
      align: 'center' as const,
      render: (count: number) => count > 0 ? <Badge count={count} style={{ backgroundColor: '#F39C12' }} /> : '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (record: Project) => (
        <Space>
          <Tooltip title="查看详情">
            <Button
              type="link"
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                viewProjectDetail(record)
              }}
            >
              查看
            </Button>
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              aria-label={`编辑项目 ${record.name}`}
              size="small"
            />
          </Tooltip>
        </Space>
      ),
    },
  ]

  // 状态标签页配置
  const statusTabs = [
    { key: 'all', label: '全部', count: statusCounts.all },
    { key: 'inProgress', label: '进行中', count: statusCounts.inProgress },
    { key: 'inReview', label: '审核中', count: statusCounts.inReview },
    { key: 'locked', label: '已锁库', count: statusCounts.locked },
    { key: 'pending', label: '待处理', count: statusCounts.pending },
  ]

  return (
    <div>
      {/* 页面标题 */}
      <PageHeader
        title="项目管理"
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/projects/new')}>
            新建项目
          </Button>
        }
      />

      {/* 筛选栏 */}
      <Card style={{ marginBottom: 16, borderRadius: 'var(--radius-lg)' }}>
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Space>
              <Input
                placeholder="搜索项目..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 240 }}
              />
              <Select style={{ width: 120 }} placeholder="状态" suffixIcon={<FilterOutlined />}>
                <Option value="all">全部状态</Option>
                <Option value="inProgress">进行中</Option>
                <Option value="inReview">审核中</Option>
              </Select>
              <Select style={{ width: 120 }} placeholder="中心" suffixIcon={<ApartmentOutlined />}>
                <Option value="all">全部中心</Option>
                <Option value="beijing">北京协和</Option>
                <Option value="shanghai">上海华山</Option>
              </Select>
              <Select style={{ width: 120 }} placeholder="日期" suffixIcon={<CalendarOutlined />}>
                <Option value="all">全部日期</Option>
                <Option value="recent7">近7天</Option>
                <Option value="recent30">近30天</Option>
              </Select>
            </Space>
          </Col>
          <Col>
            <Button icon={<ExportOutlined />}>导出</Button>
          </Col>
        </Row>
      </Card>

      {/* 状态标签页 */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        style={{ marginBottom: 16 }}
        items={statusTabs.map(tab => ({
          key: tab.key,
          label: (
            <span>
              {tab.label}
              <Badge
                count={tab.count}
                style={{
                  marginLeft: 8,
                  backgroundColor: activeTab === tab.key ? '#5CB8A6' : '#d9d9d9',
                }}
              />
            </span>
          ),
        }))}
      />

      {/* 项目表格 */}
      <Card style={{ borderRadius: 'var(--radius-lg)' }}>
        {/* 批量操作栏 */}
        {selectedRowKeys.length > 0 && (
          <div style={{ marginBottom: 16, padding: 12, background: 'var(--color-primary-light)', borderRadius: 8 }}>
            <Space>
              <span style={{ marginRight: 8 }}>已选择 <strong>{selectedRowKeys.length}</strong> 项</span>
              <Button size="small" onClick={() => setSelectedRowKeys([])}>取消选择</Button>
              <Button size="small" icon={<ExportOutlined />} onClick={handleBatchExport}>批量导出</Button>
              <Popconfirm
                title="确定要删除选中的项目吗？"
                description="此操作不可恢复"
                onConfirm={handleBatchDelete}
                okText="确定"
                cancelText="取消"
              >
                <Button size="small" danger icon={<DeleteOutlined />}>批量删除</Button>
              </Popconfirm>
            </Space>
          </div>
        )}
        <Table
          columns={columns}
          dataSource={filteredProjects}
          rowKey="id"
          rowClassName={getTableRowClassName}
          rowSelection={rowSelection}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 个项目`,
          }}
          onRow={(record) => ({
            onClick: () => viewProjectDetail(record),
            onKeyDown: (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                viewProjectDetail(record)
              }
            },
            tabIndex: 0,
            role: 'button',
            'aria-label': `查看项目详情: ${record.name}`,
            style: { cursor: 'pointer' },
          })}
        />
      </Card>

    </div>
  )
}
