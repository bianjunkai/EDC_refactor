import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  Tabs,
  Table,
  Tag,
  Button,
  Space,
  Typography,
  Row,
  Col,
  Input,
  Select,
  Form,
  DatePicker,
  Modal,
  Descriptions,
  Avatar,
} from 'antd'
import {
  UserOutlined,
  QuestionCircleOutlined,
  ExportOutlined,
  SearchOutlined,
  ProjectOutlined,
} from '@ant-design/icons'
import { mockProjects, mockQueries } from '@/utils/mockData'
import { getStatusColor, getTableRowClassName } from '@/constants/theme'
import type { TabsProps } from 'antd'
import styles from './styles.module.css'

const { Title, Text } = Typography
const { RangePicker } = DatePicker
const { Option } = Select

// 数据查询页面 Props
interface DataQueryProps {
  defaultTab?: 'query' | 'subjects' | 'queries'
}

export default function DataQuery({ defaultTab = 'query' }: DataQueryProps) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [subjectSearchForm] = Form.useForm()
  const [querySearchForm] = Form.useForm()
  const [selectedSubject, setSelectedSubject] = useState<any>(null)
  const [subjectModalVisible, setSubjectModalVisible] = useState(false)

  // 模拟跨项目受试者数据
  const allSubjects = useMemo(() => {
    const subjects: any[] = []
    mockProjects.forEach(project => {
      // 模拟每个项目有多个受试者
      for (let i = 1; i <= 5; i++) {
        subjects.push({
          id: `${project.id}-S${String(i).padStart(3, '0')}`,
          projectId: project.id,
          projectName: project.name,
          subjectCode: `S${String(i).padStart(3, '0')}`,
          name: `受试者${i}号`,
          status: i <= 3 ? '在研' : '已完成',
          enrollmentDate: '2026-01-15',
          lastVisit: '2026-03-10',
          center: '北京协和医院',
        })
      }
    })
    return subjects
  }, [])

  // 模拟跨项目质疑数据
  const allQueries = useMemo(() => {
    return mockQueries.map(q => {
      const project = mockProjects.find(p => p.id === q.projectId)
      return {
        ...q,
        projectName: project?.name || q.projectId,
      }
    })
  }, [])

  // 标签页配置
  const tabItems: TabsProps['items'] = [
    {
      key: 'query',
      label: (
        <span>
          <SearchOutlined />
          数据查询
        </span>
      ),
      children: renderDataQuery(),
    },
    {
      key: 'subjects',
      label: (
        <span>
          <UserOutlined />
          受试者查询
        </span>
      ),
      children: renderSubjectQuery(),
    },
    {
      key: 'queries',
      label: (
        <span>
          <QuestionCircleOutlined />
          质疑查询
        </span>
      ),
      children: renderQuerySearch(),
    },
  ]

  // 渲染数据查询（默认页面）
  function renderDataQuery() {
    return (
      <div>
        <Row gutter={24}>
          {/* 快速查询卡片 */}
          <Col span={8}>
            <Card
              className={styles.queryCard}
              hoverable
              onClick={() => setActiveTab('subjects')}
            >
              <div className={styles.queryCardContent}>
                <Avatar icon={<UserOutlined />} size={64} style={{ backgroundColor: '#E8F5F2' }} />
                <Title level={4}>受试者查询</Title>
                <Text type="secondary">跨项目查询受试者信息</Text>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card
              className={styles.queryCard}
              hoverable
              onClick={() => setActiveTab('queries')}
            >
              <div className={styles.queryCardContent}>
                <Avatar icon={<QuestionCircleOutlined />} size={64} style={{ backgroundColor: '#FEF3E8' }} />
                <Title level={4}>质疑查询</Title>
                <Text type="secondary">跨项目查询质疑记录</Text>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card
              className={styles.queryCard}
              hoverable
              onClick={() => navigate('/export')}
            >
              <div className={styles.queryCardContent}>
                <Avatar icon={<ExportOutlined />} size={64} style={{ backgroundColor: '#E8F4FD' }} />
                <Title level={4}>数据导出</Title>
                <Text type="secondary">导出项目数据</Text>
              </div>
            </Card>
          </Col>
        </Row>

        {/* 最近查询记录 */}
        <Card title="最近查询" style={{ marginTop: 24 }}>
          <Table
            dataSource={[
              { id: '1', type: '受试者', keyword: 'Subject-001', time: '2026-03-15 14:30', project: '肿瘤药物临床试验A' },
              { id: '2', type: '质疑', keyword: '#Q003', time: '2026-03-15 11:20', project: '心血管药物试验B' },
              { id: '3', type: '受试者', keyword: '受试者', time: '2026-03-14 16:45', project: '全部项目' },
            ]}
            columns={[
              { title: '查询类型', dataIndex: 'type', key: 'type', render: (type: string) => (
                <Tag color={type === '受试者' ? 'green' : 'orange'}>{type}</Tag>
              )},
              { title: '关键词', dataIndex: 'keyword', key: 'keyword' },
              { title: '项目', dataIndex: 'project', key: 'project' },
              { title: '查询时间', dataIndex: 'time', key: 'time' },
              {
                title: '操作',
                key: 'action',
                render: () => <Button type="link">重新查询</Button>,
              },
            ]}
            rowKey="id"
            pagination={false}
          />
        </Card>
      </div>
    )
  }

  // 渲染受试者查询
  function renderSubjectQuery() {
    const handleSearch = (values: any) => {
      console.log('Search values:', values)
    }

    const handleViewSubject = (record: any) => {
      setSelectedSubject(record)
      setSubjectModalVisible(true)
    }

    const columns = [
      { title: '受试者编号', dataIndex: 'subjectCode', key: 'subjectCode' },
      { title: '姓名', dataIndex: 'name', key: 'name' },
      { title: '所属项目', dataIndex: 'projectName', key: 'projectName', render: (text: string) => <Space><ProjectOutlined />{text}</Space> },
      { title: '中心', dataIndex: 'center', key: 'center' },
      { title: '状态', dataIndex: 'status', key: 'status', render: (status: string) => (
        <Tag color={status === '在研' ? 'green' : 'blue'}>{status}</Tag>
      )},
      { title: '入组日期', dataIndex: 'enrollmentDate', key: 'enrollmentDate' },
      { title: '最近访视', dataIndex: 'lastVisit', key: 'lastVisit' },
      {
        title: '操作',
        key: 'action',
        render: (_: any, record: any) => (
          <Button type="link" onClick={() => handleViewSubject(record)}>
            查看详情
          </Button>
        ),
      },
    ]

    return (
      <div>
        <Card style={{ marginBottom: 16 }}>
          <Form
            form={subjectSearchForm}
            layout="inline"
            onFinish={handleSearch}
          >
            <Form.Item name="project" label="项目" style={{ marginBottom: 8 }}>
              <Select style={{ width: 200 }} placeholder="全部项目" allowClear>
                {mockProjects.map(p => (
                  <Option key={p.id} value={p.id}>{p.name}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="subjectCode" label="受试者编号" style={{ marginBottom: 8 }}>
              <Input placeholder="请输入受试者编号" style={{ width: 160 }} />
            </Form.Item>
            <Form.Item name="status" label="状态" style={{ marginBottom: 8 }}>
              <Select style={{ width: 120 }} placeholder="全部" allowClear>
                <Option value="在研">在研</Option>
                <Option value="已完成">已完成</Option>
                <Option value="脱落">脱落</Option>
              </Select>
            </Form.Item>
            <Form.Item name="dateRange" label="入组日期" style={{ marginBottom: 8 }}>
              <RangePicker />
            </Form.Item>
            <Form.Item style={{ marginBottom: 8 }}>
              <Button type="primary" icon={<SearchOutlined />} htmlType="submit">
                查询
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Card>
          <Table
            dataSource={allSubjects}
            columns={columns}
            rowKey="id"
            rowClassName={getTableRowClassName}
            pagination={{ pageSize: 10 }}
          />
        </Card>

        {/* 受试者详情弹窗 */}
        <Modal
          title="受试者详情"
          open={subjectModalVisible}
          onCancel={() => setSubjectModalVisible(false)}
          footer={[
            <Button key="crf" type="primary" onClick={() => {
              setSubjectModalVisible(false)
              navigate(`/projects/${selectedSubject?.projectId}/subjects/${selectedSubject?.id}/crf/1`)
            }}>
              查看CRF
            </Button>,
            <Button key="close" onClick={() => setSubjectModalVisible(false)}>
              关闭
            </Button>,
          ]}
          width={700}
        >
          {selectedSubject && (
            <Descriptions bordered column={2}>
              <Descriptions.Item label="受试者编号">{selectedSubject.subjectCode}</Descriptions.Item>
              <Descriptions.Item label="姓名">{selectedSubject.name}</Descriptions.Item>
              <Descriptions.Item label="所属项目">{selectedSubject.projectName}</Descriptions.Item>
              <Descriptions.Item label="中心">{selectedSubject.center}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={selectedSubject.status === '在研' ? 'green' : 'blue'}>{selectedSubject.status}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="入组日期">{selectedSubject.enrollmentDate}</Descriptions.Item>
              <Descriptions.Item label="最近访视">{selectedSubject.lastVisit}</Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
      </div>
    )
  }

  // 渲染质疑查询
  function renderQuerySearch() {
    const handleSearch = (values: any) => {
      console.log('Search values:', values)
    }

    const columns = [
      { title: '质疑编号', dataIndex: 'id', key: 'id', render: (id: string) => `#${id}` },
      { title: '项目', dataIndex: 'projectName', key: 'projectName', render: (text: string) => <Space><ProjectOutlined />{text}</Space> },
      { title: '受试者', dataIndex: 'subjectName', key: 'subjectName' },
      { title: 'CRF', dataIndex: 'crfName', key: 'crfName' },
      { title: '字段', dataIndex: 'fieldName', key: 'fieldName' },
      { title: '内容', dataIndex: 'content', key: 'content', ellipsis: true },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => {
          const { text, bg } = getStatusColor(status)
          return <Tag style={{ color: text, backgroundColor: bg }}>{status}</Tag>
        },
      },
      { title: '发起人', dataIndex: 'creator', key: 'creator' },
      { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
      {
        title: '操作',
        key: 'action',
        render: (_: any, record: any) => (
          <Button type="link" onClick={() => navigate(`/queries/${record.id}`)}>
            查看详情
          </Button>
        ),
      },
    ]

    return (
      <div>
        <Card style={{ marginBottom: 16 }}>
          <Form
            form={querySearchForm}
            layout="inline"
            onFinish={handleSearch}
          >
            <Form.Item name="project" label="项目" style={{ marginBottom: 8 }}>
              <Select style={{ width: 200 }} placeholder="全部项目" allowClear>
                {mockProjects.map(p => (
                  <Option key={p.id} value={p.id}>{p.name}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="status" label="状态" style={{ marginBottom: 8 }}>
              <Select style={{ width: 120 }} placeholder="全部" allowClear>
                <Option value="待处理">待处理</Option>
                <Option value="已回复">已回复</Option>
                <Option value="已关闭">已关闭</Option>
              </Select>
            </Form.Item>
            <Form.Item name="keyword" label="关键词" style={{ marginBottom: 8 }}>
              <Input placeholder="请输入质疑内容关键词" style={{ width: 200 }} />
            </Form.Item>
            <Form.Item name="dateRange" label="创建时间" style={{ marginBottom: 8 }}>
              <RangePicker />
            </Form.Item>
            <Form.Item style={{ marginBottom: 8 }}>
              <Button type="primary" icon={<SearchOutlined />} htmlType="submit">
                查询
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Card>
          <Table
            dataSource={allQueries}
            columns={columns}
            rowKey="id"
            rowClassName={getTableRowClassName}
            pagination={{ pageSize: 10 }}
          />
        </Card>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* 页面头部 */}
      <div className={styles.header}>
        <div>
          <Title level={4} className={styles.title}>数据查询</Title>
          <Text type="secondary">跨项目查询受试者、质疑等数据</Text>
        </div>
      </div>

      {/* 标签页 */}
      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as typeof activeTab)}
        items={tabItems}
        className={styles.tabs}
      />
    </div>
  )
}
