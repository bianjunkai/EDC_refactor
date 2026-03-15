import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  Steps,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Space,
  Divider,
  message,
} from 'antd'
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckOutlined,
} from '@ant-design/icons'
import PageHeader from '@/components/Common/PageHeader'

const { Option } = Select
const { TextArea } = Input

// 表单数据类型
interface ProjectFormData {
  projectName?: string
  projectCode?: string
  description?: string
  sponsor?: string
  protocolNumber?: string
  studyType?: string
  phase?: string
  indication?: string
  startDate?: string
  endDate?: string
  visitPhases?: string[]
  visitCount?: number
  windowDays?: number
  visitConfig?: string
}

export default function ProjectWizard() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<ProjectFormData>({})
  const [form] = Form.useForm()

  // 表单提交
  const handleNext = async () => {
    try {
      const values = await form.validateFields()
      setFormData({ ...formData, ...values })

      if (currentStep < 3) {
        setCurrentStep(currentStep + 1)
      } else {
        // 最后一步：提交创建
        console.log('项目创建数据:', { ...formData, ...values })
        message.success('项目创建成功！')
        navigate('/projects')
      }
    } catch (error) {
      console.error('表单验证失败:', error)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const steps = [
    { title: '基本信息', description: '项目名称和描述' },
    { title: '项目方案', description: '研究方案详情' },
    { title: '访视计划', description: '访视期配置' },
    { title: '审核发布', description: '提交审核' },
  ]

  // 步骤内容
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Form form={form} layout="vertical" initialValues={formData}>
            <Form.Item
              name="projectName"
              label="项目名称"
              rules={[{ required: true, message: '请输入项目名称' }]}
            >
              <Input placeholder="请输入项目名称" />
            </Form.Item>
            <Form.Item
              name="projectCode"
              label="项目编号"
              rules={[{ required: true, message: '请输入项目编号' }]}
            >
              <Input placeholder="例如: PROJECT-2026-001" />
            </Form.Item>
            <Form.Item
              name="description"
              label="项目描述"
            >
              <TextArea rows={4} placeholder="请输入项目描述" />
            </Form.Item>
            <Form.Item
              name="sponsor"
              label="申办方"
            >
              <Input placeholder="请输入申办方名称" />
            </Form.Item>
          </Form>
        )
      case 1:
        return (
          <Form form={form} layout="vertical" initialValues={formData}>
            <Form.Item
              name="protocolNumber"
              label="方案编号"
            >
              <Input placeholder="请输入方案编号" />
            </Form.Item>
            <Form.Item
              name="studyType"
              label="研究类型"
            >
              <Select placeholder="请选择研究类型">
                <Option value="intervention">干预性研究</Option>
                <Option value="observational">观察性研究</Option>
                <Option value="expanded">拓展性研究</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="phase"
              label="研究阶段"
            >
              <Select placeholder="请选择研究阶段">
                <Option value="I">I期</Option>
                <Option value="II">II期</Option>
                <Option value="III">III期</Option>
                <Option value="IV">IV期</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="indication"
              label="适应症"
            >
              <Input placeholder="请输入适应症" />
            </Form.Item>
            <Form.Item
              name="startDate"
              label="计划开始日期"
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="endDate"
              label="计划结束日期"
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Form>
        )
      case 2:
        return (
          <Form form={form} layout="vertical" initialValues={formData}>
            <Form.Item
              name="visitPhases"
              label="访视期配置"
            >
              <Select mode="multiple" placeholder="请选择访视期">
                <Option value="screening">筛选期</Option>
                <Option value="treatment">治疗期</Option>
                <Option value="followup">随访期</Option>
                <Option value="closeout">结束访视</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="visitCount"
              label="预计访视次数"
            >
              <Input type="number" placeholder="请输入预计访视次数" />
            </Form.Item>
            <Form.Item
              name="windowDays"
              label="窗口期(天)"
            >
              <Input type="number" placeholder="请输入允许偏离天数" />
            </Form.Item>
            <Form.Item
              name="visitConfig"
              label="访视配置说明"
            >
              <TextArea rows={3} placeholder="请输入访视配置说明" />
            </Form.Item>
          </Form>
        )
      case 3:
        return (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <CheckOutlined style={{ fontSize: 48, color: 'var(--color-success)' }} />
              <h3>项目配置完成</h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                请确认以下信息后提交审核
              </p>
            </div>
            <Card style={{ marginBottom: 16 }}>
              <h4>基本信息</h4>
              <p>项目名称: {formData.projectName || '-'}</p>
              <p>项目编号: {formData.projectCode || '-'}</p>
              <p>申办方: {formData.sponsor || '-'}</p>
            </Card>
            <Card style={{ marginBottom: 16 }}>
              <h4>项目方案</h4>
              <p>研究类型: {formData.studyType === 'intervention' ? '干预性研究' : formData.studyType === 'observational' ? '观察性研究' : '拓展性研究'}</p>
              <p>研究阶段: {formData.phase}期</p>
              <p>适应症: {formData.indication || '-'}</p>
            </Card>
            <Card>
              <h4>访视计划</h4>
              <p>访视期: {Array.isArray(formData.visitPhases) ? formData.visitPhases.join(', ') : '-'}</p>
              <p>预计访视次数: {formData.visitCount || '-'}</p>
              <p>窗口期: {formData.windowDays || '-'}天</p>
            </Card>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div>
      <PageHeader
        title="新建项目"
        subtitle="分步配置创建临床试验项目"
      />

      <Card style={{ borderRadius: 12 }}>
        <Steps
          current={currentStep}
          items={steps}
          style={{ marginBottom: 32 }}
        />

        <div style={{ minHeight: 300 }}>
          {renderStepContent()}
        </div>

        <Divider />

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            onClick={() => navigate('/projects')}
            icon={<ArrowLeftOutlined />}
          >
            取消
          </Button>
          <Space>
            {currentStep > 0 && (
              <Button onClick={handlePrev}>
                上一步
              </Button>
            )}
            <Button type="primary" onClick={handleNext}>
              {currentStep === 3 ? '提交审核' : '下一步'}
              {currentStep < 3 && <ArrowRightOutlined />}
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  )
}
