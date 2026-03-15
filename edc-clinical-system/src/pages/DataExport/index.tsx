import { useState } from 'react'
import {
  Card,
  Row,
  Col,
  Button,
  Form,
  Select,
  Radio,
  Checkbox,
  Table,
  Tag,
  Space,
  Typography,
  Divider,
  Alert,
  message,
} from 'antd'
import {
  DownloadOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  DatabaseOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons'
import { mockExportHistory } from '@/utils/mockData'
import PageHeader from '@/components/Common/PageHeader'
import { getTableRowClassName } from '@/constants/theme'
import type { ExportConfig } from '@/types'

const { Text } = Typography
const { Option } = Select

export default function DataExport() {
  const [form] = Form.useForm()
  const [exportScope, setExportScope] = useState<'all' | 'selected'>('all')
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf' | 'audit' | 'sas'>('csv')
  const [history] = useState<ExportConfig[]>(mockExportHistory)

  // 提交导出
  const handleSubmit = () => {
    form.validateFields().then(() => {
      // TODO: 实现导出逻辑
      message.success('导出任务已创建')
    })
  }

  // 历史表格列
  const historyColumns = [
    {
      title: '文件名',
      dataIndex: 'fileName',
      key: 'fileName',
      render: (text: string, record: ExportConfig) => (
        <Space>
          {record.format === 'csv' && <FileExcelOutlined style={{ color: 'var(--color-primary-500)' }} />}
          {record.format === 'pdf' && <FilePdfOutlined style={{ color: 'var(--color-error)' }} />}
          {record.format === 'sas' && <DatabaseOutlined style={{ color: 'var(--color-status-completed-text)' }} />}
          {text}
        </Space>
      ),
    },
    {
      title: '导出时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap: Record<string, { color: string; text: string; icon: React.ReactNode }> = {
          completed: { color: 'success', text: '已完成', icon: <CheckCircleOutlined /> },
          processing: { color: 'processing', text: '处理中', icon: <LoadingOutlined /> },
          failed: { color: 'error', text: '失败', icon: <FileTextOutlined /> },
        }
        const config = statusMap[status] || statusMap.completed
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        )
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (record: ExportConfig) => (
        <Button
          type="link"
          icon={<DownloadOutlined />}
          disabled={record.status !== 'completed'}
          aria-label={`下载文件 ${record.fileName}`}
        >
          下载
        </Button>
      ),
    },
  ]

  return (
    <div>
      {/* 页面标题 */}
      <PageHeader title="数据导出" />

      <Row gutter={24}>
        {/* 导出配置 */}
        <Col span={16}>
          <Card title="导出配置" style={{ borderRadius: 'var(--radius-lg)' }}>
            <Form form={form} layout="vertical">
              {/* 导出范围 */}
              <div style={{ marginBottom: 24 }}>
                <Text strong style={{ fontSize: 14 }}>
                  导出范围
                </Text>
                <Divider style={{ margin: '12px 0' }} />
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="centers" label="中心选择" initialValue={['all']}>
                      <Select mode="multiple" placeholder="选择中心">
                        <Option value="all">全部中心</Option>
                        <Option value="北京协和医院">北京协和医院</Option>
                        <Option value="上海华山医院">上海华山医院</Option>
                        <Option value="广州中山医院">广州中山医院</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="subjects" label="受试者选择" initialValue={['all']}>
                      <Select mode="multiple" placeholder="选择受试者">
                        <Option value="all">全部受试者</Option>
                        <Option value="enrolled">已入组</Option>
                        <Option value="completed">已完成</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </div>

              {/* 数据内容 */}
              <div style={{ marginBottom: 24 }}>
                <Text strong style={{ fontSize: 14 }}>
                  数据内容
                </Text>
                <Divider style={{ margin: '12px 0' }} />
                <Form.Item name="crfScope" initialValue="all">
                  <Radio.Group value={exportScope} onChange={(e) => setExportScope(e.target.value)}>
                    <Space direction="vertical">
                      <Radio value="all">全部CRF</Radio>
                      <Radio value="selected">
                        选择CRF
                        {exportScope === 'selected' && (
                          <Form.Item name="selectedCRFs" style={{ marginTop: 8, marginBottom: 0 }}>
                            <Select
                              mode="multiple"
                              placeholder="选择要导出的CRF"
                              style={{ width: 400 }}
                            >
                              <Option value="dm">人口学资料</Option>
                              <Option value="mh">既往病史</Option>
                              <Option value="pe">体格检查</Option>
                              <Option value="lb">实验室检查</Option>
                              <Option value="ae">不良事件</Option>
                              <Option value="cm">合并用药</Option>
                            </Select>
                          </Form.Item>
                        )}
                      </Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>
              </div>

              {/* 导出格式 */}
              <div style={{ marginBottom: 24 }}>
                <Text strong style={{ fontSize: 14 }}>
                  导出格式
                </Text>
                <Divider style={{ margin: '12px 0' }} />
                <Form.Item name="format" initialValue="csv">
                  <Radio.Group
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value)}
                  >
                    <Space>
                      <Radio.Button value="csv">
                        <FileExcelOutlined /> CSV
                      </Radio.Button>
                      <Radio.Button value="pdf">
                        <FilePdfOutlined /> PDF
                      </Radio.Button>
                      <Radio.Button value="audit">
                        <FileTextOutlined /> 稽查痕迹
                      </Radio.Button>
                      <Radio.Button value="sas">
                        <DatabaseOutlined /> SAS
                      </Radio.Button>
                    </Space>
                  </Radio.Group>
                </Form.Item>
              </div>

              {/* 导出选项 */}
              <div style={{ marginBottom: 24 }}>
                <Text strong style={{ fontSize: 14 }}>
                  导出选项
                </Text>
                <Divider style={{ margin: '12px 0' }} />
                <Form.Item>
                  <Space direction="vertical">
                    <Checkbox>包含稽查痕迹</Checkbox>
                    <Checkbox>仅导出有修改的记录</Checkbox>
                    <Checkbox>包含填写人信息</Checkbox>
                  </Space>
                </Form.Item>
              </div>

              {/* 提交按钮 */}
              <Form.Item style={{ marginBottom: 0 }}>
                <Button type="primary" size="large" icon={<DownloadOutlined />} onClick={handleSubmit}>
                  开始导出
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* 导出说明 */}
        <Col span={8}>
          <Card title="导出说明" style={{ borderRadius: 'var(--radius-lg)' }}>
            <Alert
              message="导出注意事项"
              description="
                1. CSV格式适合数据分析，可用Excel打开
                2. PDF格式适合打印和归档
                3. 稽查痕迹包含所有数据修改记录
                4. SAS格式可直接导入统计分析软件
              "
              type="info"
              showIcon
            />
          </Card>
        </Col>
      </Row>

      {/* 导出历史 */}
      <Card title="导出历史" style={{ marginTop: 24, borderRadius: 'var(--radius-lg)' }}>
        <Table
          columns={historyColumns}
          dataSource={history}
          rowKey="id"
          rowClassName={getTableRowClassName}
          pagination={{
            pageSize: 5,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>
    </div>
  )
}
