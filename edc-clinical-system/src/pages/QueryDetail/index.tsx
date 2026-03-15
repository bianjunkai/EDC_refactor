import { useParams, useNavigate } from 'react-router-dom'
import {
  Card,
  Row,
  Col,
  Button,
  Input,
  Timeline,
  Descriptions,
  Tag,
  Space,
  Typography,
  Alert,
} from 'antd'
import {
  ShareAltOutlined,
  PrinterOutlined,
  CloseCircleOutlined,
  EditOutlined,
  EyeOutlined,
  UndoOutlined,
} from '@ant-design/icons'
import { mockQueries } from '@/utils/mockData'
import StatusTag from '@/components/Common/StatusTag'
import PageHeader from '@/components/Common/PageHeader'

const { Text } = Typography
const { TextArea } = Input

export default function QueryDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const query = mockQueries.find((q) => q.id === id) || mockQueries[0]

  return (
    <div>
      {/* 页面标题 */}
      <PageHeader
        title={`质疑 #${query.id}`}
        back
        onBack={() => navigate('/queries')}
        actions={
          <Space>
            <Button icon={<ShareAltOutlined />} aria-label="转发质疑">转发</Button>
            <Button icon={<PrinterOutlined />} aria-label="打印质疑">打印</Button>
            <StatusTag status={query.status} />
          </Space>
        }
      />

      {/* 信息卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card size="small" style={{ borderRadius: 'var(--radius-md)' }}>
            <Text type="secondary">项目</Text>
            <div style={{ fontWeight: 500, marginTop: 4 }}>{query.projectName}</div>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" style={{ borderRadius: 'var(--radius-md)' }}>
            <Text type="secondary">受试者</Text>
            <div style={{ fontWeight: 500, marginTop: 4 }}>{query.subjectName}</div>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" style={{ borderRadius: 'var(--radius-md)' }}>
            <Text type="secondary">访视期</Text>
            <div style={{ fontWeight: 500, marginTop: 4 }}>治疗期访视2</div>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" style={{ borderRadius: 'var(--radius-md)' }}>
            <Text type="secondary">CRF</Text>
            <div style={{ fontWeight: 500, marginTop: 4 }}>{query.crfName}</div>
          </Card>
        </Col>
      </Row>

      {/* 主要内容 */}
      <Row gutter={24}>
        {/* 左侧 */}
        <Col span={14}>
          {/* 质疑内容 */}
          <Card title="质疑内容" style={{ marginBottom: 24, borderRadius: 'var(--radius-lg)' }}>
            <Alert
              message={query.content}
              type="warning"
              showIcon
              style={{ marginBottom: 16 }}
            />
            <Descriptions column={2} size="small">
              <Descriptions.Item label="字段">{query.fieldName}</Descriptions.Item>
              <Descriptions.Item label="发起人">{query.creator}</Descriptions.Item>
              <Descriptions.Item label="发起时间">{query.createdAt}</Descriptions.Item>
            </Descriptions>
          </Card>

          {/* 原始数据 */}
          <Card title="原始数据" style={{ borderRadius: 'var(--radius-lg)' }}>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="收缩压">160 mmHg</Descriptions.Item>
              <Descriptions.Item label="舒张压">95 mmHg</Descriptions.Item>
              <Descriptions.Item label="测量时间">2026-03-07 09:30</Descriptions.Item>
              <Descriptions.Item label="测量位置">右上臂</Descriptions.Item>
              <Descriptions.Item label="测量体位">坐位</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* 右侧 */}
        <Col span={10}>
          <Card title="回复记录" style={{ marginBottom: 24, borderRadius: 'var(--radius-lg)' }}>
            <Timeline
              items={
                query.replies?.map((reply) => ({
                  color: reply.type === 'reply' ? 'green' : 'blue',
                  children: (
                    <div>
                      <div style={{ marginBottom: 4 }}>
                        <Tag color={reply.type === 'reply' ? 'success' : 'processing'}>
                          {reply.type === 'reply' ? '回复' : '追问'}
                        </Tag>
                        <Text strong>{reply.creator}</Text>
                        <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                          {reply.createdAt}
                        </Text>
                      </div>
                      <div>{reply.content}</div>
                    </div>
                  ),
                })) || [
                  {
                    color: 'gray',
                    children: <Text type="secondary">暂无回复</Text>,
                  },
                ]
              }
            />
          </Card>

          {/* 回复框 */}
          <Card title="添加回复" style={{ borderRadius: 'var(--radius-lg)' }}>
            <TextArea rows={4} placeholder="请输入回复内容..." aria-label="回复内容" />
            <Space style={{ marginTop: 16, width: '100%', justifyContent: 'flex-end' }}>
              <Button aria-label="取消回复">取消</Button>
              <Button type="primary" aria-label="提交回复">提交回复</Button>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 底部操作栏 */}
      <Card style={{ marginTop: 24, borderRadius: 'var(--radius-lg)' }} bodyStyle={{ padding: 16 }}>
        <Row justify="center">
          <Space size="large">
            <Button type="primary" icon={<CloseCircleOutlined />} size="large" aria-label="关闭质疑">
              关闭质疑
            </Button>
            <Button icon={<EditOutlined />} size="large" aria-label="直接修改数据">
              直接修改数据
            </Button>
            <Button icon={<ShareAltOutlined />} size="large" aria-label="转发">
              转发
            </Button>
            <Button icon={<EyeOutlined />} size="large" aria-label="查看CRF">
              查看CRF
            </Button>
            <Button icon={<UndoOutlined />} size="large" aria-label="撤销质疑">
              撤销质疑
            </Button>
          </Space>
        </Row>
      </Card>
    </div>
  )
}
