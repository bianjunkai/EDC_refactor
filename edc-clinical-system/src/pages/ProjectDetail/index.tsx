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
  Dropdown,
  message,
} from 'antd'
import {
  ArrowLeftOutlined,
  EditOutlined,
  MoreOutlined,
  TeamOutlined,
  FileTextOutlined,
  QuestionCircleOutlined,
  BarChartOutlined,
  FileSearchOutlined,
  UserOutlined,
  CalendarOutlined,
  SettingOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { mockProjects, mockQueries, mockActivities } from '@/utils/mockData'
import { getStatusColor, getTableRowClassName } from '@/constants/theme'
import type { TabsProps } from 'antd'
import styles from './styles.module.css'

const { Title, Text } = Typography

// 标签页配置 - 简化为6个
const tabItems: TabsProps['items'] = [
  { key: 'overview', label: '概览', icon: <BarChartOutlined /> },
  { key: 'subjects', label: '受试者', icon: <UserOutlined /> },
  { key: 'crf', label: 'CRF配置', icon: <FileTextOutlined /> },
  { key: 'visit', label: '访视计划', icon: <CalendarOutlined /> },
  { key: 'data', label: '数据管理', icon: <FileSearchOutlined /> },
  { key: 'settings', label: '项目设置', icon: <SettingOutlined /> },
]

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [settingsTab, setSettingsTab] = useState('basic')

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
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/crf-designer')}>新建CRF</Button>
          <Button icon={<FileTextOutlined />} onClick={() => navigate(`/projects/${id}/visit-crf-matrix`)}>
            配置访视矩阵
          </Button>
        </Space>
      </div>
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
              <Button type="link" key="edit" onClick={() => navigate('/crf-designer')}>编辑</Button>,
              <Button type="link" key="preview" onClick={() => message.info('预览功能')}>预览</Button>,
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

  // 渲染受试者标签
  const renderSubjects = () => {
    const subjects = [
      { id: 'S001', code: 'Subject-001', name: '张三', status: '在研', enrollmentDate: '2026-01-15', lastVisit: '2026-03-10', center: '北京协和医院' },
      { id: 'S002', code: 'Subject-002', name: '李四', status: '在研', enrollmentDate: '2026-01-20', lastVisit: '2026-03-08', center: '北京协和医院' },
      { id: 'S003', code: 'Subject-003', name: '王五', status: '已完成', enrollmentDate: '2026-01-10', lastVisit: '2026-03-01', center: '上海华山医院' },
    ]
    const columns = [
      { title: '受试者编号', dataIndex: 'code', key: 'code' },
      { title: '姓名', dataIndex: 'name', key: 'name' },
      { title: '状态', dataIndex: 'status', key: 'status', render: (status: string) => (
        <Tag color={status === '在研' ? 'green' : 'blue'}>{status}</Tag>
      )},
      { title: '入组日期', dataIndex: 'enrollmentDate', key: 'enrollmentDate' },
      { title: '最近访视', dataIndex: 'lastVisit', key: 'lastVisit' },
      { title: '中心', dataIndex: 'center', key: 'center' },
      {
        title: '操作',
        key: 'action',
        render: (_: any, record: any) => (
          <Space>
            <Button type="link" onClick={() => navigate(`/projects/${id}/subjects/${record.id}`)}>查看</Button>
            <Button type="link" onClick={() => navigate(`/projects/${id}/subjects/${record.id}/crf/1`)}>填写CRF</Button>
          </Space>
        ),
      },
    ]
    return (
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <Button type="primary" onClick={() => navigate(`/projects/${id}/subjects`)}>添加受试者</Button>
            <Button>导入受试者</Button>
          </Space>
          <Space>
            <Button onClick={() => navigate(`/projects/${id}/subjects`)}>查看全部</Button>
          </Space>
        </div>
        <Table
          dataSource={subjects}
          columns={columns}
          rowKey="id"
          rowClassName={getTableRowClassName}
          pagination={{ pageSize: 5 }}
        />
      </Card>
    )
  }

  // 渲染访视计划标签
  const renderVisitPlan = () => {
    const visits = [
      { id: 'V1', name: '筛选期', day: 'Day -14 ~ -1', window: '±3天', status: '已完成' },
      { id: 'V2', name: '基线期', day: 'Day 0', window: '±1天', status: '进行中' },
      { id: 'V3', name: '治疗期1', day: 'Day 14', window: '±2天', status: '待进行' },
      { id: 'V4', name: '治疗期2', day: 'Day 28', window: '±3天', status: '待进行' },
      { id: 'V5', name: '治疗期3', day: 'Day 42', window: '±3天', status: '待进行' },
      { id: 'V6', name: '随访期', day: 'Day 56', window: '±7天', status: '待进行' },
    ]
    return (
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={() => navigate(`/projects/${id}/visit-crf-matrix`)}>配置访视-CRF矩阵</Button>
        </div>
        <Table
          dataSource={visits}
          columns={[
            { title: '访视编号', dataIndex: 'id', key: 'id' },
            { title: '访视名称', dataIndex: 'name', key: 'name' },
            { title: '计划时间', dataIndex: 'day', key: 'day' },
            { title: '窗口期', dataIndex: 'window', key: 'window' },
            { title: '状态', dataIndex: 'status', key: 'status', render: (status: string) => {
              const colorMap: Record<string, string> = {
                '已完成': 'green',
                '进行中': 'blue',
                '待进行': 'default',
              }
              return <Tag color={colorMap[status]}>{status}</Tag>
            }},
            {
              title: '操作',
              key: 'action',
              render: () => (
                <Button type="link">编辑</Button>
              ),
            },
          ]}
          rowKey="id"
          rowClassName={getTableRowClassName}
          pagination={false}
        />
      </Card>
    )
  }

  // 渲染数据管理标签（合并数据采集、导出、质疑、稽查）
  const renderDataManagement = () => (
    <>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="已填写CRF"
              value={45}
              suffix="/ 60"
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#5CB8A6' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="待处理质疑"
              value={projectQueries.filter(q => q.status === '待处理').length}
              prefix={<QuestionCircleOutlined />}
              valueStyle={{ color: '#F39C12' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已完成SDV"
              value={30}
              suffix="/ 45"
              prefix={<FileSearchOutlined />}
              valueStyle={{ color: '#2196F3' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="数据质控"
              value={98}
              suffix="%"
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#27AE60' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="质疑管理" style={{ marginBottom: 16 }}>
        <Table
          dataSource={projectQueries.slice(0, 5)}
          columns={[
            { title: '质疑编号', dataIndex: 'id', key: 'id', render: (id: string) => `#${id}` },
            { title: '受试者', dataIndex: 'subjectName', key: 'subjectName' },
            { title: 'CRF', dataIndex: 'crfName', key: 'crfName' },
            { title: '内容', dataIndex: 'content', key: 'content', ellipsis: true },
            { title: '状态', dataIndex: 'status', key: 'status', render: (status: string) => {
              const { text, bg } = getStatusColor(status)
              return <Tag style={{ color: text, backgroundColor: bg }}>{status}</Tag>
            }},
            {
              title: '操作',
              key: 'action',
              render: () => <Button type="link" onClick={() => navigate(`/queries/1`)}>处理</Button>,
            },
          ]}
          rowKey="id"
          rowClassName={getTableRowClassName}
          pagination={false}
        />
      </Card>

      <Card title="数据导出">
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Text>支持按项目、受试者、访视、CRF等条件导出数据</Text>
          </div>
          <div>
            <Button type="primary" icon={<FileSearchOutlined />} onClick={() => navigate('/export')}>
              前往数据导出
            </Button>
          </div>
        </Space>
      </Card>
    </>
  )

  // 渲染项目设置标签（合并基本信息、审核流程、成员管理、试验分组）
  const renderProjectSettings = () => {
    const settingsTabItems = [
      { key: 'basic', label: '基本信息' },
      { key: 'members', label: '成员管理' },
      { key: 'workflow', label: '审核流程' },
      { key: 'groups', label: '试验分组' },
    ]

    return (
      <Card>
        <Tabs
          activeKey={settingsTab}
          onChange={setSettingsTab}
          items={settingsTabItems}
        />
        {settingsTab === 'basic' && renderBasicInfo()}
        {settingsTab === 'members' && renderMembers()}
        {settingsTab === 'workflow' && renderWorkflow()}
        {settingsTab === 'groups' && (
          <Card><Text type="secondary">试验分组配置 - 设置随机化分组规则</Text></Card>
        )}
      </Card>
    )
  }

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
          <Button icon={<EditOutlined />} onClick={() => message.info('编辑项目功能')}>编辑</Button>
          <Dropdown
            menu={{
              items: [
                { key: 'export', label: '导出项目数据' },
                { key: 'archive', label: '归档项目' },
                { key: 'delete', label: '删除项目', danger: true },
              ],
              onClick: ({ key }) => {
                switch (key) {
                  case 'export':
                    message.success('开始导出项目数据')
                    break
                  case 'archive':
                    message.info('归档项目功能')
                    break
                  case 'delete':
                    message.warning('删除项目需要确认')
                    break
                }
              },
            }}
            placement="bottomRight"
          >
            <Button icon={<MoreOutlined />}>更多</Button>
          </Dropdown>
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
        {activeTab === 'subjects' && renderSubjects()}
        {activeTab === 'crf' && renderCRFConfig()}
        {activeTab === 'visit' && renderVisitPlan()}
        {activeTab === 'data' && renderDataManagement()}
        {activeTab === 'settings' && renderProjectSettings()}
      </div>
    </div>
  )
}
