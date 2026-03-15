import dayjs from 'dayjs'

// 格式化日期
export const formatDate = (date: string | Date, format = 'YYYY-MM-DD'): string => {
  if (!date) return '-'
  return dayjs(date).format(format)
}

// 格式化日期时间
export const formatDateTime = (date: string | Date): string => {
  if (!date) return '-'
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

// 格式化相对时间
export const formatRelativeTime = (date: string | Date): string => {
  if (!date) return '-'
  const now = dayjs()
  const target = dayjs(date)
  const diff = now.diff(target, 'minute')

  if (diff < 1) return '刚刚'
  if (diff < 60) return `${diff}分钟前`
  if (diff < 1440) return `${Math.floor(diff / 60)}小时前`
  if (diff < 2880) return '昨天'

  return target.format('MM-DD')
}

// 获取今日日期字符串
export const getTodayString = (): string => {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth() + 1
  const day = today.getDate()
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  const weekday = weekdays[today.getDay()]

  return `${year}年${month}月${day}日 ${weekday}`
}

// 脱敏手机号
export const maskPhone = (phone: string): string => {
  if (!phone || phone.length < 11) return phone
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

// 生成唯一ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15)
}

// 计算百分比
export const calculatePercentage = (value: number, total: number, decimals = 0): number => {
  if (total === 0) return 0
  const percentage = (value / total) * 100
  return Number(percentage.toFixed(decimals))
}

// 深拷贝
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj))
}

// 防抖函数
export const debounce = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timer: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

// 节流函数
export const throttle = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastTime = 0
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastTime >= delay) {
      lastTime = now
      fn(...args)
    }
  }
}
