import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Card,
  Button,
  Tabs,
  Tag,
  Row,
  Col,
  Progress,
  Timeline,
  Descriptions,
  Typography,
  Space,
  Badge,
  Table,
  List,
} from 'antd'
import {
  ArrowLeftOutlined,
  EditOutlined,
  FileTextOutlined,
  QuestionCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
} from '@ant-design/icons'
import { mockSubjects, mockQueries, mockVisits } from '@/utils/mockData'
import { getStatusColor, getTableRowClassName } from '@/constants/theme'
import type { TabsProps } from 'antd'
import styles from './styles.module.css'

const { Title, Text } = Typography

// 标签页配置
const tabItems: TabsProps['items'] = [
  { key: 'basic', label: '基本信息', icon: <UserOutlined /> },
  { key: 'visits', label: '访视时间线', icon: <ClockCircleOutlined /> },
  { key: 'crf', label: 'CRF任务', icon: <FileTextOutlined /> },
  { key: 'queries', label: '质疑记录', icon: <QuestionCircleOutlined /> },
]

export default function SubjectDetail() {
  const { subjectId } = useParams<{ projectId: string; subjectId: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('basic')

  // 获取受试者数据
  const subject = useMemo(() => {
    return mockSubjects.find(s => s.id === subjectId)
  }, [subjectId])

  // 获取受试者相关的质疑
  const subjectQueries = useMemo(() => {
    return mockQueries.filter(q => q.subjectId === subjectId)
  }, [subjectId])

  if (!subject) {
    return (
      <div className={styles.emptyState}>
        <Title level={4}>受试者不存在</Title>
        <Button type="primary" onClick={() => navigate(-1)}>
          返回
        </Button>
      </div>
    )
  }

  const { text, bg } = getStatusColor(subject.status)

  // 渲染基本信息标签
  const renderBasicInfo = () => (
    <Row gutter={24}>
      <Col span={16}>
        <Card title="基本信息" className={styles.infoCard}>
          <Descriptions bordered column={2}>
            <Descriptions.Item label="筛选号">{subject.screeningId}</Descriptions.Item>
            <Descriptions.Item label="随机号">{subject.randomId || '-'}</Descriptions.Item>
            <Descriptions.Item label="姓名">{subject.name || '-'}</Descriptions.Item>
            <Descriptions.Item label="性别">{subject.gender}</Descriptions.Item>
            <Descriptions.Item label="年龄">{subject.age}岁</Descriptions.Item>
            <Descriptions.Item label="中心">{subject.center}</Descriptions.Item>
            <Descriptions.Item label="入组日期" span={2}>{subject.enrollmentDate || '-'}</Descriptions.Item>
            <Descriptions.Item label="当前状态" span={2}>
              <Tag style={{ color: text, backgroundColor: bg }}>{subject.status}</Tag>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Col>
      <Col span={8}>
        <Card title="联系方式" className={styles.contactCard}>
          <div className={styles.contactItem}>
            <PhoneOutlined className={styles.contactIcon} />
            <span>{subject.phone || '未记录'}</span>
          </div>
          <div className={styles.contactItem}>
            <MailOutlined className={styles.contactIcon} />
            <span>{subject.email || '未记录'}</span>
          </div>
        </Card>
        <Card title="访视进度" className={styles.progressCard} style={{ marginTop: 16 }}>
          <Progress percent={subject.progress} strokeColor="#5CB8A6" />
          <div className={styles.progressText}>{subject.currentVisit}</div>
        </Card>
      </Col>
    </Row>
  )

  // 渲染访视时间线标签
  const renderVisits = () => (
    <Card className={styles.visitCard}>
      <Timeline mode="left">
        {mockVisits.map((visit) => (
          <Timeline.Item
            key={visit.id}
            label={`${visit.phase} · ${visit.name}`}
            color={subject.progress >= visit.order * 20 ? 'green' : 'gray'}
            dot={subject.progress >= visit.order * 20 ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
          >
            <div className={styles.visitItem}>
              <div className={styles.visitTitle}>{visit.name}</div>
              <div className={styles.visitMeta}>
                <Tag>{visit.type}</Tag>
                {visit.windowDays && <span>时间窗: ±{visit.windowDays}天</span>}
              </div>
              <div className={styles.visitCrfs}>
                {visit.crfs.map((crf) => (
                  <Tag key={crf} style={{ marginBottom: 4, fontSize: 12 }}>{crf}</Tag>
                ))}
              </div>
            </div>
          </Timeline.Item>
        ))}
      </Timeline>
    </Card>
  )

  // 渲染CRF任务标签
  const renderCRFTasks = () => (
    <Card className={styles.crfCard}>
      <Table
        dataSource={[
          { id: '1', crf: '人口学资料', visit: '筛选期访视1', status: '已完成', date: '2026-02-15' },
          { id: '2', crf: '既往病史', visit: '筛选期访视1', status: '已完成', date: '2026-02-15' },
          { id: '3', crf: '体格检查', visit: '筛选期访视1', status: '已完成', date: '2026-02-15' },
          { id: '4', crf: '实验室检查', visit: '筛选期访视2', status: '已完成', date: '2026-02-18' },
          { id: '5', crf: '体格检查', visit: '治疗期访视1', status: '进行中', date: '-' },
          { id: '6', crf: '实验室检查', visit: '治疗期访视1', status: '待开始', date: '-' },
        ]}
        columns={[
          { title: 'CRF表单', dataIndex: 'crf', key: 'crf' },
          { title: '所属访视', dataIndex: 'visit', key: 'visit' },
          { title: '状态', dataIndex: 'status', key: 'status', render: (status: string) => {
            const colorMap: Record<string, string> = {
              '已完成': '#27AE60',
              '进行中': '#5CB8A6',
              '待开始': '#999999',
            }
            return <Badge color={colorMap[status]} text={status} />
          }},
          { title: '完成时间', dataIndex: 'date', key: 'date' },
          { title: '操作', key: 'action', render: () => (
            <Button type="link" size="small">填写</Button>
          )},
        ]}
        rowKey="id"
        rowClassName={getTableRowClassName}
        pagination={false}
      />
    </Card>
  )

  // 渲染质疑记录标签
  const renderQueries = () => (
    <Card className={styles.queryCard}>
      {subjectQueries.length > 0 ? (
        <List
          dataSource={subjectQueries}
          renderItem={(query) => (
            <List.Item
              actions={[
                <Button type="link" key="view">查看</Button>,
              ]}
            >
              <List.Item.Meta
                title={
                  <Space>
                    <span>质疑 #{query.id}</span>
                    <Tag style={{ color: getStatusColor(query.status).text, backgroundColor: getStatusColor(query.status).bg }}>
                      {query.status}
                    </Tag>
                  </Space>
                }
                description={
                  <div>
                    <div>CRF: {query.crfName} · 字段: {query.fieldName}</div>
                    <div style={{ color: '#666', marginTop: 4 }}>{query.content}</div>
                    <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
                      发起人: {query.creator} · {query.createdAt}
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      ) : (
        <div className={styles.emptyQueries}>
          <QuestionCircleOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
          <Text type="secondary">暂无质疑记录</Text>
        </div>
      )}
    </Card>
  )

  return (
    <div className={styles.container}>
      {/* 头部 */}
      <div className={styles.header}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
            返回
          </Button>
          <div>
            <Title level={4} className={styles.title}>
              {subject.name || subject.screeningId}
            </Title>
            <Space>
              <Tag style={{ color: text, backgroundColor: bg }}>{subject.status}</Tag>
              <Text type="secondary">{subject.center}</Text>
            </Space>
          </div>
        </Space>
        <Space>
          <Button icon={<EditOutlined />}>编辑</Button>
          <Button type="primary" icon={<FileTextOutlined />}>填写CRF</Button>
        </Space>
      </div>

      {/* 标签页 */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        className={styles.tabs}
      />

      {/* 标签内容 */}
      <div className={styles.tabContent}>
        {activeTab === 'basic' && renderBasicInfo()}
        {activeTab === 'visits' && renderVisits()}
        {activeTab === 'crf' && renderCRFTasks()}
        {activeTab === 'queries' && renderQueries()}
      </div>
    </div>
  )
}
