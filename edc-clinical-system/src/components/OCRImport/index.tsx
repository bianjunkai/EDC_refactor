import { useState } from 'react'
import {
  Modal,
  Button,
  Upload,
  Space,
  Typography,
  Progress,
  List,
  Tag,
  Alert,
  Row,
  Col,
  Image,
} from 'antd'
import {
  ScanOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  FileImageOutlined,
  CloseOutlined,
  RobotOutlined,
} from '@ant-design/icons'
import type { UploadFile } from 'antd/es/upload/interface'
import styles from './styles.module.css'

const { Title, Text } = Typography

interface OCRResult {
  field: string
  value: string
  confidence: number
  verified: boolean
}

interface OCRImportProps {
  visible: boolean
  onCancel: () => void
  onApply: (results: OCRResult[]) => void
  crfName?: string
}

// 模拟OCR识别结果
const mockOCRResults: OCRResult[] = [
  { field: '姓名', value: '张三', confidence: 0.98, verified: true },
  { field: '性别', value: '男', confidence: 0.95, verified: true },
  { field: '年龄', value: '45', confidence: 0.92, verified: true },
  { field: '身高', value: '175', confidence: 0.88, verified: false },
  { field: '体重', value: '71', confidence: 0.65, verified: false },
  { field: '收缩压', value: '120', confidence: 0.90, verified: true },
  { field: '舒张压', value: '80', confidence: 0.89, verified: true },
]

export default function OCRImport({ visible, onCancel, onApply }: OCRImportProps) {
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [recognizing, setRecognizing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<OCRResult[]>([])
  const [previewImage, setPreviewImage] = useState<string>('')

  // 处理文件上传
  const handleUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)
    return false // 阻止自动上传
  }

  // 开始OCR识别
  const startRecognition = () => {
    if (fileList.length === 0) {
      return
    }

    setRecognizing(true)
    setProgress(0)
    setResults([])

    // 模拟识别进度
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setRecognizing(false)
          setResults(mockOCRResults)
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  // 处理应用到表单
  const handleApply = () => {
    onApply(results.filter((r) => r.confidence > 0.7))
    onCancel()
  }

  // 获取置信度颜色
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'success'
    if (confidence >= 0.7) return 'warning'
    return 'error'
  }

  // 获取置信度标签
  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.9) return '高'
    if (confidence >= 0.7) return '中'
    return '低'
  }

  return (
    <Modal
      title={
        <Space>
          <RobotOutlined style={{ color: '#5CB8A6' }} />
          <span>OCR智能识别导入</span>
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      width={900}
      footer={
        results.length > 0
          ? [
              <Button key="cancel" onClick={onCancel}>
                取消
              </Button>,
              <Button key="apply" type="primary" onClick={handleApply}>
                应用到表单
              </Button>,
            ]
          : [
              <Button key="cancel" onClick={onCancel}>
                取消
              </Button>,
              <Button
                key="recognize"
                type="primary"
                icon={<ScanOutlined />}
                loading={recognizing}
                disabled={fileList.length === 0 || !previewImage}
                onClick={startRecognition}
              >
                开始识别
              </Button>,
            ]
      }
    >
      <div className={styles.container}>
        {/* 上传区域 */}
        {!previewImage && (
          <Upload.Dragger
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            beforeUpload={handleUpload}
            accept="image/*,.pdf"
            maxCount={1}
            showUploadList={false}
            className={styles.uploader}
          >
            <div style={{ padding: '20px 0' }}>
              <p className="ant-upload-drag-icon">
                <FileImageOutlined style={{ fontSize: 48, color: '#5CB8A6' }} />
              </p>
              <p className="ant-upload-text">点击或拖拽上传CRF扫描件/照片</p>
              <p className="ant-upload-hint">支持 JPG、PNG、PDF 格式</p>
            </div>
          </Upload.Dragger>
        )}

        {/* 预览和识别区域 */}
        {previewImage && (
          <Row gutter={24}>
            {/* 左侧：图片预览 */}
            <Col span={12}>
              <div className={styles.previewSection}>
                <Title level={5}>原始图片</Title>
                <div className={styles.imageWrapper}>
                  <Image
                    src={previewImage}
                    alt="CRF扫描件"
                    style={{ maxWidth: '100%', maxHeight: 300, objectFit: 'contain' }}
                  />
                </div>
                {!recognizing && results.length === 0 && (
                  <Button
                    icon={<CloseOutlined />}
                    onClick={() => {
                      setPreviewImage('')
                      setFileList([])
                    }}
                    style={{ marginTop: 8 }}
                  >
                    重新上传
                  </Button>
                )}
              </div>
            </Col>

            {/* 右侧：识别结果 */}
            <Col span={12}>
              <div className={styles.resultSection}>
                <Title level={5}>识别结果</Title>

                {/* 识别进度 */}
                {recognizing && (
                  <div className={styles.progressSection}>
                    <Progress percent={progress} status="active" strokeColor="#5CB8A6" />
                    <Text type="secondary">正在识别中，请稍候...</Text>
                  </div>
                )}

                {/* 识别结果列表 */}
                {!recognizing && results.length > 0 && (
                  <>
                    <Alert
                      message="识别完成"
                      description="请核对识别结果，低置信度字段需要人工确认"
                      type="info"
                      showIcon
                      style={{ marginBottom: 16 }}
                    />
                    <List
                      dataSource={results}
                      renderItem={(item) => (
                        <List.Item
                          className={styles.resultItem}
                          actions={[
                            <Tag
                              key="confidence"
                              color={getConfidenceColor(item.confidence)}
                              icon={
                                item.confidence >= 0.9 ? (
                                  <CheckCircleOutlined />
                                ) : (
                                  <WarningOutlined />
                                )
                              }
                            >
                              {getConfidenceLabel(item.confidence)}
                            </Tag>,
                          ]}
                        >
                          <List.Item.Meta
                            title={item.field}
                            description={
                              <Text strong style={{ fontSize: 16 }}>
                                {item.value}
                              </Text>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  </>
                )}

                {/* 空状态 */}
                {!recognizing && results.length === 0 && (
                  <div className={styles.emptyState}>
                    <ScanOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
                    <Text type="secondary">点击"开始识别"进行OCR识别</Text>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        )}
      </div>
    </Modal>
  )
}
