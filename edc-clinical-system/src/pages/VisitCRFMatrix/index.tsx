import { useState, useMemo, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Card,
  Button,
  Table,
  Checkbox,
  Typography,
  Space,
  Upload,
  Input,
  Alert,
  Tooltip,
} from 'antd'
import {
  ArrowLeftOutlined,
  SaveOutlined,
  EyeOutlined,
  CloseOutlined,
  UploadOutlined,
  DownloadOutlined,
  RobotOutlined,
} from '@ant-design/icons'
import { mockVisits, mockCRFs, mockProjects } from '@/utils/mockData'
import { getTableRowClassName } from '@/constants/theme'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'
import styles from './styles.module.css'

const { Title, Text } = Typography
const { TextArea } = Input

export default function VisitCRFMatrix() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [matrix, setMatrix] = useState<Record<string, string[]>>({})
  const [aiText, setAiText] = useState('')
  const [showAiPanel, setShowAiPanel] = useState(false)

  // 获取项目信息
  const project = useMemo(() => {
    return mockProjects.find(p => p.id === id)
  }, [id])

  // 初始化矩阵
  useEffect(() => {
    const initialMatrix: Record<string, string[]> = {}
    mockVisits.forEach(visit => {
      initialMatrix[visit.id] = visit.crfs || []
    })
    setMatrix(initialMatrix)
  }, [])

  // 处理CRF选择
  const handleCRFChange = (visitId: string, crf: string, checked: boolean) => {
    setMatrix(prev => {
      const current = prev[visitId] || []
      if (checked) {
        return { ...prev, [visitId]: [...current, crf] }
      } else {
        return { ...prev, [visitId]: current.filter(c => c !== crf) }
      }
    })
  }

  // 表格列定义
  const columns = useMemo(() => [
    {
      title: '访视期 / CRF表单',
      dataIndex: 'visit',
      key: 'visit',
      fixed: 'left' as const,
      width: 200,
      render: (visit: typeof mockVisits[0]) => {
        if (!visit) return null
        return (
          <div className={styles.visitCell}>
            <div className={styles.visitName}>{visit.name}</div>
            <div className={styles.visitPhase}>{visit.phase} · {visit.type}</div>
          </div>
        )
      },
    },
    ...mockCRFs.map(crf => ({
      title: (
        <Tooltip title={crf}>
          <div className={styles.crfHeader}>{crf.slice(0, 4)}</div>
        </Tooltip>
      ),
      key: crf,
      width: 80,
      align: 'center' as const,
      render: (_: unknown, record: typeof mockVisits[0]) => {
        if (!record) return null
        const isChecked = matrix[record.id]?.includes(crf) || record.crfs?.includes(crf)
        return (
          <Checkbox
            checked={isChecked}
            onChange={(e: CheckboxChangeEvent) => handleCRFChange(record.id, crf, e.target.checked)}
          />
        )
      },
    })),
  ], [matrix])

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
              访视-CRF矩阵配置
            </Title>
            <Text type="secondary">{project?.name}</Text>
          </div>
        </Space>
        <Space>
          <Button icon={<EyeOutlined />}>预览</Button>
          <Button type="primary" icon={<SaveOutlined />}>保存配置</Button>
        </Space>
      </div>

      {/* 矩阵表格 */}
      <Card className={styles.matrixCard}>
        <Table
          columns={columns}
          dataSource={mockVisits}
          rowKey="id"
          rowClassName={getTableRowClassName}
          pagination={false}
          scroll={{ x: 'max-content' }}
          bordered
          size="middle"
        />
      </Card>

      {/* Excel导入 */}
      <Card
        title="Excel导入"
        className={styles.importCard}
        extra={
          <Space>
            <Button icon={<DownloadOutlined />}>下载模板</Button>
            <Upload accept=".xlsx,.xls" showUploadList={false}>
              <Button icon={<UploadOutlined />}>导入Excel</Button>
            </Upload>
          </Space>
        }
      >
        <Alert
          message="Excel模板说明"
          description={
            <ul className={styles.templateDesc}>
              <li>Sheet1: 访视期列表（名称、类型、时间窗）</li>
              <li>Sheet2: CRF表单结构（表单名、字段名、控件类型、验证规则）</li>
              <li>Sheet3: 访视-CRF矩阵（交叉配对关系）</li>
            </ul>
          }
          type="info"
          showIcon
        />
      </Card>

      {/* AI智能导入 */}
      <Card
        title={
          <Space>
            <RobotOutlined style={{ color: '#5CB8A6' }} />
            <span>AI智能导入</span>
          </Space>
        }
        className={styles.aiCard}
        extra={
          <Button
            type="link"
            onClick={() => setShowAiPanel(!showAiPanel)}
          >
            {showAiPanel ? '收起' : '展开'}
          </Button>
        }
      >
        {showAiPanel && (
          <>
            <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
              粘贴研究方案文字描述，AI自动解析生成访视-CRF矩阵配置
            </Text>
            <TextArea
              rows={6}
              placeholder="粘贴研究方案描述...例如：
筛选期（Day -7 ±3天）：人口学资料、既往病史、体格检查、实验室检查
基线期（Day 1 ±2天）：人口学资料、体格检查、实验室检查
治疗期（Day 15, 30 ±3天）：体格检查、实验室检查、不良事件记录
随访期（Day 45 ±7天）：体格检查、实验室检查、心电图"
              value={aiText}
              onChange={(e) => setAiText(e.target.value)}
            />
            <Button
              type="primary"
              icon={<RobotOutlined />}
              style={{ marginTop: 16 }}
              disabled={!aiText.trim()}
            >
              开始解析
            </Button>
          </>
        )}
        {!showAiPanel && (
          <Text type="secondary">
            使用AI技术自动解析临床研究方案，生成访视-CRF矩阵配置
          </Text>
        )}
      </Card>

      {/* 底部操作 */}
      <div className={styles.footer}>
        <Space>
          <Button icon={<CloseOutlined />} onClick={() => navigate(-1)}>
            取消
          </Button>
          <Button type="primary" icon={<SaveOutlined />}>
            保存配置
          </Button>
        </Space>
      </div>
    </div>
  )
}
