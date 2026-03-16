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
  Statistic,
  Avatar,
  List,
} from 'antd'
import {
  FileTextOutlined,
  QuestionCircleOutlined,
  AuditOutlined,
  RightOutlined,
  UserOutlined,
  ProjectOutlined,
} from '@ant-design/icons'
import { mockProjects, mockQueries } from '@/utils/mockData'
import { getStatusColor, getTableRowClassName } from '@/constants/theme'
import type { TabsProps } from 'antd'
import styles from './styles.module.css'

const { Title, Text } = Typography

// 我的工作页面 Props
interface MyWorkProps {
  defaultTab?: 'workbench' | 'pending-data' | 'pending-queries'
}

export default function MyWork({ defaultTab = 'workbench' }: MyWorkProps) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(defaultTab)

  // 获取待录入数据 - 模拟数据
  const pendingDataItems = useMemo(() => {
    return [
      {
        id: '1',
        project: '肿瘤药物临床试验A',
        subject: 'Subject-001',
        visit: '访视3',
        crf: '体格检查',
        status: '待填写',
        dueDate: '2026-03-20',
      },
      {
        id: '2',
        project: '肿瘤药物临床试验A',
        subject: 'Subject-002',
        visit: '访视2',
        crf: '实验室检查',
        status: '待填写',
        dueDate: '2026-03-22',
      },
      {
        id: '3',
        project: '心血管药物试验B',
        subject: 'Subject-015',
        visit: '访视1',
        crf: '人口学资料',
        status: '填写中',
        dueDate: '2026-03-18',
      },
    ]
  }, [])

  // 获取待处理质疑
  const pendingQueries = useMemo(() => {
    return mockQueries.filter(q => q.status === '待处理').slice(0, 5)
  }, [])

  // 获取待审核项目（仅审核员可见）
  const pendingAudits = useMemo(() => {
    return mockProjects.filter(p => p.status === '待审核' as any)
  }, [])

  // 统计信息
  const stats = useMemo(() => ({
    pendingData: pendingDataItems.length,
    pendingQueries: pendingQueries.length,
    pendingAudits: pendingAudits.length,
  }), [pendingDataItems, pendingQueries, pendingAudits])

  // 标签页配置
  const tabItems: TabsProps['items'] = [
    {
      key: 'workbench',
      label: (
        <span>
          <FileTextOutlined />
          工作台
        </span>
      ),
      children: renderWorkbench(),
    },
    {
      key: 'pending-data',
      label: (
        <span>
          <FileTextOutlined />
          待录入数据 ({stats.pendingData})
        </span>
      ),
      children: renderPendingData(),
    },
    {
      key: 'pending-queries',
      label: (
        <span>
          <QuestionCircleOutlined />
          待处理质疑 ({stats.pendingQueries})
        </span>
      ),
      children: renderPendingQueries(),
    },
  ]

  // 渲染工作台
  function renderWorkbench() {
    return (
      <div>
        <Row gutter={24} style={{ marginBottom: 24 }}>
          <Col span={8}>
            <Card className={styles.statCard} hoverable onClick={() => setActiveTab('pending-data')}>
              <Statistic
                title="待录入数据"
                value={stats.pendingData}
                prefix={<FileTextOutlined style={{ color: '#5CB8A6' }} />}
                valueStyle={{ color: '#5CB8A6' }}
              />
              <Text type="secondary">点击查看详情</Text>
            </Card>
          </Col>
          <Col span={8}>
            <Card className={styles.statCard} hoverable onClick={() => setActiveTab('pending-queries')}>
              <Statistic
                title="待处理质疑"
                value={stats.pendingQueries}
                prefix={<QuestionCircleOutlined style={{ color: '#F39C12' }} />}
                valueStyle={{ color: '#F39C12' }}
              />
              <Text type="secondary">点击查看详情</Text>
            </Card>
          </Col>
          <Col span={8}>
            <Card className={styles.statCard} hoverable>
              <Statistic
                title="待审核项目"
                value={stats.pendingAudits}
                prefix={<AuditOutlined style={{ color: '#2196F3' }} />}
                valueStyle={{ color: '#2196F3' }}
              />
              <Text type="secondary">点击查看详情</Text>
            </Card>
          </Col>
        </Row>

        {/* 最近待办 */}
        <Row gutter={24}>
          <Col span={12}>
            <Card
              title={
                <Space>
                  <FileTextOutlined />
                  待录入数据
                </Space>
              }
              extra={<Button type="link" onClick={() => setActiveTab('pending-data')}>查看全部 <RightOutlined /></Button>}
              className={styles.listCard}
            >
              <List
                dataSource={pendingDataItems.slice(0, 3)}
                renderItem={(item) => (
                  <List.Item
                    className={styles.listItem}
                    actions={[
                      <Tag color="orange">{item.status}</Tag>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} style={{ backgroundColor: '#E8F5F2' }} />}
                      title={item.subject}
                      description={`${item.project} - ${item.visit}`}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card
              title={
                <Space>
                  <QuestionCircleOutlined />
                  待处理质疑
                </Space>
              }
              extra={<Button type="link" onClick={() => setActiveTab('pending-queries')}>查看全部 <RightOutlined /></Button>}
              className={styles.listCard}
            >
              <List
                dataSource={pendingQueries.slice(0, 3)}
                renderItem={(item) => (
                  <List.Item
                    className={styles.listItem}
                    actions={[
                      <Tag color="red">{item.status}</Tag>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar icon={<QuestionCircleOutlined />} style={{ backgroundColor: '#FEF3E8' }} />}
                      title={`质疑 #${item.id}`}
                      description={item.content.substring(0, 30) + '...'}
                    />
                  </List.Item>
                )}
              />
              {pendingQueries.length === 0 && (
                <Text type="secondary">暂无待处理质疑</Text>
              )}
            </Card>
          </Col>
        </Row>
      </div>
    )
  }

  // 渲染待录入数据
  function renderPendingData() {
    const columns = [
      { title: '项目', dataIndex: 'project', key: 'project', render: (text: string) => <Space><ProjectOutlined />{text}</Space> },
      { title: '受试者', dataIndex: 'subject', key: 'subject' },
      { title: '访视', dataIndex: 'visit', key: 'visit' },
      { title: 'CRF', dataIndex: 'crf', key: 'crf' },
      { title: '状态', dataIndex: 'status', key: 'status', render: (status: string) => (
        <Tag color={status === '待填写' ? 'orange' : 'blue'}>{status}</Tag>
      )},
      { title: '截止日期', dataIndex: 'dueDate', key: 'dueDate' },
      {
        title: '操作',
        key: 'action',
        render: () => (
          <Button type="link" onClick={() => navigate(`/projects/1/subjects/S001/crf/1`)}>
            填写
          </Button>
        ),
      },
    ]

    return (
      <Card>
        <Table
          dataSource={pendingDataItems}
          columns={columns}
          rowKey="id"
          rowClassName={getTableRowClassName}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    )
  }

  // 渲染待处理质疑
  function renderPendingQueries() {
    const columns = [
      { title: '质疑编号', dataIndex: 'id', key: 'id', render: (id: string) => `#${id}` },
      { title: '项目', dataIndex: 'projectId', key: 'projectId', render: (id: string) => {
        const project = mockProjects.find(p => p.id === id)
        return project?.name || id
      }},
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
      { title: '时间', dataIndex: 'createdAt', key: 'createdAt' },
      {
        title: '操作',
        key: 'action',
        render: (_: any, record: any) => (
          <Button type="link" onClick={() => navigate(`/queries/${record.id}`)}>
            处理
          </Button>
        ),
      },
    ]

    return (
      <Card>
        <Table
          dataSource={pendingQueries}
          columns={columns}
          rowKey="id"
          rowClassName={getTableRowClassName}
          pagination={{ pageSize: 10 }}
        />
        {pendingQueries.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <QuestionCircleOutlined style={{ fontSize: 48, color: '#ccc' }} />
            <Text type="secondary" style={{ display: 'block', marginTop: 16 }}>暂无待处理质疑</Text>
          </div>
        )}
      </Card>
    )
  }

  return (
    <div className={styles.container}>
      {/* 页面头部 */}
      <div className={styles.header}>
        <div>
          <Title level={4} className={styles.title}>我的工作</Title>
          <Text type="secondary">聚合所有待办事项，统一处理</Text>
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
