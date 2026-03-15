import { useState } from 'react'
import {
  Layout,
  Button,
  Input,
  Select,
  Switch,
  Modal,
  Card,
  Space,
  Tabs,
  Form,
  Collapse,
  Tag,
  Row,
  Col,
  Empty,
  Tooltip,
  Popconfirm,
  Divider,
  Radio,
  Checkbox as AntCheckbox,
  DatePicker,
  Upload,
  message,
} from 'antd'
import {
  SaveOutlined,
  EyeOutlined,
  UploadOutlined,
  PlusOutlined,
  CopyOutlined,
  FormOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  NumberOutlined,
  StarOutlined,
  TableOutlined,
  UploadOutlined as UploadIcon,
  DownOutlined,
  DeleteOutlined,
  DragOutlined,
  SettingOutlined,
  MedicineBoxOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { mockCRFTemplates } from '@/utils/mockData'
import PageHeader from '@/components/Common/PageHeader'
import type { CRFField, FieldType, CRFSection } from '@/types'
import styles from './styles.module.css'

const { Sider, Content } = Layout
const { Option } = Select
const { Panel } = Collapse
const { TextArea } = Input

// 控件类型定义
const controlTypes: { type: FieldType; label: string; icon: React.ReactNode; description: string }[] = [
  { type: 'input', label: '单行文本', icon: <FormOutlined />, description: '短文本输入' },
  { type: 'textarea', label: '多行文本', icon: <FileTextOutlined />, description: '长文本输入' },
  { type: 'inputUnit', label: '带单位数值', icon: <NumberOutlined />, description: '数值+单位' },
  { type: 'date', label: '日期', icon: <CalendarOutlined />, description: '日期选择器' },
  { type: 'datetime', label: '日期时间', icon: <CalendarOutlined />, description: '日期时间选择' },
  { type: 'radio', label: '单选', icon: <CheckCircleOutlined />, description: '单选按钮组' },
  { type: 'select', label: '下拉', icon: <DownOutlined />, description: '下拉选择' },
  { type: 'checkbox', label: '多选', icon: <CheckCircleOutlined />, description: '多选框' },
  { type: 'rate', label: '评分', icon: <StarOutlined />, description: '星级评分' },
  { type: 'table', label: '表格', icon: <TableOutlined />, description: '动态表格' },
  { type: 'upload', label: '上传', icon: <UploadIcon />, description: '文件上传' },
]

// 生成唯一ID
const generateId = () => `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

// 默认字段配置
const createDefaultField = (type: FieldType): CRFField => ({
  id: generateId(),
  name: `field_${type}`,
  label: '新字段',
  type,
  required: false,
  placeholder: '请输入',
})

// CRF列表数据
interface CRFItem {
  id: string
  name: string
  code: string
  status: '已发布' | '编辑中' | '草稿'
  updateDate: string
}

const mockCRFList: CRFItem[] = [
  { id: '1', name: '人口学资料', code: 'DM', status: '已发布', updateDate: '2026-03-10' },
  { id: '2', name: '既往病史', code: 'MH', status: '已发布', updateDate: '2026-03-10' },
  { id: '3', name: '体格检查', code: 'PE', status: '编辑中', updateDate: '2026-03-12' },
  { id: '4', name: '实验室检查', code: 'LB', status: '草稿', updateDate: '2026-03-11' },
  { id: '5', name: '不良事件', code: 'AE', status: '已发布', updateDate: '2026-03-09' },
]

export default function CRFDesigner() {
  const navigate = useNavigate()
  const [templateModalVisible, setTemplateModalVisible] = useState(false)
  const [activeTab, setActiveTab] = useState('crflist')
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [activeSectionId, setActiveSectionId] = useState<string>('section-1')

  // CRF表单数据
  const [formName, setFormName] = useState('人口学资料')
  const [formCode] = useState('DM')
  const [sections, setSections] = useState<CRFSection[]>([
    {
      id: 'section-1',
      name: '基本信息',
      order: 1,
      fields: [
        { id: 'f1', name: 'subject_id', label: '受试者编号', type: 'input', required: true, placeholder: '请输入筛选号' },
        { id: 'f2', name: 'gender', label: '性别', type: 'radio', required: true, options: [{ label: '男', value: 'male' }, { label: '女', value: 'female' }] },
        { id: 'f3', name: 'birth_date', label: '出生日期', type: 'date', required: true },
        { id: 'f4', name: 'age', label: '年龄', type: 'inputUnit', required: true, placeholder: '请输入年龄', options: [{ label: '岁', value: 'year' }] },
      ],
    },
    {
      id: 'section-2',
      name: '联系信息',
      order: 2,
      fields: [
        { id: 'f5', name: 'phone', label: '联系电话', type: 'input', required: false, placeholder: '请输入手机号' },
        { id: 'f6', name: 'address', label: '住址', type: 'textarea', required: false, placeholder: '请输入详细地址' },
      ],
    },
  ])

  const selectedField = selectedFieldId
    ? sections.flatMap(s => s.fields).find(f => f.id === selectedFieldId)
    : null

  const activeSection = sections.find(s => s.id === activeSectionId) || sections[0]

  // 添加字段到当前分节
  const addField = (type: FieldType) => {
    const newField = createDefaultField(type)
    setSections(prev => prev.map(section =>
      section.id === activeSectionId
        ? { ...section, fields: [...section.fields, newField] }
        : section
    ))
    setSelectedFieldId(newField.id)
    message.success(`已添加${controlTypes.find(c => c.type === type)?.label}`)
  }

  // 删除字段
  const deleteField = (fieldId: string) => {
    setSections(prev => prev.map(section => ({
      ...section,
      fields: section.fields.filter(f => f.id !== fieldId)
    })))
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(null)
    }
  }

  // 更新字段属性
  const updateField = (fieldId: string, updates: Partial<CRFField>) => {
    setSections(prev => prev.map(section => ({
      ...section,
      fields: section.fields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      )
    })))
  }

  // 添加分节
  const addSection = () => {
    const newSection: CRFSection = {
      id: `section-${Date.now()}`,
      name: `分节${sections.length + 1}`,
      order: sections.length + 1,
      fields: [],
    }
    setSections([...sections, newSection])
    setActiveSectionId(newSection.id)
  }

  // 删除分节
  const deleteSection = (sectionId: string) => {
    if (sections.length <= 1) {
      message.warning('至少保留一个分节')
      return
    }
    setSections(prev => prev.filter(s => s.id !== sectionId))
    if (activeSectionId === sectionId) {
      setActiveSectionId(sections[0].id)
    }
  }

  // 渲染字段预览
  const renderFieldPreview = (field: CRFField) => {
    const isSelected = selectedFieldId === field.id

    return (
      <div
        key={field.id}
        className={`${styles.fieldItem} ${isSelected ? styles.fieldItemSelected : ''}`}
        onClick={() => setSelectedFieldId(field.id)}
      >
        <div className={styles.fieldHeader}>
          <DragOutlined className={styles.dragIcon} />
          <span className={styles.fieldLabel}>
            {field.label}
            {field.required && <span className={styles.requiredMark}>*</span>}
          </span>
          <Popconfirm
            title="确认删除此字段？"
            onConfirm={(e) => { e?.stopPropagation(); deleteField(field.id) }}
            okText="删除"
            cancelText="取消"
          >
            <Button
              type="text"
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={(e) => e.stopPropagation()}
            />
          </Popconfirm>
        </div>
        <div className={styles.fieldPreview} onClick={(e) => e.stopPropagation()}>
          {field.type === 'input' && <Input placeholder={field.placeholder} disabled />}
          {field.type === 'textarea' && <TextArea placeholder={field.placeholder} rows={2} disabled />}
          {field.type === 'inputUnit' && (
            <Input
              placeholder={field.placeholder}
              suffix={field.options?.[0]?.label}
              disabled
            />
          )}
          {field.type === 'date' && <DatePicker disabled style={{ width: '100%' }} />}
          {field.type === 'radio' && (
            <Radio.Group disabled>
              {field.options?.map((opt, i) => (
                <Radio key={i} value={opt.value}>{opt.label}</Radio>
              )) || <Radio value="1">选项1</Radio>}
            </Radio.Group>
          )}
          {field.type === 'select' && (
            <Select disabled style={{ width: '100%' }} placeholder="请选择">
              {field.options?.map((opt, i) => (
                <Option key={i} value={opt.value}>{opt.label}</Option>
              )) || <Option value="1">选项1</Option>}
            </Select>
          )}
          {field.type === 'checkbox' && (
            <AntCheckbox.Group disabled>
              {field.options?.map((opt, i) => (
                <AntCheckbox key={i} value={opt.value}>{opt.label}</AntCheckbox>
              )) || <AntCheckbox value="1">选项1</AntCheckbox>}
            </AntCheckbox.Group>
          )}
          {field.type === 'upload' && (
            <Upload disabled>
              <Button disabled icon={<UploadIcon />}>上传文件</Button>
            </Upload>
          )}
        </div>
      </div>
    )
  }

  // 渲染控件面板
  const renderControlPanel = () => (
    <div className={styles.controlPanel}>
      <Collapse defaultActiveKey={['basic', 'date', 'select', 'advanced']} ghost>
        <Panel header="基础控件" key="basic">
          <Row gutter={[8, 8]}>
            {controlTypes.slice(0, 3).map((control) => (
              <Col span={12} key={control.type}>
                <Tooltip title={control.description}>
                  <Card
                    hoverable
                    size="small"
                    className={styles.controlCard}
                    onClick={() => addField(control.type)}
                  >
                    <div className={styles.controlIcon}>{control.icon}</div>
                    <div className={styles.controlLabel}>{control.label}</div>
                  </Card>
                </Tooltip>
              </Col>
            ))}
          </Row>
        </Panel>

        <Panel header="日期控件" key="date">
          <Row gutter={[8, 8]}>
            {controlTypes.slice(3, 6).map((control) => (
              <Col span={12} key={control.type}>
                <Tooltip title={control.description}>
                  <Card
                    hoverable
                    size="small"
                    className={styles.controlCard}
                    onClick={() => addField(control.type)}
                  >
                    <div className={styles.controlIcon}>{control.icon}</div>
                    <div className={styles.controlLabel}>{control.label}</div>
                  </Card>
                </Tooltip>
              </Col>
            ))}
          </Row>
        </Panel>

        <Panel header="选择控件" key="select">
          <Row gutter={[8, 8]}>
            {controlTypes.slice(6, 9).map((control) => (
              <Col span={12} key={control.type}>
                <Tooltip title={control.description}>
                  <Card
                    hoverable
                    size="small"
                    className={styles.controlCard}
                    onClick={() => addField(control.type)}
                  >
                    <div className={styles.controlIcon}>{control.icon}</div>
                    <div className={styles.controlLabel}>{control.label}</div>
                  </Card>
                </Tooltip>
              </Col>
            ))}
          </Row>
        </Panel>

        <Panel header="高级控件" key="advanced">
          <Row gutter={[8, 8]}>
            {controlTypes.slice(9).map((control) => (
              <Col span={12} key={control.type}>
                <Tooltip title={control.description}>
                  <Card
                    hoverable
                    size="small"
                    className={styles.controlCard}
                    onClick={() => addField(control.type)}
                  >
                    <div className={styles.controlIcon}>{control.icon}</div>
                    <div className={styles.controlLabel}>{control.label}</div>
                  </Card>
                </Tooltip>
              </Col>
            ))}
          </Row>
        </Panel>
      </Collapse>
    </div>
  )

  // 渲染属性面板
  const renderPropertyPanel = () => {
    if (!selectedField) {
      return (
        <Empty description="点击画布中的字段查看属性" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )
    }

    return (
      <Form layout="vertical" className={styles.propertyForm}>
        <Divider orientation="left">基础属性</Divider>

        <Form.Item label="字段名称">
          <Input
            value={selectedField.name}
            onChange={(e) => updateField(selectedField.id, { name: e.target.value })}
          />
        </Form.Item>

        <Form.Item label="显示标签">
          <Input
            value={selectedField.label}
            onChange={(e) => updateField(selectedField.id, { label: e.target.value })}
          />
        </Form.Item>

        <Form.Item label="占位提示">
          <Input
            value={selectedField.placeholder || ''}
            onChange={(e) => updateField(selectedField.id, { placeholder: e.target.value })}
            placeholder="请输入占位提示"
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Switch
              checked={selectedField.required}
              onChange={(checked) => updateField(selectedField.id, { required: checked })}
            />
            <span>必填字段</span>
          </Space>
        </Form.Item>

        {(selectedField.type === 'radio' || selectedField.type === 'select' || selectedField.type === 'checkbox') && (
          <>
            <Divider orientation="left">选项配置</Divider>
            <Form.Item label="选项列表">
              <TextArea
                rows={4}
                value={selectedField.options?.map(o => `${o.label}=${o.value}`).join('\n') || ''}
                onChange={(e) => {
                  const options = e.target.value.split('\n').filter(Boolean).map(line => {
                    const [label, value] = line.split('=')
                    return { label: label || line, value: value || line }
                  })
                  updateField(selectedField.id, { options })
                }}
                placeholder="每行一个选项，格式：标签=值"
              />
            </Form.Item>
          </>
        )}

        {selectedField.type === 'inputUnit' && (
          <>
            <Divider orientation="left">单位配置</Divider>
            <Form.Item label="单位">
              <Input
                value={selectedField.options?.[0]?.label || ''}
                onChange={(e) => updateField(selectedField.id, {
                  options: [{ label: e.target.value, value: e.target.value }]
                })}
                placeholder="如：kg、cm、mmHg"
              />
            </Form.Item>
          </>
        )}
      </Form>
    )
  }

  // 渲染表单预览
  const renderFormPreview = () => (
    <Modal
      title="CRF表单预览"
      open={previewVisible}
      onCancel={() => setPreviewVisible(false)}
      width={800}
      footer={[
        <Button key="close" onClick={() => setPreviewVisible(false)}>关闭</Button>,
      ]}
    >
      <div className={styles.previewContainer}>
        <h2 className={styles.previewTitle}>{formName}</h2>
        <p className={styles.previewSubtitle}>表单编号：{formCode}</p>

        {sections.map(section => (
          <div key={section.id} className={styles.previewSection}>
            <h3 className={styles.previewSectionTitle}>{section.name}</h3>
            <div className={styles.previewFields}>
              {section.fields.map(field => (
                <div key={field.id} className={styles.previewField}>
                  <label className={styles.previewLabel}>
                    {field.label}
                    {field.required && <span className={styles.requiredMark}>*</span>}
                  </label>
                  <div className={styles.previewControl}>
                    {field.type === 'input' && <Input placeholder={field.placeholder} />}
                    {field.type === 'textarea' && <TextArea placeholder={field.placeholder} rows={2} />}
                    {field.type === 'inputUnit' && (
                      <Input placeholder={field.placeholder} suffix={field.options?.[0]?.label} />
                    )}
                    {field.type === 'date' && <DatePicker style={{ width: '100%' }} />}
                    {field.type === 'radio' && (
                      <Radio.Group>
                        {field.options?.map((opt, i) => (
                          <Radio key={i} value={opt.value}>{opt.label}</Radio>
                        ))}
                      </Radio.Group>
                    )}
                    {field.type === 'select' && (
                      <Select style={{ width: '100%' }} placeholder="请选择">
                        {field.options?.map((opt, i) => (
                          <Option key={i} value={opt.value}>{opt.label}</Option>
                        ))}
                      </Select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  )

  return (
    <div className={styles.designerContainer}>
      {/* 页面标题 */}
      <PageHeader
        title="CRF设计器"
        back
        onBack={() => navigate('/projects')}
        actions={
          <Space>
            <Button icon={<CopyOutlined />} onClick={() => setTemplateModalVisible(true)}>
              从模板创建
            </Button>
            <Button icon={<SaveOutlined />}>保存草稿</Button>
            <Button icon={<EyeOutlined />} onClick={() => setPreviewVisible(true)}>预览</Button>
            <Button type="primary" icon={<UploadOutlined />}>
              发布申请
            </Button>
          </Space>
        }
      />

      {/* CRF设计器主体 */}
      <Layout className={styles.designerLayout}>
        {/* 左侧边栏 */}
        <Sider width={260} className={styles.leftSider}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              {
                key: 'crflist',
                label: '表单列表',
                children: (
                  <div style={{ padding: 12 }}>
                    <Button type="primary" block icon={<PlusOutlined />} style={{ marginBottom: 12 }}>
                      新建表单
                    </Button>
                    {mockCRFList.map((crf) => (
                      <Card
                        key={crf.id}
                        size="small"
                        style={{ marginBottom: 8, cursor: 'pointer' }}
                        onClick={() => {}}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontWeight: 500 }}>{crf.name}</div>
                            <div style={{ fontSize: 12, color: '#999' }}>{crf.code}</div>
                          </div>
                          <Tag
                            color={crf.status === '已发布' ? 'green' : crf.status === '编辑中' ? 'blue' : 'default'}
                            style={{ margin: 0 }}
                          >
                            {crf.status}
                          </Tag>
                        </div>
                      </Card>
                    ))}
                  </div>
                ),
              },
              {
                key: 'controls',
                label: '控件库',
                children: renderControlPanel(),
              },
              {
                key: 'sections',
                label: '分节',
                children: (
                  <div className={styles.sectionList}>
                    <Button
                      type="dashed"
                      block
                      icon={<PlusOutlined />}
                      onClick={addSection}
                      className={styles.addSectionBtn}
                    >
                      添加分节
                    </Button>
                    {sections.map(section => (
                      <Card
                        key={section.id}
                        size="small"
                        className={`${styles.sectionCard} ${activeSectionId === section.id ? styles.sectionCardActive : ''}`}
                        onClick={() => setActiveSectionId(section.id)}
                        extra={
                          <Popconfirm
                            title="确认删除此分节？"
                            onConfirm={() => deleteSection(section.id)}
                          >
                            <Button type="text" danger size="small" icon={<DeleteOutlined />} />
                          </Popconfirm>
                        }
                      >
                        <div className={styles.sectionName}>{section.name}</div>
                        <Tag>{section.fields.length}个字段</Tag>
                      </Card>
                    ))}
                  </div>
                ),
              },
            ]}
          />
        </Sider>

        {/* 中间画布 */}
        <Content className={styles.designerCanvas}>
          <Card
            title={
              <Space>
                <MedicineBoxOutlined />
                <Input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  bordered={false}
                  style={{ fontSize: 16, fontWeight: 'bold', padding: 0 }}
                />
                <Tag color="blue">{formCode}</Tag>
              </Space>
            }
            className={styles.canvasCard}
          >
            {/* 分节标签 */}
            <div className={styles.sectionTabs}>
              {sections.map(section => (
                <div
                  key={section.id}
                  className={`${styles.sectionTab} ${activeSectionId === section.id ? styles.sectionTabActive : ''}`}
                  onClick={() => setActiveSectionId(section.id)}
                >
                  {section.name}
                </div>
              ))}
            </div>

            {/* 字段画布 */}
            <div className={styles.fieldsCanvas}>
              {activeSection.fields.length === 0 ? (
                <Empty
                  description="点击左侧控件添加到此处"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ) : (
                activeSection.fields.map(renderFieldPreview)
              )}
            </div>

            {/* 添加字段按钮 */}
            <div className={styles.addFieldArea}>
              <Button
                type="dashed"
                block
                icon={<PlusOutlined />}
                onClick={() => setActiveTab('controls')}
              >
                添加字段
              </Button>
            </div>
          </Card>
        </Content>

        {/* 右侧属性面板 */}
        <Sider width={320} className={styles.rightSider}>
          <div className={styles.propertyHeader}>
            <SettingOutlined /> 属性配置
          </div>
          <div className={styles.propertyContent}>
            {renderPropertyPanel()}
          </div>
        </Sider>
      </Layout>

      {/* 模板市场弹窗 */}
      <Modal
        title="模板市场"
        open={templateModalVisible}
        onCancel={() => setTemplateModalVisible(false)}
        width={800}
        footer={[
          <Button key="cancel" onClick={() => setTemplateModalVisible(false)}>
            取消
          </Button>,
          <Button key="confirm" type="primary">
            使用模板
          </Button>,
        ]}
      >
        <Row gutter={[16, 16]}>
          {mockCRFTemplates.map((template) => (
            <Col span={8} key={template.id}>
              <Card
                hoverable
                title={template.name}
                className={styles.templateCard}
              >
                <Tag color="blue">{template.code}</Tag>
                <p className={styles.templateDesc}>{template.description}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </Modal>

      {/* 预览弹窗 */}
      {renderFormPreview()}
    </div>
  )
}
