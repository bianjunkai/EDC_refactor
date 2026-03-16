import { useState, memo, useCallback } from 'react'
import {
  Layout,
  Menu,
  Form,
  Input,
  Select,
  Radio,
  Checkbox,
  DatePicker,
  Button,
  Progress,
  Card,
  Space,
  Typography,
  Alert,
  Badge,
  Timeline,
  Row,
  Col,
  Affix,
  Divider,
  Descriptions,
  Drawer,
  Table,
} from 'antd'
import {
  SaveOutlined,
  CheckCircleOutlined,
  QuestionCircleOutlined,
  HistoryOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  FileTextOutlined,
  MedicineBoxOutlined,
  ScanOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import OCRImport from '@/components/OCRImport'

const { Sider, Content } = Layout
const { Text } = Typography
const { Option } = Select
const { TextArea } = Input

// 访视菜单项
const visitMenuItems: MenuProps['items'] = [
  {
    key: 'visit-1',
    icon: <MedicineBoxOutlined />,
    label: '筛选期访视1',
    children: [
      { key: 'crf-1', label: '人口学资料', icon: <FileTextOutlined /> },
      { key: 'crf-2', label: '既往病史', icon: <FileTextOutlined /> },
    ],
  },
  {
    key: 'visit-2',
    icon: <MedicineBoxOutlined />,
    label: '筛选期访视2',
    children: [
      { key: 'crf-3', label: '体格检查', icon: <FileTextOutlined /> },
      { key: 'crf-4', label: '实验室检查', icon: <FileTextOutlined /> },
    ],
  },
  {
    key: 'visit-3',
    icon: <MedicineBoxOutlined />,
    label: '治疗期访视1',
    children: [
      { key: 'crf-5', label: '生命体征', icon: <FileTextOutlined /> },
      { key: 'crf-6', label: '不良事件', icon: <FileTextOutlined /> },
    ],
  },
]

// 质疑列表
const queries = [
  { id: 1, content: '血压值超出正常范围', status: 'open' },
  { id: 2, content: '日期格式不正确', status: 'resolved' },
]

// 字段修改历史记录
const modificationHistory = [
  { id: 1, field: '姓名缩写', oldValue: 'ZL', newValue: 'ZS', modifier: '张医生', modifyDate: '2026-03-15 10:30:00', reason: '录入错误' },
  { id: 2, field: '性别', oldValue: '男', newValue: '男', modifier: '李护士', modifyDate: '2026-03-14 14:20:00', reason: '信息核实' },
  { id: 3, field: '收缩压(mmHg)', oldValue: '120', newValue: '125', modifier: '张医生', modifyDate: '2026-03-13 09:15:00', reason: '复测更新' },
  { id: 4, field: '既往病史描述', oldValue: '', newValue: '高血压病史5年', modifier: '张医生', modifyDate: '2026-03-12 16:45:00', reason: '补充信息' },
]

// 记忆化的表单字段组件
const FormFields = memo(function FormFields() {
  return (
    <>
      <Card title="基本信息" style={{ marginBottom: 24 }}>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="姓名缩写"
              name="nameAbbr"
              rules={[{ required: true, message: '请输入姓名缩写' }]}
            >
              <Input placeholder="请输入姓名缩写" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="性别"
              name="gender"
              rules={[{ required: true, message: '请选择性别' }]}
            >
              <Radio.Group>
                <Radio value="male">男</Radio>
                <Radio value="female">女</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="出生日期"
              name="birthDate"
              rules={[{ required: true, message: '请选择出生日期' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="民族" name="ethnicity">
              <Select placeholder="请选择民族">
                <Option value="han">汉族</Option>
                <Option value="manchu">满族</Option>
                <Option value="hui">回族</Option>
                <Option value="other">其他</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Card title="体格检查" style={{ marginBottom: 24 }}>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="身高(cm)" name="height">
              <Input type="number" placeholder="请输入身高" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="体重(kg)" name="weight">
              <Input type="number" placeholder="请输入体重" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="BMI" name="bmi">
              <Input disabled placeholder="自动计算" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="收缩压(mmHg)"
              name="systolicBP"
              rules={[{ required: true, message: '请输入收缩压' }]}
            >
              <Input type="number" placeholder="请输入收缩压" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="舒张压(mmHg)"
              name="diastolicBP"
              rules={[{ required: true, message: '请输入舒张压' }]}
            >
              <Input type="number" placeholder="请输入舒张压" />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Card title="既往病史">
        <Form.Item label="是否有既往病史" name="hasMedicalHistory">
          <Radio.Group>
            <Radio value={true}>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="既往病史描述" name="medicalHistoryDesc">
          <TextArea rows={4} placeholder="请详细描述既往病史" />
        </Form.Item>

        <Form.Item label="既往用药史" name="medicationHistory">
          <Checkbox.Group>
            <Space direction="vertical">
              <Checkbox value="hypertension">降压药</Checkbox>
              <Checkbox value="diabetes">降糖药</Checkbox>
              <Checkbox value="cardiac">心血管药物</Checkbox>
              <Checkbox value="other">其他</Checkbox>
            </Space>
          </Checkbox.Group>
        </Form.Item>
      </Card>
    </>
  )
})

export default function CRFForm() {
  const [form] = Form.useForm()
  const [saveStatus, setSaveStatus] = useState('saved')
  const [validationStatus] = useState('valid')
  const [selectedCRF, setSelectedCRF] = useState('crf-1')
  const [ocrVisible, setOcrVisible] = useState(false)
  const [historyVisible, setHistoryVisible] = useState(false)

  // 修改历史表格列
  const historyColumns = [
    {
      title: '字段',
      dataIndex: 'field',
      key: 'field',
      width: 120,
    },
    {
      title: '原值',
      dataIndex: 'oldValue',
      key: 'oldValue',
      render: (val: string) => val || '-',
    },
    {
      title: '新值',
      dataIndex: 'newValue',
      key: 'newValue',
      render: (val: string) => val || '-',
    },
    {
      title: '修改人',
      dataIndex: 'modifier',
      key: 'modifier',
      width: 80,
    },
    {
      title: '修改时间',
      dataIndex: 'modifyDate',
      key: 'modifyDate',
      width: 150,
    },
    {
      title: '修改原因',
      dataIndex: 'reason',
      key: 'reason',
      ellipsis: true,
    },
  ]

  // 处理保存 - 使用 useCallback 避免重复创建
  const handleSave = useCallback(() => {
    setSaveStatus('saving')
    setTimeout(() => setSaveStatus('saved'), 1000)
  }, [])

  // 菜单点击处理
  const handleMenuClick = useCallback((e: { key: string }) => {
    setSelectedCRF(e.key)
  }, [])

  return (
    <div>
      {/* 面包屑 */}
      <div style={{ marginBottom: 16, color: '#6b7280', fontSize: 14 }}>
        项目管理 {'>'} 项目 {'>'} 受试者管理 {'>'} 张三 {'>'} 筛选期 {'>'} 人口学资料
      </div>

      <Layout style={{ background: '#fff', minHeight: 600 }}>
        {/* 左侧访视导航 */}
        <Sider width={240} style={{ background: '#fff', borderRight: '1px solid #e5e7eb' }}>
          <div style={{ padding: '16px', fontWeight: 600, borderBottom: '1px solid #e5e7eb' }}>
            访视计划
          </div>
          <Menu
            mode="inline"
            selectedKeys={[selectedCRF]}
            defaultOpenKeys={['visit-1']}
            items={visitMenuItems}
            onClick={handleMenuClick}
          />
        </Sider>

        {/* 中间表单区域 */}
        <Content style={{ padding: 24, background: '#f5f7fa' }}>
          <Card
            title={
              <Space>
                <span>人口学资料</span>
                <Badge status="processing" text="进行中" />
              </Space>
            }
            extra={
              <Space>
                <Text type="secondary">表单编号: DM-001</Text>
                <Text type="secondary">版本: V1.0</Text>
              </Space>
            }
            style={{ maxWidth: 900, margin: '0 auto' }}
          >
            <Form form={form} layout="vertical" onValuesChange={handleSave}>
              <FormFields />
            </Form>
          </Card>

          {/* 底部操作栏 */}
          <Affix offsetBottom={0}>
            <Card
              style={{
                marginTop: 24,
                marginBottom: 0,
                borderTop: '1px solid #e5e7eb',
                background: '#fff',
              }}
              bodyStyle={{ padding: '12px 24px' }}
            >
              <Row justify="space-between" align="middle">
                <Col>
                  <Space>
                    <Text type="secondary">
                      <SaveOutlined />{' '}
                      {saveStatus === 'saved' ? '已自动保存' : '保存中...'}
                    </Text>
                    <Divider type="vertical" />
                    {validationStatus === 'valid' ? (
                      <Text type="success">
                        <CheckCircleOutlined /> 数据校验通过
                      </Text>
                    ) : (
                      <Text type="warning">
                        <Alert type="warning" message="有必填项未填写" />
                      </Text>
                    )}
                  </Space>
                </Col>
                <Col>
                  <Space>
                    <Button icon={<ScanOutlined />} onClick={() => setOcrVisible(true)}>
                      OCR识别导入
                    </Button>
                    <Button icon={<QuestionCircleOutlined />}>发起质疑</Button>
                    <Button icon={<HistoryOutlined />} onClick={() => setHistoryVisible(true)}>填写记录</Button>
                    <Button icon={<ArrowLeftOutlined />}>上一条</Button>
                    <Button type="primary" icon={<ArrowRightOutlined />}>
                      下一条
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Card>
          </Affix>
        </Content>

        {/* 右侧信息栏 */}
        <Sider width={280} style={{ background: '#fff', borderLeft: '1px solid #e5e7eb', padding: 16 }}>
          {/* 受试者信息 */}
          <Card size="small" title="受试者信息" style={{ marginBottom: 16 }}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="筛选号">SCR-2026-001</Descriptions.Item>
              <Descriptions.Item label="随机号">RND-001</Descriptions.Item>
              <Descriptions.Item label="性别">男</Descriptions.Item>
              <Descriptions.Item label="年龄">45岁</Descriptions.Item>
              <Descriptions.Item label="中心">北京协和医院</Descriptions.Item>
            </Descriptions>
          </Card>

          {/* 填写进度 */}
          <Card size="small" title="填写进度" style={{ marginBottom: 16 }}>
            <Progress percent={65} strokeColor="#27AE60" />
            <Timeline
              style={{ marginTop: 16 }}
              items={[
                { color: 'green', children: '人口学资料' },
                { color: 'green', children: '既往病史' },
                { color: 'blue', children: '体格检查' },
                { color: 'gray', children: '实验室检查' },
              ]}
            />
          </Card>

          {/* 质疑列表 */}
          <Card size="small" title="质疑列表">
            {queries.map((query) => (
              <Alert
                key={query.id}
                message={query.content}
                type={query.status === 'resolved' ? 'success' : 'warning'}
                showIcon
                style={{ marginBottom: 8 }}
              />
            ))}
          </Card>
        </Sider>
      </Layout>

      {/* OCR导入弹窗 */}
      <OCRImport
        visible={ocrVisible}
        onCancel={() => setOcrVisible(false)}
        onApply={(data) => {
          console.log('OCR识别结果:', data)
          setOcrVisible(false)
        }}
      />

      {/* 填写记录抽屉 */}
      <Drawer
        title="填写记录"
        width={700}
        open={historyVisible}
        onClose={() => setHistoryVisible(false)}
      >
        <div style={{ marginBottom: 16 }}>
          <Alert
            message="以下显示该CRF所有字段的修改历史记录"
            type="info"
            showIcon
          />
        </div>
        <Table
          columns={historyColumns}
          dataSource={modificationHistory}
          rowKey="id"
          pagination={false}
          size="small"
        />
      </Drawer>
    </div>
  )
}
