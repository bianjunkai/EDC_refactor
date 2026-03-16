import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  Button,
  Input,
  Select,
  Table,
  Drawer,
  Descriptions,
  Progress,
  Space,
  Typography,
  Timeline,
  Tooltip,
} from 'antd'
import {
  PlusOutlined,
  ExportOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  SwapOutlined,
  FormOutlined,
} from '@ant-design/icons'
import { mockSubjects, mockProjects } from '@/utils/mockData'
import StatusTag from '@/components/Common/StatusTag'
import PageHeader from '@/components/Common/PageHeader'
import Toolbar from '@/components/Common/Toolbar'
import { getTableRowClassName } from '@/constants/theme'
import type { Subject } from '@/types'

const { Text } = Typography
const { Option } = Select

export default function SubjectList() {
  const navigate = useNavigate()
  const [subjects] = useState<Subject[]>(mockSubjects)
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [selectedProject, setSelectedProject] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('全部')
  const [filterCenter, setFilterCenter] = useState<string>('全部')
  const [searchText, setSearchText] = useState('')

  // 跳转到CRF填写页面
  const handleFillCRF = (subject: Subject) => {
    // 跳转到第一个CRF表单（人口学资料）
    navigate(`/projects/${subject.projectId}/subjects/${subject.id}/crf/crf-1`)
  }

  // 筛选受试者
  const filteredSubjects = subjects.filter((subject) => {
    if (filterStatus !== '全部' && subject.status !== filterStatus) return false
    if (filterCenter !== '全部' && subject.center !== filterCenter) return false
    if (searchText && !subject.screeningId.toLowerCase().includes(searchText.toLowerCase())) return false
    return true
  })

  // 打开详情抽屉
  const openDrawer = (subject: Subject) => {
    setSelectedSubject(subject)
    setDrawerVisible(true)
  }

  // 表格列
  const columns = [
    {
      title: '筛选号',
      dataIndex: 'screeningId',
      key: 'screeningId',
      render: (text: string) => <Text style={{ fontFamily: 'monospace' }}>{text}</Text>,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      width: 70,
      align: 'center' as const,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      width: 70,
      align: 'center' as const,
      render: (age: number) => `${age}岁`,
    },
    {
      title: '中心',
      dataIndex: 'center',
      key: 'center',
    },
    {
      title: '当前访视',
      dataIndex: 'currentVisit',
      key: 'currentVisit',
    },
    {
      title: '随机号',
      dataIndex: 'randomId',
      key: 'randomId',
      render: (text: string) =>
        text ? <Text style={{ fontFamily: 'monospace' }}>{text}</Text> : '-',
    },
    {
      title: '入组日期',
      dataIndex: 'enrollmentDate',
      key: 'enrollmentDate',
      render: (text: string) => text || '-',
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
      width: 100,
      render: (record: Subject) => (
        <Space>
          <Tooltip title="查看">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={(e) => {
                e.stopPropagation()
                openDrawer(record)
              }}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button type="text" icon={<EditOutlined />} />
          </Tooltip>
        </Space>
      ),
    },
  ]

  // 获取中心列表
  const centers = ['全部', ...new Set(subjects.map((s) => s.center))]

  return (
    <div>
      {/* 页面标题 */}
      <PageHeader
        title="受试者管理"
        subtitle="肿瘤药物临床试验A"
        actions={
          <Button type="primary" icon={<PlusOutlined />}>
            新增受试者
          </Button>
        }
      />

      {/* 工具栏 */}
      <Toolbar
        filters={
          <Space wrap>
            <Select
              value={selectedProject}
              onChange={setSelectedProject}
              style={{ width: 180 }}
              placeholder="选择项目"
            >
              <Option value="all">全部项目</Option>
              {mockProjects.map((p) => (
                <Option key={p.id} value={p.id}>
                  {p.name}
                </Option>
              ))}
            </Select>

            <Select
              value={filterCenter}
              onChange={setFilterCenter}
              style={{ width: 160 }}
              placeholder="选择中心"
            >
              {centers.map((center) => (
                <Option key={center} value={center}>
                  {center}
                </Option>
              ))}
            </Select>

            <Select
              value={filterStatus}
              onChange={setFilterStatus}
              style={{ width: 140 }}
              placeholder="状态筛选"
            >
              <Option value="全部">全部状态</Option>
              <Option value="筛选中">筛选中</Option>
              <Option value="已入组">已入组</Option>
              <Option value="完成">完成</Option>
              <Option value="脱落">脱落</Option>
              <Option value="筛选失败">筛选失败</Option>
              <Option value="退出">退出</Option>
              <Option value="失访">失访</Option>
            </Select>

            <Input
              placeholder="搜索筛选号..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
          </Space>
        }
        actions={
          <Space>
            <Button icon={<ExportOutlined />}>导出</Button>
            <Button icon={<SwapOutlined />}>随机化</Button>
          </Space>
        }
      />

      {/* 受试者表格 */}
      <Card style={{ borderRadius: 12 }}>
        <Table
          columns={columns}
          dataSource={filteredSubjects}
          rowKey="id"
          rowClassName={getTableRowClassName}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 名受试者`,
          }}
          onRow={(record) => ({
            onClick: () => openDrawer(record),
            style: { cursor: 'pointer' },
          })}
        />
      </Card>

      {/* 详情抽屉 */}
      <Drawer
        title="受试者详情"
        width={520}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        bodyStyle={{ padding: 24 }}
      >
        {selectedSubject && (
          <div>
            {/* 基本信息 */}
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#1f2937',
                  marginBottom: 12,
                  paddingBottom: 8,
                  borderBottom: '1px solid #e5e7eb',
                }}
              >
                基本信息
              </div>
              <Descriptions column={2} labelStyle={{ color: '#6b7280' }} contentStyle={{ fontWeight: 500 }}>
                <Descriptions.Item label="筛选号">{selectedSubject.screeningId}</Descriptions.Item>
                <Descriptions.Item label="随机号">
                  {selectedSubject.randomId || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="性别">{selectedSubject.gender}</Descriptions.Item>
                <Descriptions.Item label="年龄">{selectedSubject.age}岁</Descriptions.Item>
                <Descriptions.Item label="中心" span={2}>
                  {selectedSubject.center}
                </Descriptions.Item>
                <Descriptions.Item label="入组日期" span={2}>
                  {selectedSubject.enrollmentDate || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="当前状态" span={2}>
                  <StatusTag status={selectedSubject.status} />
                </Descriptions.Item>
              </Descriptions>
            </div>

            {/* 访视进度 */}
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#1f2937',
                  marginBottom: 12,
                  paddingBottom: 8,
                  borderBottom: '1px solid #e5e7eb',
                }}
              >
                访视进度
              </div>
              <Progress percent={selectedSubject.progress} strokeColor="#5CB8A6" />
              <Timeline
                style={{ marginTop: 16 }}
                items={[
                  { color: 'green', children: '筛选期访视1 - 已完成' },
                  { color: 'green', children: '筛选期访视2 - 已完成' },
                  { color: selectedSubject.progress >= 50 ? 'green' : 'blue', children: '治疗期访视1' },
                  { color: selectedSubject.progress >= 75 ? 'green' : 'gray', children: '治疗期访视2' },
                  { color: selectedSubject.progress === 100 ? 'green' : 'gray', children: '随访期访视1' },
                ]}
              />
            </div>

            {/* 操作按钮 */}
            <Space wrap style={{ marginTop: 24 }}>
              <Button type="primary" icon={<FormOutlined />} onClick={() => handleFillCRF(selectedSubject!)}>
                填写CRF
              </Button>
              <Button>查看记录</Button>
              <Button>发起质疑</Button>
            </Space>
          </div>
        )}
      </Drawer>
    </div>
  )
}
