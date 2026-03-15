import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Card,
  Button,
  Tabs,
  Tag,
  Row,
  Col,
  Statistic,
  Progress,
  Timeline,
  List,
  Table,
  Descriptions,
  Typography,
  Space,
  Badge,
  Avatar,
} from 'antd'
import {
  ArrowLeftOutlined,
  EditOutlined,
  MoreOutlined,
  TeamOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  QuestionCircleOutlined,
  BarChartOutlined,
  FileSearchOutlined,
} from '@ant-design/icons'
import { mockProjects, mockQueries, mockActivities } from '@/utils/mockData'
import { getStatusColor, getTableRowClassName } from '@/constants/theme'
import type { TabsProps } from 'antd'
import styles from './styles.module.css'

const { Title, Text } = Typography

// 标签页配置
const tabItems: TabsProps['items'] = [
  { key: 'overview', label: '概览', icon: <BarChartOutlined /> },
  { key: 'basic', label: '基本信息', icon: <FileTextOutlined /> },
  { key: 'workflow', label: '审核流程', icon: <ClockCircleOutlined /> },
  { key: 'members', label: '成员管理', icon: <TeamOutlined /> },
  { key: 'crf', label: 'CRF配置', icon: <FileTextOutlined /> },
  { key: 'groups', label: '试验分组', icon: <TeamOutlined /> },
  { key: 'data', label: '数据采集', icon: <FileTextOutlined /> },
  { key: 'export', label: '数据导出', icon: <FileSearchOutlined /> },
  { key: 'queries', label: '质疑管理', icon: <QuestionCircleOutlined /> },
  { key: 'audit', label: '稽查留痕', icon: <FileSearchOutlined /> },
  { key: 'reports', label: '统计报表', icon: <BarChartOutlined /> },
]

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')

  // 获取项目数据
  const project = useMemo(() => {
    return mockProjects.find(p => p.id === id)
  }, [id])

  // 获取项目相关的受试者
  // const projectSubjects = useMemo(() => {
  //   return mockSubjects.filter(s => s.id.startsWith('S')) // 模拟筛选
  // }, [id])

  // 获取项目相关的质疑
  const projectQueries = useMemo(() => {
    return mockQueries.filter(q => q.projectId === id)
  }, [id])

  // 获取项目活动
  const projectActivities = useMemo(() => {
    return mockActivities.filter(a => a.projectId === id).slice(0, 5)
  }, [id])

  if (!project) {
    return (
      <div className={styles.emptyState}>
        <Title level={4}>项目不存在</Title>
        <Button type="primary" onClick={() => navigate('/projects')}>
          返回项目列表
        </Button>
      </div>
    )
  }

  const { text, bg } = getStatusColor(project.status)

  // 渲染概览标签
  const renderOverview = () => (
    <>
      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card title="项目进度" className={styles.overviewCard}>
            <div className={styles.progressCircle}>
              <Progress
                type="circle"
                percent={Math.round(project.progress)}
                strokeColor="#5CB8A6"
                width={140}
                format={(percent) => (
                  <div className={styles.progressFormat}>
                    <div className={styles.progressPercent}>{percent}%</div>
                    <div className={styles.progressLabel}>入组进度</div>
                  </div>
                )}
              />
            </div>
            <div className={styles.progressMeta}>
              <Text>预计完成: 2026年8月</Text>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="关键指标" className={styles.overviewCard}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title="受试者"
                  value={`${project.enrolledCount}/${project.targetCount}`}
                  prefix={<TeamOutlined />}
                  valueStyle={{ color: '#5CB8A6' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="质疑"
                  value={`${projectQueries.filter(q => q.status === '待处理').length} (待处理${projectQueries.filter(q => q.status === '待处理').length})`}
                  prefix={<QuestionCircleOutlined />}
                  valueStyle={{ color: '#F39C12', fontSize: 18 }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="中心"
                  value={project.centerCount}
                  prefix={<TeamOutlined />}
                  valueStyle={{ color: '#2196F3' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="数据点"
                  value="1,234"
                  prefix={<FileTextOutlined />}
                  valueStyle={{ color: '#27AE60' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={16}>
          <Card title="入组趋势" className={styles.chartCard}>
            <div className={styles.chartPlaceholder}>
              <BarChartOutlined style={{ fontSize: 48, color: '#5CB8A6' }} />
              <Text type="secondary">入组趋势图（折线图：展示每月入组人数）</Text>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title="最近活动"
            className={styles.activityCard}
            extra={<Button type="link" size="small">查看全部</Button>}
          >
            <Timeline
              items={projectActivities.map((activity) => ({
                color: '#5CB8A6',
                children: (
                  <div style={{ paddingBottom: 8 }}>
                    <div className={styles.activityContent}>{activity.content}</div>
                    <div className={styles.activityTime}>{activity.time}</div>
                  </div>
                ),
              }))}
            />
            {projectActivities.length === 0 && (
              <Text type="secondary">暂无活动记录</Text>
            )}
          </Card>
        </Col>
      </Row>
    </>
  )

  // 渲染基本信息标签
  const renderBasicInfo = () => (
    <Card className={styles.infoCard}>
      <Descriptions title="项目信息" bordered column={2}>
        <Descriptions.Item label="项目编号">{project.id}</Descriptions.Item>
        <Descriptions.Item label="项目名称">{project.name}</Descriptions.Item>
        <Descriptions.Item label="项目描述" span={2}>{project.description}</Descriptions.Item>
        <Descriptions.Item label="项目状态">
          <Tag style={{ color: text, backgroundColor: bg }}>{project.status}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="项目负责人">{project.manager || '-'}</Descriptions.Item>
        <Descriptions.Item label="开始日期">{project.startDate || '-'}</Descriptions.Item>
        <Descriptions.Item label="结束日期">{project.endDate || '-'}</Descriptions.Item>
        <Descriptions.Item label="创建时间">{project.createdAt}</Descriptions.Item>
        <Descriptions.Item label="更新时间">{project.updatedAt}</Descriptions.Item>
      </Descriptions>
    </Card>
  )

  // 渲染审核流程标签
  const renderWorkflow = () => (
    <Card className={styles.workflowCard}>
      <Timeline
        mode="left"
        items={[
          {
            label: '2026-03-01 10:30',
            color: 'green',
            children: (
              <div>
                <div className={styles.workflowTitle}>提交审核</div>
                <div className={styles.workflowDesc}>张医生 提交了项目审核申请</div>
              </div>
            ),
          },
          {
            label: '2026-03-02 14:20',
            color: 'green',
            children: (
              <div>
                <div className={styles.workflowTitle}>一级审核通过</div>
                <div className={styles.workflowDesc}>李主任 审核通过</div>
              </div>
            ),
          },
          {
            label: '待审核',
            color: 'blue',
            children: (
              <div>
                <div className={styles.workflowTitle}>二级审核</div>
                <div className={styles.workflowDesc}>等待 王院长 审核</div>
              </div>
            ),
          },
          {
            label: '-',
            color: 'gray',
            children: (
              <div>
                <div className={styles.workflowTitle}>最终审核</div>
                <div className={styles.workflowDesc}>等待中</div>
              </div>
            ),
          },
        ]}
      />
    </Card>
  )

  // 渲染成员管理标签
  const renderMembers = () => (
    <Card className={styles.membersCard}>
      <Table
        dataSource={[
          { id: '1', name: '张医生', role: '项目负责人', department: '肿瘤科', center: '北京协和医院', status: '活跃' },
          { id: '2', name: '李医生', role: '研究者', department: '肿瘤科', center: '北京协和医院', status: '活跃' },
          { id: '3', name: '王护士', role: '研究护士', department: '肿瘤科', center: '北京协和医院', status: '活跃' },
        ]}
        columns={[
          { title: '姓名', dataIndex: 'name', key: 'name', render: (text: string) => (
            <Space><Avatar size="small">{text[0]}</Avatar>{text}</Space>
          )},
          { title: '角色', dataIndex: 'role', key: 'role' },
          { title: '科室', dataIndex: 'department', key: 'department' },
          { title: '中心', dataIndex: 'center', key: 'center' },
          { title: '状态', dataIndex: 'status', key: 'status', render: () => (
            <Badge status="success" text="活跃" />
          )},
        ]}
        rowKey="id"
        rowClassName={getTableRowClassName}
        pagination={false}
      />
    </Card>
  )

  // 渲染CRF配置标签
  const renderCRFConfig = () => (
    <Card className={styles.crfCard}>
      <List
        dataSource={[
          { name: '人口学资料', code: 'DM', fields: 5, status: '已发布' },
          { name: '既往病史', code: 'MH', fields: 8, status: '已发布' },
          { name: '体格检查', code: 'PE', fields: 12, status: '已发布' },
          { name: '实验室检查', code: 'LB', fields: 25, status: '编辑中' },
          { name: '不良事件', code: 'AE', fields: 10, status: '已发布' },
        ]}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button type="link" key="edit">编辑</Button>,
              <Button type="link" key="preview">预览</Button>,
            ]}
          >
            <List.Item.Meta
              title={<Space>{item.name} <Tag>{item.code}</Tag></Space>}
              description={`${item.fields}个字段 · 状态: ${item.status}`}
            />
          </List.Item>
        )}
      />
    </Card>
  )

  // 渲染质疑管理标签
  const renderQueries = () => (
    <Card className={styles.queryCard}>
      <Table
        dataSource={projectQueries}
        columns={[
          { title: '质疑编号', dataIndex: 'id', key: 'id' },
          { title: '受试者', dataIndex: 'subjectName', key: 'subjectName' },
          { title: 'CRF', dataIndex: 'crfName', key: 'crfName' },
          { title: '字段', dataIndex: 'fieldName', key: 'fieldName' },
          { title: '内容', dataIndex: 'content', key: 'content', ellipsis: true },
          { title: '状态', dataIndex: 'status', key: 'status', render: (status: string) => {
            const { text, bg } = getStatusColor(status)
            return <Tag style={{ color: text, backgroundColor: bg }}>{status}</Tag>
          }},
          { title: '发起人', dataIndex: 'creator', key: 'creator' },
          { title: '时间', dataIndex: 'createdAt', key: 'createdAt' },
        ]}
        rowKey="id"
        rowClassName={getTableRowClassName}
        pagination={{ pageSize: 5 }}
      />
    </Card>
  )

  return (
    <div className={styles.container}>
      {/* 头部 */}
      <div className={styles.header}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/projects')}>
            返回
          </Button>
          <div>
            <Title level={4} className={styles.title}>{project.name}</Title>
            <Space>
              <Tag style={{ color: text, backgroundColor: bg }}>{project.status}</Tag>
              <Text type="secondary">创建时间: {project.createdAt}</Text>
            </Space>
          </div>
        </Space>
        <Space>
          <Button icon={<EditOutlined />}>编辑</Button>
          <Button icon={<MoreOutlined />}>更多</Button>
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
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'basic' && renderBasicInfo()}
        {activeTab === 'workflow' && renderWorkflow()}
        {activeTab === 'members' && renderMembers()}
        {activeTab === 'crf' && renderCRFConfig()}
        {activeTab === 'groups' && (
          <Card><Text type="secondary">试验分组配置</Text></Card>
        )}
        {activeTab === 'data' && (
          <Card><Text type="secondary">数据采集监控</Text></Card>
        )}
        {activeTab === 'export' && (
          <Card><Text type="secondary">数据导出配置</Text></Card>
        )}
        {activeTab === 'queries' && renderQueries()}
        {activeTab === 'audit' && (
          <Card><Text type="secondary">稽查留痕记录</Text></Card>
        )}
        {activeTab === 'reports' && (
          <Card><Text type="secondary">统计报表</Text></Card>
        )}
      </div>
    </div>
  )
}
