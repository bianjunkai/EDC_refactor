import { useState, useMemo } from 'react'
import {
  Card,
  Row,
  Col,
  Button,
  Progress,
  Badge,
  Timeline,
  List,
  Typography,
  Space,
  Statistic,
  Table,
  Tag,
} from 'antd'
import {
  PlusOutlined,
  QuestionCircleOutlined,
  RightOutlined,
  BellOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  EditOutlined,
  FileSearchOutlined,
  TeamOutlined,
  FileSyncOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { mockProjects, mockActivities, mockNotifications, mockQueries } from '@/utils/mockData'
import { getTodayString } from '@/utils/helpers'
import type { Project, Activity, Notification } from '@/types'
import { getStatusColor, getTableRowClassName } from '@/constants/theme'
import styles from './styles.module.css'

const { Title, Text } = Typography

/**
 * Dashboard 页面 - EDC 系统首页
 * 规范化后的组件，使用 CSS 模块和设计系统变量
 */
export default function Dashboard() {
  const navigate = useNavigate()
  const [activities] = useState<Activity[]>(mockActivities)
  const [notifications] = useState<Notification[]>(mockNotifications)

  // 根据PRD文档计算项目统计数据
  const projectStats = useMemo(() => {
    const total = mockProjects.length
    const inProgress = mockProjects.filter(p => p.status === '进行中').length
    const inReview = mockProjects.filter(p => p.status === '审批中').length
    const locked = mockProjects.filter(p => p.status === '已锁库').length
    const pending = mockProjects.filter(p => p.status === '立项中' || p.status === '已驳回').length
    return { total, inProgress, inReview, locked, pending }
  }, [])

  // 待办事项
  const todoItems = useMemo(() => [
    { type: 'review', count: 3, label: '条待审核', icon: <FileSearchOutlined />, color: '#5CB8A6' },
    { type: 'query', count: mockQueries.filter(q => q.status === '待处理').length, label: '条待处理质疑', icon: <QuestionCircleOutlined />, color: '#F39C12' },
    { type: 'export', count: 2, label: '份待导出', icon: <FileSyncOutlined />, color: '#2196F3' },
  ], [])

  // 快速操作按钮配置 - 根据PRD
  const quickActions = [
    { icon: <PlusOutlined />, label: '新建项目', path: '/projects', primary: true },
    { icon: <EditOutlined />, label: '录入数据', path: '/subjects', primary: false },
    { icon: <QuestionCircleOutlined />, label: '查看质疑', path: '/queries', primary: false },
  ]

  // 项目表格列定义
  const projectColumns = [
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Project) => (
        <div>
          <div className={styles.projectName}>{text}</div>
          <div className={styles.projectMeta}>{record.centerCount}个中心 · {record.subjectCount}名受试者</div>
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const { text, bg } = getStatusColor(status)
        return (
          <Tag style={{ color: text, backgroundColor: bg, borderColor: text }}>
            {status}
          </Tag>
        )
      },
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      width: 120,
      render: (progress: number, record: Project) => (
        <div className={styles.projectProgress}>
          <Progress percent={Math.round(progress)} size="small" strokeColor="#5CB8A6" showInfo={false} />
          <div className={styles.projectProgressText}>{record.enrolledCount}/{record.targetCount}</div>
        </div>
      ),
    },
    {
      title: '质疑',
      dataIndex: 'queryCount',
      key: 'queryCount',
      width: 80,
      render: (count: number) => count > 0 ? <Badge count={count} style={{ backgroundColor: '#F39C12' }} /> : '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_: unknown, record: Project) => (
        <Button type="link" size="small" onClick={() => navigate(`/projects/${record.id}/subjects`)}>
          查看
        </Button>
      ),
    },
  ]

  // 获取通知图标 - 使用 CSS 变量颜色
  const getNotificationIcon = (type: string) => {
    const iconProps = { style: { fontSize: 16 } }
    switch (type) {
      case 'success':
        return <CheckCircleOutlined {...iconProps} style={{ color: '#27AE60' }} />
      case 'warning':
        return <ExclamationCircleOutlined {...iconProps} style={{ color: '#F39C12' }} />
      case 'error':
        return <ExclamationCircleOutlined {...iconProps} style={{ color: '#E74C3C' }} />
      default:
        return <InfoCircleOutlined {...iconProps} style={{ color: '#2196F3' }} />
    }
  }

  // 获取活动颜色 - 映射到 CSS 变量
  const getActivityColor = (type: string) => {
    switch (type) {
      case 'fill':
        return '#27AE60'
      case 'query':
        return '#F39C12'
      case 'enroll':
        return '#5CB8A6'
      case 'complete':
        return '#27AE60'
      default:
        return '#999999'
    }
  }

  return (
    <div>
      {/* 欢迎区 - PRD: 顶部欢迎语 + 日期 */}
      <section className={styles.welcomeSection} aria-label="欢迎信息">
        <Title level={3} className={styles.welcomeTitle}>
          欢迎回来，张医生
        </Title>
        <Text className={styles.welcomeSubtitle}>
          {getTodayString()}
        </Text>
      </section>

      {/* 快速操作区 - PRD: 高频功能一键直达 */}
      <Card className={styles.quickActionsCard} bodyStyle={{ padding: 20 }}>
        <div className={styles.quickActionsTitle}>快捷操作</div>
        <Space wrap>
          {quickActions.map((action, index) => (
            <Button
              key={index}
              type={action.primary ? 'primary' : 'default'}
              icon={action.icon}
              size="large"
              className={styles.actionButton}
              aria-label={action.label}
              onClick={() => action.path && navigate(action.path)}
            >
              {action.label}
            </Button>
          ))}
        </Space>
      </Card>

      {/* 项目概览统计卡片 - PRD: 4个核心指标 */}
      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card className={styles.statCard} hoverable onClick={() => navigate('/projects?status=进行中')}>
            <Statistic
              title="进行中"
              value={projectStats.inProgress}
              valueStyle={{ color: '#5CB8A6', fontSize: 32, fontWeight: 600 }}
              prefix={<TeamOutlined />}
            />
            <Button type="link" size="small" style={{ padding: 0 }}>查看</Button>
          </Card>
        </Col>
        <Col span={6}>
          <Card className={styles.statCard} hoverable onClick={() => navigate('/projects?status=审批中')}>
            <Statistic
              title="审核中"
              value={projectStats.inReview}
              valueStyle={{ color: '#2196F3', fontSize: 32, fontWeight: 600 }}
              prefix={<FileSearchOutlined />}
            />
            <Button type="link" size="small" style={{ padding: 0 }}>查看</Button>
          </Card>
        </Col>
        <Col span={6}>
          <Card className={styles.statCard} hoverable onClick={() => navigate('/projects?status=已锁库')}>
            <Statistic
              title="已锁库"
              value={projectStats.locked}
              valueStyle={{ color: '#27AE60', fontSize: 32, fontWeight: 600 }}
              prefix={<CheckCircleOutlined />}
            />
            <Button type="link" size="small" style={{ padding: 0 }}>查看</Button>
          </Card>
        </Col>
        <Col span={6}>
          <Card className={styles.statCard} hoverable onClick={() => navigate('/projects?status=待处理')}>
            <Statistic
              title="待处理"
              value={projectStats.pending}
              valueStyle={{ color: '#F39C12', fontSize: 32, fontWeight: 600 }}
              prefix={<InfoCircleOutlined />}
            />
            <Button type="link" size="small" style={{ padding: 0 }}>查看</Button>
          </Card>
        </Col>
      </Row>

      {/* 内容区 */}
      <Row gutter={24}>
        {/* 左侧 - 我的项目表格 - PRD */}
        <Col span={16}>
          <Card
            className={styles.projectListCard}
            title="我的项目"
            extra={
              <Button type="link" onClick={() => navigate('/projects')} icon={<RightOutlined />}>
                查看更多项目
              </Button>
            }
          >
            <Table
              dataSource={mockProjects.slice(0, 5)}
              columns={projectColumns}
              rowKey="id"
              rowClassName={getTableRowClassName}
              pagination={false}
              size="middle"
              className={styles.projectTable}
            />
          </Card>
        </Col>

        {/* 右侧 - 待办事项 + 最近活动 */}
        <Col span={8}>
          {/* 待办事项 - PRD */}
          <Card
            className={styles.todoCard}
            title="待办事项"
            extra={
              <Button type="link" size="small">查看全部</Button>
            }
          >
            <List
              dataSource={todoItems}
              renderItem={(item) => (
                <List.Item className={styles.todoItem}>
                  <div className={styles.todoItemContent}>
                    <span className={styles.todoItemIcon} style={{ color: item.color }}>
                      {item.icon}
                    </span>
                    <span className={styles.todoItemCount} style={{ color: item.color }}>
                      {item.count}
                    </span>
                    <span className={styles.todoItemLabel}>{item.label}</span>
                  </div>
                </List.Item>
              )}
            />
          </Card>

          {/* 最近活动 - PRD */}
          <Card
            className={styles.activityCard}
            title="最近活动"
            extra={
              <Button type="link" size="small">查看全部</Button>
            }
            style={{ marginTop: 24 }}
          >
            <Timeline
              items={activities.map((activity) => ({
                color: getActivityColor(activity.type),
                children: (
                  <div style={{ paddingBottom: 8 }}>
                    <div className={styles.activityContent}>
                      {activity.content}
                    </div>
                    <div className={styles.activityTime}>{activity.time}</div>
                  </div>
                ),
              }))}
            />
          </Card>

          {/* 通知公告 */}
          <Card
            className={styles.notificationCard}
            title={
              <Space>
                <BellOutlined />
                <span>通知公告</span>
              </Space>
            }
            extra={
              <Badge count={notifications.filter((n) => !n.read).length} size="small">
                <Button type="link" size="small">全部标记已读</Button>
              </Badge>
            }
            style={{ marginTop: 24 }}
          >
            <List
              dataSource={notifications.slice(0, 3)}
              renderItem={(notification) => (
                <List.Item
                  className={`${styles.notificationItem} ${
                    !notification.read ? styles.notificationItemUnread : ''
                  }`}
                >
                  <List.Item.Meta
                    avatar={
                      <div className={styles.notificationIconContainer}>
                        {getNotificationIcon(notification.type)}
                      </div>
                    }
                    title={
                      <span className={styles.notificationTitle}>
                        {notification.title}
                      </span>
                    }
                    description={
                      <span className={styles.notificationContent}>
                        {notification.content}
                      </span>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
